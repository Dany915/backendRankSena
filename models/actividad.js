const mongoose = require('mongoose');

const ActividadSchema = new mongoose.Schema({
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  resultadoAprendizaje: { type: String },
  competencia: { type: String },
  tipoActividad: { type: String },
  criterioEvaluacion: { type: String },
  instrumentoEvaluacion: { type: String },
  tecnicaEvaluacion: { type: String },
  evidenciaAprendizaje: { type: String },
  cursoId: { type: String, ref: 'Curso' }
}, { timestamps: true });

module.exports = mongoose.model('Actividad', ActividadSchema);
