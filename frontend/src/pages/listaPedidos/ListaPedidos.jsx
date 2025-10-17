import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './ListaPedidos.css';

const agruparPedidosPorData = (pedidos) => {
  return pedidos.reduce((acc, pedido) => {
    const dataPedido = new Date(pedido.createdAt);
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
  if (isToday(dataObj)) return 'Hoje';
  if (isYesterday(dataObj)) return 'Ontem';
  return format(dataObj, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

function ListaPedidos() {
  const [pedidosAgrupados, setPedidosAgrupados] = useState({});
  const navigate = useNavigate();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const handleDetalhes = (pedidoId) => {
        navigate(`/pedidos/${pedidoId}`);
    };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const params = new URLSearchParams();
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFim) params.append('dataFim', dataFim);

        const response = await axios.get(`http://localhost:5000/api/pedidos`, { params });

        const agrupados = agruparPedidosPorData(response.data);
        setPedidosAgrupados(agrupados);n
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };
    fetchPedidos();
  }, [dataInicio, dataFim]); 

  const datasOrdenadas = Object.keys(pedidosAgrupados).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="lista-pedidos-page">
      <div className="lista-header">
        <h2>Histórico de Pedidos</h2>
        <Link to="/pedidos" className="btn-adicionar">
          + Novo Pedido
        </Link>
      </div>

      {datasOrdenadas.map(data => (
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosAgrupados[data].map(pedido => (
                <tr key={pedido._id}>
                  <td>{pedido.cliente?.nome || 'Cliente não encontrado'}</td>
                  <td>R$ {pedido.total.toFixed(2)}</td>
                  <td>
                    <span className={`status status-${pedido.status.toLowerCase()}`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-detalhes" onClick={() => handleDetalhes(pedido._id)}>Ver Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ListaPedidos;