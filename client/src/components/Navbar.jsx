import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Dashboard', icon: '' },
    { to: '/create', label: 'New Order', icon: '' },
    { to: '/orders', label: 'Orders', icon: '' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">👔</span>
        <h1>LaundryPro</h1>
      </div>
      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
