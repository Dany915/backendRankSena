const { response } = require('express');


const Estudiante = require('../models/estudiante');
const Actividad = require('../models/actividad');
const Nota = require('../models/nota');

const vacio = async ( req, res = response ) => {
    
}

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

const registrarNotas = async ( req, res = response ) => {
    try {
    const entradas = req.body;

    if (!Array.isArray(entradas) || entradas.length === 0) {
      return res.status(400).json({ message: 'Debes enviar una lista de notas' });
    }

    const errores = [];
    const insertadas = [];

    for (const entrada of entradas) {
      const { idActividad, identificacion, nota, fechaEntrega } = entrada;

      // Validar existencia de la actividad
      const actividad = await Actividad.findById(idActividad);
      if (!actividad) {
        errores.push({ identificacion, error: 'Actividad no existe' });
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

      // Registrar nota
      const nuevaNota = new Nota({
        idEstudiante: estudiante._id,
        idActividad,
        nota,
        fechaEntrega,
        estado: 'calificada'
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
    registrarNotas

}
