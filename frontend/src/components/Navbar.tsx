import { Link } from 'react-router-dom';
import { useState } from 'react';

interface NavbarProps {
  cartItemCount: number;
}

export default function Navbar({ cartItemCount }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-anime-dark border-b border-anime-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">⛩️</span>
            <span className="font-display text-3xl text-white tracking-widest" style={{ letterSpacing: '0.15em' }}>
              ANIMART
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-anime-accent transition-colors duration-200 font-semibold">
              Home
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-anime-accent transition-colors duration-200 font-semibold">
              Shop
            </Link>
          </div>

          {/* Desktop Cart Button */}
          <div className="hidden md:flex">
            <Link to="/cart" className="relative flex items-center gap-2 bg-anime-accent hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-bold">
              🛒 Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-anime-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Hamburger Button — only shows on mobile */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

        </div>
      </div>

      {/* Mobile Menu — slides in when menuOpen is true */}
      {menuOpen && (
        <div className="md:hidden bg-anime-dark border-t border-anime-accent/30 px-4 py-4 flex flex-col gap-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-anime-accent transition-colors duration-200 font-semibold"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-anime-accent transition-colors duration-200 font-semibold"
          >
            Shop
          </Link>
          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="relative flex items-center gap-2 bg-anime-accent hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-bold w-fit"
          >
            🛒 Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-anime-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
}