const express = require('express');
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db');

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API de Gerenciamento do Pedidos!' })
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
});

