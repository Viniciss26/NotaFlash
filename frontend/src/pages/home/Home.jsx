import { useState, useEffect } from 'react';
import api from "../../api";
import 'date-fns';
import './Home.css'; // Vamos criar o CSS logo abaixo

function Home() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumo, setResumo] = useState({ pendentes: 0, finalizados: 0, cancelados: 0 });

  const carregarDadosDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pedidos'); // Rota padrão do seu pedidosRoutes.js
      if (response.data) {
        setPedidos(response.data);
        
        // Calcula os totais de cada status dinamicamente
        const contagem = response.data.reduce((acc, pedido) => {
          if (pedido.status === 'Pendente') acc.pendentes++;
          if (pedido.status === 'Finalizado') acc.finalizados++;
          if (pedido.status === 'Cancelado') acc.cancelados++;
          return acc;
        }, { pendentes: 0, finalizados: 0, cancelados: 0 });

        setResumo(contagem);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do painel inicial:", error);
    } finally {
      setLoading(false);
    }
  };

  const alterarStatusRapido = async (id, novoStatus) => {
    try {
      // Usa a rota PATCH de status que já existe no seu pedidosRoutes.js
      await api.patch(`/pedidos/${id}/status`, { status: novoStatus });
      carregarDadosDashboard(); // Recarrega a tela para atualizar os cards e a lista
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
    }
  };

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  // Pega apenas os 5 últimos pedidos cadastrados para a tabela operacional
  const ultimosPedidos = pedidos.slice(-5).reverse();

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Painel Operacional — NotaFlash</h2>
        <button onClick={carregarDadosDashboard} className="btn-atualizar-home">🔄 Atualizar Painel</button>
      </div>

      {/* CARDS DE OPERAÇÃO EM TEMPO REAL */}
      <div className="operacao-grid">
        <div className="operacao-card status-pendente">
          <h3>Pedidos Pendentes</h3>
          <p className="operacao-valor">{resumo.pendentes}</p>
          <span>Aguardando produção / Cozinha</span>
        </div>
        <div className="operacao-card status-finalizado">
          <h3>Concluídos Hoje</h3>
          <p className="operacao-valor">{resumo.finalizados}</p>
          <span>Pedidos entregues e faturados</span>
        </div>
        <div className="operacao-card status-cancelado">
          <h3>Cancelados</h3>
          <p className="operacao-valor">{resumo.cancelados}</p>
          <span>Pedidos estornados</span>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: ÚLTIMAS MOVIMENTAÇÕES */}
      <div className="ultimos-pedidos-section">
        <h3>Últimos Pedidos Recebidos</h3>
        {loading ? (
          <p className="loading-home">Carregando fluxo da cozinha...</p>
        ) : ultimosPedidos.length === 0 ? (
          <p className="sem-pedidos-home">Nenhum pedido registrado no sistema até o momento.</p>
        ) : (
          <div className="tabela-home-wrapper">
            <table className="home-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Origem</th>
                  <th>Total</th>
                  <th>Status Atual</th>
                  <th>Ações Rápidas</th>
                </tr>
              </thead>
              <tbody>
                {ultimosPedidos.map((pedido) => (
                  <tr key={pedido._id}>
                    <td><strong>{pedido.cliente?.nome || 'Cliente Não Informado'}</strong></td>
                    <td>
                      <span className={`badge-origem ${pedido.origem?.toLowerCase()}`}>
                        {pedido.origem === 'whatsapp' ? '📱 WhatsApp' : '💻 Balcão'}
                      </span>
                    </td>
                    <td className="valor-home">R$ {pedido.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge-status status-${pedido.status?.toLowerCase()}`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td>
                      {pedido.status === 'Pendente' && (
                        <div className="botoes-acao-home">
                          <button 
                            onClick={() => alterarStatusRapido(pedido._id, 'Finalizado')} 
                            className="btn-acao-concluir"
                          >
                            ✅ Finalizar
                          </button>
                          <button 
                            onClick={() => alterarStatusRapido(pedido._id, 'Cancelado')} 
                            className="btn-acao-cancelar"
                          >
                            ❌ Cancelar
                          </button>
                        </div>
                      )}
                      {pedido.status !== 'Pendente' && (
                        <span className="texto-finalizado">Pedido Processado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;