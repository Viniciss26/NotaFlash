import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import './DetalhesPedido.css';
import CupomFiscal from '../../components/cupomFiscal/CupomFiscal'; 

function DetalhesPedido() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();

  useEffect(() => {
    const fetchPedidoDetalhado = async () => {
      try {
        const response = await api.get(`/pedidos/${id}`);
        setPedido(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
        alert("Erro ao carregar o pedido. Verifique se o ID está correto.");
      }
      setLoading(false);
    };
    fetchPedidoDetalhado();
  }, [id]);

  const handleImprimir = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading-container">Carregando detalhes do pedido...</div>;
  }

  if (!pedido) {
    return <div className="loading-container">Pedido não encontrado.</div>;
  }

  const dataCriacao = new Date(pedido.createdAt).toLocaleString();
  const dataPedidoReal = pedido.data || dataCriacao; 

  return (
    <div className="detalhes-pedido-page">
      <CupomFiscal pedido={pedido} refCupom={componentRef} />
      <div className="detalhes-header">
        <div>
          <Link to="/pedidos" className="btn-voltar">← Voltar para a Lista</Link>
          <h2>
            Pedido #{pedido._id.slice(-4).toUpperCase()}
            <span className={`status ${pedido.status.toLowerCase()}`} style={{fontSize: '0.6em', marginLeft: '15px'}}>
                {pedido.status}
            </span>
          </h2>
        </div>
        
        <div className="header-actions">
          <button onClick={handleImprimir} className="btn-imprimir-detalhes">
            🖨️ Imprimir Cupom
          </button>
          
        </div>
      </div>


      <div className="info-grid">
        
        <div className="info-card">
          <h3>👤 Dados do Cliente</h3>
          <div className="info-row">
            <strong>Nome:</strong>
            <span>{pedido.cliente?.nome || 'Cliente Desconhecido'}</span>
          </div>
          <div className="info-row">
            <strong>Telefone:</strong>
            <span>{pedido.cliente?.telefone || 'N/A'}</span>
          </div>
           {/* Adicione endereço se tiver no objeto cliente populado */}
           {pedido.cliente?.endereco && (
             <div className="info-row">
                <strong>Endereço:</strong>
                <span>{pedido.cliente.endereco}, {pedido.cliente.bairro}</span>
             </div>
           )}
        </div>

        <div className="info-card">
          <h3>📄 Dados do Pedido</h3>
          <div className="info-row">
            <strong>ID Completo:</strong>
            <span style={{fontSize: '0.8em', fontFamily: 'monospace'}}>{pedido._id}</span>
          </div>
          <div className="info-row">
            <strong>Data do Pedido:</strong>
            <span>{dataPedidoReal}</span>
          </div>
          <div className="info-row">
            <strong>Origem:</strong>
            <span>
                {pedido.origem === 'whatsapp' 
                    ? <span className="badge-origem badge-whatsapp">📱 WhatsApp</span> 
                    : <span className="badge-origem badge-manual">🖥️ Manual</span>
                }
            </span>
          </div>

          {pedido.observacoes && (
            <div className="obs-box">
                <strong>Observações:</strong><br/>
                {pedido.observacoes}
            </div>
          )}
        </div>
      </div>


      <div className="itens-section">
        <h3>🛒 Itens do Pedido</h3>
        <table className="itens-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th className="col-numero">Qtd.</th>
              <th className="col-numero">Preço Unit.</th>
              <th className="col-numero">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.itens.map((item, index) => (
              <tr key={index}>
                <td>
                    {item.produto?.nome || item.nomeProduto || 'Produto Removido do Estoque'}
                </td>
                <td className="col-numero">
                    {item.quantidade} {item.unidade || 'un'}
                </td>
                <td className="col-numero">
                    R$ {item.precoUnitario.toFixed(2)}
                </td>
                <td className="col-numero" style={{fontWeight: 'bold'}}>
                    R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-section">
            <span className="total-label">Total do Pedido:</span>
            <span className="total-value">R$ {(pedido.total || pedido.valorTotal).toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
}

export default DetalhesPedido;