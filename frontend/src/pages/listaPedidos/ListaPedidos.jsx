import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../../api";
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './ListaPedidos.css';

const agruparPedidosPorData = (pedidos) => {
  return pedidos.reduce((acc, pedido) => {
    const dataPedido = new Date(pedido.criadoEm || pedido.createdAt); 
    const dataFormatada = format(dataPedido, 'yyyy-MM-dd');
    if (!acc[dataFormatada]) {
      acc[dataFormatada] = [];
    }
    acc[dataFormatada].push(pedido);
    return acc;
  }, {});
};

const formatarTituloData = (data) => {
  const dataObj = new Date(data);
  const dataCorrigida = new Date(dataObj.valueOf() + dataObj.getTimezoneOffset() * 60000);
  if (isToday(dataCorrigida)) return 'Hoje';
  if (isYesterday(dataCorrigida)) return 'Ontem';
  return format(dataCorrigida, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

function ListaPedidos() {
  const [pedidosAgrupados, setPedidosAgrupados] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [dataInicio, setDataInicio] = useState(today);
  const [dataFim, setDataFim] = useState(today);
  const [filtro, setFiltro] = useState('todos');

  const [pedidoImprimindo, setPedidoImprimindo] = useState(null);

  const handleDetalhes = (pedidoId) => {
      navigate(`/pedidos/${pedidoId}`);
  };

  const handleFinalizar = async (pedidoId) => {
    if (!window.confirm("Deseja marcar este pedido como Finalizado e imprimir o cupom?")) return;
    try {
      setPedidoImprimindo(pedidoId);
      
      await api.patch(`/pedidos/${pedidoId}/status`, { status: 'Finalizado' });
      
      setTimeout(() => {
        setPedidoImprimindo(null);
        window.location.reload(); 
      }, 1500);

    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido.");
      setPedidoImprimindo(null);
    }
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      let endpoint = '/pedidos'; 
      if (filtro === 'manual') {
        endpoint = '/pedidos/manual';
      } else if (filtro === 'whatsapp') {
        endpoint = '/pedidos/whatsapp';
      }

      const params = new URLSearchParams();
      if (dataInicio) params.append('dataInicio', dataInicio);
      if (dataFim) params.append('dataFim', dataFim);

      try {
        const response = await api.get(endpoint, { params });
        const agrupados = agruparPedidosPorData(response.data);
        setPedidosAgrupados(agrupados);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
      setLoading(false);
    };
    fetchPedidos();
  }, [dataInicio, dataFim, filtro]);

  const datasOrdenadas = Object.keys(pedidosAgrupados).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="lista-pedidos-page">
      <div className="lista-header">
        <h2>Histórico de Pedidos</h2>
        <div className="header-actions">
          <Link to="/pedidos-whatsapp" className="btn-whatsapp">
            <span className="icon">📱</span> Painel WhatsApp
          </Link>
          <Link to="/pedidos" className="btn-adicionar">
            + Novo Pedido
          </Link>
        </div>
      </div>

      <div className="filtros-pedidos">
        <button className={filtro === 'todos' ? 'filtro-btn active' : 'filtro-btn'} onClick={() => setFiltro('todos')}>Todos</button>
        <button className={filtro === 'manual' ? 'filtro-btn active' : 'filtro-btn'} onClick={() => setFiltro('manual')}>Pedidos Manuais</button>
        <button className={filtro === 'whatsapp' ? 'filtro-btn active' : 'filtro-btn'} onClick={() => setFiltro('whatsapp')}>Pedidos WhatsApp</button>

        <div className="filtro-data">
          <label>De:</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div className="filtro-data">
          <label>Até:</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : datasOrdenadas.length === 0 ? (
        <p>Nenhum pedido encontrado para este filtro.</p>
      ) : (
        datasOrdenadas.map(data => (
          <div key={data} className="date-group">
            <div className="date-header">
              <h3>{formatarTituloData(data)}</h3>
            </div>
            <table className="pedidos-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Origem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidosAgrupados[data].map(pedido => (
                  <tr key={pedido._id}>
                    <td>{pedido.cliente?.nome || 'Cliente não encontrado'}</td>
                    <td>R$ {(pedido.total || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status status-${pedido.status?.trim().toLowerCase()}`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td>
                      <span className={`origem origem-${(pedido.origem || 'Manual').toLowerCase()}`}>
                        {pedido.origem || 'Manual'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-detalhes" onClick={() => handleDetalhes(pedido._id)}>
                        Ver Detalhes
                      </button>
                      
                      {/* ALTERAÇÃO DA SPRINT 5: O botão agora muda o texto e desabilita enquanto processa */}
                      {pedido.status?.trim() !== 'Finalizado' && (
                        <button 
                          className="btn-finalizar" 
                          disabled={pedidoImprimindo === pedido._id}
                          style={{ 
                            backgroundColor: pedidoImprimindo === pedido._id ? '#6c757d' : '#28a745', 
                            color: 'white', 
                            marginLeft: '5px', 
                            padding: '5px 10px', 
                            borderRadius: '4px', 
                            border: 'none', 
                            cursor: pedidoImprimindo === pedido._id ? 'not-allowed' : 'pointer' 
                          }}
                          onClick={() => handleFinalizar(pedido._id)}
                        >
                          {pedidoImprimindo === pedido._id ? "Imprimindo..." : "Finalizar"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default ListaPedidos;