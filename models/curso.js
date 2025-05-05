const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  numeroFicha: { type: String, required: true, unique: true },
  nombrePrograma: { type: String, required: true },
  descripcion: { type: String },
  versionPrograma: { type: String },
  periodo: { type: String },
  lugar: { type: String },
  institucionEducativa: { type: String },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  fechaInicio: { type: Date },
  fechaFin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Curso', CursoSchema);
