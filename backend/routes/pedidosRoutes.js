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

// Helper para datas (usado nas rotas manuais e whatsapp)
const criarFiltroDeData = (dataInicio, dataFim) => {
  const filtro = {};
  if (dataInicio && dataFim) {
    filtro.criadoEm = { // Ajustado para 'criadoEm' para bater com seu banco
      $gte: new Date(dataInicio + "T00:00:00"),
      $lte: new Date(dataFim + "T23:59:59.999")
    };
  }
  return filtro;
};

// --- 1. ROTA: FATURAMENTO DIÁRIO ---
router.get('/relatorios/faturamento', async (req, res) => {
  try {
    const dados = await Pedido.aggregate([
      {
        $match: { 
          status: { $regex: /Finalizado|Pendente/i } 
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$criadoEm" } }, 
          totalVendas: { $sum: "$total" },
          qtdPedidos: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: "Erro no faturamento" });
  }
});

// --- 2. ROTA: PRODUTOS MAIS VENDIDOS (PIZZA) ---
router.get('/relatorios/produtos-mais-vendidos', async (req, res) => {
  try {
    const dados = await Pedido.aggregate([
      { $match: { status: { $regex: /Finalizado|Pendente/i } } },
      { $unwind: "$itens" },
      { 
        $group: {
          _id: "$itens.nome",
          quantidadeVendida: { $sum: "$itens.quantidade" }
        }
      },
      { $sort: { quantidadeVendida: -1 } },
      { $limit: 5 }
    ]);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: "Erro nos produtos" });
  }
});

// --- 3. ROTAS DE FILTRO (WHATSAPP / MANUAL) ---
router.get('/whatsapp', async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const filtroData = criarFiltroDeData(dataInicio, dataFim);
    const filtroFinal = { ...filtroData, origem: 'whatsapp' };
    const pedidos = await Pedido.find(filtroFinal).populate('cliente').sort({ criadoEm: 1 });
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
    const pedidos = await Pedido.find(filtroFinal).populate('cliente').sort({ criadoEm: 1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos manuais" });
  }
});

// --- 4. ROTA: ATUALIZAR STATUS ---
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

// --- 5. ROTAS PADRÃO (Sempre por último) ---
router.route('/')
  .post(cadastrarPedido)
  .get(obterPedidos);

router.route('/:id')
  .get(obterPedidoPorId)
  .put(atualizarPedido)
  .delete(excluirPedido);

export default router;