const express = require('express');
const cors = require('cors');
const app = express();

// importamos la ruta
const oferentesRoutes = require('./routes/oferentesRoutes');

app.use(cors());
app.use(express.json());

// usamos la ruta en /api/v1/oferentesListos
app.use('/api/v1/oferentesListos', oferentesRoutes);

module.exports = app;
