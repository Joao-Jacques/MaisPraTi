
import React, { useEffect, useState, useRef } from 'react';

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
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white text-gray-900 flex items-center justify-between px-6 shadow z-50" aria-label="Barra de navegação principal">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-4 top-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        tabIndex={0}
      >Pular para o conteúdo principal</a>
      <div
        className="font-bold text-lg outline-none"
        tabIndex={0}
        aria-label="Logo e início"
        role="banner"
      >
        {LOGO}
      </div>
      <button
        className="bg-transparent border-none text-xl cursor-pointer mx-4 rounded-full p-2 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        onClick={() => setDark((v) => !v)}
        tabIndex={0}
        ref={themeBtnRef}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setDark((v) => !v);
          }
        }}
      >
        {dark ? '🌙' : '☀️'}
      </button>
      <div className="relative text-xl ml-4" aria-label="Carrinho de compras" tabIndex={0} role="region">
        <span aria-hidden="true">🛍️</span>
        <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs rounded-full px-2 min-w-[1.5em] text-center font-bold shadow" aria-label={`Itens no carrinho: ${cartCount}`}>
          {cartCount}
        </span>
      </div>
    </nav>
  );
}