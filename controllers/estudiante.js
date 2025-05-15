const { response } = require('express');


const Curso = require('../models/curso');
const Estudiante = require('../models/estudiante');


const estPost = async ( req, res = response ) => {
  
    try {
        const { numeroFicha } = req.body;
    
        const cursoExiste = await Curso.findOne({ numeroFicha });
        if (!cursoExiste) {
          return res.status(400).json({
            message: `No existe un curso con la ficha ${numeroFicha}`
          });
        }
    
        const nuevoEstudiante = new Estudiante(req.body);
        await nuevoEstudiante.save();
    
        res.status(201).json({
          message: 'Estudiante registrado correctamente',
          data: nuevoEstudiante
        });
      } catch (error) {
        if (error.code === 11000) {
          res.status(400).json({
            message: 'Ya existe un estudiante con esa identificación',
            field: Object.keys(error.keyValue)[0]
          });
        } else {
          res.status(400).json({
            message: 'Error al registrar estudiante',
            error: error.message
          });
        }
      }
}

const estPostLista = async ( req, res = response ) => {
    try {
        const estudiantes = req.body;
    
        if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
          return res.status(400).json({ message: 'Debe enviar una lista de estudiantes' });
        }
    
        // Extraer fichas únicas del lote
        const fichas = [...new Set(estudiantes.map(e => e.numeroFicha))];
        const cursos = await Curso.find({ numeroFicha: { $in: fichas } });
        const fichasExistentes = cursos.map(c => c.numeroFicha);
    
        const fichasInvalidas = fichas.filter(f => !fichasExistentes.includes(f));
        if (fichasInvalidas.length > 0) {
          return res.status(400).json({
            message: 'Algunas fichas no existen',
            fichasInvalidas
          });
        }
    
        const insertados = await Estudiante.insertMany(estudiantes, { ordered: false });
    
        res.status(201).json({
          message: `${insertados.length} estudiantes registrados correctamente`,
          data: insertados
        });
      } catch (error) {
        if (error.code === 11000) {
          res.status(400).json({
            message: 'Uno o más estudiantes tienen identificaciones duplicadas',
            error: error.message
          });
        } else {
          res.status(500).json({
            message: 'Error al registrar estudiantes',
            error: error.message
          });
        }
      }
}

const estGet = async ( req, res = response ) => {
    try {
        const estudiantes = await Estudiante.find().sort({ apellido: 1 });
        res.json(estudiantes);
      } catch (error) {
        res.status(500).json({ message: 'Error al obtener estudiantes', error: error.message });
      }    
}

const estGetCurso = async ( req, res = response ) => {
    try {
        const ficha = req.params.numeroFicha;
        const estudiantes = await Estudiante.find({ numeroFicha: ficha });
    
        if (estudiantes.length === 0) {
          return res.status(404).json({ message: 'No hay estudiantes registrados para esa ficha' });
        }
    
        res.json(estudiantes);
      } catch (error) {
        res.status(500).json({ message: 'Error al buscar estudiantes por ficha', error: error.message });
      }
}

const estPut = async ( req, res = response ) => {
    try {
        const estudianteActualizado = await Estudiante.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        );
    
        if (!estudianteActualizado) {
          return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
    
        res.json({
          message: 'Estudiante actualizado correctamente',
          data: estudianteActualizado
        });
      } catch (error) {
        if (error.code === 11000) {
          res.status(400).json({
            message: 'Ya existe un estudiante con esa identificación',
            error: error.message
          });
        } else {
          res.status(500).json({
            message: 'Error al actualizar estudiante',
            error: error.message
          });
        }
      }
}


module.exports = {

    estPost,
    estPostLista,
    estGet,
    estGetCurso,
    estPut
    
}