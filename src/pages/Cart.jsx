import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../App';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { setCart } = useContext(CartContext);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Format price with commas
  const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCheckout = () => {
    // Show confirmation message
    setOrderPlaced(true);
    
    // Clear the cart
    setCart([]);
    
    // Hide the confirmation message after 4 seconds
    setTimeout(() => {
      setOrderPlaced(false);
    }, 4000);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      {orderPlaced && (
        <div className="order-confirmation">
          <p>Order placed successfully!</p>
        </div>
      )}
      
      {cart.length === 0 && !orderPlaced ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => window.location.href = '/products'}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedSize || 'default'}`} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-price">${formatPrice(item.price)}</p>
                  {item.selectedSize && (
                    <p className="item-size">Size: {item.selectedSize}</p>
                  )}
                </div>
                <div className="item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  <p>${formatPrice(item.price * item.quantity)}</p>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-item">
              <span>Shipping:</span>
              <span>{totalPrice > 50 ? "Free" : "$4.99"}</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>${formatPrice(totalPrice * 0.07)}</span>
            </div>
            <div className="total-price">
              <h3>Total:</h3>
              <h3>${formatPrice(totalPrice + (totalPrice > 50 ? 0 : 4.99) + (totalPrice * 0.07))}</h3>
            </div>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </button>
            <button 
              className="continue-shopping"
              onClick={() => window.location.href = '/products'}
            >
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;