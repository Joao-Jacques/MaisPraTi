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
      className={`product-card${loading ? ' loading' : ''}${added ? ' added' : ''}`}
      tabIndex={0}
      aria-label={product.title}
      aria-describedby={`desc-${product.id}`}
      role="region"
    >
      <div className="product-card__img-wrapper">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="product-card__img"
          style={{ opacity: loading ? 0.5 : 1 }}
        />
        {product.tag && (
          <span
            className={`product-card__tag product-card__tag--${product.tag === 'Promo' ? 'promo' : 'novo'}`}
            aria-label={product.tag === 'Promo' ? 'Produto em promoção' : 'Produto novo'}
          >
            {product.tag}
          </span>
        )}
      </div>
      <div className="product-card__body" id={`desc-${product.id}`}>
        <h2 className="product-card__title" title={product.title}>{product.title}</h2>
        <div className="product-card__price-rating">
          <span className="product-card__price">R$ {product.price.toFixed(2)}</span>
          <span className="product-card__rating" aria-label={`Nota ${product.rating}`}>★ {product.rating}</span>
        </div>
        <button
          className={`product-card__btn${added ? ' product-card__btn--added' : ''}`}
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