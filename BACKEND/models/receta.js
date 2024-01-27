const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  ingredientes: {
    type: String,
    required: true,
  },
  pasos: {
    type: String,
    required: true,
  },
});

const Receta = mongoose.model('Receta', recetaSchema);

module.exports = Receta;
