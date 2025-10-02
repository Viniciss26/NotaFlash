import { useState } from 'react';
import './CadastroCliente.css';

function CadastroCliente() {
  const [formData, setFormData] = useState({
    nomeCliente: '',
    telefone: '',
    cep: '',
    endereco: '',
    bairro: '',
    descricao: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do cliente:', formData);
    alert('Cliente cadastrado com sucesso!');
    setFormData({
      nomeCliente: '',
      telefone: '',
      cep: '',
      endereco: '',
      bairro: '',
      descricao: ''
    });
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-header">
        <h1>Cadastrar Novo Cliente</h1>
      </div>

      <div className="cadastro-content">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-field">
            <label htmlFor="nomeCliente">Nome do Cliente / Estabelecimento:</label>
            <input
              type="text"
              id="nomeCliente"
              name="nomeCliente"
              value={formData.nomeCliente}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="telefone">Telefone:</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="cep">Cep:</label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              className="input-small"
            />
          </div>

          <div className="form-field">
            <label htmlFor="endereco">Endereço:</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="bairro">Bairro:</label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="descricao">Descrição:</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-cadastrar">
              Cadastrar Novo Cliente
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroCliente;