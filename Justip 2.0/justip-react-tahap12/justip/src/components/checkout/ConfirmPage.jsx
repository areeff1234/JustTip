import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { title } from '../../data.js';
import { payInfo } from './checkout.js';
import { CoHeader, Row } from './parts.jsx';

export default function ConfirmPage({ co, back, backTo, onPay, say }) {
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);
  const pay = payInfo(co.payId);
  const submit = () => {
    if (!agree) return say('Setujui Syarat & Ketentuan Justip untuk melanjutkan');
    setBusy(true); setTimeout(onPay, 1200);
  };
  return (
    <>
      <CoHeader title="Konfirmasi Pesanan" back={back} />
      <main className="scroll pad">
        <section className="confbox">
          <div className="cb-h"><div><b>Ringkasan Pesanan</b><small>{co.cart.length} Produk • {co.stores.length} Toko</small></div><button className="lnk" onClick={() => backTo('checkout')}>Lihat Detail <Ic n="chevR" size={11} /></button></div>
          {co.cart.map(({ p, qty }) => (
            <div className="cf-item" key={p.id}><span className="ci-img sm">{ART[p.art]}</span><div><small>{title(p)}</small><b>{rp(p.price)}</b></div><i>×{qty}</i></div>))}
        </section>

        <div className="sumbox flat">
          <Row k="Total Harga Barang" v={rp(co.subtotal)} />
          <Row k="Biaya Layanan Platform (2,5%)" v={rp(co.fee)} />
          <Row k="Ongkos Kirim" v={rp(co.ship)} />
          {co.insurance && <Row k="Asuransi Barang & Makanan" v={rp(co.insuranceFee)} />}
          <div className="totalrow"><span>Total Pembayaran</span><b>{rp(co.total)}</b></div>
        </div>

        {co.insurance && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 11.5, color: '#166534' }}>
            <Ic n="shield" size={16} />
            <span>Pesanan dilindungi <b>Asuransi JustTip Care</b> (Garansi barang aman & anti-basi)</span>
          </div>
        )}

        <div className="sec tight"><h3>Metode Pembayaran</h3></div>
        <div className="chg"><span className="plogo" style={{ background: pay.color ?? '#38bdf8' }}>{pay.name.slice(0, 2)}</span><span><b>{pay.name}</b><small>{pay.sub || (['dana', 'ovo', 'gopay', 'shopeepay'].includes(co.payId) ? co.addr.phone : 'Virtual Account dibuat setelah pesanan')}</small></span><button className="lnk" onClick={() => backTo('bayar')}>Ubah</button></div>

        <div className="sec tight"><h3>Lokasi Pengiriman & Titik Temu</h3></div>
        <div className="chg">
          <Ic n="pin" size={20} className="big-shield" />
          <span>
            <b>{co.courierId === 'cod_kampus' ? co.meetingPoint?.name : co.addr.name}</b>
            <small>
              {co.courierId === 'cod_kampus'
                ? `Titik Temu Kampus: ${co.meetingPoint?.desc}`
                : `${co.addr.text.slice(0, 44)}…`}
            </small>
          </span>
          <button className="lnk" onClick={() => backTo('kurir')}>Ubah</button>
        </div>

        <label className="chk agree"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span /> Saya setuju dengan Syarat & Ketentuan Justip</label>
      </main>
      <footer className="co-bar solo"><button className="btn wide" disabled={busy} onClick={submit}><Ic n="shield" size={18} />{busy ? 'Memproses pembayaran...' : 'Bayar Sekarang'}</button></footer>
    </>
  );
}
