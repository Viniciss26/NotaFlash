import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaBox, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';

const menuItems = [
  { path: "/", name: "Início", icon: <FaHome /> },
  { path: "/pedidos", name: "Pedidos", icon: <FaBox /> },
  { path: "/relatorios", name: "Relatórios", icon: <FaChartBar /> },
  { path: "/clientes", name: "Clientes", icon: <FaUsers /> },
  { path: "/configuracoes", name: "Configurações", icon: <FaCog /> }
];

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>NotaFlash</h1>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <Link to={item.path}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;