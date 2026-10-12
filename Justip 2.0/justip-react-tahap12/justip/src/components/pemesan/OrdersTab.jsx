import { rp } from '../ui.jsx';
import { title } from '../../data.js';

const STAGE_LABELS = {
  baru: 'Menunggu Diterima',
  diterima: '1. Pesanan Diterima',
  belanja: '2. Membelikan Produk',
  antar: '3. Sedang Diantar',
  perjalanan: '3. Sedang Diantar',
  tiba: '4. Sampai Tujuan COD',
  selesai: '5. Selesai',
};

export default function OrdersTab({ orders, open }) {
  const getStageBadge = (o) => {
    if (o.status === 'batal') return { text: 'Dibatalkan', cls: 'bad' };
    if (o.status === 'selesai') return { text: 'Selesai', cls: 'ok' };
    const stg = o.stage || (o.status === 'baru' ? 'baru' : 'diterima');
    return {
      text: STAGE_LABELS[stg] || 'Sedang Diproses',
      cls: stg === 'baru' ? 'warn' : 'active',
    };
  };

  return (
    <main className="scroll pad">
      <h2 className="pg-t">Pesanan</h2>
      <div className="olist">
        {orders.map((o) => {
          const badge = getStageBadge(o);
          return (
            <button className="ocard ord" key={o.no} onClick={() => open(o.no)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', marginBottom: 3 }}>
                <span className={`o-tag ${badge.cls}`}>
                  {badge.text}
                </span>
                {o.isCustomRequest && (
                  <span style={{ fontSize: 9.5, background: '#fef3c7', color: '#92400e', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                    ⭐ Titip Bebas
                  </span>
                )}
                {o.insurance && (
                  <span style={{ fontSize: 9.5, background: '#dcfce7', color: '#166534', fontWeight: 800, padding: '2px 6px', borderRadius: 4, marginLeft: 'auto' }}>
                    ✓ Asuransi
                  </span>
                )}
              </div>
              <b>{o.no}</b>
              <small>{o.items && o.items.length > 0 ? o.items.map((i) => (i.p ? title(i.p) : i.name || o.name)).join(', ') : o.name}</small>
              <b className="amt">{rp(o.total || o.price || 0)}</b>
            </button>
          );
        })}
        {!orders.length && <p className="empty">Belum ada pesanan. Yuk, mulai belanja!</p>}
      </div>
    </main>
  );
}
