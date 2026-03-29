import { useState, useEffect } from 'react';
import { fetchProducts } from '../api/client';
import type { Product } from '../types';
import { addToCart } from '../api/client';

/*const animeIcons: Record<string, string> = {
  'Jujutsu Kaisen': '🔵',
  'Chainsaw Man': '⛓️',
  'Demon Slayer': '🗡️',
  'Attack on Titan': '🪖',
  'One Piece': '🏴‍☠️',
  'Spy x Family': '👨‍👩‍👧',
};
*/

const animeImages: Record<string, string> = {
  'Jujutsu Kaisen': '/7cb929baf81f4d0ca9886c3b0906af35.jpg',
  'Chainsaw Man': '/CSM V1.jpg',
  'Demon Slayer': '/tanjinendo.jpg',
  'Attack on Titan': '/snk hood.jpg',
  'One Piece': '/luffy g5.jpg',
  'Spy x Family': '/anyaplush.jpg',
};

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 3;
  {/*const icon = animeIcons[product.anime_title] || '🎌';*/}

async function handleAddToCart() {            
    try {
      await addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);  
    } catch {
      alert('Could not add to cart.');
    }
  }

  return (
    <div 
      className={`
        bg-anime-gray border rounded-xl overflow-hidden 
        transition-all duration-300 group
        ${isOutOfStock 
          ? 'border-gray-700 opacity-60' 
          : 'border-anime-accent/20 hover:border-anime-accent hover:-translate-y-2 hover:shadow-lg hover:shadow-anime-accent/20'
        }
      `}
    >
      {/* Product Image Placeholder 
      /* <div className="h-48 bg-anime-blue flex items-center justify-center relative overflow-hidden">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
      */}
      
      <div className="h-48 bg-anime-blue flex items-center justify-center relative overflow-hidden">
        <img
            src={animeImages[product.anime_title] || '/favicon.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />  
        
        {/* Stock badges */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="font-display text-2xl text-gray-400 tracking-widest">SOLD OUT</span>
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            ONLY {product.stock_quantity} LEFT!
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="text-xs text-anime-accent font-bold uppercase tracking-wider mb-1">
          {product.anime_title}
        </div>
        <h3 className="font-bold text-white text-lg leading-tight mb-3">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-anime-gold">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            {isOutOfStock ? 'Out of stock' : `${product.stock_quantity} in stock`}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || added}
          className={`
            mt-4 w-full font-bold py-2 rounded-lg transition-all duration-200 text-sm
            ${isOutOfStock
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : added
              ? 'bg-green-600 text-white'
              : 'bg-anime-accent hover:bg-red-600 text-white'
            }
          `}
        >
          {isOutOfStock ? 'Out of Stock' : added ? '✓ Added!' : '+ Add to Cart'}
        </button>

      </div>
    </div>
  );
}


export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();  
        setProducts(data);                   
      } catch (err) {
        setError('Could not load products. Is the backend running?');
      } finally {
        setLoading(false);  
      }
    }
    loadProducts();
  }, []); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⛩️</div>
          <p className="text-gray-400 text-lg">Loading the merch...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center bg-anime-gray border border-red-500/50 rounded-xl p-8 max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Connection Error</h2>
          <p className="text-gray-400">{error}</p>
          <p className="text-gray-500 mt-4 text-sm">
            Make sure <code className="text-anime-gold">docker-compose up --build</code> is running
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-6xl text-white tracking-widest mb-4">SHOP</h1>
          <p className="text-gray-400">Premium anime merchandise — limited stock available</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎌</div>
            <p className="text-gray-400">No products found. The store might still be seeding data.</p>
          </div>
        )}

      </div>
    </div>
  );
}