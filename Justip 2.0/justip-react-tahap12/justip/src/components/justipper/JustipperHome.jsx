import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { TopBar } from '../shared.jsx';
import OrderCard from './OrderCard.jsx';

export default function JustipperHome({
  balance,
  online,
  setOnline,
  orders,
  st,
  open,
  onDetail,
  onAccept,
  goTab,
  say,
  chatUnread,
  products = [],
  onAddProduct,
  onDetailProduct,
  onManageMp,
  onManageQris,
}) {
  const fresh = orders.filter((o) => st(o) === 'new');
  const pending = fresh.length;
  const bell = () => (fresh.length ? open(fresh[0].id) : say('Belum ada pesanan baru'));

  const QA = [
    ['plus', 'Buka Titipan', onAddProduct],
    ['bag', 'Katalog Saya', () => goTab('Titipan')],
    ['clip', 'Pesanan Masuk', () => goTab('Pesanan'), pending],
    ['chat', 'Chat Pembeli', () => goTab('Chat'), chatUnread],
  ];

  return (
    <main className="scroll pad">
      <TopBar title="Justipper" onBell={bell} />

      {/* Banner Rekening Langsung (Tanpa Saldo Mengendap) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: 16,
          padding: '14px 16px',
          color: '#fff',
          boxShadow: '0 4px 14px rgba(2, 132, 199, .22)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ background: 'rgba(255,255,255,.2)', padding: '2px 7px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
            ✓ Skenario 1: QRIS Toko Mandiri
          </span>
          <span style={{ fontSize: 11, opacity: 0.9 }}>
            Bebas Saldo Mengendap
          </span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.2 }}>
          Pendapatan 100% Masuk ke E-Wallet Toko
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 11.5, opacity: 0.92, lineHeight: 1.4 }}>
          Uang belanja pembeli langsung masuk penuh ke akun tokomu (DANA/SeaBank). Komisi platform 2,5% disetorkan via scan QRIS Developer saat pesanan selesai.
        </p>
      </div>

      {/* Akses Cepat Kelola Titik Temu & QRIS Jastiper */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 0 6px' }}>
        <button
          type="button"
          onClick={onManageMp}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 12px',
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 14,
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: 34, height: 34, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Ic n="pin" size={18} />
          </span>
          <div>
            <b style={{ fontSize: 12.5, color: '#0f172a', display: 'block' }}>Titik Temu COD</b>
            <small style={{ fontSize: 10.5, color: '#64748b' }}>Atur lokasi kampus</small>
          </div>
        </button>

        <button
          type="button"
          onClick={onManageQris}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 12px',
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 14,
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: 34, height: 34, borderRadius: 10, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Ic n="shield" size={18} />
          </span>
          <div>
            <b style={{ fontSize: 12.5, color: '#0f172a', display: 'block' }}>QRIS Toko</b>
            <small style={{ fontSize: 10.5, color: '#64748b' }}>Upload foto QRIS</small>
          </div>
        </button>
      </div>

      <div className="qa" style={{ marginTop: 6 }}>
        {QA.map(([icon, label, fn, badge]) => (
          <button key={label} onClick={fn}>
            <span>
              <Ic n={icon} size={24} />
              {badge ? <i className="badge">{badge}</i> : null}
            </span>
            {label}
          </button>
        ))}
      </div>

      <div className={`online ${online ? 'on' : ''}`}>
        <i className="dot" />
        <span>
          <b>{online ? 'Status Jastiper: Online' : 'Status Jastiper: Offline'}</b>
          <small>{online ? 'Siap menerima pesanan titipan dari mahasiswa' : 'Aktifkan untuk menerima pesanan'}</small>
        </span>
        <button className="switch" role="switch" aria-checked={online} aria-label="Status online" onClick={() => setOnline(!online)}><i /></button>
      </div>

      {/* Bagian Titipan Saya */}
      <div className="sec">
        <h3>Katalog Titipan Saya</h3>
        <button onClick={() => goTab('Titipan')}>Lihat Semua ({products.length}) <Ic n="chevR" size={12} /></button>
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, margin: '0 -4px 14px' }}>
        <button
          type="button"
          onClick={onAddProduct}
          style={{
            flex: 'none',
            width: 130,
            padding: '14px 10px',
            borderRadius: 14,
            border: '1.5px dashed #38bdf8',
            background: '#f0f9ff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: 'var(--sky)',
            cursor: 'pointer',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e0f2fe', display: 'grid', placeItems: 'center' }}>
            <Ic n="plus" size={18} />
          </div>
          <b style={{ fontSize: 12, textAlign: 'center', color: 'var(--sky)' }}>+ Buka Titipan</b>
          <small style={{ fontSize: 10.5, color: 'var(--muted)' }}>Slot jastip baru</small>
        </button>

        {products.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => onDetailProduct && onDetailProduct(p)}
            aria-label={`Lihat detail ${p.name}`}
            style={{
              flex: 'none',
              width: 140,
              padding: 10,
              borderRadius: 14,
              border: '1px solid var(--line)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              cursor: 'pointer',
              position: 'relative',
              textAlign: 'left',
              font: 'inherit',
              color: 'var(--navy)',
            }}
          >
            <div style={{ width: '100%', height: 75, borderRadius: 10, background: 'var(--bg)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
              {p.photos?.[0] ? <img src={p.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ART[p.art || 'box']}
            </div>
            <b style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 4, color: 'var(--navy)' }}>
              {p.name}
            </b>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--sky)' }}>{rp(p.price)}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
              <small style={{ fontSize: 10.5, color: 'var(--muted)' }}>Slot: {p.stock}</small>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: p.draft ? '#fef3c7' : p.active ? '#dcfce7' : '#f3f4f6',
                  color: p.draft ? '#92400e' : p.active ? '#166534' : '#6b7280',
                }}
              >
                {p.draft ? 'Draf' : p.active ? 'Aktif' : 'Off'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="sec">
        <h3>Pesanan Konsumen Masuk</h3>
        <button onClick={() => goTab('Pesanan')}>Lihat Semua <Ic n="chevR" size={12} /></button>
      </div>
      <div className="olist">
        {orders.filter((o) => st(o) !== 'done').map((o) => (
          <OrderCard
            key={o.id}
            o={o}
            state={st(o)}
            online={online}
            onOpen={onDetail}
            onDetail={onDetail}
            onAccept={onAccept}
          />
        ))}
        {orders.every((o) => st(o) === 'done') && <p className="empty">Semua pesanan sudah selesai. Mantap!</p>}
      </div>
    </main>
  );
}
