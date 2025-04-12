import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">FashionHub</h3>
          <p className="footer-desc">
            Premium fashion for the modern individual. Discover unique styles that elevate your wardrobe.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
              <FaPinterest />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Shop</h3>
          <ul className="footer-links">
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/category/women">Women</Link></li>
            <li><Link to="/category/men">Men</Link></li>
            <li><Link to="/category/accessories">Accessories</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Help</h3>
          <ul className="footer-links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/shipping">Shipping & Returns</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Subscribe</h3>
          <p className="footer-desc">Join our newsletter for exclusive offers and style updates.</p>
          <div className="subscribe-form">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="subscribe-input"
            />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} FashionHub. All rights reserved.</p>
        <div className="payment-methods">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>PayPal</span>
          <span>American Express</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 