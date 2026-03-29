import { useState, useEffect } from 'react';
import { fetchCart, placeOrder } from '../api/client';
import type { Cart, Order } from '../types';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await fetchCart();
        setCart(data);
      } catch (err) {
        setError('Could not load cart. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  const cartTotal = cart?.items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0) ?? 0;

  async function handleCheckout() {
    setOrdering(true);
    setOrderError(null);

    try {
      const idempotencyKey = `order-${crypto.randomUUID()}`;
      
      const order = await placeOrder(idempotencyKey);
      setPlacedOrder(order);   
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Order failed. Please try again.';
      setOrderError(message);
    } finally {
      setOrdering(false);
    }
  }

  // ============================================================
  // SUCCESS STATE — Show this after a successful order
  // ============================================================
  if (placedOrder) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-anime-gray border border-green-500/50 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="font-display text-4xl text-white tracking-wider mb-2">ORDER PLACED!</h1>
          <p className="text-green-400 mb-6">Your order was processed successfully</p>
          
          <div className="bg-anime-dark rounded-xl p-6 text-left mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Order ID:</span>
              <span className="text-white font-bold">#{placedOrder.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 font-bold">{placedOrder.status}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Total:</span>
              <span className="text-anime-gold font-bold text-xl">
                ${placedOrder.total_price.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Idempotency Key:</span>
              <span className="text-xs text-gray-500 font-mono truncate ml-2">
                {placedOrder.idempotency_key}
              </span>
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-6">
            The idempotency key above ensures this order can never be duplicated, 
            even if this request was retried.
          </p>

          <a 
            href="/products"
            className="bg-anime-accent hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200 inline-block"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🛒</div>
          <p className="text-gray-400">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="bg-anime-gray border border-red-500/50 rounded-xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-400 font-bold mb-2">Connection Error</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY CART STATE
  // ============================================================
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-display text-4xl text-white tracking-wider mb-4">CART IS EMPTY</h2>
          <p className="text-gray-400 mb-8">The seeded cart should have a Gojo Figure in it. Is the backend running?</p>
          <a 
            href="/products"
            className="bg-anime-accent text-white font-bold px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN CART VIEW
  // ============================================================
  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="font-display text-5xl text-white tracking-widest mb-8">YOUR CART</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items List — takes up 2/3 of the space */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div 
                key={item.id}
                className="bg-anime-gray border border-anime-accent/20 rounded-xl p-6 flex items-center gap-4"
              >
                {/* Product Icon */}
                <div className="w-16 h-16 bg-anime-blue rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  🎌
                </div>
                
                {/* Product Details */}
                <div className="flex-grow">
                  <p className="text-xs text-anime-accent font-bold uppercase tracking-wider">
                    {item.product.anime_title}
                  </p>
                  <h3 className="text-white font-bold">{item.product.name}</h3>
                  <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                </div>
                
                {/* Price */}
                <div className="text-right">
                  <p className="text-anime-gold font-bold text-xl">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs">${item.product.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary — takes up 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="bg-anime-gray border border-anime-accent/30 rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl text-white tracking-wider mb-6">ORDER SUMMARY</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span className="text-anime-gold">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Error Message */}
              {orderError && (
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3 mb-4 text-sm text-red-300">
                  ❌ {orderError}
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={ordering}
                className={`
                  w-full font-bold text-lg py-4 rounded-lg transition-all duration-200
                  ${ordering 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-anime-accent hover:bg-red-600 text-white glow-pulse'
                  }
                `}
              >
                {ordering ? '⏳ Processing...' : '⚡ Place Order'}
              </button>

              <p className="text-gray-500 text-xs text-center mt-3">
                Protected by idempotency — safe to retry
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}