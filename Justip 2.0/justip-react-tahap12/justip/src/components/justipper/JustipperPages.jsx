import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import OrderCard from './OrderCard.jsx';

export function OrdersPage({ orders, st, online, onDetail, onAccept, start = 'masuk' }) {
  const [tab, setTab] = useState(start);
  const MAP = { masuk: 'new', diterima: 'active', selesai: 'done' };
  const list = orders.filter((o) => st(o) === MAP[tab]);
  const EMPTY = { masuk: 'Belum ada pesanan baru masuk.', diterima: 'Belum ada pesanan yang sedang berjalan.', selesai: 'Belum ada pesanan selesai.' };
  return (
    <main className="scroll pad">
      <h2 className="pg-t">Pesanan Konsumen</h2>
      <div className="seg" role="tablist">
        {[['masuk', 'Masuk'], ['diterima', 'Sedang Berjalan'], ['selesai', 'Selesai']].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>))}
      </div>
      <div className="olist">
        {list.map((o) => (
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
        {!list.length && <p className="empty">{EMPTY[tab]}</p>}
      </div>
    </main>
  );
}

export function MapPage({ orders, st }) {
  const pins = [[70, 90], [200, 150], [120, 210]];
  return (
    <main className="scroll pad">
      <h2 className="pg-t">Peta</h2>
      <div className="mapbox">
        <svg viewBox="0 0 300 260" aria-label="Peta pesanan terdekat">
          <rect width="300" height="260" fill="#e8f4fb" />
          <g stroke="#fff" strokeWidth="10" fill="none"><path d="M0 70h300M0 160h300M0 230h300M60 0v260M170 0v260M250 0v260" /></g>
          <path d="M20 200C80 150 130 170 190 110S260 60 280 40" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="2 8" strokeLinecap="round" />
          {orders.map((o, i) => {
            const p = pins[i % pins.length];
            return (
              <g key={o.id} transform={`translate(${p[0]} ${p[1]})`}>
                <circle r="14" fill={st(o) !== 'new' ? '#1aa179' : '#38bdf8'} stroke="#fff" strokeWidth="3" />
                <text textAnchor="middle" y="4" fontSize="12" fontWeight="800" fill="#fff">{i + 1}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="lead">Titik menunjukkan lokasi jemput pesanan terdekat. Peta interaktif (GPS) menyusul di tahap backend.</p>
    </main>
  );
}
