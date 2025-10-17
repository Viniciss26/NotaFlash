import { Link } from 'react-router-dom';
import './Sidebar.css';
import NotaFlashLogo from '../../assets/NotaFlashLogo.svg'
import HomeIcon from '../../assets/Home.svg'
import OrderIcon from '../../assets/Order.svg'
import AnalyticsIcon from '../../assets/Analytics.svg'
import ClientIcon from '../../assets/Client.svg'
import NewProduct from '../../assets/NewProduct.svg'
import SettingsIcon from '../../assets/Settings.svg'
import DoubleLeft from '../../assets/DoubleLeft.svg'
import DoubleRight from '../../assets/DoubleRight.svg'

const menuItems = [
  { path: "/", name: "Início", icon: <img src={HomeIcon} alt='Icone de Inicio' /> },
  { path: "/pedidos/lista", name: "Pedidos", icon: <img src={OrderIcon} alt='Icone de Pedidos' /> },
  { path: "/relatorios", name: "Relatórios", icon: <img src={AnalyticsIcon} alt='Icone de Grafico' /> },
  { path: "/clientes", name: "Clientes", icon: <img src={ClientIcon} alt='Icone de Clientes' /> },
  { path: "/produtos", name: "Produto", icon: <img src={NewProduct} alt='Icone de Novo Produto' /> },
  { path: "/configuracoes", name: "Configurações", icon: <img src={SettingsIcon} alt='Icone de Configurações' /> }
];

function Sidebar({ recolhida, toggle}) {
  return (
    <div className={`sidebar ${recolhida ? 'recolhido' : ''}`}>
      <div className="sidebar-logo">
        <img src={NotaFlashLogo} alt="Logo NotaFlash" className='logo-img' />
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <Link to={item.path}>
              <span className="menu-icon">{item.icon}</span>
              {!recolhida && <span className="menu-text">{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="sidebar-toggle" onClick={toggle}>
        {recolhida ? (
          <img src={DoubleRight} alt="Expandir Sidebar" />
        ) : (
          <img src={DoubleLeft} alt="Recolher Sidebar" />
        )}
      </div>
    </div>
  );
}

export default Sidebar;