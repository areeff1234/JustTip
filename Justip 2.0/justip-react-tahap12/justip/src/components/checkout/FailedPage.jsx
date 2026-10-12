import { rp } from '../ui.jsx';
import { CoHeader } from './parts.jsx';
import StateView from '../states/StateView.jsx';

export default function FailedPage({ f, retry, change, cart }) {
  return (
    <>
      <CoHeader title="Status Pembayaran" back={retry} />
      <main className="scroll pad">
        <StateView art="payfail" title="Pembayaran Gagal" text="Pesananmu belum dibuat dan belum ada dana yang terpotong. Kamu bisa mencoba lagi atau memakai metode lain." />
        <section className="st-card bad">
          <h3>Informasi Kegagalan</h3>
          <div className="st-row"><span>Metode</span><b>{f.method}</b></div>
          <div className="st-row"><span>Total</span><b>{rp(f.total)}</b></div>
          <div className="st-row"><span>Kode kesalahan</span><b>{f.code}</b></div>
          <p className="st-note">{f.reason}</p>
        </section>
        <p className="st-note">Barang di keranjangmu tetap tersimpan. Jika dana sudah terpotong, hubungi Pusat Bantuan dengan menyertakan kode kesalahan di atas.</p>
      </main>
      <footer className="co-bar solo col">
        <button className="btn wide" onClick={retry}>Coba Lagi</button>
        <button className="btn out wide" onClick={change}>Ganti Metode Pembayaran</button>
        <button className="lnk" onClick={cart}>Kembali ke Checkout</button>
      </footer>
    </>
  );
}
