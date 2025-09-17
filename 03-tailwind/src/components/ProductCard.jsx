import React, { useState } from 'react';

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }, 900);
  };

  return (
    <article
      className={`bg-white rounded-xl shadow-sm flex flex-col overflow-hidden transition-all outline-none min-w-0 ${loading ? 'opacity-70 pointer-events-none' : ''} ${added ? 'animate-pulse' : ''}`}
      tabIndex={0}
      aria-label={product.title}
      aria-describedby={`desc-${product.id}`}
      role="region"
    >
      <div className="relative aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-opacity"
          style={{ opacity: loading ? 0.5 : 1 }}
        />
        {product.tag && (
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow ${product.tag === 'Promo' ? 'bg-pink-600 text-white' : 'bg-green-600 text-white'}`}
            aria-label={product.tag === 'Promo' ? 'Produto em promoção' : 'Produto novo'}
          >
            {product.tag}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4" id={`desc-${product.id}`}>
        <h2 className="text-base font-semibold mb-1 truncate" title={product.title}>{product.title}</h2>
        <div className="flex items-center justify-between gap-2">
          <span className="text-blue-700 font-bold text-lg">R$ {product.price.toFixed(2)}</span>
          <span className="text-yellow-500 font-medium text-base" aria-label={`Nota ${product.rating}`}>★ {product.rating}</span>
        </div>
        <button
          className={`mt-2 px-5 py-2 rounded-md border-2 border-blue-600 bg-blue-600 text-white font-semibold text-base shadow hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:border-blue-300 disabled:cursor-not-allowed ${added ? 'bg-green-600 border-green-600' : ''}`}
          onClick={handleAdd}
          disabled={loading || added}
          aria-busy={loading}
          aria-label={added ? 'Produto adicionado ao carrinho' : 'Adicionar ao carrinho'}
          tabIndex={0}
          style={{ outline: 'none' }}
        >
          {loading ? (
            <span aria-live="polite">Adicionando...</span>
          ) : added ? (
            <span aria-live="polite">Adicionado!</span>
          ) : (
            <span>Adicionar</span>
          )}
        </button>
      </div>
    </article>
  );
}