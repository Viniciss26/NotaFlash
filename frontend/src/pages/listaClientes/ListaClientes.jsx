import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import './ListaClientes.css';

function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
        setClientesFiltrados(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        alert('Não foi possível carregar a lista de clientes do servidor.');
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const resultado = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(filtro.toLowerCase())
    );
    setClientesFiltrados(resultado);
  }, [filtro, clientes]);

  const handleEditar = (id) => {
    navigate(`/clientes/editar/${id}`)
  };

  const handleExcluir = async (id) => {
    const confirmado = window.confirm('Tem certeza que deseja excluir este cliente?');

    if (confirmado) {
      try {
        await api.delete(`/clientes/${id}`);
        const novosClientes = clientes.filter(cliente => cliente._id !== id);
        setClientes(novosClientes);

        alert('Cliente excluído com sucesso!');
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        alert('Ocorreu um erro ao tentar excluir o cliente.');
      }
    }
  };

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h2>Gerenciamento de Clientes</h2>
        <Link to="/clientes/cadastrar" className="btn-adicionar">
          + Adicionar Cliente
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
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map(cliente => (
            <tr key={cliente._id}>
              <td>{cliente.nome}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.endereco}</td>
              <td className="actions-cell">
                <button className="btn-editar" onClick={() => handleEditar(cliente._id)}>Editar</button>
                <button className="btn-excluir" onClick={() => handleExcluir(cliente._id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaClientes;