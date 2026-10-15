import { useState } from 'react';
import Logo from './Logo.jsx';
import HeroSlider from './HeroSlider.jsx';
import { Ic, Stars, rp } from './ui.jsx';
import { Avatar } from './shared.jsx';
import { ART } from './art.jsx';
import { CATEGORIES } from '../data.js';
import { useJustip } from '../context/JustipContext.jsx';

export default function Home({ go, onRequestCustom }) {
  const [fav, setFav] = useState({});
  const { products } = useJustip();
  const activeProducts = products.filter((p) => p.active !== false);

  return (
    <main className="scroll pad">
      <header className="top">
        <div className="brand brand-home"><Logo bg="#38BDF8" fg="#fff" className="home-brand-logo" /><b className="home-brand-name">just<i className="home-brand-roll">i</i>p</b></div>
        <div className="top-r"><button className="icon-btn" aria-label="Notifikasi"><Ic n="bell" /></button><Avatar /></div>
      </header>
      <button className="search as-btn" onClick={() => go('list')}><Ic n="search" size={20} /><span>Cari barang, toko, atau link...</span></button>

      <HeroSlider onSelect={() => go('list')} />

      {/* Banner Request Titipan Bebas */}
      <div
        style={{
          marginTop: 12,
          padding: '12px 14px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
        }}
      >
        <div>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, background: 'rgba(255,255,255,0.25)', padding: '2px 6px', borderRadius: 4 }}>
            Fitur Spesial
          </span>
          <b style={{ fontSize: 13.5, display: 'block', marginTop: 3 }}>Mau Titip Barang Bebas?</b>
          <small style={{ fontSize: 11, opacity: 0.95, display: 'block', lineHeight: 1.3 }}>
            Punya titipan di luar etalase? Ajukan request langsung ke Jastiper.
          </small>
        </div>
        <button
          type="button"
          onClick={onRequestCustom}
          style={{
            background: '#fff',
            color: '#0284c7',
            border: 'none',
            borderRadius: 10,
            padding: '8px 12px',
            fontSize: 11.5,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          Titip Sekarang
        </button>
      </div>

      <div className="cats5">
        {[...CATEGORIES.slice(0, 4), ['grid', 'Semua']].map(([icon, name]) => (
          <button className="cat" key={name} onClick={() => go(name === 'Semua' ? 'kategori' : 'list')}><span><Ic n={icon} /></span>{name}</button>
        ))}
      </div>

      <div className="sec"><h3>Rekomendasi Untukmu</h3><button onClick={() => go('list')}>Lihat Semua <Ic n="chevR" size={12} /></button></div>
      <div className="prods grid2">
        {activeProducts.slice(0, 4).map((p) => (
          <article className="pcard" key={p.id}>
            <button className="pimg" onClick={() => go('detail', p)} aria-label={p.name}>
              {p.disc ? <span className="disc-tag">-{p.disc}%</span> : null}
              {ART[p.art]}
            </button>
            <button className={`fav sm teal ${fav[p.id] ? 'on' : ''}`} aria-label="Favorit" onClick={() => setFav({ ...fav, [p.id]: !fav[p.id] })}>
              <Ic n="heart" size={14} filled />
            </button>
            <span className="p-store" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <small style={{ color: 'var(--sky)', fontWeight: 700 }}>{p.justipper || p.store}</small>
              <Ic n="shield" size={11} className="vf" />
            </span>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 3 }}>
              <Ic n="plane" size={10} /> {p.rute || 'Purwokerto ⇄ Yogyakarta'}
            </div>
            <h4 onClick={() => go('detail', p)}>{p.name} {p.tag ? <span className="tag-inline">{p.tag}</span> : null}</h4>
            <div className="p-price-row">
              <b>{rp(p.price)}</b>
              {p.old ? <s>{rp(p.old)}</s> : null}
            </div>
            <div className="p-footer">
              <Stars v={p.rating} c={`${p.reviews}`} />
              <span className="intl" style={{ background: '#dcfce7', color: '#166534', border: 'none' }}><Ic n="truck" size={11} />COD Kampus</span>
            </div>
          </article>
        ))}
      </div>

      <button className="trust" onClick={() => go('list')}>
        <Ic n="shield" size={38} className="big-shield" />
        <span><b>Bebas Ongkir Titik Temu Kampus</b><small>COD aman di Gedung TI & Halte Kampus Unsoed.</small></span>
        <Ic n="chevR" size={16} />
      </button>

      <div className="sec"><h3>Kategori Populer</h3></div>
      <div className="cats5 four">
        {CATEGORIES.slice(4, 8).map(([icon, name]) => (
          <button className="cat" key={name} onClick={() => go('list')}><span><Ic n={icon} /></span>{name}</button>
        ))}
      </div>
    </main>
  );
}
