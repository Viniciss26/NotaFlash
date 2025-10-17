import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CategoriaDeProduto.css'; 

function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/produtos');
        const produtos = response.data;
        const categoriasUnicas = [...new Set(produtos.map(p => p.grupo || 'Sem Categoria'))];
        setCategorias(categoriasUnicas);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <div className="categorias-container">
      <div className="lista-header">
        <h2>Categorias de Produtos</h2>
        <Link to="/produtos/cadastrar" className="btn-adicionar">
          + Adicionar Produto
        </Link>
      </div>
      <div className="categorias-grid">
        {categorias.map(categoria => (
          <Link key={categoria} to={`/produtos/${categoria}`} className="categoria-bloco">
            {categoria}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoriasPage;