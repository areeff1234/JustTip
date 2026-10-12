import { useMemo, useRef, useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { Avatar } from '../shared.jsx';
import MapView from './MapView.jsx';
import { BellArt, StoreOk, BoxPin, DoneArt } from './tripArt.jsx';

const city = (t) => (t ? t.split(',').slice(-2).join(',').trim() : 'Yogyakarta');
const tel = (p) => (p ? `tel:${p.replace(/[\s-]/g, '')}` : 'tel:081234567890');
const hm = (d) => d.toTimeString().slice(0, 5);

const Bar = ({ title, back }) => (
  <header className="bar"><button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button><h2>{title}</h2></header>
);
const Mny = ({ k, v, b }) => <div className={`t-mny ${b ? 'tot' : ''}`}><span>{k}</span><b>{v}</b></div>;
const Place = ({ icon, name, addr, chip, onClick, children }) => {
  const T = onClick ? 'button' : 'section';
  return (
    <T className={`t-card t-place ${onClick ? 't-go' : ''}`} onClick={onClick}>
      <span className="t-pic"><Ic n={icon} size={26} /></span><div><b>{name}</b><small>{addr}</small>{children}</div>
      {chip && <em className="t-chip">{chip}</em>}{onClick && <Ic n="chevR" size={16} />}
    </T>
  );
};

/* 1 */ const Notif = ({ o, back, go }) => (<>
  <Bar title="Notifikasi Pesanan Baru" back={back} />
  <main className="scroll pad trip">
    <section className="t-hero"><BellArt /><h1>Pesanan Baru!</h1><p>Ada pesanan yang siap kamu ambil.<br />Yuk, lihat detailnya dan segera terima pesanan!</p></section>
    <section className="t-card t-prod"><span className="t-img">{ART[o.art]}</span>
      <div><b>{o.name}</b><strong>{rp(o.price)}</strong><small><Ic n="pin" size={12} />{o.store}<br />{city(o.storeAddr)}</small></div></section>
    <div className="t-two">
      <span><i><Ic n="pin" size={18} /></i><small>Jarak Lokasi Toko</small><b>{o.km} km</b></span>
      <span><i><Ic n="map" size={18} /></i><small>Estimasi Pengantaran</small><b>{o.kmTotal} km</b></span>
    </div>
    <section className="t-card t-sum"><small>Total Bayaran</small><b>{rp(o.fee)}</b></section>
  </main>
  <footer className="co-bar solo"><button className="btn wide" onClick={() => go('detail')}>Lihat Detail Pesanan</button></footer>
</>);

/* 2 */ const Detail = ({ o, back, go, accept }) => (<>
  <Bar title="Detail Pesanan" back={back} />
  <main className="scroll pad trip">
    <section className="t-head"><b>Pesanan {o.no}</b><em>Menunggu Konfirmasi</em><small>{o.date}</small></section>
    <section className="t-card"><h3>Informasi Produk</h3>
      <div className="t-prod in"><span className="t-img">{ART[o.art]}</span><div><b>{o.name}</b><small>{o.store}</small><strong>{rp(o.price)}</strong><small>Stok: {o.stock}</small></div></div>
      <Mny k="Jumlah" v={`${o.qty} barang`} /><Mny k="Subtotal" v={rp(o.price * o.qty)} /></section>
    <section className="t-card"><h3>Rincian Komisi Justipper</h3>
      <Mny k="Jasa Titip" v={rp(o.jasa || o.fee || 15000)} />
      <Mny k="Ongkir Ekspedisi" v="Gratis (COD Kampus)" />
      <Mny k="Metode Bayar" v={o.pay === 'cod' ? 'COD (Uang Tunai)' : 'QRIS (Direct Split)'} />
      <Mny k="Total Diterima" v={rp(o.fee || (o.price * o.qty + (o.jasa || 0)))} b /></section>
    <section className="t-card"><h3>Titik Temu Serah Terima</h3>
      <div className="t-addr"><Ic n="pin" size={20} /><div><b>Titik Temu: {o.titikTemu || 'Gedung TI Kampus Unsoed'}</b><small>{o.buyerNote ? `Catatan: ${o.buyerNote}` : 'Sistem COD langsung di area kampus'}</small></div></div></section>
  </main>
  <footer className="co-bar solo"><button className="btn wide" onClick={accept}>Terima Pesanan</button></footer>
</>);

/* 3 */ const Rute = ({ o, accepted, back, go, accept }) => (<>
  <Bar title="Detail Lokasi & Rute" back={back} />
  <main className="scroll pad trip">
    <Place icon="store" name={o.store} addr={o.storeAddr} chip="Toko" />
    <MapView mode="rute" km={o.km} />
    <Place icon="house" name="Lokasi Pengantaran" addr={o.dest} />
    <div className="t-dist"><small>Jarak Total</small><b>{o.kmTotal} km (± {o.est} menit)</b></div>
  </main>
  <footer className="co-bar solo"><button className="btn wide" onClick={accepted ? () => go('ambil') : accept}>{accepted ? 'Mulai Perjalanan' : 'Terima Pesanan'}</button></footer>
</>);

/* 4 */ const Ambil = ({ o, back, go }) => {
  const t = useMemo(() => { const d = new Date(); return [hm(d), hm(new Date(d.getTime() + 4 * 60000))]; }, []);
  return (<>
    <Bar title="Konfirmasi Pengambilan Barang" back={back} />
    <main className="scroll pad trip">
      <section className="t-hero"><StoreOk /><h1>Barang berhasil diambil!</h1><p>Sekarang, lanjutkan ke lokasi pengantaran<br />dan pastikan barang sesuai dengan pesanan.</p></section>
      <ol className="t-card t-steps">
        <li><i className="t-dot"><Ic n="check" size={16} /></i><div><b>Tiba di Toko</b><small>{o.store}</small><small>{t[0]}</small></div></li>
        <li><i className="t-dot"><Ic n="check" size={16} /></i><div><b>Barang diambil</b><small>{o.qty} barang</small><small>{t[1]}</small></div></li>
        <li><i className="t-dot todo" /><div><b>Menuju Lokasi Pengantaran</b><small>{o.kmTotal} km • ± {o.est} menit</small></div></li>
      </ol>
    </main>
    <footer className="co-bar solo"><button className="btn wide" onClick={() => go('jalan')}>Lanjutkan Perjalanan</button></footer>
  </>);
};

/* 5 */ const Jalan = ({ o, back, go }) => (<>
  <Bar title="Dalam Perjalanan" back={back} />
  <main className="scroll pad trip">
    <Place icon="house" name="Menuju Lokasi Pengantaran" addr={o.dest} onClick={() => go('tiba')} />
    <MapView mode="jalan" left={(o.kmTotal * 0.78).toFixed(1)} eta={Math.max(1, Math.round(o.est * 0.6))} />
    <section className="t-card"><div className="t-buyer"><Avatar /><div><b>{o.buyer} (Pemesan)</b><small>{o.phone}</small></div></div>
      <a className="btn wide" href={tel(o.phone)}>Hubungi Pemesan</a></section>
    <Place icon="camera" name="Bukti Pengantaran" addr="Siapkan foto barang dan tanda terima saat tiba di lokasi." onClick={() => go('tiba')} />
  </main>
</>);

/* 6 */ const Tiba = ({ o, back, go }) => (<>
  <Bar title="Tiba di Lokasi" back={back} />
  <main className="scroll pad trip">
    <section className="t-hero"><BoxPin /><h1>Sudah sampai!</h1><p>Pastikan penerima dan barang sesuai<br />dengan pesanan sebelum konfirmasi.</p></section>
    <section className="t-card"><h3>Informasi Penerima</h3>
      <div className="t-buyer"><span className="t-av"><Ic n="user" size={26} /></span>
        <div><b>{o.buyer}</b><small>{o.phone}</small><small className="t-ad">{o.dest}</small>
          <button className="lnk t-map-l" onClick={back}><Ic n="pin" size={13} /> Lihat Peta</button></div></div></section>
  </main>
  <footer className="co-bar solo col">
    <a className="btn ghost wide" href={tel(o.phone)}><Ic n="call" size={16} />Hubungi Penerima</a>
    <button className="btn wide" onClick={() => go('bukti')}>Konfirmasi Barang Diterima</button>
  </footer>
</>);

function Sign({ signed, onChange }) {
  const cv = useRef(null), on = useRef(false);
  const pt = (e) => { const r = cv.current.getBoundingClientRect(); return [(e.clientX - r.left) * cv.current.width / r.width, (e.clientY - r.top) * cv.current.height / r.height]; };
  const down = (e) => { on.current = true; cv.current.setPointerCapture(e.pointerId); const c = cv.current.getContext('2d'); c.beginPath(); c.moveTo(...pt(e)); };
  const move = (e) => {
    if (!on.current) return;
    const c = cv.current.getContext('2d'); c.lineWidth = 3; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#0f2d5b';
    c.lineTo(...pt(e)); c.stroke(); if (!signed) onChange(true);
  };
  const clear = () => { cv.current.getContext('2d').clearRect(0, 0, 600, 240); onChange(false); };
  return (
    <div className="t-sign">
      {!signed && <span>Tanda tangan di sini</span>}
      <canvas ref={cv} width="600" height="240" aria-label="Kolom tanda tangan penerima" onPointerDown={down} onPointerMove={move} onPointerUp={() => (on.current = false)} onPointerCancel={() => (on.current = false)} />
      <button type="button" onClick={clear}>Hapus</button>
    </div>
  );
}

/* 7 */ const Bukti = ({ o, back, finish, say }) => {
  const [photos, setPhotos] = useState([]);
  const [cur, setCur] = useState(0);
  const [note, setNote] = useState('');
  const [signed, setSigned] = useState(false);
  const add = (e) => {
    const urls = [...e.target.files].slice(0, 3 - photos.length).map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls]); e.target.value = '';
  };
  const send = () => {
    if (!photos.length) return say('Tambahkan minimal 1 foto bukti');
    if (!signed) return say('Minta penerima menandatangani dulu');
    finish();
  };
  return (<>
    <Bar title="Unggah Bukti Pengantaran" back={back} />
    <main className="scroll pad trip">
      <div className="t-photo">{photos[cur] ? <img src={photos[cur]} alt="Foto bukti pengantaran" /> : <span>{ART[o.art]}<small>Belum ada foto</small></span>}</div>
      <div className="t-thumbs">
        {photos.map((u, i) => <button key={u} className={i === cur ? 'on' : ''} onClick={() => setCur(i)} aria-label={`Foto ${i + 1}`}><img src={u} alt="" /></button>)}
        {photos.length < 3 && <label className="t-slot" aria-label="Tambah foto"><Ic n="plus" size={18} /><input type="file" accept="image/*" capture="environment" multiple onChange={add} /></label>}
      </div>
      <label className="t-add"><Ic n="camera" size={22} /><b>Tambah Foto</b><small>(Maks. 3 foto)</small><input type="file" accept="image/*" capture="environment" multiple onChange={add} disabled={photos.length >= 3} /></label>
      <label className="t-lab" htmlFor="cat">Catatan (Opsional)</label>
      <input id="cat" className="t-note" placeholder="Contoh: Barang sudah diterima dengan baik." value={note} onChange={(e) => setNote(e.target.value)} />
      <span className="t-lab">Tanda Tangan Penerima</span>
      <Sign signed={signed} onChange={setSigned} />
    </main>
    <footer className="co-bar solo"><button className="btn wide" onClick={send}>Kirim Bukti</button></footer>
  </>);
};

/* 8 */ const Selesai = ({ o, exit }) => (
  <div className="okpage trip">
    <section className="t-hero plain"><DoneArt /><h1>Pesanan Selesai!</h1><p>Terima kasih sudah membantu<br />Justip berjalan dengan lancar.</p></section>
    <div className="t-body">
      <section className="t-card"><h3>Rincian Pembayaran</h3>
        <Mny k="Metode Bayar" v={o.pay === 'cod' ? 'COD (Uang Tunai)' : 'QRIS (Direct Split)'} />
        <Mny k="Titik Temu COD" v={o.titikTemu || 'Kampus Unsoed'} />
        <Mny k="Ongkir Kurir" v="Rp 0 (Bebas Ongkir)" />
        <Mny k="Total Transaksi" v={rp(o.total || o.fee)} b />
      </section>
      <div className="t-note-i">
        <span><Ic n="shield" size={22} /></span>
        {o.pay === 'cod'
          ? 'Pembeli membayar tunai di tempat. Fee layanan 2,5% disetor ke developer via QRIS saat menyelesaikan pesanan.'
          : 'Pembayaran QRIS pembeli otomatis di-split: 97,5% masuk ke rekening mitra & 2,5% masuk ke developer.'}
      </div>
    </div>
    <div className="ok-act">
      <button className="btn out wide" onClick={() => exit('Pesanan', 'selesai')}>Lihat Riwayat Pesanan</button>
      <button className="btn wide" onClick={() => exit('Beranda')}>Kembali ke Beranda</button>
    </div>
  </div>
);

export default function TripFlow({ step, ...p }) {
  const S = { notif: Notif, detail: Detail, rute: Rute, ambil: Ambil, jalan: Jalan, tiba: Tiba, bukti: Bukti, selesai: Selesai }[step];
  return <S {...p} />;
}
