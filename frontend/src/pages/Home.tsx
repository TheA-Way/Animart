import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Animated background gradient */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at top, #E94560 0%, transparent 60%), radial-gradient(ellipse at bottom-left, #16213E 0%, transparent 60%)',
          }}
        />

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-anime-accent/20 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full border border-anime-accent/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />

        {/* Main hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          
          <div className="fade-in-up mb-6">
            <span className="text-6xl">⛩️</span>
          </div>

          <h1 
            className="font-display text-7xl md:text-9xl text-white mb-4 fade-in-up"
            style={{ 
              letterSpacing: '0.1em',
              textShadow: '0 0 40px rgba(233, 69, 96, 0.5)',
              animationDelay: '0.1s',
              opacity: 0,
              animation: 'fadeInUp 0.6s ease 0.1s forwards'
            }}
          >
            ANIMART
          </h1>

          <p 
            className="text-xl md:text-2xl text-gray-300 mb-8 font-body"
            style={{ 
              opacity: 0,
              animation: 'fadeInUp 0.6s ease 0.3s forwards'
            }}
          >
            Premium Anime Merchandise — Figures, Manga, Apparel
          </p>

          <p 
            className="text-gray-400 mb-12 max-w-2xl mx-auto"
            style={{ 
              opacity: 0,
              animation: 'fadeInUp 0.6s ease 0.5s forwards'
            }}
          >
            A full-stack e-commerce platform built with FastAPI + PostgreSQL backend 
            featuring atomic transactions, row-level locking, and idempotency patterns.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ 
              opacity: 0,
              animation: 'fadeInUp 0.6s ease 0.7s forwards'
            }}
          >
            <Link 
              to="/products"
              className="bg-anime-accent hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 glow-pulse"
            >
              🛒 Shop Now
            </Link>
            <Link 
              to="/cart"
              className="border border-anime-accent text-anime-accent hover:bg-anime-accent hover:text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200"
            >
              View Cart
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-4 bg-anime-gray">
        <div className="max-w-6xl mx-auto">
          
          <h2 className="font-display text-5xl text-center text-white mb-4 tracking-wider">
            ENGINEERING HIGHLIGHTS
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature Card 1 */}
            <div className="bg-anime-dark border border-anime-accent/20 rounded-xl p-8 hover:border-anime-accent/60 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-display text-2xl text-anime-accent mb-3 tracking-wider">
                ROW-LEVEL LOCKING
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Uses PostgreSQL's <code className="text-anime-gold bg-black/40 px-1 rounded">SELECT FOR UPDATE</code> to prevent 
                race conditions. Two users can't buy the last Gojo Figure simultaneously.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-anime-dark border border-anime-accent/20 rounded-xl p-8 hover:border-anime-accent/60 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🔑</div>
              <h3 className="font-display text-2xl text-anime-accent mb-3 tracking-wider">
                IDEMPOTENCY
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Every order requires a unique <code className="text-anime-gold bg-black/40 px-1 rounded">idempotency_key</code>. 
                Double-clicking checkout won't create duplicate charges — ever.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-anime-dark border border-anime-accent/20 rounded-xl p-8 hover:border-anime-accent/60 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-display text-2xl text-anime-accent mb-3 tracking-wider">
                ATOMIC TRANSACTIONS
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Stock deduction, order creation, and cart clearing happen in a single 
                database transaction. Failure at any step triggers a full ROLLBACK.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl text-white mb-12 tracking-wider">TECH STACK</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Python 3.11', color: 'bg-blue-600' },
              { name: 'FastAPI', color: 'bg-teal-600' },
              { name: 'PostgreSQL', color: 'bg-indigo-600' },
              { name: 'SQLAlchemy', color: 'bg-purple-600' },
              { name: 'Docker', color: 'bg-sky-600' },
              { name: 'React', color: 'bg-cyan-600' },
              { name: 'TypeScript', color: 'bg-blue-700' },
              { name: 'Tailwind CSS', color: 'bg-teal-700' },
            ].map((tech) => (
              <span 
                key={tech.name}
                className={`${tech.color} text-white font-bold px-4 py-2 rounded-full text-sm`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}