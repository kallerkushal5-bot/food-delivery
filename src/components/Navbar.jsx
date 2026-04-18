import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X, ShoppingCart, User } from 'lucide-react';

export default function Navbar({ page, go, cnt, user }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (y > lastScrollY.current && y > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'explore', label: 'Menu' },
    { id: 'offers', label: 'Offers' },
    { id: 'track', label: 'Orders' },
    { id: 'about', label: 'About' },
    { id: 'help', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'nav-hidden' : 'nav-visible'} ${darkMode ? 'dark' : ''}`}>
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => go('home')}>
          <div className="logo-leaf">🌿</div>
          <span>Terra<em>Eats</em></span>
        </button>

        <div className="nav-links desktop">
          {links.map(l => (
            <button
              key={l.id}
              className={`nav-link ${page === l.id ? 'active' : ''}`}
              onClick={() => go(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="nav-btn-icon"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="nav-cart" onClick={() => go('cart')}>
            <ShoppingCart size={20} />
            {cnt > 0 && <span className="cart-badge">{cnt}</span>}
          </button>

          {user ? (
            <div className="user-avatar" onClick={() => go('cart')} title={user.name}>
              {user.name[0].toUpperCase()}
            </div>
          ) : (
            <button className="nav-btn" onClick={() => go('login')}>
              <User size={20} />
              Login
            </button>
          )}

          <button
            className="nav-btn-icon mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <button
              key={l.id}
              className={`mobile-menu-item ${page === l.id ? 'active' : ''}`}
              onClick={() => {
                go(l.id);
                setMobileMenuOpen(false);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}