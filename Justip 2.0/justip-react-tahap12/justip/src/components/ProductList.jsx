import { useState } from 'react';
import { Ic, Stars, rp } from './ui.jsx';
import { ART } from './art.jsx';
import { title } from '../data.js';
import { useJustip } from '../context/JustipContext.jsx';
import StateView from './states/StateView.jsx';

const SUGGEST = ['Sepatu', 'Elektronik', 'Tas', 'Kecantikan', 'Peralatan'];

export default function ProductList({ go, back, pick, onRequestCustom }) {
  const open = (p) => (pick ? pick(p) : go('detail', p));
  const [fav, setFav] = useState({});
  const [q, setQ] = useState('');
  const { products } = useJustip();
  const key = q.trim().toLowerCase();
  const activeProducts = products.filter((p) => p.active !== false);
  const shown = activeProducts.filter((p) => !key || [p.name, p.tag, p.label, p.store, p.cat].join(' ').toLowerCase().includes(key));
  return (
    <>
      <header className="bar">
        <button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button>
        <label className="search flex"><Ic n="search" size={20} /><input placeholder="Cari barang, toko, atau link..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari barang" /></label>
      </header>
      <div className="chips">
        <button><Ic n="sort" size={16} />Urutkan <Ic n="chevD" size={14} /></button>
        <button>Kategori <Ic n="chevD" size={14} /></button>
        <button><Ic n="filter" size={16} />Filter</button>
      </div>
      <main className="scroll list">
        {!shown.length && (
          <StateView
            art="search"
            title="Barang Tidak Ditemukan"
            text={`Kami tidak menemukan hasil untuk "${q.trim()}". Periksa ejaan atau buat request titipan bebas untuk barang ini.`}
            actions={[
              ['Hapus Pencarian', () => setQ('')],
              ...(onRequestCustom ? [['Titip Bebas Barang Ini', onRequestCustom]] : []),
            ]}
          >
            <div className="sv-chips" aria-label="Coba cari">{SUGGEST.map((c) => <button key={c} onClick={() => setQ(c)}>{c}</button>)}</div>
          </StateView>
        )}
        {shown.map((p) => (
          <article className="row" key={p.id}>
            <button className="rimg" onClick={() => open(p)} aria-label={title(p)}>
              <span className="disc">-{p.disc}%</span>{ART[p.art]}
            </button>
            <div className="rinfo" onClick={() => open(p)}>
              <h4>{title(p)}</h4>
              <small style={{ color: 'var(--sky)', fontWeight: 600 }}>{p.justipper || p.store} · {p.rute || 'Purwokerto ⇄ Yogyakarta'}</small>
              <Stars v={p.rating} c={p.reviews} />
              <div className="pr"><b>{rp(p.price)}</b><s>{rp(p.old)}</s></div>
              <span className="pill">-{p.disc}%</span>
            </div>
            <button className={`fav ${fav[p.id] ? 'on' : ''}`} aria-label="Favorit" onClick={() => setFav({ ...fav, [p.id]: !fav[p.id] })}><Ic n="heart" size={18} filled={fav[p.id]} /></button>
          </article>
        ))}
      </main>
    </>
  );
}
