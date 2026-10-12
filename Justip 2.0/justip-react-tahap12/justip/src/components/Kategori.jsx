import Banner from './Banner.jsx';
import { Ic, Brand, Stars } from './ui.jsx';
import { CATEGORIES, STORES } from '../data.js';

export default function Kategori({ go, back }) {
  return (
    <>
      <header className="bar"><button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button><h2>Kategori</h2></header>
      <main className="scroll pad">
        <label className="search"><Ic n="search" size={20} /><input placeholder="Cari kategori atau produk..." /></label>
        <Banner tall>
          <h2 className="h-sm">Semua yang kamu butuhkan,<br />ada di Justip!</h2>
          <p className="sub">Dari fashion, gadget, hingga<br />makanan favorit.</p>
        </Banner>
        <div className="catgrid">
          {CATEGORIES.map(([icon, name]) => (
            <button className="cat" key={name} onClick={() => go('list')}><span><Ic n={icon} /></span>{name}</button>
          ))}
        </div>
        <div className="sec"><h3>Toko Populer</h3><button onClick={() => go('list')}>Lihat Semua <Ic n="chevR" size={12} /></button></div>
        <div className="stores tall">
          {STORES.map((s) => (
            <button className="store" key={s.name} onClick={() => go('list')}>
              <Brand k={s.brand} size={40} /><b>{s.name}</b><Stars v={s.rating} c={`${s.n} produk`} />
            </button>
          ))}
        </div>
        <section className="cta">
          <div><b>Ingin beli dari toko tertentu?</b><small>Gunakan fitur jasa titip, kami siap membantumu!</small>
            <button className="btn" onClick={() => go('list')}>Jasa Titip Sekarang</button></div>
        </section>
      </main>
    </>
  );
}
