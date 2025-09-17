const { response } = require('express');


const Estudiante = require('../models/estudiante');
const Actividad = require('../models/actividad');
const Nota = require('../models/nota');
const Usuario = require('../models/usuario');

const formatearFecha = (fecha) => {
  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

const vacio = async ( req, res = response ) => {
    
}

const generarRankingCurso = async ( req, res = response ) => {

  const { numeroFicha } = req.params;

  try {
    // Verificar si hay estudiantes con esa ficha
    const existeFicha = await Estudiante.exists({ numeroFicha });
    if (!existeFicha) {
      return res.status(404).json({
        message: `No se encontró ningún estudiante con la ficha ${numeroFicha}`
      });
    }

    const ranking = await Nota.aggregate([
      // Join con estudiante
      {
        $lookup: {
          from: 'estudiantes',
          localField: 'idEstudiante',
          foreignField: '_id',
          as: 'estudiante'
        }
      },
      { $unwind: '$estudiante' },

      // Filtrar por ficha
      {
        $match: {
          'estudiante.numeroFicha': numeroFicha
        }
      },

      // Join con actividad
      {
        $lookup: {
          from: 'actividads',
          localField: 'idActividad',
          foreignField: '_id',
          as: 'actividad'
        }
      },
      { $unwind: '$actividad' },

      // Agrupar por estudiante + área
      {
        $group: {
          _id: {
            estudianteId: '$estudiante._id',
            area: '$actividad.area'
          },
          nombre: { $first: '$estudiante.nombre' },
          apellido: { $first: '$estudiante.apellido' },
          notasActividad: {
            $push: {
              tipo: '$actividad.tipoNota',
              nota: '$nota'
            }
          }
        }
      },

      // Calcular promedios por tipo de nota
      {
        $project: {
          estudianteId: '$_id.estudianteId',
          nombre: 1,
          apellido: 1,
          promedioActividad: {
            $avg: {
              $map: {
                input: {
                  $filter: {
                    input: '$notasActividad',
                    as: 'nota',
                    cond: { $eq: ['$$nota.tipo', 'Actividad'] }
                  }
                },
                as: 'nota',
                in: '$$nota.nota'
              }
            }
          },
          promedioTest: {
            $avg: {
              $map: {
                input: {
                  $filter: {
                    input: '$notasActividad',
                    as: 'nota',
                    cond: { $eq: ['$$nota.tipo', 'Test Teorico/Practico'] }
                  }
                },
                as: 'nota',
                in: '$$nota.nota'
              }
            }
          }
        }
      },

      // Calcular nota final por área
      {
        $project: {
          estudianteId: 1,
          nombre: 1,
          apellido: 1,
          notaFinal: {
            $cond: {
              if: { $or: [{ $eq: ['$promedioTest', 0] }, { $eq: ['$promedioTest', null] }] },
              then: { $ifNull: ['$promedioActividad', 0] },
              else: {
                $add: [
                  { $multiply: [{ $ifNull: ['$promedioActividad', 0] }, 0.7] },
                  { $multiply: [{ $ifNull: ['$promedioTest', 0] }, 0.3] }
                ]
              }
            }
          }
        }
      }
      ,

      // Agrupar por estudiante para promedio general
      {
        $group: {
          _id: '$estudianteId',
          nombre: { $first: '$nombre' },
          apellido: { $first: '$apellido' },
          promedioGeneral: { $avg: '$notaFinal' }
        }
      },

      // Ordenar y limitar
      { $sort: { promedioGeneral: -1 } },
      //{ $limit: 10 }
    ]);

    if (ranking.length === 0) {
      return res.status(404).json({
        message: `No se encontraron notas para la ficha ${numeroFicha}`
      });
    }

    res.json(ranking);

  } catch (error) {
    res.status(500).json({
      message: 'Error al generar el ranking',
      error: error.message
    });
  }
}


const obtenerNotasPorAreaDeEstudiante = async ( req, res = response ) => {
 const { identificacion, area } = req.params;

  try {
    // Buscar estudiante
    const estudiante = await Estudiante.findOne({ identificacion });
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Buscar notas con actividades que coincidan con el área
    const notas = await Nota.find({ idEstudiante: estudiante._id })
      .populate({
        path: 'idActividad',
        match: { area },
        select: 'nombre tipoNota descripcion area',
      });

    // Filtrar solo notas con actividad encontrada (no null por el match)
    const resultados = notas
      .filter(nota => nota.idActividad !== null)
      .map(nota => ({
        estado: nota.estado,
        fechaEntrega: nota.fechaEntrega ? formatearFecha(nota.fechaEntrega) : 'Sin fecha',
        nota: nota.nota,
        nombre: nota.idActividad.nombre,
        tipoActividad: nota.idActividad.tipoNota,
        descripcion: nota.idActividad.descripcion || '',
      }));

    if (resultados.length === 0) {
      return res.status(404).json({
        message: `No se encontraron notas en el área "${area}" para el estudiante con identificación ${identificacion}`
      });
    }

    res.json({
      estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
      area,
      actividades: resultados
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener notas por área', error: error.message });
  }   
}

const generarEstadisticas = async ( req, res = response ) => {
  const { identificacion } = req.params;

  try {
    const estudiante = await Estudiante.findOne({ identificacion });
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const notas = await Nota.find({ idEstudiante: estudiante._id }).populate('idActividad');

    const resumen = {};

    for (const nota of notas) {
      const actividad = nota.idActividad;
      if (!actividad) continue;

      const area = actividad.area;

      if (!resumen[area]) {
        resumen[area] = {
          numeroNotas: 0,
          numeroNotasAprobadas: 0,
          promedioActividad: [],
          promedioTest: [],
        };
      }

      resumen[area].numeroNotas += 1;

      if (nota.nota >= 3.5) {
        resumen[area].numeroNotasAprobadas += 1;
      }

      if (actividad.tipoNota === 'Actividad') {
        resumen[area].promedioActividad.push(nota.nota);
      } else if (actividad.tipoNota === 'Test Teorico/Practico') {
        resumen[area].promedioTest.push(nota.nota);
      }
    }

    // Calcular promedios y nota final
    for (const area in resumen) {
      const datos = resumen[area];

      const promedioAct = datos.promedioActividad.length > 0
        ? datos.promedioActividad.reduce((a, b) => a + b, 0) / datos.promedioActividad.length
        : 0;

      const promedioTest = datos.promedioTest.length > 0
        ? datos.promedioTest.reduce((a, b) => a + b, 0) / datos.promedioTest.length
        : 0;

      let notaFinal;

      if (promedioTest === 0 ) {
        notaFinal = promedioAct;
      } else if( promedioTest == null){
        notaFinal = promedioAct;
      } else {
        notaFinal = (promedioAct * 0.7) + (promedioTest * 0.3);
      }

      resumen[area] = {
        numeroNotas: datos.numeroNotas,
        numeroNotasAprobadas: datos.numeroNotasAprobadas,
        promedioActividad: promedioAct.toFixed(2),
        promedioTest: promedioTest.toFixed(2),
        notaFinal: notaFinal.toFixed(2),
      };
    }

    // Respuesta final con nombre completo
    res.json({
      estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
      resumen,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar resumen por área', error: error.message });
  }
    
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
    generarEstadisticas,
    generarRanking,
    registrarNotas,
    generarRankingFicha,
    notasEstudiante,
    obtenerNotasPorAreaDeEstudiante,
    generarRankingCurso

}
