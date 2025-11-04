import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import './ProdutosDaCategoria.css';

function ProdutosCategoria() {
  const { categoria } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get(`/produtos/categoria/${categoria}`);
        setProdutos(response.data);
        setProdutosFiltrados(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, [categoria])

  useEffect(() => {
      const resultado = produtos.filter(produto =>
          produto.nome.toLowerCase().includes(filtro.toLowerCase())
      );
      setProdutosFiltrados(resultado);
  }, [filtro, produtos]);

  const handleEditar = (id) => {
      navigate(`/produtos/editar/${id}`);
  };

  const handleExcluir = async (id) => {
      if (window.confirm('Tem certeza que deseja excluir este produto?')) {
          try {
              await api.delete(`/produtos/${id}`);
              setProdutos(produtos.filter(p => p._id !== id));
              alert('Produto excluído com sucesso!');
          } catch (error) {
              console.error("Erro ao excluir produto:", error);
          }
      }
  };

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h2>Produtos em: {categoria}</h2>
        <Link to="/produtos/cadastrar" className="btn-adicionar">
          + Adicionar Novo Produto
        </Link>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar nesta categoria..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      <table className="clientes-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço de Venda</th>
            <th>Unidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map(produto => (
            <tr key={produto._id}>
              <td>{produto.nome}</td>
              <td>
                {typeof produto.precoVenda === 'number'
                  ? `R$ ${produto.precoVenda.toFixed(2)}`
                  : 'N/A'}
              </td>
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

export default ProdutosCategoria;