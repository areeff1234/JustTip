import { Ic } from '../ui.jsx';
import Logo from '../Logo.jsx';
import { Avatar } from '../shared.jsx';
import { ProductRow } from './SellerProducts.jsx';

export default function PenjualHome({ products, todo, seeOrders, goTab, onAdd, say, rowProps }) {
  const QA = [['plus', 'Tambah Produk', onAdd, true], ['clip', 'Pesanan', () => seeOrders(), false, todo], ['store', 'Toko', () => say('Halaman toko hadir di tahap berikutnya')], ['gear', 'Pengaturan', () => goTab('Akun')]];
  return (
    <main className="scroll pad">
      <header className="top">
        <div className="brand"><Logo bg="#38BDF8" fg="#fff" /><b>just<i>ip</i></b></div>
        <div className="top-r"><button className="icon-btn" aria-label="Notifikasi"><Ic n="bell" /></button><Avatar v="b" /></div>
      </header>
      <section className="storecard">
        <span className="st-ic"><Ic n="store" size={34} /></span>
        <span><b>Toko Arif Store <Ic n="shield" size={16} className="vf w" /></b><small>Produk pilihan, kualitas terjamin</small></span>
        <Ic n="chevR" size={18} />
      </section>
      <div className="stats">
        <span><i><Ic n="box" size={22} /></i><b>{products.length}</b><small>Produk</small></span>
        <span><i><Ic n="clip" size={22} /></i><b>56</b><small>Pesanan</small></span>
        <span><i className="gold">★</i><b>4.8</b><small>Rating</small></span>
      </div>
      <button className="promo" onClick={() => say('Fitur promosi hadir di tahap berikutnya')}>
        <Ic n="mega" size={36} className="big-shield" />
        <span><b>Tingkatkan penjualanmu!</b><small>Aktifkan fitur promosi agar lebih banyak pembeli menemukan tokomu.</small></span>
        <Ic n="chevR" size={16} />
      </button>
      <div className="qa seller">
        {QA.map(([icon, label, fn, solid, badge]) => (
          <button key={label} onClick={fn}><span className={solid ? 'solid' : ''}><Ic n={icon} size={24} />{badge ? <i className="badge">{badge}</i> : null}</span>{label}</button>))}
      </div>
      <div className="sec"><h3>Produk Saya</h3><button onClick={() => goTab('Produk')}>Lihat Semua <Ic n="chevR" size={12} /></button></div>
      <div className="splist">
        {products.slice(0, 3).map((p) => <ProductRow key={p.id} p={p} {...rowProps} />)}
        {!products.length && <p className="empty">Belum ada produk. Tambahkan produk pertamamu.</p>}
      </div>
    </main>
  );
}
