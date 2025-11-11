import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';

import clientesRoutes from './routes/clientesRoutes.js';
import produtosRoutes from './routes/produtosRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use(cors());

conectarDB();

app.use('/api/clientes', clientesRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/whatsapp', whatsappRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});