import { Ic, rp } from '../ui.jsx';

export default function SuccessPage({ order, onDetail, onHome, say }) {
  const copy = () => { navigator.clipboard?.writeText(order.no).catch(() => {}); say('Nomor pesanan disalin'); };
  const isPaid = order.paid;

  return (
    <div className="okpage">
      <div className="ok-top">
        <i className="sp s1" /><i className="sp s2" /><i className="sp s3" /><i className="sp s4" />
        <span className="okc"><svg viewBox="0 0 52 52"><path d="M14 27l8 8 16-17" fill="none" stroke="#2fa9f0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        <h1>{isPaid ? 'Pembayaran QRIS Berhasil!' : 'Pesanan COD Berhasil!'}</h1>
        <p>
          {isPaid
            ? 'Pembayaran QRIS lunas terverifikasi. Jastiper akan segera membelikan titipanmu.'
            : 'Pesanan telah masuk. Siapkan uang tunai pas saat serah terima di kampus.'}
        </p>
      </div>
      <div className="okcard">
        <div><small>No. Pesanan</small><b>{order.no}</b><button onClick={copy} aria-label="Salin nomor pesanan"><Ic n="copy" size={18} /></button></div>
        <div><small>Lokasi Titik Temu Kampus</small><b style={{ fontSize: 13, color: '#0284c7' }}>{order.dest || 'Gedung TI Kampus Unsoed'}</b></div>
        <div><small>Metode Pembayaran</small><b>{order.method || (isPaid ? 'QRIS' : 'COD')}</b></div>
        <div><small>Total Tagihan</small><b className="big">{rp(order.total)}</b></div>
      </div>
      <div className="ok-act">
        <button className="btn wide" onClick={onDetail}>Lihat Detail & Tracking Pesanan</button>
        <button className="btn out wide" onClick={onHome}>Kembali ke Beranda</button>
      </div>
    </div>
  );
}
