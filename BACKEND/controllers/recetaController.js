const mongoose = require('mongoose');
const Receta = require('../models/receta');
const { validationResult } = require('express-validator')
const axios = require('axios');

exports.buscarRecetasPorIngrediente = async (req, res) => {
  const { ingrediente } = req.query;

  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`);
    const data = response.data;

    if (data && data.meals) {
      res.json(data.meals);
    } else {
      res.json ([]);
    }
  } catch (error) {
    console.error('Error al buscar recetas:' , error);
    res.status(500).json({error: "No se encontraron recetas"});
  }
};

exports.obtenerTodasLasRecetas = async (req, res) => {
  try {
    const recetas = await Receta.find();
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearReceta = async (req, res) => {
  try {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const nuevaReceta = new Receta({
      nombre: req.body.nombre,
      ingredientes: req.body.ingredientes,
      pasos: req.body.pasos,
    });
    const recetaGuardada = await nuevaReceta.save();
    console.log('Receta guardada:', recetaGuardada);
    res.status(201).json(recetaGuardada);
    
  } catch (error) {
    console.error('Error al guardar receta', error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerRecetaPorId = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarReceta = async (req, res) => {
  try {
    const receta = await Receta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarReceta = async (req, res) => {
  try {
    const receta = await Receta.findByIdAndDelete(req.params.id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.json({ mensaje: 'Receta eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
