const { response } = require('express');


const Curso = require('../models/curso');
const Actividad = require('../models/actividad');

const vacio = async ( req, res = response ) => {
    
}

const actPost = async ( req, res = response ) => {
    try {
        const { cursoId } = req.body;
    
        // Validar que el curso exista
        const curso = await Curso.findById(cursoId);
        if (!curso) {
          return res.status(400).json({ message: 'El curso no existe' });
        }
    
        const nueva = new Actividad(req.body);
        await nueva.save();
        res.status(201).json({
          message: 'Actividad registrada correctamente',
          data: nueva
        });
      } catch (error) {
        res.status(400).json({ message: 'Error al registrar actividad', error: error.message });
      }
}

const actGet = async ( req, res = response ) => {
    try {
        const actividades = await Actividad.find().sort({ createdAt: -1 });
        res.json(actividades);
      } catch (error) {
        res.status(500).json({ message: 'Error al obtener actividades', error: error.message });
      }
}

const actPut = async ( req, res = response ) => {
    try {
        const actualizada = await Actividad.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        );
    
        if (!actualizada) {
          return res.status(404).json({ message: 'Actividad no encontrada' });
        }
    
        res.json({
          message: 'Actividad actualizada correctamente',
          data: actualizada
        });
      } catch (error) {
        res.status(400).json({ message: 'Error al actualizar actividad', error: error.message });
      }
}

const actGetId = async ( req, res = response ) => {
    try {
        const actividad = await Actividad.findById(req.params.id);
        if (!actividad) return res.status(404).json({ message: 'Actividad no encontrada' });
    
        res.json(actividad);
      } catch (error) {
        res.status(500).json({ message: 'Error al buscar actividad', error: error.message });
      }
}

const acGetCurso = async ( req, res = response ) => {
    try {
        const actividades = await Actividad.find({ cursoId: req.params.cursoId });
        if (actividades.length === 0) {
          return res.status(404).json({ message: 'No hay actividades para este curso' });
        }
    
        res.json(actividades);
      } catch (error) {
        res.status(500).json({ message: 'Error al buscar actividades del curso', error: error.message });
      }
}

module.exports = {

    actPut,
    acGetCurso,
    actGet,
    actPost,
    actGetId

}
