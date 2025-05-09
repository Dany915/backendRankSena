const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rol: { type: String, enum: ['admin', 'instructor'], default: 'instructor' },
  contraseña: { type: String, required: true },
  cursosAsociados: [{ type: String, ref: 'Curso' }]
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
