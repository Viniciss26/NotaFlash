import express from 'express';
import Pedido from '../models/Pedido.js';
import {
  cadastrarPedido,
  obterPedidos, 
  obterPedidoPorId,
  atualizarPedido,
  excluirPedido
} from '../controllers/pedidoController.js';

const router = express.Router();

const criarFiltroDeData = (dataInicio, dataFim) => {
  const filtro = {};
  if (dataInicio && dataFim) {
    filtro.createdAt = {
      $gte: new Date(dataInicio + "T00:00:00"),
      $lte: new Date(dataFim + "T23:59:59.999")
    };
  }
  return filtro;
};

router.get('/whatsapp', async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const filtroData = criarFiltroDeData(dataInicio, dataFim);
    const filtroFinal = { ...filtroData, origem: 'whatsapp' };
    const pedidos = await Pedido.find(filtroFinal).populate('cliente').sort({ createdAt: 1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos do WhatsApp" });
  }
});

router.get('/manual', async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const filtroData = criarFiltroDeData(dataInicio, dataFim);
    const filtroFinal = { ...filtroData, origem: 'Manual' };
    const pedidos = await Pedido.find(filtroFinal).populate('cliente').sort({ createdAt: 1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos manuais" });
  }
});

router.route('/')
  .post(cadastrarPedido)
  .get(obterPedidos);

router.route('/:id')
  .get(obterPedidoPorId)
  .put(atualizarPedido)
  .delete(excluirPedido);

export default router;