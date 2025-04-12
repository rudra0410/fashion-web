import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../App';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('default');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        // Check if there's a category in the URL
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        
        if (categoryParam) {
          setSelectedCategory(categoryParam);
          filterProducts(categoryParam, data);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [location.search]);
  
  // Filter products based on selected category
  const filterProducts = (category, productsList = products) => {
    if (category === 'all') {
      setFilteredProducts(productsList);
    } else {
      const filtered = productsList.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
  };
  
  // Handle category filter click
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterProducts(category);
    
    // Update URL with category param
    navigate(`/products${category === 'all' ? '' : `?category=${category}`}`);

    // Close filter menu on mobile after selection
    if (filterMenuOpen) {
      setFilterMenuOpen(false);
    }
  };
  
  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };
  
  // Apply price filter
  const applyPriceFilter = () => {
    const filtered = products.filter(product => {
      return product.price >= priceRange.min && product.price <= priceRange.max &&
        (selectedCategory === 'all' || product.category === selectedCategory);
    });
    setFilteredProducts(filtered);

    // Close filter menu on mobile after applying filter
    if (filterMenuOpen) {
      setFilterMenuOpen(false);
    }
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    
    let sortedProducts = [...filteredProducts];
    
    switch(sortValue) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'name-asc':
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default - no sorting or by ID
        sortedProducts = [...filteredProducts];
    }
    
    setFilteredProducts(sortedProducts);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 1000 });
    setSortBy('default');
    setFilteredProducts(products);
    navigate('/products');

    // Close filter menu on mobile after reset
    if (filterMenuOpen) {
      setFilterMenuOpen(false);
    }
  };

  // Toggle mobile filter menu
  const toggleFilterMenu = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <h2>Error loading products</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Discover our curated collection of fashion products</p>
      </div>
      
      {/* Mobile Filter Toggle Button */}
      <div className="mobile-filter-toggle">
        <button 
          className={`filter-toggle-btn ${filterMenuOpen ? 'active' : ''}`} 
          onClick={toggleFilterMenu}
        >
          {filterMenuOpen ? 'Close Filters' : 'Show Filters'}
        </button>
        
        <div className="mobile-sort-container">
          <select className="mobile-sort-select" value={sortBy} onChange={handleSortChange}>
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rating</option>
          </select>
        </div>
      </div>
      
      <div className="products-container">
        <div className={`filter-sidebar ${filterMenuOpen ? 'mobile-open' : ''}`}>
          <div className="filter-section">
            <h3>Categories</h3>
            <ul className="category-filters">
              <li>
                <button
                  className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter('all')}
                >
                  All Products
                </button>
              </li>
              {categories.map(category => (
                <li key={category}>
                  <button
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range-inputs">
              <div className="price-input-group">
                <label htmlFor="min">Min $</label>
                <input
                  type="number"
                  id="min"
                  name="min"
                  min="0"
                  max="1000"
                  value={priceRange.min}
                  onChange={handlePriceRangeChange}
                />
              </div>
              <div className="price-input-group">
                <label htmlFor="max">Max $</label>
                <input
                  type="number"
                  id="max"
                  name="max"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                />
              </div>
            </div>
            <button className="apply-filter-btn" onClick={applyPriceFilter}>
              Apply Filter
            </button>
          </div>
          
          <div className="filter-section desktop-sort">
            <h3>Sort By</h3>
            <select className="sort-select" value={sortBy} onChange={handleSortChange}>
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
          
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset All Filters
          </button>

          {/* Mobile only - close filters button */}
          <button className="close-filters-btn" onClick={() => setFilterMenuOpen(false)}>
            Close Filters
          </button>
        </div>
        
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="no-products-found">
              <h3>No products found</h3>
              <p>Try adjusting your filters for better results.</p>
              <button className="reset-filters-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="products-results-summary">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>
    </div>
  );
};

export default Products; 