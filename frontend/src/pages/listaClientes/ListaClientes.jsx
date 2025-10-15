import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importante para o botão de navegação
import './ListaClientes.css'; // Vamos criar este arquivo a seguir

// Usando os mesmos dados de exemplo
const mockClientes = [
    { _id: '1', nome: 'Padaria Pão Quente', telefone: '(11) 98765-4321', endereco: 'Rua das Flores, 123' },
    { _id: '2', nome: 'Mercadinho do Zé', telefone: '(21) 91234-5678', endereco: 'Av. Principal, 456' },
    { _id: '3', nome: 'Lanchonete Sabor & Cia', telefone: '(31) 95555-8888', endereco: 'Praça da Matriz, 789' },
];

function ListaClientes() {
  const [clientes, setClientes] = useState(mockClientes);
  const [filtro, setFiltro] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState(mockClientes);

  useEffect(() => {
    // A lógica de busca continua a mesma
    const resultado = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(filtro.toLowerCase())
    );
    setClientesFiltrados(resultado);
  }, [filtro, clientes]);

  const handleEditar = (id) => {
    alert(`Lógica para ir para a página de edição do cliente ID: ${id}`);
  };

  const handleExcluir = (id) => {
    alert(`Lógica para excluir o cliente ID: ${id}`);
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