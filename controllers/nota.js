const { response } = require('express');


const Estudiante = require('../models/estudiante');
const Actividad = require('../models/actividad');
const Nota = require('../models/nota');
const Usuario = require('../models/usuario');

const vacio = async ( req, res = response ) => {
    
}

const notasEstudiante = async (req, res = response) => {
  const { idEstudiante } = req.params;

  try {
    const notas = await Nota.find({ idEstudiante })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación DESC
      .populate({
        path: 'idActividad',
        select: 'nombre tipoActividad area'
      })
      .populate({
        path: 'idEstudiante',
        select: 'nombre apellido'
      });

    const resultado = notas.map(nota => {
      const fecha = new Date(nota.createdAt);
      const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${
        (fecha.getMonth() + 1).toString().padStart(2, '0')
      }/${fecha.getFullYear()}`;

      return {
        nombreActividad: nota.idActividad?.nombre || 'Sin nombre',
        tipoActividad: nota.idActividad?.tipoActividad || 'Sin asignar',
        nota: nota.nota,
        area: nota.idActividad?.area,
        estado: nota.estado,        
        fechaEntrega: fechaFormateada,
        estudiante: `${nota.idEstudiante?.nombre} ${nota.idEstudiante?.apellido}`
      };
    });

    res.json(resultado);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notas del estudiante', error: error.message });
  }
};

const notaPost = async ( req, res = response ) => {
    try {
        const { idEstudiante, idActividad } = req.body;
    
        // Validar existencia del estudiante y la actividad
        const estudiante = await Estudiante.findById(idEstudiante);
        const actividad = await Actividad.findById(idActividad);
    
        if (!estudiante || !actividad) {
          return res.status(400).json({
            message: 'Estudiante o actividad no válida'
          });
        }
    
        const nueva = new Nota(req.body);
        await nueva.save();
    
        res.status(201).json({
          message: 'Nota registrada correctamente',
          data: nueva
        });
      } catch (error) {
        res.status(400).json({ message: 'Error al registrar nota', error: error.message });
    }
}

const generarRanking = async ( req, res = response ) => {

    try {
        const ranking = await Nota.aggregate([
          {
            $lookup: {
              from: 'estudiantes',
              localField: 'idEstudiante',
              foreignField: '_id',
              as: 'estudiante'
            }
          },
          { $unwind: '$estudiante' },
          {
            $group: {
              _id: '$idEstudiante',
              nombre: { $first: '$estudiante.nombre' },
              apellido: { $first: '$estudiante.apellido' },
              numeroFicha: { $first: '$estudiante.numeroFicha' },
              promedio: { $avg: '$nota' },
              cantidadNotas: { $sum: 1 }
            }
          },
          { $sort: { promedio: -1 } }
        ]);
    
        res.json(ranking);
      } catch (error) {
        res.status(500).json({ message: 'Error al generar ranking', error: error.message });
      }
    
}

const generarRankingFicha = async ( req, res = response ) => {

    const { numeroFicha } = req.params;

  try {
    const ranking = await Nota.aggregate([
      {
        $lookup: {
          from: 'estudiantes',
          localField: 'idEstudiante',
          foreignField: '_id',
          as: 'estudiante'
        }
      },
      { $unwind: '$estudiante' },
      {
        $match: {
          'estudiante.numeroFicha': numeroFicha
        }
      },
      {
        $group: {
          _id: '$idEstudiante',
          nombre: { $first: '$estudiante.nombre' },
          apellido: { $first: '$estudiante.apellido' },
          numeroFicha: { $first: '$estudiante.numeroFicha' },
          promedio: { $avg: '$nota' },
          cantidadNotas: { $sum: 1 }
        }
      },
      { $sort: { promedio: -1 } }
    ]);

    if (ranking.length === 0) {
      return res.status(404).json({ message: `No se encontraron notas para la ficha ${numeroFicha}` });
    }

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar ranking por ficha', error: error.message });
  }
    
}

const registrarNotas = async ( req, res = response ) => {
    try {
    const entradas = req.body;

    if (!Array.isArray(entradas) || entradas.length === 0) {
      return res.status(400).json({ message: 'Debes enviar una lista de notas' });
    }

    const errores = [];
    const insertadas = [];

    for (const entrada of entradas) {
      const { idActividad, identificacion, nota, fechaEntrega, idUsuario } = entrada;

      // Validar existencia de la actividad
      const actividad = await Actividad.findById(idActividad);
      if (!actividad) {
        errores.push({ actividad, error: 'Actividad no existe' });
        continue;
      }

       // Validar existencia del usuario
      const usuario = await Usuario.findById(idUsuario);
      if (!usuario) {
        errores.push({ idUsuario, error: 'Usuario no encontrado' });
        continue;
      }

      // Validar existencia del estudiante
      const estudiante = await Estudiante.findOne({ identificacion });
      if (!estudiante) {
        errores.push({ identificacion, error: 'Estudiante no encontrado' });
        continue;
      }

      
      // Validar que no exista ya una nota para este estudiante y actividad
      const notaExistente = await Nota.findOne({
        idEstudiante: estudiante._id,
        idActividad
      });

      if (notaExistente) {
        errores.push({ identificacion, error: 'Ya existe una nota para esta actividad' });
        continue;
      }

      let estado = 'No entregada'; // valor por defecto (por si algo falla)

      if (nota === 0) {
        estado = 'No entregada';
      } else if (nota > 0 && nota < 3.5) {
        estado = 'No aprobada';
      } else if (nota >= 3.5 && nota <= 5) {
        estado = 'Aprobada';
      } else {
        throw new Error('La nota debe estar entre 0 y 5'); // opcional: validación adicional
      }

     
      

      // Registrar nota
      const nuevaNota = new Nota({
        idEstudiante: estudiante._id,
        idActividad,
        nota,
        fechaEntrega,
        estado,
        idUsuario
      });

      await nuevaNota.save();
      insertadas.push(nuevaNota);
    }

    res.status(201).json({
      message: `${insertadas.length} notas registradas correctamente`,
      insertadas,
      errores
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el registro masivo de notas', error: error.message });
  }
}

module.exports = {

    notaPost,
    generarRanking,
    registrarNotas,
    generarRankingFicha,
    notasEstudiante

}
