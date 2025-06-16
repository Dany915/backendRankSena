const mongoose = require('mongoose');

const ProgramaSchema = new mongoose.Schema({
  nombrePrograma: { type: String, required: true },
  duracion: { type: String },
  versionPrograma: { type: String },
  codigoPrograma: { type: String, required: true, unique: true },
  tipoPrograma: { type: String }, // Ej: técnico, tecnológico, etc.
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Programa', ProgramaSchema);
