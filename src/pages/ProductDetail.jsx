import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../App';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  // Available sizes
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Fetch related products from the same category
        const relatedResponse = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(data.category)}`);
        const relatedData = await relatedResponse.json();
        // Filter out the current product and limit to 4 items
        setRelatedProducts(relatedData.filter(item => item.id !== data.id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Add the product with the selected quantity and size
    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        selectedSize,
        uniqueId: `${product.id}-${selectedSize}-${Date.now()}`
      });
    }
    
    setAddedToCart(true);
    
    // Reset the "Added to cart" message after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/product/${productId}`);
    // Scroll to top when navigating to another product
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <button className="back-to-products" onClick={() => navigate('/products')}>
          Browse All Products
        </button>
      </div>
    );
  }

  // Calculate discount (random for demo purposes)
  const discount = Math.floor(Math.random() * 30) + 10;
  const originalPrice = (product.price * (100 / (100 - discount))).toFixed(2);

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-images">
          <div className="main-image">
            <img src={product.image} alt={product.title} />
          </div>
        </div>
        
        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-meta">
            <span className="product-category">{product.category}</span>
            <span className="product-rating">
              <span className="stars">{product.rating?.rate || 4.5} ★</span>
              <span className="count">({product.rating?.count || 120} reviews)</span>
            </span>
          </div>
          
          <div className="product-price-container">
            <span className="current-price">${product.price.toFixed(2)}</span>
            <span className="original-price">${originalPrice}</span>
            <span className="discount-badge">{discount}% OFF</span>
          </div>
          
          <div className="product-description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-options">
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-control">
                <button className="quantity-btn" onClick={decrementQuantity}>-</button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                />
                <button className="quantity-btn" onClick={incrementQuantity}>+</button>
              </div>
            </div>
          </div>
          
          <div className="product-actions">
            <button 
              className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={addedToCart}
            >
              {addedToCart ? 'Added to Cart!' : `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}`}
            </button>
            
            <button className="wishlist-btn">
              Add to Wishlist
            </button>
          </div>
          
          <div className="product-shipping">
            <p><strong>Free shipping</strong> on orders over $50</p>
            <p>30-day return policy</p>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => (
              <div
                key={relatedProduct.id}
                className="related-product"
                onClick={() => handleRelatedProductClick(relatedProduct.id)}
              >
                <div className="related-product-image">
                  <img src={relatedProduct.image} alt={relatedProduct.title} />
                </div>
                <h3>{relatedProduct.title}</h3>
                <p className="related-product-price">${relatedProduct.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;