import Produto from '../models/Produto.js';

const cadastrarProduto = async (req, res) => {
  const { nome, precoVenda, unidade } = req.body;
  if (!nome || !precoVenda || !unidade) {
    return res.status(400).json({ msg: 'Nome, Preço de Venda e Unidade são obrigatórios.' });
  }

  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor ao cadastrar produto.' });
  }
};

const obterProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar produtos.' });
  }
};

const obterProdutoPorId = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ msg: 'Produto não encontrado.' });
    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar produto.' });
  }
};

const obterProdutosPorCategoria = async (req, res) => {
  try {
    const produtos = await Produto.find({ grupo: req.params.categoria });
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar produtos por categoria.' });
  }
};

const atualizarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produto) return res.status(404).json({ msg: 'Produto não encontrado.' });
    res.json({ msg: 'Produto atualizado com sucesso!', produto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao atualizar produto.' });
  }
};

const excluirProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ msg: 'Produto não encontrado.' });
    res.json({ msg: 'Produto excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao excluir produto.' });
  }
};

export {
  cadastrarProduto,
  obterProdutos,
  obterProdutoPorId,
  obterProdutosPorCategoria,
  atualizarProduto,
  excluirProduto
};