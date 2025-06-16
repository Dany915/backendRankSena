const mongoose = require('mongoose');

const CompetenciaSchema = new mongoose.Schema({
  nombreCompetencia: { type: String, required: true },
  codigoCompetencia: { type: String, required: true, unique: true },
  duracion: { type: String },
  unidadCompetencia: { type: String },
  idPrograma: { type: mongoose.Schema.Types.ObjectId, ref: 'Programa', required: true },
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Competencia', CompetenciaSchema);
