import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { Avatar } from '../shared.jsx';
import { Bar } from '../account/parts.jsx';
import { total } from './SellerOrders.jsx';

const STEPS = [['baru', 'Pesanan masuk'], ['proses', 'Diproses'], ['siap', 'Siap diambil Justipper']];
const Row = ({ k, v, b }) => <div className={`so-row ${b ? 'tot' : ''}`}><span>{k}</span><b>{v}</b></div>;

export default function OrderDetail({ o, back, setStatus }) {
  const [dlg, setDlg] = useState(false);
  const at = STEPS.findIndex(([k]) => k === o.status);
  return (
    <>
      <Bar title="Detail Pesanan" back={back} />
      <main className="scroll pad so">
        <section className="so-head"><b>{o.no}</b><span className={`o-tag ${o.paid ? 'ok' : 'warn'}`}>{o.paid ? 'Lunas' : 'Menunggu Pembayaran'}</span></section>
        <ol className="so-steps" aria-label="Status pesanan">
          {STEPS.map(([k, l], i) => <li key={k} className={i <= at ? 'on' : ''}><i>{i < at || o.status === 'siap' ? <Ic n="check" size={12} /> : i + 1}</i>{l}</li>)}
        </ol>

        <section className="so-card2"><h3>Barang Pesanan</h3>
          <div className="so-item"><span className="o-img">{ART[o.art]}</span><div><b>{o.item}</b>{o.size && <small>Ukuran: {o.size}</small>}<small>{rp(o.price)} × {o.qty}</small></div></div>
          <Row k="Jumlah barang" v={`${o.qty} barang`} /><Row k="Total harga" v={rp(total(o))} b />
          {o.note && <p className="so-note"><Ic n="info" size={14} />Catatan pembeli: {o.note}</p>}
        </section>

        <section className="so-card2"><h3>Pembeli</h3>
          <div className="so-buyer"><Avatar /><div><b>{o.buyer}</b><small>{o.phone}</small></div><a className="so-call" href={`tel:${o.phone.replace(/[\s-]/g, '')}`} aria-label={`Hubungi ${o.buyer}`}><Ic n="call" size={18} /></a></div>
          <p className="so-addr"><Ic n="pin" size={15} />{o.addr}</p>
        </section>

        <section className="so-card2"><h3>Pembayaran</h3>
          <Row k="Metode" v={o.method} /><Row k="Status" v={o.paid ? 'Sudah dibayar' : 'Belum dibayar'} />
          {!o.paid && <p className="so-note warn"><Ic n="info" size={14} />Pesanan baru bisa diproses setelah pembayaran diterima.</p>}
        </section>
      </main>
      {o.status !== 'siap' ? (
        <footer className="co-bar solo">
          {o.status === 'baru'
            ? <button className="btn wide" disabled={!o.paid} onClick={() => { setStatus(o.id, 'proses', 'Pesanan sedang diproses'); }}>Proses Pesanan</button>
            : <button className="btn wide" onClick={() => setDlg(true)}><Ic n="check" size={18} />Konfirmasi Siap Diambil</button>}
        </footer>
      ) : <footer className="co-bar solo"><p className="so-done"><Ic n="truck" size={18} />Menunggu Justipper mengambil barang di tokomu.</p></footer>}
      {dlg && (
        <div className="dlg" role="dialog" aria-modal="true" aria-labelledby="rd-t" onClick={() => setDlg(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <span className="dlg-ic ok"><Ic n="box" size={26} /></span>
            <b id="rd-t">Barang sudah siap?</b>
            <p>Pastikan {o.qty} barang sudah dikemas dan sesuai pesanan. Justipper akan diberi tahu untuk mengambilnya.</p>
            <button className="btn out wide" onClick={() => setDlg(false)}>Belum</button>
            <button className="btn wide" onClick={() => { setDlg(false); setStatus(o.id, 'siap', 'Barang siap diambil Justipper'); }}>Ya, Siap Diambil</button>
          </div>
        </div>
      )}
    </>
  );
}
