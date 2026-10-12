import { useState } from 'react';
import { rp } from '../ui.jsx';
import { ART } from '../art.jsx';

const TABS = [['baru', 'Perlu Diproses'], ['proses', 'Diproses'], ['siap', 'Siap Diambil']];
const EMPTY = { baru: 'Belum ada pesanan baru.', proses: 'Tidak ada pesanan yang sedang diproses.', siap: 'Belum ada barang yang siap diambil.' };
export const total = (o) => o.price * o.qty;

export default function SellerOrders({ orders, start = 'baru', open, setStatus }) {
  const [tab, setTab] = useState(start);
  const list = orders.filter((o) => o.status === tab);
  const count = (k) => orders.filter((o) => o.status === k).length;
  return (
    <main className="scroll pad">
      <h2 className="pg-t">Pesanan</h2>
      <div className="seg so-seg" role="tablist">
        {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}{count(k) ? <i>{count(k)}</i> : null}</button>)}
      </div>
      <div className="olist">
        {list.map((o) => (
          <article className="ocard so-card" key={o.id}>
            <button className="so-top" onClick={() => open(o.id)}>
              <span className="o-img">{ART[o.art]}</span>
              <span className="o-info">
                <span className="so-tags"><span className={`o-tag ${o.paid ? 'ok' : 'warn'}`}>{o.paid ? 'Lunas' : 'Menunggu Pembayaran'}</span><small>{o.time}</small></span>
                <b>{o.buyer}</b><small>{o.item}</small>
                <small>{o.qty} barang · <b className="amt">{rp(total(o))}</b></small>
              </span>
            </button>
            {tab === 'baru' && <button className="btn wide" disabled={!o.paid} onClick={() => setStatus(o.id, 'proses', 'Pesanan sedang diproses')}>{o.paid ? 'Proses Pesanan' : 'Tunggu Pembayaran'}</button>}
            {tab === 'proses' && <button className="btn wide" onClick={() => open(o.id)}>Konfirmasi Siap Diambil</button>}
          </article>
        ))}
        {!list.length && <p className="empty">{EMPTY[tab]}</p>}
      </div>
    </main>
  );
}
