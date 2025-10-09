import express from 'express';
import { cadastrarCliente } from '../controllers/clienteController.js';

const router = express.Router();

router.post('/', cadastrarCliente);


export default router;