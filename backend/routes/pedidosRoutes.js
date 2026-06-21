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

// Helper para datas ajustado para 'createdAt' (padrão dos timestamps do Mongoose)
const criarFiltroDeData = (dataInicio, dataFim) => {
  const filtro = {};
  if (dataInicio && dataFim) {
    filtro.createdAt = { 
      $gte: new Date(dataInicio + "T00:00:00.000Z"),
      $lte: new Date(dataFim + "T23:59:59.999Z")
    };
  }
  return filtro;
};

// --- 1. ROTAS DE FILTRO (WHATSAPP / MANUAL) ---
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

// --- 2. ROTA: ATUALIZAR STATUS ---
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true }
    );
    res.json(pedidoAtualizado);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// --- 3. ROTAS PADRÃO (Sempre por último) ---
router.route('/')
  .post(cadastrarPedido)
  .get(obterPedidos);

router.route('/:id')
  .get(obterPedidoPorId)
  .put(atualizarPedido)
  .delete(excluirPedido);

export default router;