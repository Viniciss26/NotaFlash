import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './PedidosWhatsapp.css';

function PedidosWhatsapp() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const pegarDataDeHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const fetchPedidos = useCallback(async () => {
    try {
      const dataHoje = pegarDataDeHoje();
      const params = {
        origem: 'whatsapp',
        dataInicio: dataHoje,
        dataFim: dataHoje
      };
      const response = await api.get('/pedidos', { params });
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos do WhatsApp:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPedidos(); 
    const intervalo = setInterval(() => {
      fetchPedidos();
    }, 30000);
    return () => clearInterval(intervalo);
  }, [fetchPedidos]);
  const handleAtualizar = () => {
    setLoading(true);
    fetchPedidos();
  };

  if (loading && pedidos.length === 0) {
    return (
      <div className="pedidos-whatsapp-page">
        <h2>Pedidos Recebidos via WhatsApp (Hoje)</h2>
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="pedidos-whatsapp-page">
      <div className="whatsapp-header-actions">
          <div className="titulo-container">
            <h2>🚨 Pedidos WhatsApp - {new Date().toLocaleDateString()}</h2>
            <span className="badge-hoje">Mostrando apenas hoje</span>
          </div>
          <button onClick={handleAtualizar} className="btn-atualizar">🔄 Atualizar Lista</button>
      </div>
      
      {pedidos.length === 0 ? (
        <div className="empty-state">
            <p>Nenhum pedido recebido via WhatsApp <strong>hoje</strong>.</p>
            <p className="subtext">Aguardando novas mensagens...</p>
        </div>
      ) : (
        <table className="pedidos-whatsapp-table">
          <thead>
            <tr>
              <th>Hora</th>
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
                <td>{new Date(pedido.createdAt || pedido.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                
                <td>{pedido.cliente?.nome || 'Cliente não encontrado'}</td>
                
                <td>
                    <span className={`status ${pedido.status.toLowerCase()}`}>
                        {pedido.status}
                    </span>
                </td>
                
                <td>
                  <span className="origem-whatsapp-badge">
                    📱 {pedido.origem}
                  </span>
                </td>
                
                <td>R$ {(pedido.total || pedido.valorTotal || 0).toFixed(2)}</td>
                
                <td className="actions-cell">
                  <Link to={`/pedidos/${pedido._id}`} className="action-link">
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