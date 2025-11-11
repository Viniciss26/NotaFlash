import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import ProdutosPage from './pages/cadastroProdutos/ProdutosPage';
import PedidosPage from './pages/cadastroPedidos/PedidosPage';
import ListaClientes from './pages/listaClientes/ListaClientes';
import CadastroCliente from './pages/cadastroCliente/ClientePage';
import CategoriaDeProduto from './pages/categorias/CategoriaDeProduto';
import EditarCliente from './pages/edicao/EditarCliente';
import EditarProduto from './pages/edicao/EditarProduto';
import ProdutosDaCategoria from './pages/categorias/ProdutosDaCategoria';
import ListaPedidos from './pages/listaPedidos/ListaPedidos';
import DetalhesPedido from './pages/detalhesPedido/DetalhesPedido';
import PedidosWhatsapp from './pages/pedidoswhatsapp/PedidosWhatsapp';

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
          <Route path='/clientes/editar/:id' element={<EditarCliente />} />
          <Route path="/produtos" element={<CategoriaDeProduto />} />
          <Route path='/produtos/:categoria' element={<ProdutosDaCategoria />} />
          <Route path='/produtos/cadastrar' element={<ProdutosPage />} />
          <Route path='/produtos/editar/:id' element={<EditarProduto />} />
          <Route path='/pedidos' element={<PedidosPage />} />
          <Route path='pedidos/lista' element={<ListaPedidos />} />
          <Route path='/pedidos/:id' element={<DetalhesPedido />} />
          <Route path='/pedidos-whatsapp' element={<PedidosWhatsapp />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;