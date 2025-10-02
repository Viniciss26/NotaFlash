import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import ClientesPage from './pages/CadastroCliente/CadastroCliente';
import ProdutosPage from './pages/produtos/ProdutosPage';

function App() {
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);

  const toggleSidebar = () => {
    setSidebarRecolhida(!sidebarRecolhida);
  };

  return (
    <div className="app-container">
      <Sidebar recolhida={sidebarRecolhida} toggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarRecolhida ? 'recolhido' : ''}`}>
        <Routes>
          <Route path="/" element={<h2>Página Inicial</h2>} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;