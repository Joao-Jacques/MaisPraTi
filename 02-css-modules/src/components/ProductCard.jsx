
import React, { useState } from 'react';
import styles from '../index.module.css';

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
      className={[
        styles.productCard,
        loading ? styles.loading : '',
        added ? styles.added : ''
      ].join(' ')}
      tabIndex={0}
      aria-label={product.title}
      aria-describedby={`desc-${product.id}`}
      role="region"
    >
      <div className={styles.productCardImgWrapper}>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={styles.productCardImg}
          style={{ opacity: loading ? 0.5 : 1 }}
        />
        {product.tag && (
          <span
            className={[
              styles.productCardTag,
              product.tag === 'Promo' ? styles.productCardTagPromo : styles.productCardTagNovo
            ].join(' ')}
            aria-label={product.tag === 'Promo' ? 'Produto em promoção' : 'Produto novo'}
          >
            {product.tag}
          </span>
        )}
      </div>
      <div className={styles.productCardBody} id={`desc-${product.id}`}>
        <h2 className={styles.productCardTitle} title={product.title}>{product.title}</h2>
        <div className={styles.productCardPriceRating}>
          <span className={styles.productCardPrice}>R$ {product.price.toFixed(2)}</span>
          <span className={styles.productCardRating} aria-label={`Nota ${product.rating}`}>★ {product.rating}</span>
        </div>
        <button
          className={[
            styles.productCardBtn,
            added ? styles.productCardBtnAdded : ''
          ].join(' ')}
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