const { response } = require('express');

const Programa = require('../models/programa');

// Crear un programa
const crearPrograma = async (req, res = response) => {
  try {
    const nuevoPrograma = new Programa(req.body);
    await nuevoPrograma.save();
    res.status(201).json({
      message: 'Programa registrado correctamente',
      data: nuevoPrograma
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar programa', error: error.message });
  }
};

// Obtener todos los programas
const obtenerProgramas = async (req, res) => {
  try {
    const programas = await find().populate('idUsuario', 'nombre email');
    res.json(programas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener programas', error: error.message });
  }
};

// Obtener un programa por ID
const obtenerProgramaPorId = async (req, res) => {
  try {
    const programa = await findById(req.params.id);
    if (!programa) return res.status(404).json({ message: 'Programa no encontrado' });
    res.json(programa);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar programa', error: error.message });
  }
};

// Actualizar programa
const actualizarPrograma = async (req, res) => {
  try {
    const actualizado = await findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ message: 'Programa no encontrado' });
    res.json({ message: 'Programa actualizado', data: actualizado });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error: error.message });
  }
};

// Cambiar estado a inactivo
const inactivarPrograma = async (req, res) => {
  try {
    const programa = await findByIdAndUpdate(
      req.params.id,
      { estado: 'inactivo' },
      { new: true }
    );
    if (!programa) return res.status(404).json({ message: 'Programa no encontrado' });
    res.json({ message: 'Programa inactivado', data: programa });
  } catch (error) {
    res.status(500).json({ message: 'Error al inactivar', error: error.message });
  }
};

// Cambiar estado a activo
const activarPrograma = async (req, res) => {
  try {
    const programa = await findByIdAndUpdate(
      req.params.id,
      { estado: 'activo' },
      { new: true }
    );
    if (!programa) return res.status(404).json({ message: 'Programa no encontrado' });
    res.json({ message: 'Programa activado', data: programa });
  } catch (error) {
    res.status(500).json({ message: 'Error al activar', error: error.message });
  }
};

module.exports = {   
  crearPrograma
}