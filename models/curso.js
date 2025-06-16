const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  idPrograma: { type: mongoose.Schema.Types.ObjectId, ref: 'Programa', required: true },
  numeroFicha: { type: String, required: true, unique: true },  
  descripcion: { type: String },
  lugar: { type: String },
  institucionEducativa: { type: String },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  fechaInicio: { type: Date },
  fechaFin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Curso', CursoSchema);
