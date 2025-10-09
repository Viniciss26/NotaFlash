import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import clientesRoutes from './routes/clientesRoutes.js';

const app = express();

app.use(express.json());
dotenv.config();

app.use(cors());

conectarDB();

app.use('/api/clientes', clientesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});