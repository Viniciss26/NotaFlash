import React, { useState, useMemo } from 'react';
import './ProdutosPage.css'; // Importando nosso novo CSS

const mockProdutos = [
  { id: 1, nome: 'Queijo Mussarela (Kg)', preco: 55.90, categoria: 'Frios', sku: 'FR-001' },
  { id: 2, nome: 'Presunto Cozido (Kg)', preco: 45.50, categoria: 'Frios', sku: 'FR-002' },
  { id: 3, nome: 'Copo Descartável 300ml (100 un)', preco: 8.50, categoria: 'Descartáveis', sku: 'DC-001' },
  { id: 4, nome: 'Detergente Limpol', preco: 2.99, categoria: 'Produtos de Limpeza', sku: 'PL-001' },
  { id: 5, nome: 'Arroz Tipo 1 (5Kg)', preco: 28.00, categoria: 'Mercearia', sku: 'MC-001' },
  { id: 6, nome: 'Pimenta do Reino (50g)', preco: 5.00, categoria: 'Temperos', sku: 'TP-001' },
  { id: 7, nome: 'Salame Italiano (Kg)', preco: 89.90, categoria: 'Frios', sku: 'FR-003' },
  { id: 8, nome: 'Guardanapo de Papel (50 un)', preco: 3.50, categoria: 'Descartáveis', sku: 'DC-002' },
  { id: 9, nome: 'Água Sanitária (1L)', preco: 4.20, categoria: 'Produtos de Limpeza', sku: 'PL-002' },
  { id: 10, nome: 'Feijão Carioca (1Kg)', preco: 9.50, categoria: 'Mercearia', sku: 'MC-002' },
  { id: 11, nome: 'Orégano (30g)', preco: 3.00, categoria: 'Temperos', sku: 'TP-002' },
  { id: 12, nome: 'Peito de Peru (Kg)', preco: 75.00, categoria: 'Frios', sku: 'FR-004' },
];

const itensPorPagina = 5;

function ProdutosPage() {
  // Estados para controlar os campos do formulário
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [sku, setSku] = useState('');

  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);


  const produtosFiltrados = useMemo(() => {
    if (!termoBusca) {
      return mockProdutos;
    }
    return mockProdutos.filter(produto =>
      produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );
  }, [termoBusca]);

  const produtosPaginados = useMemo(() => {
    const ultimoIndex = paginaAtual * itensPorPagina;
    const primeiroIndex = ultimoIndex - itensPorPagina;
    return produtosFiltrados.slice(primeiroIndex, ultimoIndex);
  }, [produtosFiltrados, paginaAtual]);

  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);

  const handleSubmit = (event) => {
    event.preventDefault();
    const novoProduto = { nome, preco, categoria, sku };
    console.log('Novo Produto:', novoProduto);
    alert(`Produto "${nome}" cadastrado! (Verifique o console)`);
  };

  return (
    <div className="produtos-page">
      <h2>Cadastro de Produtos</h2>

      {/* Seção do Formulário */}
      <div className="form-container">
        <h3>Adicionar Novo Produto</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome do Produto</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="preco">Preço (R$)</label>
              <input
                type="number"
                id="preco"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                <option value="Frios">Frios</option>
                <option value="Descartáveis">Descartáveis</option>
                <option value="Produtos de Limpeza">Produtos de Limpeza</option>
                <option value="Mercearia">Mercearia</option>
                <option value="Temperos">Temperos</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sku">Código (SKU)</label>
              <input
                type="text"
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Cadastrar Produto</button>
          </div>
        </form>
      </div>

      {/* Seção da Lista de Produtos */}
      <div className="product-list">
        <div className="list-header">
          <h3>Produtos Cadastrados</h3>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar produto por nome..."
              value={termoBusca}
              onChange={(e) => {
                setTermoBusca(e.target.value);
                setPaginaAtual(1);
              }}
            />
          </div>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosPaginados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>R$ {produto.preco.toFixed(2)}</td>
                <td>{produto.categoria}</td>
                <td className="action-buttons">
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
          <span>
            Página {paginaAtual} de {totalPaginas > 0 ? totalPaginas : 1}
          </span>
          <button
            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas || produtosFiltrados.length === 0}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProdutosPage;