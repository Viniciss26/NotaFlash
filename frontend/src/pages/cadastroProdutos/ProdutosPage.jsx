import { useState } from 'react';
import axios from 'axios'
import './ProdutosPage.css';

function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [unidade, setUnidade] = useState('un');
  const [grupo, setGrupo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const novoProduto = { nome, precoVenda, unidade, grupo, codigo, descricao };
    
    try {
      await axios.post('http://localhost:5000/api/produtos', novoProduto);
      
      alert(`Produto "${nome}" cadastrado com sucesso!`);
      
      setNome('');
      setPrecoVenda('');
      setUnidade('un');
      setGrupo('');
      setCodigo('');
      setDescricao('');

    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert('Ocorreu um erro ao cadastrar o produto.');
    }
  };

  return (
    <div className="cadastro-produto-page">
      <div className="form-container-produto">
        <h2>Cadastro de Novo Produto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid-produto">
            
            <div className="form-group-produto full-width">
              <label htmlFor="nome">Nome do Produto</label>
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            
            <div className="form-group-produto">
              <label htmlFor="precoVenda">Preço de Venda (R$)</label>
              <input type="number" id="precoVenda" value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} required min="0.01" step="0.01" />
            </div>

            <div className="form-group-produto">
              <label htmlFor="unidade">Unidade de Venda</label>
              <select id="unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)}>
                  <option value="un">Unidade (un)</option>
                  <option value="kg">Quilograma (kg)</option>
                  <option value="pct">Pacote (pct)</option>
                  <option value="cx">Caixa (cx)</option>
              </select>
            </div>

            <div className="form-group-produto">
                <label htmlFor="grupo">Grupo / Categoria</label>
                <input type="text" id="grupo" value={grupo} onChange={(e) => setGrupo(e.target.value)} />
            </div>

            <div className="form-group-produto">
                <label htmlFor="codigo">Código</label>
                <input type="text" id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            </div>

            <div className="form-group-produto full-width">
              <label htmlFor="descricao">Descrição / Observações</label>
              <textarea id="descricao" rows="4" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
            </div>

          </div>
          <div className="form-actions-produto">
            <button type="submit" className="submit-btn-produto">Cadastrar Produto</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroProduto;