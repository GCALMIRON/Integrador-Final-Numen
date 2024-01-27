const { validationResult } = require('express-validator')

// Middleware para validad crear una receta

const validarCreacionReceta = (req, res, next) => {

    console.log('Middleware de validación ejecutado');

    const errores = validationResult(req);

    if (!errores.isEmpty()) {

        console.log('Errores de validación encontrados:', errores.array());

        return res.status(400).json({
            errores: errores.array()
        });
    }

    console.log('No hay errores de validación');

    next();
}