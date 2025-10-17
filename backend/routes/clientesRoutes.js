import express from 'express';
import { cadastrarCliente, obterClientes, atualizarCliente, excluirCliente, obterClientePorId } from '../controllers/clienteController.js';

const router = express.Router();

router.route('/')
    .post(cadastrarCliente)
    .get(obterClientes)

router.route('/:id')
    .get(obterClientePorId)
    .put(atualizarCliente)
    .delete(excluirCliente);


export default router;