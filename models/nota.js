const mongoose = require('mongoose');

const NotaSchema = new mongoose.Schema({
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  idEstudiante: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
  idActividad: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad', required: true },  
  nota: { type: Number, required: true },
  detallesNota: { type: String },
  fechaEntrega: { type: Date, default: Date.now },
  estado: { type: String, enum: ['Recuperada', 'No aprobada', 'Aprobada', 'No entregada'], default: 'No entregada' }
}, { timestamps: true });

module.exports = mongoose.model('Nota', NotaSchema);
