const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String},
  apellido: { type: String},
  centro: { type: String},
  programa: { type: String},
  regional: { type: String},
  email: { type: String, required: true, unique: true },
  rol: { type: String, enum: ['admin', 'instructor'], default: 'instructor' },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
