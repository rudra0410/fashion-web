import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './CategoryBar.css';
import { FaSearch } from 'react-icons/fa';

const CategoryBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const categoriesRef = useRef(null);
  const categoryBarRef = useRef(null);
  
  // Track scroll position to make category bar sticky
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = window.innerWidth <= 768 ? 60 : 70; // Mobile header is 60px
      
      if (categoryBarRef.current) {
        if (window.scrollY > headerHeight && window.innerWidth <= 768) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Categories for fashion website
  const categories = [
    { id: 0, name: 'All', path: '/products' },
    { id: 1, name: "Men's", path: '/products?category=men\'s%20clothing' },
    { id: 2, name: "Women's", path: '/products?category=women\'s%20clothing' },
    { id: 3, name: 'Jewelry', path: '/products?category=jewelery' },
    { id: 4, name: 'Electronics', path: '/products?category=electronics' },
    { id: 5, name: 'New', path: '/products?sort=newest' },
    { id: 6, name: 'Sale', path: '/products?discount=true' },
    { id: 7, name: 'Trending', path: '/products?sort=popular' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  
  // Helper to determine if a category is active
  const isActive = (path) => {
    const currentParams = new URLSearchParams(location.search);
    const pathParams = new URLSearchParams(path.split('?')[1] || '');
    
    // Check if this path's parameter matches the current URL
    for (const [key, value] of pathParams.entries()) {
      if (currentParams.get(key) === value) {
        return true;
      }
    }
    
    // Special case for all products
    if (path === '/products' && location.pathname === '/products' && 
        !currentParams.has('category') && !currentParams.has('sort') && !currentParams.has('discount')) {
      return true;
    }
    
    return false;
  };

  return (
    <div 
      className={`category-bar ${isSticky ? 'sticky' : ''}`}
      ref={categoryBarRef}
    >
      <div className="category-bar-container">
        <div className="categories" ref={categoriesRef}>
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.path} 
              className={`category-item ${isActive(category.path) ? 'active' : ''}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch className="search-icon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;