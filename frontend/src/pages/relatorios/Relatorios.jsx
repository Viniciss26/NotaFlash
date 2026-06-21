import { useState, useEffect } from 'react';
import api from "../../api";
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import './Relatorios.css';

function Relatorios() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const [dataInicio, setDataInicio] = useState(todayStr);
  const [dataFim, setDataFim] = useState(todayStr);
  const [loading, setLoading] = useState(false);
  
  // Estados para armazenar os dados consolidados do backend
  const [resumoFinanceiro, setResumoFinanceiro] = useState({
    faturamentoTotal: 0,
    qtdPedidos: 0,
    ticketMedio: 0,
    whatsappPedidos: 0,
    manualPedidos: 0
  });
  const [historicoDias, setHistoricoDias] = useState([]);
  const [rankingProdutos, setRankingProdutos] = useState([]);

  // Função para buscar os dados baseados no período de datas
  const carregarRelatorios = async (inicio, fim) => {
    setLoading(true);
    try {
      // Faz a chamada enviando as datas como query params para o seu backend
      const response = await api.get('/relatorios/faturamento', {
        params: { dataInicio: inicio, dataFim: fim }
      });
      
      // Ajuste os campos abaixo conforme o formato exato que o seu backend retorna
      if (response.data) {
        setResumoFinanceiro(response.data.resumo || {
          faturamentoTotal: response.data.faturamentoTotal || 0,
          qtdPedidos: response.data.qtdPedidos || 0,
          ticketMedio: response.data.ticketMedio || 0,
          whatsappPedidos: response.data.whatsappPedidos || 0,
          manualPedidos: response.data.manualPedidos || 0
        });
        setHistoricoDias(response.data.historico || []);
        setRankingProdutos(response.data.produtos || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do fechamento:", error);
    } finally {
      setLoading(false);
    }
  };

  // Executa a busca sempre que o botão de filtrar for clicado manualmente
  const handleFiltrarManualmente = (e) => {
    e.preventDefault();
    carregarRelatorios(dataInicio, dataFim);
  };

  // Atalhos rápidos de clique que já disparam a busca na hora
  const aplicarFiltroRapido = (tipo) => {
    let inicio = todayStr;
    let fim = todayStr;

    if (tipo === 'ontem') {
      const ontem = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      inicio = ontem;
      fim = ontem;
    } else if (tipo === 'semana') {
      inicio = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    } else if (tipo === 'mes') {
      inicio = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      fim = format(endOfMonth(new Date()), 'yyyy-MM-dd');
    }

    setDataInicio(inicio);
    setDataFim(fim);
    carregarRelatorios(inicio, fim);
  };

  // Carrega os dados de "Hoje" por padrão ao abrir a tela
  useEffect(() => {
    carregarRelatorios(todayStr, todayStr);
  }, []);

  return (
    <div className="relatorios-container">
      <div className="relatorios-header">
        <h2>Fechamento de Caixa & Relatórios</h2>
      </div>

      {/* BARRA DE FILTROS TEMPORAIS */}
      <div className="filtros-card">
        <div className="botoes-atalho">
          <button onClick={() => aplicarFiltroRapido('hoje')} className="btn-atalho">Hoje</button>
          <button onClick={() => aplicarFiltroRapido('ontem')} className="btn-atalho">Ontem</button>
          <button onClick={() => aplicarFiltroRapido('semana')} className="btn-atalho">Últimos 7 Dias</button>
          <button onClick={() => aplicarFiltroRapido('mes')} className="btn-atalho">Este Mês</button>
        </div>

        <form onSubmit={handleFiltrarManualmente} className="form-datas">
          <div className="input-grupo">
            <label>De:</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </div>
          <div className="input-grupo">
            <label>Até:</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </div>
          <button type="submit" className="btn-filtrar">Atualizar Painel</button>
        </form>
      </div>

      {loading ? (
        <p className="loading-texto">Buscando dados no banco...</p>
      ) : (
        <>
          {/* GRID DE CARDS FINANCEIROS (KPIs) */}
          <div className="kpi-grid">
            <div className="kpi-card destaque-money">
              <h3>Faturamento Bruto</h3>
              <p className="kpi-valor">R$ {resumoFinanceiro.faturamentoTotal.toFixed(2)}</p>
            </div>
            <div className="kpi-card">
              <h3>Total de Pedidos</h3>
              <p className="kpi-valor">{resumoFinanceiro.qtdPedidos}</p>
            </div>
            <div className="kpi-card">
              <h3>Ticket Médio</h3>
              <p className="kpi-valor">R$ {resumoFinanceiro.ticketMedio.toFixed(2)}</p>
            </div>
            <div className="kpi-card">
              <h3>Canais de Venda</h3>
              <p className="kpi-subvalor">📱 WhatsApp: <strong>{resumoFinanceiro.whatsappPedidos}</strong></p>
              <p className="kpi-subvalor">💻 Balcão/Manual: <strong>{resumoFinanceiro.manualPedidos}</strong></p>
            </div>
          </div>

          {/* SEÇÃO INFERIOR: HISTÓRICO VS PRODUTOS */}
          <div className="dados-detalhados-grid">
            
            {/* TABELA DE AUDITORIA DIÁRIA */}
            <div className="tabela-card-painel">
              <h3>Levantamento de Caixa por Dia</h3>
              <div className="tabela-wrapper">
                <table className="painel-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Qtd Pedidos</th>
                      <th>Total Faturado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoDias.length === 0 ? (
                      <tr><td colSpan="3" className="tabela-vazia">Nenhum registro para este período.</td></tr>
                    ) : (
                      historicoDias.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.data}</td>
                          <td>{item.qtd}</td>
                          <td className="coluna-money">R$ {item.total.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LISTA DE RANKING DE PRODUTOS */}
            <div className="tabela-card-painel">
              <h3>Ranking de Itens Mais Vendidos</h3>
              <div className="ranking-lista">
                {rankingProdutos.length === 0 ? (
                  <p className="tabela-vazia">Nenhum produto vendido no período.</p>
                ) : (
                  rankingProdutos.map((prod, index) => (
                    <div key={index} className="ranking-item">
                      <div className="ranking-posicao">{index + 1}º</div>
                      <div className="ranking-detalhes">
                        <span className="ranking-nome">{prod.nome}</span>
                        <span className="ranking-qtd">{prod.quantidade} unidades vendidas</span>
                      </div>
                      <div className="ranking-total-valor">
                        R$ {(prod.totalFaturado || 0).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default Relatorios;