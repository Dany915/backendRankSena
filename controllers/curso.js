const { response } = require('express');


const Curso = require('../models/curso');

const cursoPost = async ( req, res = response ) => {    
  try {
    const nuevoCurso = new Curso(req.body);
    await nuevoCurso.save();
    res.status(201).json({
      message: 'Curso registrado correctamente',
      data: nuevoCurso
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error al registrar el curso',
      error: error.message
    });
  }
}

const cursosGet = async ( req, res = response ) => {    
  try {
    const cursos = await Curso.find();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos', error: error.message });
  }  
}

const cursoGet = async ( req, res = response ) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el curso', error: error.message });
  }  
}

const cursoPut = async ( req, res = response ) => {
  try {
    const cursoActualizado = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!cursoActualizado) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    res.json({
      message: 'Curso actualizado correctamente',
      data: cursoActualizado
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el curso', error: error.message });
  } 
  
}

const cursoPatch = async ( req, res = response ) => {
  try {
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      { estado: 'inactivo' },
      { new: true }
    );

    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    res.json({
      message: 'Curso marcado como inactivo',
      data: curso
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al inactivar el curso', error: error.message });
  }  
}

const cursosEstadoGet = async ( req, res = response ) => {
    
  const estado = req.params.estado;

  if (!['activo', 'inactivo'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido. Usa "activo" o "inactivo"' });
  }

  try {
    const cursos = await Curso.find({ estado });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al filtrar cursos', error: error.message });
  }
  
}




module.exports = {
    cursoPost,
    cursosGet,
    cursoGet,
    cursoPut,
    cursoPatch,
    cursosEstadoGet
}