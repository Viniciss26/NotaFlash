import { useState } from 'react';
import api from '../../api';
import './ClientePage.css';

function CadastroCliente() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const novoCliente = { nome, telefone, cep, endereco, bairro, descricao };

    try {
      await api.post('/clientes', novoCliente);

      alert(`Cliente "${nome}" cadastrado com sucesso!`);
      
      setNome('');
      setTelefone('');
      setCep('');
      setEndereco('');
      setBairro('');
      setDescricao('');

    } catch (error) {
      console.error("Ocorreu um erro ao cadastrar o cliente:", error);
      alert('Falha ao cadastrar cliente. Verifique o console do navegador para detalhes.');
    }
  };

  return (
    <div className="clientes-page">
      <h2>Cadastro de Clientes</h2>
      <div className="form-container-cliente">
        <h3>Adicionar Novo Cliente</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid-cliente">
            <div className="form-group-cliente full-width">
              <label htmlFor="nome">Nome do Cliente / Estabelecimento</label>
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="form-group-cliente">
              <label htmlFor="telefone">Telefone</label>
              <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
            </div>
            <div className="form-group-cliente">
              <label htmlFor="cep">CEP</label>
              <input type="text" id="cep" value={cep} onChange={(e) => setCep(e.target.value)} />
            </div>
            <div className="form-group-cliente full-width">
              <label htmlFor="endereco">Endereço</label>
              <input type="text" id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </div>
            <div className="form-group-cliente full-width">
              <label htmlFor="bairro">Bairro</label>
              <input type="text" id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
            </div>
            <div className="form-group-cliente full-width">
              <label htmlFor="descricao">Descrição / Observações</label>
              <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
            </div>
          </div>
          <div className="form-actions-cliente">
            <button type="submit" className="submit-btn-cliente">Cadastrar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroCliente;