import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import ProdutosPage from './pages/produtos/ProdutosPage';

function App() {

  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const toggleSidebar = () => {
    setSidebarRecolhida(!sidebarRecolhida);
  }

  return (
    <div className="app-container">
      <Sidebar recolhida={sidebarRecolhida} toggle={toggleSidebar} />
      <main className={`main-content ${sidebarRecolhida ? 'recolhido' : ''}`}>
        <Routes>
          <Route path="/produtos" element={<ProdutosPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;