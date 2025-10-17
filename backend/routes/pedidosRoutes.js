import express from 'express';
const router = express.Router();

import {
  cadastrarPedido,
  obterPedidos,
  obterPedidoPorId,
  atualizarPedido,
  excluirPedido
} from '../controllers/pedidoController.js';

router.route('/')
  .post(cadastrarPedido)
  .get(obterPedidos);

router.route('/:id')
  .get(obterPedidoPorId)
  .put(atualizarPedido)
  .delete(excluirPedido);

export default router;