import { Ic, Brand, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { title } from '../../data.js';
import { COLOR } from './checkout.js';
import { CoHeader, Row } from './parts.jsx';
import { useJustip } from '../../context/JustipContext.jsx';

export default function CartPage({ co, go, back, addMore }) {
  const { meetingPoints } = useJustip();

  const currentMp =
    meetingPoints.find((m) => m.id === co.selectedMpId) || meetingPoints[0];

  return (
    <>
      <header className="bar">
        <button className="icon-btn" onClick={back} aria-label="Kembali">
          <Ic n="back" />
        </button>
        <h2>Checkout Pesanan</h2>
      </header>

      <main className="scroll pad">
        {/* 1. BARANG YANG DITITIP */}
        <div className="sec"><h3>Barang Titipan</h3></div>
        {co.stores.map((st) => {
          const items = co.cart.filter((i) => (i.p.store || i.p.justipper) === st);
          return (
            <section className="costore" key={st}>
              <header>
                <Brand k={items[0]?.p?.brand} size={20} />
                <b>{st}</b>
                <span style={{ fontSize: 11, color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                  Mitra Kampus
                </span>
                <button onClick={() => co.removeStore(st)} aria-label={`Hapus barang dari ${st}`} style={{ marginLeft: 'auto' }}>
                  <Ic n="trash" size={16} />
                </button>
              </header>
              {items.map(({ p, qty, size }) => (
                <div className="coitem" key={p.id}>
                  <span className="ci-img">{ART[p.art]}</span>
                  <div className="ci-info">
                    <h4>{title(p)}</h4>
                    {size && <small>Ukuran: {size}</small>}
                    {COLOR[p.id] && <small>Warna: {COLOR[p.id]}</small>}
                    <div className="ci-row">
                      <b>{rp(p.price)}</b>
                      <span className="stepq">
                        <button onClick={() => (qty > 1 ? co.qty(p.id, -1) : co.remove(p.id))} aria-label="Kurangi">−</button>
                        <i aria-live="polite">{qty}</i>
                        <button onClick={() => co.qty(p.id, 1)} aria-label="Tambah">+</button>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          );
        })}

        {!co.cart.length && <p className="empty">Keranjang masih kosong.</p>}
        <button className="addmore" onClick={addMore} style={{ marginBottom: 16 }}>
          <Ic n="plus" size={14} /> Tambah Barang Lain
        </button>

        {/* 2. PILIH TITIK TEMU KAMPUS (DITENTUKAN OLEH JASTIPER) */}
        <div className="sec" style={{ margin: '14px 0 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h3 style={{ margin: 0 }}>Titik Temu di Kampus</h3>
            <span style={{ fontSize: 11, background: '#dcfce7', color: '#166534', fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
              COD Bebas Ongkir
            </span>
          </div>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 11.5, color: '#64748b' }}>
          Pilih lokasi serah terima yang sudah disediakan oleh Jastiper:
        </p>

        <div style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
          {meetingPoints.map((mp) => {
            const isPicked = (co.selectedMpId || meetingPoints[0]?.id) === mp.id;
            return (
              <button
                key={mp.id}
                type="button"
                onClick={() => co.setSelectedMpId(mp.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 14,
                  textAlign: 'left',
                  background: isPicked ? '#f0f9ff' : '#fff',
                  border: isPicked ? '1.5px solid #0284c7' : '1px solid var(--line)',
                  boxShadow: isPicked ? '0 0 0 3px rgba(2, 132, 199, .12)' : 'none',
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: isPicked ? '#0284c7' : '#f1f5f9',
                    color: isPicked ? '#fff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Ic n="pin" size={16} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>{mp.name}</b>
                  <small style={{ fontSize: 11, color: '#64748b', display: 'block' }}>{mp.desc}</small>
                  {mp.time && (
                    <small style={{ fontSize: 10.5, color: '#0284c7', fontWeight: 600, display: 'block', marginTop: 1 }}>
                      ⏰ Jam Kumpul: {mp.time}
                    </small>
                  )}
                </div>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: isPicked ? '5px solid #0284c7' : '2px solid #cbd5e1',
                    background: '#fff',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* 3. CATATAN PATOKAN SERAH TERIMA */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
            Catatan Patokan / Kontak Kamu
          </label>
          <input
            type="text"
            placeholder="Contoh: Saya pakai jaket hitam, kontak WA aktif 0812..."
            value={co.notes}
            onChange={(e) => co.setNotes(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 12.5, outline: 'none' }}
          />
        </div>

        {/* 4. RINGKASAN BIAYA */}
        <div className="sec"><h3>Ringkasan Biaya</h3></div>
        <div className="sumbox">
          <Row k="Harga Barang Toko" v={rp(co.subtotal)} />
          <Row k="Biaya Layanan JustTip (2,5%)" v={rp(co.fee)} />
          <Row k="Ongkos Kirim" v="Gratis (COD Kampus)" green />
        </div>
      </main>

      <footer className="co-bar">
        <div>
          <small style={{ display: 'block', fontSize: 11, color: '#64748b' }}>Total Tagihan</small>
          <b style={{ fontSize: 18, color: '#0f172a' }}>{rp(co.total)}</b>
        </div>
        <button
          className="btn"
          disabled={!co.cart.length}
          onClick={() => go('bayar')}
          style={{ padding: '12px 24px', fontSize: 13, fontWeight: 800 }}
        >
          Lanjut ke Pembayaran
        </button>
      </footer>
    </>
  );
}
