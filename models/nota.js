const mongoose = require('mongoose');

const NotaSchema = new mongoose.Schema({
  idEstudiante: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
  idActividad: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad', required: true },
  nota: { type: Number, required: true },
  detallesNota: { type: String },
  fechaEntrega: { type: Date },
  estado: { type: String, enum: ['pendiente', 'entregada', 'calificada'], default: 'calificada' }
}, { timestamps: true });

module.exports = mongoose.model('Nota', NotaSchema);
