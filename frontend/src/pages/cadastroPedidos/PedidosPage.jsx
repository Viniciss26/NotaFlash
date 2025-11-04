import { useState, useEffect } from 'react';
import api from '../../api';
import './PedidosPage.css';

function PedidosPage() {
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [itensDoPedido, setItensDoPedido] = useState([]);
  const [observacoes, setObservacoes] = useState('');

  const [clientes, setClientes] = useState([]); 
  const [produtos, setProdutos] = useState([]); 

  const [buscaCliente, setBuscaCliente] = useState('');
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtosEncontrados, setProdutosEncontrados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('un');

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resClientes, resProdutos] = await Promise.all([
          api.get('/clientes'),
          api.get('/produtos')
        ]);
        setClientes(resClientes.data);
        setProdutos(resProdutos.data);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        alert('Não foi possível carregar clientes e produtos.');
      }
    };
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (buscaCliente) {
      setClientesEncontrados(clientes.filter(c => c.nome.toLowerCase().includes(buscaCliente.toLowerCase())));
    } else {
      setClientesEncontrados([]);
    }
  }, [buscaCliente, clientes]);

  useEffect(() => {
    if (buscaProduto) {
      setProdutosEncontrados(produtos.filter(p => p.nome.toLowerCase().includes(buscaProduto.toLowerCase())));
    } else {
      setProdutosEncontrados([]);
    }
  }, [buscaProduto, produtos]);

  const handleSelecionaCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setBuscaCliente('');
    setClientesEncontrados([]);
  };
  
  const handleSelecionaProduto = (produto) => {
    setProdutoSelecionado(produto);
    setBuscaProduto(produto.nome);
    setProdutosEncontrados([]);
    setUnidadeSelecionada(produto.unidade);
  };

  const handleAddItemAoPedido = () => {
    if (!produtoSelecionado || quantidade <= 0) {
      alert('Selecione um produto e defina uma quantidade válida.');
      return;
    }
    
    setItensDoPedido([...itensDoPedido, {
      ...produtoSelecionado,
      quantidade: Number(quantidade),
      unidade: unidadeSelecionada,
    }]);

    setProdutoSelecionado(null);
    setBuscaProduto('');
    setQuantidade(1);
    setUnidadeSelecionada('un');
  };

  const handleRemoverItem = (idDoItem) => {
    setItensDoPedido(itensDoPedido.filter(item => item._id !== idDoItem));
  };
  
  const calcularTotal = () => {
    return itensDoPedido.reduce((total, item) => total + (item.quantidade * item.precoVenda), 0).toFixed(2);
  };

  const handleFinalizarPedido = async (event) => {
    event.preventDefault();

    // Validações
    if (!clienteSelecionado) {
      return alert('Por favor, selecione um cliente.');
    }
    if (itensDoPedido.length === 0) {
      return alert('O pedido precisa ter pelo menos um item.');
    }

    const pedidoData = {
      cliente: clienteSelecionado._id,
      itens: itensDoPedido.map(item => ({
        produto: item._id,
        quantidade: item.quantidade,
        precoUnitario: item.precoVenda
      })),
      total: calcularTotal(),
      observacoes: observacoes,
    };

    try {
      await api.post('/pedidos', pedidoData);
      alert('Pedido cadastrado com sucesso!');
      setClienteSelecionado(null);
      setItensDoPedido([]);
      setObservacoes('');
      setBuscaCliente('');
      setBuscaProduto('');

    } catch (error) {
      console.error("Erro ao finalizar o pedido:", error);
      alert('Ocorreu um erro ao salvar o pedido.');
    }
  };

  return (
    <div className="pedidos-page">
      <h2>Novo Pedido</h2>
      <form onSubmit={handleFinalizarPedido}>

        <div className="pedido-card">
          <h3>1. Cliente</h3>
          {clienteSelecionado ? (
            <div className="cliente-selecionado">
              {clienteSelecionado.nome}
              <button type="button" onClick={() => setClienteSelecionado(null)} className="btn-trocar-cliente">Trocar</button>
            </div>
          ) : (
            <div className="form-group-pedido">
              <label htmlFor="cliente">Buscar cliente pelo nome</label>
              <input type="text" id="cliente" value={buscaCliente} onChange={(e) => setBuscaCliente(e.target.value)} placeholder="Digite o nome do cliente..." autoComplete="off"/>
              {clientesEncontrados.length > 0 && (
                <div className="search-results">{clientesEncontrados.map(cliente => (<div key={cliente._id} onClick={() => handleSelecionaCliente(cliente)}>{cliente.nome}</div>))}</div>
              )}
            </div>
          )}
        </div>

        <div className="pedido-card">
            <h3>2. Adicionar Produtos</h3>
            <div className="add-produto-grid">
                <div className="form-group-pedido">
                <label htmlFor="produto">Buscar produto</label>
                <input type="text" id="produto" value={buscaProduto} onChange={(e) => setBuscaProduto(e.target.value)} placeholder="Digite o nome do produto..." autoComplete="off"/>
                {produtosEncontrados.length > 0 && (
                    <div className="search-results">{produtosEncontrados.map(produto => (<div key={produto._id} onClick={() => handleSelecionaProduto(produto)}>{produto.nome}</div>))}</div>
                )}
                </div>
                
                <div className="form-group-pedido">
                <label>Quantidade</label>
                <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} min="0.01" step={unidadeSelecionada === 'kg' ? '0.01' : '1'}/>
                </div>

                <div className="form-group-pedido">
                <label>Unidade</label>
                <select value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(e.target.value)}>
                    <option value="un">un</option> <option value="kg">kg</option> <option value="pct">pct</option> <option value="cx">cx</option>
                </select>
                </div>
                
                <div>
                    <label>&nbsp;</label>
                    <button type="button" className="add-produto-btn" onClick={handleAddItemAoPedido}>Adicionar</button>
                </div>
            </div>
        </div>

        {itensDoPedido.length > 0 && (
          <div className="pedido-card">
            <h3>3. Resumo do Pedido</h3>
            <table className="resumo-table">
              <thead>
                <tr>
                  <th>Produto</th><th>Qtd.</th><th>Preço Unit.</th><th>Subtotal</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itensDoPedido.map(item => (
                  <tr key={item._id}>
                    <td>{item.nome}</td>
                    <td>{item.quantidade} {item.unidade}</td>
                    <td>R$ {typeof item.precoVenda === 'number' ? item.precoVenda.toFixed(2) : '0.00'}</td>
                    <td>R$ {(item.quantidade * item.precoVenda).toFixed(2)}</td>
                    <td className="item-actions">
                      <button type="button" className="remover-btn" onClick={() => handleRemoverItem(item._id)}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total-container">Total: R$ {calcularTotal()}</div>
          </div>
        )}

        <div className="pedido-card">
            <h3>4. Observações e Finalização</h3>
            <div className="form-group-pedido">
                <label htmlFor="observacoes">Observações do Pedido</label>
                <textarea id="observacoes" rows="3" value={observacoes} onChange={(e) => setObservacoes(e.target.value)}></textarea>
            </div>
            <button type="submit" className="finalizar-pedido-btn">
                Finalizar Pedido
            </button>
        </div>
      </form>
    </div>
  );
}

export default PedidosPage;