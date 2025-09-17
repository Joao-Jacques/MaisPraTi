
import React, { useEffect, useState, useRef } from 'react';
import styles from '../index.module.css';

const LOGO = '🛒 MaisPraTi';

export default function Navbar() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [cartCount, setCartCount] = useState(0);
  const themeBtnRef = useRef(null);

  useEffect(() => {
    document.body.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <nav className={styles.navbar} aria-label="Barra de navegação principal">
      <a
        href="#main-content"
        className={`${styles.visuallyHidden} ${styles.skipLink}`}
        tabIndex={0}
      >Pular para o conteúdo principal</a>
      <div
        className={styles.navbarLogo}
        tabIndex={0}
        aria-label="Logo e início"
        role="banner"
        style={{ outline: 'none' }}
      >
        {LOGO}
      </div>
      <button
        className={styles.navbarThemeToggle}
        aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        onClick={() => setDark((v) => !v)}
        tabIndex={0}
        ref={themeBtnRef}
        style={{ outline: 'none' }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setDark((v) => !v);
          }
        }}
      >
        {dark ? '🌙' : '☀️'}
      </button>
      <div className={styles.navbarCart} aria-label="Carrinho de compras" tabIndex={0} role="region">
        <span aria-hidden="true">
          🛍️
        </span>
        <span className={styles.navbarCartBadge} aria-label={`Itens no carrinho: ${cartCount}`}>
          {cartCount}
        </span>
      </div>
    </nav>
  );
}