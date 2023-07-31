const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//Importar ruta usuarios
const userRoutes = require('./routes/user.routes.js');

// configuracion del puerto
const app = express();
const port = 9000;

//Middleware
app.use(express.json());
app.use('/api', userRoutes);

//definir rutas
app.get('/', (req, res) => {
    res.send('Welcome to API');
})

//MongoDB conección
mongoose.connect('mongodb://localhost:27017')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error));

// ejecutar servidor
app.listen(port, () => console.log('server running on port', port));