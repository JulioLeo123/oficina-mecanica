import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/veiculos', label: 'Veiculos' },
  { to: '/ordens-servico', label: 'Ordens de Servico' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="brand" onClick={closeMenu}>
        <span className="brand-mark">OP</span>
        <span>Oficina Pro</span>
      </NavLink>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Abrir menu de navegacao"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Navegacao principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {item.label}
          </NavLink>
        ))}
        <span className="nav-link disabled">Calendario em breve</span>
        <span className="nav-link disabled">Financeiro em breve</span>
      </nav>
    </header>
  );
}
