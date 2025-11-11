import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './PedidosWhatsapp.css';

function PedidosWhatsapp() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        // A MUDANÇA ESTÁ AQUI:
        const response = await api.get('/pedidos/whatsapp'); 
        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedidos do WhatsApp:", error);
      }
      setLoading(false);
    };
    fetchPedidos();
  }, []);

  if (loading) {
    return (
      <div className="pedidos-whatsapp-page">
        <h2>Pedidos Recebidos via WhatsApp</h2>
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="pedidos-whatsapp-page">
      <h2>Pedidos Recebidos via WhatsApp</h2>
      
      {pedidos.length === 0 ? (
        <p>Nenhum pedido recebido via WhatsApp até o momento.</p>
      ) : (
        <table className="pedidos-whatsapp-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Origem</th>
              <th>Valor Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido._id}>
                <td>{new Date(pedido.data).toLocaleDateString()}</td>
                <td>{pedido.cliente?.nome || 'Cliente não encontrado'}</td>
                <td>{pedido.status}</td>
                <td>
                  <span className="origem-whatsapp">
                    {pedido.origem}
                  </span>
                </td>
                <td>R$ {pedido.valorTotal.toFixed(2)}</td>
                <td className="actions-cell">
                  {/* Link para a página de Detalhes do Pedido que você já tem */}
                  <Link to={`/detalhes-pedido/${pedido._id}`} className="action-link">
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PedidosWhatsapp;