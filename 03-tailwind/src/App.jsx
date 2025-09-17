import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import React, { useState, useEffect } from 'react';

const PRODUCTS = [
  { id: 1, title: 'Fone Bluetooth Headset', price: 199.9, rating: 4.7, tag: 'Novo', image: 'https://via.placeholder.com/300?text=Fone' },
  { id: 2, title: 'Smartwatch Fitness', price: 349.0, rating: 4.5, tag: 'Promo', image: 'https://via.placeholder.com/300?text=Watch' },
  { id: 3, title: 'Câmera de Ação 4K', price: 499.0, rating: 4.8, tag: 'Novo', image: 'https://via.placeholder.com/300?text=Camera' },
  { id: 4, title: 'Echo Dot 5ª Geração', price: 279.9, rating: 4.6, tag: 'Promo', image: 'https://via.placeholder.com/300?text=Echo+Dot' },
  { id: 5, title: 'Teclado Mecânico RGB', price: 299.0, rating: 4.9, tag: 'Novo', image: 'https://via.placeholder.com/300?text=Teclado' },
  { id: 6, title: 'Mouse Gamer 16000DPI', price: 149.9, rating: 4.4, tag: 'Promo', image: 'https://via.placeholder.com/300?text=Mouse' },
];

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // simula atraso
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />
      <main className="pt-14">
        <h1 className="sr-only">Produtos em destaque</h1>
        <section
          className="grid gap-8 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          aria-label="Lista de produtos"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  className="aspect-[1/1.2] rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse shadow-md"
                  key={i}
                  aria-hidden="true"
                />
              ))
            : PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
        </section>
      </main>
    </div>
  );
}
