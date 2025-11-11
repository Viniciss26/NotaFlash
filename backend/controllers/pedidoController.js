import Pedido from '../models/Pedido.js';

const cadastrarPedido = async (req, res) => {
  const { cliente, itens, total } = req.body;
  if (!cliente || !itens || itens.length === 0) {
    return res.status(400).json({ msg: 'Cliente e Itens são obrigatórios.' });
  }

  try {
    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json(novoPedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor ao cadastrar pedido.' });
  }
};

const obterPedidos = async (req, res) => {
  const { dataInicio, dataFim } = req.query;

  const filtro = {};

  if (dataInicio && dataFim) {
    filtro.createdAt = {
      $gte: new Date(dataInicio + "T00:00:00"),
      $lte: new Date(dataFim + "T23:59:59.999")
    };
  }

  try {
    const pedidos = await Pedido.find(filtro)
      .populate('cliente', 'nome')
      .sort({ createdAt: 1 });
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar pedidos.' });
  }
};

const obterPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'nome telefone')
      .populate('itens.produto', 'nome');

    if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado.' });
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar pedido.' });
  }
};

const atualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado.' });
    res.json({ msg: 'Pedido atualizado com sucesso!', pedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao atualizar pedido.' });
  }
};

const excluirPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado.' });
    res.json({ msg: 'Pedido excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao excluir pedido.' });
  }
};

export {
  cadastrarPedido,
  obterPedidos,
  obterPedidoPorId,
  atualizarPedido,
  excluirPedido
};