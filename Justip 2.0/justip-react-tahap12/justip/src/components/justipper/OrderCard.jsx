import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';

const LABEL = { new: 'Terima Pesanan', active: 'Lanjutkan Rute', done: 'Pesanan Selesai' };

export default function OrderCard({ o, state, online, onOpen, onDetail, onAccept }) {
  const done = state === 'done';
  const openDetail = () => {
    if (onDetail) onDetail(o.id);
    else if (onOpen) onOpen(o.id);
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (done) {
      openDetail();
      return;
    }
    if (state === 'new') {
      if (onAccept) onAccept(o);
      else openDetail();
      return;
    }
    openDetail();
  };

  const getActionLabel = () => {
    if (done) return 'Pesanan Selesai';
    if (state === 'new') return '✓ Terima Pesanan';
    return 'Update Tahap Pesanan';
  };

  return (
    <article className="ocard">
      <div className="o-top" onClick={openDetail} style={{ cursor: 'pointer' }}>
        <span className="o-img">{ART[o.art]}</span>
        <div className="o-info">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
            <span className={`o-tag ${done ? 'ok' : state === 'active' ? 'warn' : ''}`}>
              {done ? 'Selesai' : state === 'active' ? 'Sedang Berjalan' : 'Pesanan Masuk'}
            </span>
            <small style={{ color: '#64748b', fontSize: 10.5 }}>{o.date || 'Hari ini'}</small>
          </div>

          <b style={{ fontSize: 13, color: '#0f172a', display: 'block', lineHeight: 1.3 }}>{o.name}</b>

          {/* Siapa yang pesan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#0284c7', fontWeight: 600, marginTop: 3 }}>
            <Ic n="user" size={13} />
            <span>Pemesan: <b>{o.buyer || 'Nur Arif'}</b></span>
          </div>

          {/* Lokasi Tujuan / Titik Temu */}
          <small className="o-meta" style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Ic n="pin" size={12} /> {o.dest || o.to || 'Gedung TI Kampus Unsoed'}
          </small>

          {/* Komisi Bersih */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <small style={{ color: '#64748b', fontSize: 11 }}>Komisi Kamu:</small>
            <b style={{ color: '#16a34a', fontSize: 13 }}>+{rp(o.fee || 25000)}</b>
          </div>
        </div>
        <Ic n="chevR" size={16} className="o-chev" />
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
        <button
          type="button"
          className="btn sm out"
          style={{ flex: 1, padding: '7px 8px', fontSize: 11.5, fontWeight: 700 }}
          onClick={openDetail}
        >
          Lihat Detail
        </button>

        <button
          type="button"
          className={`btn sm ${done ? 'done' : ''} ${!online && state === 'new' ? 'off' : ''}`}
          style={{
            flex: 1.2,
            padding: '7px 8px',
            fontSize: 11.5,
            fontWeight: 800,
            background: state === 'new' ? '#0284c7' : done ? '#16a34a' : '#0369a1',
            color: '#fff',
          }}
          onClick={handleActionClick}
        >
          {getActionLabel()}
        </button>
      </div>
    </article>
  );
}
