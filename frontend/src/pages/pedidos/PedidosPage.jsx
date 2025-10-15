import React, { useState, useEffect } from 'react';
import './PedidosPage.css';

// Dados de exemplo, agora com mais detalhes
const mockClientes = [
  { id: 1, nome: 'Padaria Pão Quente' }, { id: 2, nome: 'Mercadinho do Zé' },
  { id: 3, nome: 'Lanchonete Sabor & Cia' }, { id: 4, nome: 'Restaurante Tempero Bom' },
];

const mockProdutos = [
  { id: 101, nome: 'Pão Francês', preco: 0.75, unidade: 'un' },
  { id: 102, nome: 'Queijo Mussarela Fatiado', preco: 55.90, unidade: 'kg' },
  { id: 103, nome: 'Presunto Cozido Fatiado', preco: 39.90, unidade: 'kg' },
  { id: 104, nome: 'Refrigerante 2L', preco: 8.00, unidade: 'un' },
  { id: 105, nome: 'Saco de Arroz 5kg', preco: 28.50, unidade: 'pct' },
];

function PedidosPage() {
  // Estado para o pedido
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [itensDoPedido, setItensDoPedido] = useState([]);
  const [observacoes, setObservacoes] = useState('');

  // Estados para a busca de clientes
  const [buscaCliente, setBuscaCliente] = useState('');
  const [clientesEncontrados, setClientesEncontrados] = useState([]);

  // Estados para a busca de produtos
  const [buscaProduto, setBuscaProduto] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtosEncontrados, setProdutosEncontrados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('un');

  // Lógica de busca de clientes
  useEffect(() => {
    if (buscaCliente) {
      const filtrados = mockClientes.filter(c => c.nome.toLowerCase().includes(buscaCliente.toLowerCase()));
      setClientesEncontrados(filtrados);
    } else {
      setClientesEncontrados([]);
    }
  }, [buscaCliente]);

  // Lógica de busca de produtos
  useEffect(() => {
    if (buscaProduto) {
      const filtrados = mockProdutos.filter(p => p.nome.toLowerCase().includes(buscaProduto.toLowerCase()));
      setProdutosEncontrados(filtrados);
    } else {
      setProdutosEncontrados([]);
    }
  }, [buscaProduto]);

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
    setUnidadeSelecionada('un')
  };

  const handleRemoverItem = (idDoItem) => {
    setItensDoPedido(itensDoPedido.filter(item => item.id !== idDoItem));
  };
  
  const calcularTotal = () => {
    return itensDoPedido.reduce((total, item) => total + (item.quantidade * item.preco), 0).toFixed(2);
  };

  return (
    <div className="pedidos-page">
      <h2>Novo Pedido</h2>
      <form onSubmit={(e) => e.preventDefault()}>

        {/* CARD 1: SELECIONAR CLIENTE */}
        <div className="pedido-card">
          <h3>1. Cliente</h3>
          {clienteSelecionado ? (
            <div className="cliente-selecionado">
              {clienteSelecionado.nome}
              <button
                onClick={() => setClienteSelecionado(null)}
                className="btn-trocar-cliente"
              >
                Trocar
                </button>
            </div>
          ) : (
            <div className="form-group-pedido">
              <label htmlFor="cliente">Buscar cliente pelo nome</label>
              <input 
                type="text" 
                id="cliente"
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                placeholder="Digite o nome do cliente..."
                autoComplete="off"
              />
              {clientesEncontrados.length > 0 && (
                <div className="search-results">
                  {clientesEncontrados.map(cliente => (
                    <div key={cliente.id} onClick={() => handleSelecionaCliente(cliente)}>
                      {cliente.nome}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CARD 2: ADICIONAR PRODUTOS */}
        <div className="pedido-card">
          <h3>2. Adicionar Produtos</h3>
          <div className="add-produto-grid">
            <div className="form-group-pedido">
              <label htmlFor="produto">Buscar produto</label>
              <input
                type="text"
                id="produto"
                value={buscaProduto}
                onChange={(e) => setBuscaProduto(e.target.value)}
                placeholder="Digite o nome do produto..."
                autoComplete="off"
              />
              {produtosEncontrados.length > 0 && (
                <div className="search-results">
                  {produtosEncontrados.map(produto => (
                    <div key={produto.id} onClick={() => handleSelecionaProduto(produto)}>
                      {produto.nome}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="form-group-pedido">
              <label>Quantidade</label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min="0.01"
                step={unidadeSelecionada === 'kg' ? '0.01' : '1'}
              />
            </div>

            <div className="form-group-pedido">
              <label>Unidade</label>
              <select 
                value={unidadeSelecionada} 
                onChange={(e) => setUnidadeSelecionada(e.target.value)}
              >
                <option value="un">un</option>
                <option value="kg">kg</option>
                <option value="pct">pct</option>
                <option value="cx">cx</option>
              </select>
            </div>
            

                <div className='form-group-pedido'>
                    <button type="button" className="add-produto-btn" onClick={handleAddItemAoPedido}>
                      Adicionar
                    </button>
                </div>
          </div>
        </div>

        {/* CARD 3: RESUMO DO PEDIDO */}
        {itensDoPedido.length > 0 && (
          <div className="pedido-card">
            <h3>3. Resumo do Pedido</h3>
            <table className="resumo-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd.</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itensDoPedido.map(item => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>{item.quantidade} {item.unidade}</td>
                    <td>R$ {item.preco.toFixed(2)}</td>
                    <td>R$ {(item.quantidade * item.preco).toFixed(2)}</td>
                    <td className="item-actions">
                      <button type="button" className="remover-btn" onClick={() => handleRemoverItem(item.id)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total-container">
              Total: R$ {calcularTotal()}
            </div>
          </div>
        )}

        {/* CARD 4: OBSERVAÇÕES E FINALIZAÇÃO */}
        <div className="pedido-card">
            <h3>4. Observações e Finalização</h3>
            <div className="form-group-pedido">
                <label htmlFor="observacoes">Observações do Pedido</label>
                <textarea 
                  id="observacoes"
                  rows="3"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                ></textarea>
            </div>
            <button type="button" className="finalizar-pedido-btn" onClick={() => alert('Lógica de finalizar não implementada')}>
                Finalizar Pedido
            </button>
        </div>

      </form>
    </div>
  );
}

export default PedidosPage;