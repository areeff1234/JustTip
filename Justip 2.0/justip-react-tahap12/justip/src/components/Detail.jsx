import { useState } from 'react';
import { Ic, Brand, Stars, rp } from './ui.jsx';
import { ART } from './art.jsx';
import { title } from '../data.js';

export default function Detail({ p, back, onOrder, onChat }) {
  const [size, setSize] = useState(38);
  const [fav, setFav] = useState(false);
  const [toast, setToast] = useState('');
  const rawStock = Number(p.stock ?? 99);
  const stock = Number.isFinite(rawStock) ? Math.max(0, rawStock) : 0;
  const outOfStock = stock === 0;
  const say = (t) => { setToast(t); setTimeout(() => setToast(''), 1800); };
  return (
    <>
      <header className="bar between">
        <button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button>
        <div>
          <button className="icon-btn" onClick={() => say('Tautan disalin')} aria-label="Bagikan"><Ic n="share" /></button>
          <button className={`icon-btn ${fav ? 'hot' : ''}`} onClick={() => setFav(!fav)} aria-label="Favorit"><Ic n="heart" filled={fav} /></button>
        </div>
      </header>
      <main className="scroll pad">
        <div className="hero">
          {p.tag && <span className="tagb">{p.tag}</span>}
          {ART[p.art]}
          <span className="count">1/5</span>
        </div>
        <div className="seller" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
            {p.justipper ? p.justipper.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'HA'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <b>{p.justipper || p.store}</b>
              <span style={{ fontSize: 10, background: '#dcfce7', color: '#166534', fontWeight: 700, padding: '2px 6px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Ic n="shield" size={11} /> Mitra TI Terverifikasi
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: '#0284c7', fontWeight: 600, marginTop: 2 }}>
              <Ic n="plane" size={12} /> {p.rute || 'Purwokerto ⇄ Yogyakarta'}
            </div>
            <Stars v={p.rating || 4.9} c={`${p.reviews || 18} titipan sukses`} />
          </div>
        </div>
        <h1 className="pname">{title(p)}</h1>
        <div className="pr big"><b>{rp(p.price)}</b><s>{rp(p.old)}</s><span className="pill">-{p.disc}%</span></div>
        <Stars v={p.rating} c={`${p.reviews} ulasan`} />

        <div className="trio">
          <span><Ic n="shield" size={16} />100% Original</span>
          <span><Ic n="truck" size={16} />COD Kampus Bebas Ongkir</span>
          <span><Ic n="shield" size={16} />Jastiper Terpercaya</span>
        </div>

        {p.sizes && (<>
          <div className="sec tight"><h3>Pilih Ukuran</h3><button><Ic n="ruler" size={14} /> Panduan Ukuran</button></div>
          <div className="sizes">{p.sizes.map((s) => (
            <button key={s} className={s === size ? 'on' : ''} onClick={() => setSize(s)} aria-pressed={s === size}>{s}</button>))}</div>
        </>)}
        <p className={`stock ${outOfStock ? 'stock-error' : ''}`} role={outOfStock ? 'status' : undefined}>
          {outOfStock ? 'Stok habis' : `Stok: ${stock} slot tersedia`}
        </p>

        <div className="sec"><h3>Deskripsi Titipan</h3></div>
        <p className="desc">{p.desc}</p>
        <dl className="spec">
          <dt><Ic n="user" size={14} />Mitra Jastip</dt><dd>: {p.justipper || 'Hafiz Anggara'}</dd>
          <dt><Ic n="pin" size={14} />Toko Asal</dt><dd>: {p.tokoAsal || p.storeAddr || 'Foot Locker Malioboro, Jogja'}</dd>
          <dt><Ic n="house" size={14} />Titik Temu COD</dt><dd>: {p.titikTemu || 'Gedung TI Kampus Unsoed (Bebas Ongkir)'}</dd>
          <dt><Ic n="clock" size={14} />Jadwal Tiba</dt><dd>: {p.jadwal || 'Besok Sore (16:30)'}</dd>
          <dt><Ic n="grid" size={14} />Kategori</dt><dd>: {p.cat}</dd>
          <dt><Ic n="shield" size={14} />Kondisi</dt><dd>: {p.kondisi || 'Baru & Original'}</dd>
        </dl>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, marginTop: 12 }}>
          <Ic n="shield" size={26} style={{ color: '#16a34a', flexShrink: 0 }} />
          <div>
            <small style={{ color: '#15803d', fontWeight: 700, display: 'block', fontSize: 11.5 }}>COD di Kampus · Bebas Ongkos Kirim</small>
            <b style={{ color: '#166534', fontSize: 12.5 }}>Serah terima langsung di titik temu kampus Unsoed</b>
          </div>
        </div>
      </main>
      <footer className="cta-bar">
        <button className="btn ghost" onClick={() => (onChat ? onChat(p) : say('Chat jastiper belum tersedia'))}><Ic n="chat" size={18} />Chat {p.justipper ? p.justipper.split(' ')[0] : 'Jastiper'}</button>
        <button className="btn" disabled={outOfStock} onClick={() => (onOrder ? onOrder(p, p.sizes ? size : undefined) : say('Pesanan hadir di tahap berikutnya'))}>
          <Ic n="bag" size={18} />{outOfStock ? 'Stok Habis' : `Titip ke ${p.justipper ? p.justipper.split(' ')[0] : 'Jastiper'}`}
        </button>
      </footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
