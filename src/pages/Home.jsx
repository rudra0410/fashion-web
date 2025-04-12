import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import './Home.css';

// Fashion e-commerce home page

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);
  const [designerCollection, setDesignerCollection] = useState([]);
  const [trendingStyles, setTrendingStyles] = useState([]);
  
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch fashion products from the API
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        
        // Filter for clothing and accessories (categories that would be in a fashion store)
        const fashionProducts = data.filter(product => 
          (product.category && (
            product.category.toLowerCase().includes('clothing') || 
            product.category.toLowerCase().includes('jewelery') ||
            product.category.toLowerCase().includes('men') ||
            product.category.toLowerCase().includes('women')
          )) || 
          (product.title && (
            product.title.toLowerCase().includes('jacket') || 
            product.title.toLowerCase().includes('shirt') ||
            product.title.toLowerCase().includes('bag') ||
            product.title.toLowerCase().includes('dress')
          ))
        );
        
        // If we don't have enough fashion products, use all products
        const productsToUse = fashionProducts.length > 10 ? fashionProducts : data;
        setProducts(productsToUse);
        
        // Ensure we have the right number of products for each section (especially for mobile grid)
        // For mobile, we want multiples of 2 products for clean grid display
        const shuffled = [...productsToUse].sort(() => 0.5 - Math.random());
        
        // Ensure arrays have even number of items for 2-column grid
        setNewArrivals(shuffled.slice(0, 5));
        
        // Increase Luxury Designer Collection to 11 products (from 10)
        setDesignerCollection(shuffled.slice(5, 16));
        
        setTrendingStyles(shuffled.slice(16, 20));
      } catch (error) {
        console.error('Error fetching fashion products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Service features data
  const serviceFeatures = [
    { icon: '🚚', title: 'Free Shipping', description: 'Orders over $50' },
    { icon: '🔄', title: 'Easy Returns', description: '30 day hassle-free returns' },
    { icon: '👗', title: 'Styling Tips', description: 'Personal style advice' },
    { icon: '💬', title: '24/7 Support', description: 'Fashion experts available' }
  ];

  // Top categories data
  const topCategories = [
    { name: "Women's Fashion", count: 120, image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg' },
    { name: "Men's Fashion", count: 95, image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg' },
    { name: 'Jewelry & Accessories', count: 65, image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg' },
    { name: 'Luxury Brands', count: 48, image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg' }
  ];

  // Blog posts data
  const blogPosts = [
    {
      title: 'Fall/Winter Fashion Trends 2023: Colors and Styles to Watch',
      date: 'October 5, 2023',
      image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg'
    },
    {
      title: '10 Essential Pieces for Your Capsule Wardrobe',
      date: 'September 18, 2023',
      image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg'
    },
    {
      title: 'Sustainable Fashion: Eco-Friendly Brands Making a Difference',
      date: 'August 22, 2023',
      image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Elevate Your Style <br />Fall/Winter 2025</h1>
          <p>Discover the season's most coveted pieces from top designers</p>
          <div className="hero-buttons">
            <Link to="/products" className="shop-now-btn">Shop All Products</Link>
            <Link to="/products?category=women's%20clothing" className="collections-btn">Women's Collection</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg" alt="Fall/Winter Collection" />
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="product-section featured-section">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link to="/products?sort=newest" className="view-all-link">View All</Link>
        </div>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading latest fashion...</p>
          </div>
        ) : (
          <div className="products-grid featured-grid">
            {newArrivals.map(product => (
              product && product.id ? <ProductCard key={product.id} product={product} /> : null
            ))}
          </div>
        )}
      </section>

      {/* Designer Collection Section */}
      <section className="product-section luxurious-section">
        <div className="section-header">
          <h2 className="section-title">Luxury Designer Collection</h2>
          <Link to="/products?category=jewelery" className="view-all-link">View All</Link>
        </div>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading designer pieces...</p>
          </div>
        ) : (
          <>
            {/* Featured Designer Item */}
            <div className="featured-luxury-item">
              <img 
                src="https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg" 
                alt="Featured Luxury Item" 
                className="featured-luxury-image" 
              />
              <div className="featured-luxury-content">
                <span className="luxury-label">Limited Edition</span>
                <h3>Designer Jewelry Collection</h3>
                <p>Elevate your style with our exclusive designer jewelry pieces - handcrafted with precision and elegance.</p>
                <Link to="/products?category=jewelery" className="view-collection-btn">
                  Shop Collection
                </Link>
              </div>
            </div>
            <div className="products-grid luxurious-grid">
              {designerCollection.map((product, index) => {
                // First item (jewelry) gets highlighted
                if (index === 0 && product.category && product.category.includes('jewelery')) {
                  return (
                    <div key={product.id} className="highlighted-grid-item">
                      <ProductCard product={product} />
                    </div>
                  );
                }
                return (
                  product && product.id ? (
                    <div key={product.id} className="">
                      <ProductCard product={product} />
                    </div>
                  ) : null
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Service Features Section */}
      <section className="service-features">
        {serviceFeatures.map((feature, index) => (
          <div key={index} className="service-feature">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Special Offer Section */}
      <section className="special-offer">
        <div className="offer-content">
          <h2>Exclusive Designer Wear & <br />Limited Edition Pieces</h2>
          <p>Discover one-of-a-kind fashion statements from world-renowned designers</p>
          <Link to="/products?category=jewelery" className="shop-now-btn">Shop Jewellery</Link>
        </div>
        <div className="offer-image">
          <img src="https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg" alt="Luxury Fashion Collection" />
        </div>
      </section>

      {/* Trending Styles Section */}
      <section className="product-section trending-section">
        <div className="section-header">
          <h2 className="section-title">Trending Styles</h2>
          <Link to="/products?sort=rating" className="view-all-link">View All</Link>
        </div>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading trending fashion...</p>
          </div>
        ) : (
          <div className="products-grid trending-grid">
            {trendingStyles.map(product => (
              product && product.id ? <ProductCard key={product.id} product={product} /> : null
            ))}
          </div>
        )}
      </section>

      {/* Discount Section */}
      <section className="discount-section">
        <div className="discount-content">
          <h2>Season End Sale - Up to 50% Off</h2>
          <p>Limited time offer on this season's hottest styles</p>
          <Link to="/products?discount=true" className="shop-now-btn">Shop The Sale</Link>
        </div>
        <div className="discount-image">
          <img src="https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg" alt="Fashion Sale" />
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="top-categories">
        <h2 className="section-title">Top Categories</h2>
        <div className="categories-grid">
          {topCategories.map((category, index) => (
            <Link 
              key={index} 
              to={`/products?category=${encodeURIComponent(category.name.toLowerCase().replace("'s", '').replace(' fashion', '').replace(' & accessories', ''))}`}
              className="category-card"
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
              </div>
              <h3>{category.name}</h3>
              <p>{category.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* All Products Banner */}
      <section className="all-products-banner">
        <div className="banner-content">
          <h2>Explore Our Complete Collection</h2>
          <p>Browse all our products with advanced filtering options</p>
          <Link to="/products" className="all-products-btn">Shop All Products</Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-decoration decoration-1"></div>
        <div className="newsletter-decoration decoration-2"></div>
        <h2>Stay Ahead of Fashion Trends<br />Subscribe to Our Style Newsletter</h2>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email for style updates" 
            required 
          />
          <button type="submit" className="subscribe-btn">
            Get Fashion Updates
          </button>
        </form>
      </section>

      {/* Latest Blog Section */}
      <section className="blog-section">
        <h2 className="section-title">Latest Blog</h2>
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <div key={index} className="blog-card">
              <div className="blog-image">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  loading="lazy" 
                  fetchpriority={index === 0 ? "high" : "auto"}
                />
              </div>
              <div className="blog-content">
                <p className="blog-date">{post.date}</p>
                <h3>{post.title}</h3>
                <Link to="#" className="read-more">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
    </div>
  );
};

export default Home;