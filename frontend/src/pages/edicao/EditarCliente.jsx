import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import '../cadastroCliente/ClientePage.css';

function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        const cliente = response.data;
        setNome(cliente.nome);
        setTelefone(cliente.telefone);
        setCep(cliente.cep || '');
        setEndereco(cliente.endereco || '');
        setBairro(cliente.bairro || '');
        setDescricao(cliente.descricao || '');
      } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        alert('Não foi possível carregar os dados do cliente.');
      }
    };

    fetchCliente();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const clienteAtualizado = { nome, telefone, cep, endereco, bairro, descricao };
    
    try {
      await api.put(`/clientes/${id}`, clienteAtualizado);
      alert('Cliente atualizado com sucesso!');
      navigate('/clientes');
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert('Erro ao atualizar cliente.');
    }
  };

  return (
    <div className="clientes-page">
      <h2>Editar Cliente</h2>
      <div className="form-container-cliente">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-cliente">
            <div className="form-group-cliente full-width">
              <label htmlFor="nome">Nome do Cliente / Estabelecimento</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group-cliente">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            <div className="form-group-cliente">
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
            </div>

            <div className="form-group-cliente full-width">
              <label htmlFor="endereco">Endereço</label>
              <input
                type="text"
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>

            <div className="form-group-cliente full-width">
              <label htmlFor="bairro">Bairro</label>
              <input
                type="text"
                id="bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>

            <div className="form-group-cliente full-width">
              <label htmlFor="descricao">Descrição / Observações</label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="form-actions-cliente">
            <button type="submit" className="submit-btn-cliente">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarCliente;