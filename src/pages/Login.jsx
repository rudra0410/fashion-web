import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Test credentials
  const TEST_EMAIL = 'test@123.com';
  const TEST_PASSWORD = 'test123';

  // Check if there's a saved email from previous login
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // For demo purposes - we'll check if the entered credentials match our test credentials
      const isTestCredentials = formData.email === TEST_EMAIL && formData.password === TEST_PASSWORD;
      
      // If not test credentials, give helpful feedback
      if (!isTestCredentials) {
        setError(`For testing, please use: ${TEST_EMAIL} / ${TEST_PASSWORD}`);
        setLoading(false);
        return;
      }
      
      // Call API with the correct credentials for FakeStore API
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'mor_2314', // Username required by Fake Store API
          password: '83r5^_',    // Password required by Fake Store API
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Store user email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('userEmail', formData.email);
      } else {
        localStorage.removeItem('userEmail');
      }
      
      // Update login state
      setIsLoggedIn(true);
      // Redirect to home page
      navigate('/');
    } catch (error) {
      setError('Server error. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fill form with test credentials for easy testing
  const fillTestCredentials = () => {
    setFormData({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-split-container">
      <div className="login-image-section">
        <div className="login-brand-logo">
          <Link to="/" className="fashion-hub-logo">
            <span>FashionHub</span>
          </Link>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
          alt="Fashion Model" 
          className="featured-product-image" 
        />
        <div className="fashion-quote">
          <p>"Style is a way to say who you are without having to speak."</p>
          <span className="quote-author">— Rachel Zoe</span>
        </div>
      </div>
      
      <div className="login-form-section">
        <div className="login-form-container">
          <h1>Welcome Back!</h1>
          <p className="login-subtitle">
            Log in now to explore all the features and benefits of our premium fashion collection.
          </p>
          
          {error && <div className="login-error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                className="login-input"
              />
            </div>
            
            <div className="form-group password-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your Password"
                className="login-input"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => {
                  const passwordInput = document.getElementById('password');
                  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="#AAAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#AAAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="form-footer">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember">Remember my account</label>
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          
          <div className="register-prompt">
            <p>Don't have an account?</p>
            <button onClick={handleRegisterClick} className="register-link">Register Now</button>
          </div>
          
          <div className="test-credentials">
            <p>For testing, use these credentials: <strong>{TEST_EMAIL} / {TEST_PASSWORD}</strong></p>
            <button onClick={fillTestCredentials} className="fill-test-btn">Fill Test Credentials</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;