import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import CadastroCliente from './pages/CadastroCliente/CadastroCliente';
// Importe suas outras páginas aqui
// import Home from './pages/Home/Home';
// import Pedidos from './pages/Pedidos/Pedidos';
// etc...

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<div>Página Inicial</div>} />
          <Route path="/pedidos" element={<div>Pedidos</div>} />
          <Route path="/relatorios" element={<div>Relatórios</div>} />
          <Route path="/clientes" element={<div>Clientes</div>} />
          <Route path="/clientes/cadastrar" element={<CadastroCliente />} />
          <Route path="/configuracoes" element={<div>Configurações</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;