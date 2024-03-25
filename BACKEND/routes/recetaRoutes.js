const express = require('express');
const { body, validationResult } = require ('express-validator');
const recetaController = require('../controllers/recetaController');
const router = express.Router();

router.get("/buscar", recetaController.buscarRecetasPorIngrediente);


// Rutas CRUD para recetas

// Middleware para validad crear una receta
const validarCreacionReceta = [
    body('nombre', 'El nombre de la receta es obligatorio').notEmpty(),
    body('ingredientes', 'Los ingredientes de la receta son obligatorios').notEmpty(),
    body('pasos', 'Los pasos de la receta son obligatorios').notEmpty(),
  
    // Manejo de errores de validación
  (req, res, next) => {
    console.log('Middleware de validación ejecutado');
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        console.log('Errores de validación encontrados:', errores.array());
      return res.status(400).json({ errores: errores.array() });
    }
    console.log('No hay errores de validación');
    next();
  }
];

// Rutas CRUD para recetas con validaciones
router.get('/', recetaController.obtenerTodasLasRecetas);
router.post('/', validarCreacionReceta, recetaController.crearReceta);
 

router.get('/:id', recetaController.obtenerRecetaPorId);
router.put('/:id', recetaController.actualizarReceta);
router.delete('/:id', recetaController.eliminarReceta);

module.exports = router;
