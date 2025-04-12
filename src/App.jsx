import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Cart from './pages/Cart';
import './App.css';

// Create context for cart state management
export const CartContext = createContext();

function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Add product to cart with animation
  const addToCart = (product, quantity = 1) => {
    // Check if product with same ID and size already exists
    const existingProductIndex = cart.findIndex(item => 
      item.id === product.id && 
      item.selectedSize === product.selectedSize
    );
    
    setCart(prevCart => {
      // If product with same ID and size exists, increase quantity
      if (existingProductIndex >= 0) {
        return prevCart.map((item, index) => 
          index === existingProductIndex 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new product with specified quantity
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update product quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Check if current page is login
  const isLoginPage = location.pathname === '/login';
  
  // Check if current page is products page
  const isProductsPage = location.pathname === '/products';
  
  // Check if current page is home page
  const isHomePage = location.pathname === '/';

  return (
    <CartContext.Provider value={{ 
      cart, 
      setCart,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartItemCount 
    }}>
      <div className={`app ${isLoginPage ? 'login-page-active' : ''}`}>
        {!isLoginPage && <Header isLoggedIn={isLoggedIn} logout={handleLogout} />}
        {isProductsPage && <CategoryBar />}
        <main className={`main-content ${isLoginPage ? 'login-main-content' : ''} ${isProductsPage ? 'products-page-content' : ''} ${isHomePage ? 'home-page-content' : ''}`}>
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
            <Route 
              path="/login" 
              element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/products" 
              element={<Products />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetail />} 
            />
            <Route 
              path="/cart" 
              element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/category/:categoryName" 
              element={<Home />} 
            />
          </Routes>
        </main>
        {!isLoginPage && <Footer />}
      </div>
    </CartContext.Provider>
  );
}

export default App;