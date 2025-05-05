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


module.exports = {
    cursoPost,
}