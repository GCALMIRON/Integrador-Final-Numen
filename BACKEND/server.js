const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const recetaRoutes = require('./routes/recetaRoutes');
const registroAccesoMiddleware = require('./middlewares/registroAccesoMiddleware');

const app = express();
const port = process.env.PORT;

// Configurar middlewares
app.use(cors());
app.use(registroAccesoMiddleware);
app.use(express.json());
app.use('/recetas', recetaRoutes);


// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor backend!');
});

// Configurar conexión a MongoDB
mongoose.connect(process.env.MONGO_URI);

// Manejar eventos de conexión a MongoDB
mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


