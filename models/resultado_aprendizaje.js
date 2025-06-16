const mongoose = require('mongoose');

const ResultadoAprendizajeSchema = new mongoose.Schema({
  nombreResultado: { type: String, required: true },
  enumeracion: { type: String, required: true }, // Ej: "RA1", "RA2", "1.1", etc.
  criterioEvaluacion: { type: String },
  conocimientoSaber: { type: String },
  conocimientoProceso: { type: String },
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ResultadoAprendizaje', ResultadoAprendizajeSchema);
