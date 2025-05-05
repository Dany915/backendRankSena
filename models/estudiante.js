const mongoose = require('mongoose');

const EstudianteSchema = new mongoose.Schema({
  tipoId: { type: String, required: true },
  identificacion: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  numeroFicha: { type: String, required: true, ref: 'Curso' },
  fechaNacimiento: { type: Date },
  fechaExpedicionDocumento: { type: Date },
  correo: { type: String },
  telefono: { type: String },
  genero: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Estudiante', EstudianteSchema);
