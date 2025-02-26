// components/Header.jsx
import { useState } from 'react';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <h1>CryptoTracker</h1>
      </div>
      
      <div className="mobile-menu-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <nav className={`navigation ${showMobileMenu ? 'active' : ''}`}>
        <ul>
          <li className="active"><a href="#">Dashboard</a></li>
          <li><a href="#">Markets</a></li>
          <li><a href="#">Portfolio</a></li>
          <li><a href="#">News</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>
      
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="auth-button">Sign In</button>
      </div>
    </header>
  );
};

export default Header;