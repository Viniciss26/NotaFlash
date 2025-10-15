import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListaProdutos.css'; 

const mockProdutos = [
    { _id: '101', nome: 'Pão Francês', preco: 0.75, unidade: 'un' },
    { _id: '102', nome: 'Queijo Mussarela Fatiado', preco: 55.90, unidade: 'kg' },
    { _id: '103', nome: 'Refrigerante 2L', preco: 8.00, unidade: 'un' },
    { _id: '104', nome: 'Saco de Arroz 5kg', preco: 28.50, unidade: 'pct' },
];

function ListaProdutos() {
  const [produtos, setProdutos] = useState(mockProdutos);
  const [filtro, setFiltro] = useState('');
  const [produtosFiltrados, setProdutosFiltrados] = useState(mockProdutos);

  useEffect(() => {
    const resultado = produtos.filter(produto =>
      produto.nome.toLowerCase().includes(filtro.toLowerCase())
    );
    setProdutosFiltrados(resultado);
  }, [filtro, produtos]);

  const handleEditar = (id) => {
    alert(`Lógica para ir para a página de edição do produto ID: ${id}`);
  };

  const handleExcluir = (id) => {
    alert(`Lógica para excluir o produto ID: ${id}`);
  };

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h2>Gerenciamento de Produtos</h2>
        <Link to="/produtos/cadastrar" className="btn-adicionar">
          + Adicionar Produto
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <table className="clientes-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Unidade Padrão</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map(produto => (
            <tr key={produto._id}>
              <td>{produto.nome}</td>
              <td>R$ {produto.preco.toFixed(2)}</td>
              <td>{produto.unidade}</td>
              <td className="actions-cell">
                <button className="btn-editar" onClick={() => handleEditar(produto._id)}>Editar</button>
                <button className="btn-excluir" onClick={() => handleExcluir(produto._id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaProdutos;