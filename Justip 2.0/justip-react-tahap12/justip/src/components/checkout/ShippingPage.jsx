import { Ic, rp } from '../ui.jsx';
import { COURIERS, CAMPUS_MEETING_POINTS, eta } from './checkout.js';
import { CoHeader, Radio, Chip } from './parts.jsx';

export default function ShippingPage({ co, go, back }) {
  return (
    <>
      <CoHeader title="Metode Pengiriman" back={back} />
      <main className="scroll pad">
        <div className="route">
          <p><Ic n="pin" size={16} /><span>Dari</span><b>{co.stores[0] ?? '-'}</b></p>
          <p><Ic n="pin" size={16} /><span>Ke</span><b>{co.addr.name} - {co.addr.short}</b></p>
        </div>

        <div className="sec"><h3>Pilih Kurir / Opsi Pengantaran</h3></div>
        <div className="couriers" role="radiogroup" aria-label="Pilih kurir">
          {COURIERS.map((c) => (
            <button key={c.id} role="radio" aria-checked={co.courierId === c.id} className={`courier ${co.courierId === c.id ? 'on' : ''}`} onClick={() => co.setCourier(c.id)}>
              <span className="clogo" style={{ color: c.color }}>{c.logo}</span>
              <span className="cinfo"><b>{c.name}</b><small>{c.days[0]}-{c.days[1]} hari · {rp(c.price)}</small><Chip t={c.tag} c={c.id === 'jne' ? 'blue' : 'green'} /></span>
              <Radio on={co.courierId === c.id} />
            </button>
          ))}
        </div>

        {/* Pilihan Titik Temu Kampus jika COD Kampus dipilih */}
        {co.courierId === 'cod_kampus' && (
          <div style={{ marginTop: 16 }}>
            <div className="sec" style={{ margin: '14px 0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <h3 style={{ margin: 0 }}>Titik Temu Kampus</h3>
                <span style={{ fontSize: 11, background: '#dcfce7', color: '#166534', fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                  Gratis Ongkir
                </span>
              </div>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 11.5, color: '#64748b' }}>
              Pilih lokasi serah terima barang langsung dengan jastiper di area kampus:
            </p>
            <div style={{ display: 'grid', gap: 8 }}>
              {CAMPUS_MEETING_POINTS.map((mp) => {
                const isPicked = co.meetingPointId === mp.id;
                return (
                  <button
                    key={mp.id}
                    type="button"
                    onClick={() => co.setMeetingPointId(mp.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 14px',
                      borderRadius: 14,
                      textAlign: 'left',
                      background: isPicked ? '#f0f9ff' : '#fff',
                      border: isPicked ? '1.5px solid var(--sky)' : '1px solid var(--line)',
                      boxShadow: isPicked ? '0 0 0 3px rgba(56, 189, 248, .12)' : 'none',
                      transition: 'all .15s',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isPicked ? '#0284c7' : '#e2e8f0',
                      color: isPicked ? '#fff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Ic n="pin" size={16} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <b style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>{mp.name}</b>
                      <small style={{ fontSize: 11, color: '#64748b', display: 'block' }}>{mp.desc}</small>
                    </span>
                    <Radio on={isPicked} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="etabox"><Ic n="cal" size={22} /><span><small>Estimasi Tiba</small><b>{eta(co.courier.days)}</b></span><Ic n="chevR" size={16} /></div>
      </main>
      <footer className="co-bar solo"><button className="btn wide" onClick={() => go('bayar')}>Lanjut ke Pembayaran</button></footer>
    </>
  );
}
