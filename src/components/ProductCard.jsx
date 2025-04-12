import React, { useContext, useState, useEffect, useMemo } from 'react';
import './ProductCard.css';
import { CartContext } from '../App';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [isHovering, setIsHovering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  
  // Calculate discount and original price only once on component mount
  useEffect(() => {
    // Generate a fixed discount between 5% and 30% based on product ID
    const fixedDiscount = Math.floor((product.id * 7) % 25) + 5;
    setDiscount(fixedDiscount);
    
    // Calculate original price
    const calcOriginalPrice = (product.price / (1 - fixedDiscount / 100)).toFixed(2);
    setOriginalPrice(calcOriginalPrice);
  }, [product.id, product.price]);
  
  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Handle mouse enter and leave for hover effects
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    // Add product to cart with selected quantity
    addToCart(product, quantity);
    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div 
      className="product-card" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          {product.rating && (
            <div className="product-rating">
              <span className="rating-score">
                {product.rating.rate ? product.rating.rate.toFixed(1) : "4.5"}
              </span>
              <span className="rating-count">
                ({product.rating.count || 340} reviews)
              </span>
            </div>
          )}
          <div className="product-price-container">
            <span className="product-price">${formatPrice(product.price)}</span>
            <span className="product-original-price">${formatPrice(originalPrice)}</span>
            <span className="product-discount">{discount}% OFF</span>
          </div>
          {product.category && (
            <span className="product-category">{product.category}</span>
          )}
        </div>
      </Link>
      <div className="product-actions">
        <div className="quantity-selector">
          <button 
            className="quantity-btn" 
            onClick={decreaseQuantity}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
            aria-label="Quantity"
          />
          <button 
            className="quantity-btn" 
            onClick={increaseQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;