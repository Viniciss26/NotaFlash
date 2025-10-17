import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './DetalhesPedido.css'; 

function DetalhesPedido() {
  const [pedido, setPedido] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pedidos/${id}`);
        setPedido(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
      }
    };
    fetchPedido();
  }, [id]);

  if (!pedido) {
    return <div>Carregando detalhes do pedido...</div>;
  }

  return (
    <div className="detalhes-pedido-page">
      <div className="detalhes-header">
        <h2>Detalhes do Pedido</h2>
        <Link to="/pedidos/lista" className="btn-voltar">Voltar para a Lista</Link>
      </div>

      <div className="detalhes-grid">
        <div className="detalhe-card">
          <h3>Informações Gerais</h3>
          <p><strong>Cliente:</strong> {pedido.cliente?.nome}</p>
          <p><strong>Data do Pedido:</strong> {format(new Date(pedido.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          <p><strong>Status:</strong> <span className={`status status-${pedido.status.toLowerCase()}`}>{pedido.status}</span></p>
          <p><strong>Total do Pedido:</strong> <span className="total-valor">R$ {pedido.total.toFixed(2)}</span></p>
        </div>

        {pedido.observacoes && (
          <div className="detalhe-card">
            <h3>Observações</h3>
            <p>{pedido.observacoes}</p>
          </div>
        )}
      </div>

      <div className="detalhe-card">
        <h3>Itens do Pedido</h3>
        <table className="itens-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.itens.map(item => (
              <tr key={item.produto?._id || item._id}>
                <td>{item.produto?.nome || 'Produto não encontrado'}</td>
                <td>{item.quantidade}</td>
                <td>R$ {item.precoUnitario.toFixed(2)}</td>
                <td>R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetalhesPedido;