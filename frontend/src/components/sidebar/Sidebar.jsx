import { Link } from 'react-router-dom';
import './Sidebar.css';
import NotaFlashLogo from '../../assets/NotaFlashLogo.svg'
import HomeIcon from '../../assets/Home.svg'
import OrderIcon from '../../assets/Order.svg'
import AnalyticsIcon from '../../assets/Analytics.svg'
import ClientIcon from '../../assets/Client.svg'
import SettingsIcon from '../../assets/Settings.svg'

const menuItems = [
  { path: "/", name: "Início", icon: <img src={HomeIcon} alt='Icone de Inicio' /> },
  { path: "/pedidos", name: "Pedidos", icon: <img src={OrderIcon} alt='Icone de Pedidos' /> },
  { path: "/relatorios", name: "Relatórios", icon: <img src={AnalyticsIcon} alt='Icone de Grafico' /> },
  { path: "/clientes", name: "Clientes", icon: <img src={ClientIcon} alt='Icone de Clientes' /> },
  { path: "/configuracoes", name: "Configurações", icon: <img src={SettingsIcon} alt='Icone de Configurações' /> }
];

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={NotaFlashLogo} alt="Logo NotaFlash" className='logo-img' />
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