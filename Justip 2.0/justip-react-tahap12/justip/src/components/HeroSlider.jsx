import { useState, useEffect, useRef } from 'react';
import Logo from './Logo.jsx';

const SLIDES = [
  {
    id: 1,
    badge: 'Jasa Titip Terpercaya',
    lead: 'Belanja barang favoritmu di luar negeri?',
    title: 'Justip aja!',
    sub: 'Mudah, aman, & bergaransi',
    gradient: 'linear-gradient(115deg, #0ea5e9, #38bdf8)',
    tag: 'Internasional',
  },
  {
    id: 2,
    badge: 'Promo Pengguna Baru',
    lead: 'Gratis Ongkir & Jasa Titip Pertama!',
    title: 'Kupon: JUSTIPBARU',
    sub: 'Hemat hingga Rp 50.000',
    gradient: 'linear-gradient(115deg, #6366f1, #a855f7)',
    tag: 'Diskon 50%',
  },
  {
    id: 3,
    badge: 'Open Pre-Order',
    lead: 'Jastip Tokyo & Seoul Berangkat Pekan Ini!',
    title: 'Sisa Bagasi 12 Kg',
    sub: 'Skincare, snack & barang langka',
    gradient: 'linear-gradient(115deg, #0d9488, #14b8a6)',
    tag: 'PO Aktif',
  },
];

export default function HeroSlider({ onSelect }) {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(0);
  const touchDiff = useRef(0);

  // Auto-slide setiap 4 detik
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCur((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, cur]);

  const next = () => setCur((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCur((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    touchDiff.current = 0;
    setPaused(true);
  };

  const handleTouchMove = (e) => {
    touchDiff.current = e.touches[0].clientX - touchStart.current;
  };

  const handleTouchEnd = () => {
    if (touchDiff.current < -40) next();
    else if (touchDiff.current > 40) prev();
    setPaused(false);
  };

  return (
    <div
      className="hero-slider-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Promo Banner Justip"
    >
      <div className="hero-slider-window">
        <div
          className="hero-slider-track"
          style={{ transform: `translateX(-${cur * 100}%)` }}
        >
          {SLIDES.map((s, idx) => (
            <div
              key={s.id}
              className="hero-slide-item"
              onClick={() => onSelect && onSelect(s)}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} dari ${SLIDES.length}: ${s.title}`}
            >
              <section className="banner big" style={{ background: s.gradient }}>
                <div className="cloud c1" /><div className="cloud c2" />
                <svg className="plane-b" viewBox="0 0 64 64" aria-hidden="true">
                  <path d="M60 8c-2-2-6-1-9 2L38 23 12 14l-4 4 20 13-8 9-8-1-3 3 9 4 4 9 3-3-1-8 9-8 13 20 4-4-9-26 13-13c3-3 4-7 2-9z" />
                </svg>
                <Logo bg="#ffffff" fg="#0284c7" className="b-logo" />
                <div className="b-text">
                  <span className="hero-badge">{s.badge}</span>
                  <p>{s.lead}</p>
                  <h2>{s.title}</h2>
                  <small className="sub">{s.sub}</small>
                </div>
              </section>
            </div>
          ))}
        </div>
      </div>

      {/* Indikator Dots */}
      <div className="hero-dots" aria-label="Pilih Slide">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`hero-dot ${cur === i ? 'on' : ''}`}
            onClick={() => setCur(i)}
            aria-label={`Ke slide ${i + 1}`}
            aria-current={cur === i}
          />
        ))}
      </div>
    </div>
  );
}
