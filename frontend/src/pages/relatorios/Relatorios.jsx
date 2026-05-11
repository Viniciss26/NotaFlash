import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Registro obrigatório dos componentes do Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
);

export default function Relatorios() {
  const [faturamento, setFaturamento] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resFat, resProd] = await Promise.all([
          axios.get('http://localhost:5000/api/pedidos/relatorios/faturamento'),
          axios.get('http://localhost:5000/api/pedidos/relatorios/produtos-mais-vendidos')
        ]);
        setFaturamento(resFat.data);
        setProdutos(resProd.data);
      } catch (err) {
        console.error("Erro ao carregar relatórios", err);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // Dados Gráfico de Linha
  const lineData = {
    labels: faturamento.map(d => d._id),
    datasets: [{
      label: 'Vendas R$',
      data: faturamento.map(d => d.totalVendas),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  // Dados Gráfico de Pizza
  const pieData = {
    labels: produtos.map(p => p._id),
    datasets: [{
      data: produtos.map(p => p.quantidadeVendida),
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
    }]
  };

  if (loading) return <p style={{ padding: '20px' }}>Carregando dashboard...</p>;

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px' }}>Relatórios Gerenciais</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Card Linha */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <h3>Faturamento por Dia</h3>
          <div style={{ height: '300px' }}>
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>

        {/* Card Pizza */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <h3>Top Produtos</h3>
          <div style={{ height: '300px' }}>
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>
    </div>
  );
}