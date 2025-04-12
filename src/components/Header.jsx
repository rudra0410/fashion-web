import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaHome, FaStore, FaBox, FaInfo, FaEnvelope } from 'react-icons/fa';
import { CartContext } from '../App';
import './Header.css';

const Header = ({ isLoggedIn, logout }) => {
  const { cart, cartItemCount } = useContext(CartContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll position for header appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isMobile = windowWidth <= 768;

  const getTotalCartItems = () => {
    return cartItemCount;
  };

  const renderDesktopNav = () => (
    <nav className="nav">
      <ul className="nav-list">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/products' ? 'active' : ''}>
          <Link to="/products">Shop</Link>
        </li>
        <li className={location.pathname.includes('/category') ? 'active' : ''}>
          <Link to="/categories">Categories</Link>
        </li>
        <li>
          <Link to="/cart" className="cart-link">
            <FaShoppingCart />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );

  const renderMobileHeader = () => (
    <div className="mobile-header">
      <Link to="/" className="logo" onClick={closeMobileMenu}>
        <span>FashionHub</span>
        <div className="tagline">PREMIUM COLLECTION</div>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/cart" className="cart-link" style={{ marginRight: '15px' }}>
          <FaShoppingCart color="white" size={20} />
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </Link>
        
        <button className="mobile-search-btn" aria-label="Search">
          <FaSearch />
        </button>
        
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          aria-label="Menu"
          aria-expanded={mobileMenuOpen}
        >
          <FaBars />
        </button>
      </div>
    </div>
  );

  const renderMobileMenu = () => (
    <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
      <button 
        className="mobile-menu-close" 
        onClick={closeMobileMenu}
        aria-label="Close menu"
      >
        <FaTimes />
      </button>
      
      <ul className="mobile-menu-items">
        <li>
          <Link to="/" onClick={closeMobileMenu}>
            <FaHome style={{ marginRight: '10px' }} /> Home
          </Link>
        </li>
        <li>
          <Link to="/products" onClick={closeMobileMenu}>
            <FaStore style={{ marginRight: '10px' }} /> Shop
          </Link>
        </li>
        <li>
          <Link to="/categories" onClick={closeMobileMenu}>
            <FaBox style={{ marginRight: '10px' }} /> Categories
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={closeMobileMenu}>
            <FaInfo style={{ marginRight: '10px' }} /> About
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={closeMobileMenu}>
            <FaEnvelope style={{ marginRight: '10px' }} /> Contact
          </Link>
        </li>
        <li>
          <Link to="/cart" onClick={closeMobileMenu}>
            <FaShoppingCart style={{ marginRight: '10px' }} /> 
            Cart {cartItemCount > 0 && `(${cartItemCount})`}
          </Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button 
              onClick={() => {
                logout();
                closeMobileMenu();
              }} 
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.1rem',
                padding: '15px 25px',
                textAlign: 'left',
                width: '100%',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login" onClick={closeMobileMenu}>Login</Link>
          </li>
        )}
      </ul>
      
      <div className="mobile-menu-footer">
        © 2023 FashionHub - Style Redefined
      </div>
    </div>
  );

  return (
    <header className={`header ${scrollPosition > 50 ? 'scrolled' : ''}`}>
      <div className="header-container">
        {isMobile ? (
          <>
            {renderMobileHeader()}
            {renderMobileMenu()}
          </>
        ) : (
          <>
            <Link to="/" className="logo">
              <span>FashionHub</span>
              <div className="tagline">PREMIUM COLLECTION</div>
            </Link>
            {renderDesktopNav()}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;