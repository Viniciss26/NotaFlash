import express from 'express';
const router = express.Router();

import {
  cadastrarProduto,
  obterProdutos,
  obterProdutoPorId,
  atualizarProduto,
  excluirProduto,
  obterProdutosPorCategoria
} from '../controllers/produtoController.js';

router.route('/')
  .post(cadastrarProduto)
  .get(obterProdutos);

router.get('/categoria/:categoria', obterProdutosPorCategoria);

router.route('/:id')
  .get(obterProdutoPorId)
  .put(atualizarProduto)
  .delete(excluirProduto);

export default router;