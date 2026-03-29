import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import CartPage from './pages/Cart';
import { fetchCart } from './api/client';

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    async function loadCartCount() {
      try {
        const cart = await fetchCart();
        setCartItemCount(cart.items.length);
      } catch {
        setCartItemCount(0);
      }
    }
    loadCartCount();
  }, []);

  return (
    <BrowserRouter>
      {/* Navbar is always visible, receives the count as a prop */}
      <Navbar cartItemCount={cartItemCount} />
      
      {/* Routes defines which component to show for each URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Catch-all: redirect unknown URLs to home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;