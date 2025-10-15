import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import ProdutosPage from './pages/produtos/ProdutosPage';
import PedidosPage from './pages/pedidos/PedidosPage';
import ListaClientes from './pages/listaClientes/ListaClientes';
import CadastroCliente from './pages/cadastroCliente/CadastroCliente';
import ListaProdutos from './pages/listaProdutos/ListaProdutos';

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
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path='/clientes/cadastrar' element={<CadastroCliente />} />
          <Route path="/produtos" element={<ListaProdutos />} />
          <Route path='/produtos/cadastrar' element={<ProdutosPage />} />
          <Route path='/pedidos' element={<PedidosPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;