import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { useJustip } from '../../context/JustipContext.jsx';

export default function PaymentPage({ co, back, onPay, say }) {
  const { qrisConfig, meetingPoints } = useJustip();
  const [method, setMethod] = useState(co.payId || 'qris');
  const [verifying, setVerifying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const selectedMp =
    meetingPoints.find((m) => m.id === co.selectedMpId) || meetingPoints[0];

  const handlePayQris = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setPaidSuccess(true);
      if (say) say(`Pembayaran QRIS ${rp(co.total)} berhasil diverifikasi!`);
      setTimeout(() => {
        onPay(true, 'QRIS');
      }, 1000);
    }, 1400);
  };

  const handlePayCod = () => {
    onPay(false, 'Bayar Tunai saat Ketemuan (COD)');
  };

  return (
    <>
      <header className="bar">
        <button className="icon-btn" onClick={back} aria-label="Kembali">
          <Ic n="back" />
        </button>
        <h2>Pembayaran</h2>
      </header>

      <main className="scroll pad">
        {/* Info Lokasi Ketemuan */}
        <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 12 }}>
          <small style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Titik Temu Serah Terima:</small>
          <b style={{ color: '#0f172a', fontSize: 13, display: 'block', marginTop: 1 }}>{selectedMp?.name}</b>
          <small style={{ color: '#0284c7', fontSize: 11, fontWeight: 600 }}>{selectedMp?.desc} {selectedMp?.time ? `· ${selectedMp.time}` : ''}</small>
        </div>

        {/* Total Tagihan Box */}
        <div style={{ background: '#f0f9ff', padding: '14px', borderRadius: 14, border: '1px solid #bae6fd', marginBottom: 14, textAlign: 'center' }}>
          <small style={{ color: '#0369a1', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Total Nominal Pembayaran
          </small>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>
            {rp(co.total)}
          </div>
          <small style={{ color: '#64748b', fontSize: 11 }}>
            Termasuk harga titipan & biaya layanan 2,5%
          </small>
        </div>

        {/* Pilihan Metode Pembayaran: Hanya QRIS & COD */}
        <div className="sec"><h3>Pilih Metode Pembayaran</h3></div>
        <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
          {/* 1. Opsi QRIS */}
          <button
            type="button"
            onClick={() => setMethod('qris')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 14,
              textAlign: 'left',
              background: method === 'qris' ? '#f0fdf4' : '#fff',
              border: method === 'qris' ? '1.5px solid #16a34a' : '1px solid var(--line)',
              boxShadow: method === 'qris' ? '0 0 0 3px rgba(22, 163, 74, .12)' : 'none',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#16a34a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              QRIS
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <b style={{ fontSize: 13.5, color: '#0f172a' }}>QRIS</b>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>
                  Rekomendasi
                </span>
              </div>
              <small style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 1 }}>
                Scan lewat BCA, GoPay, DANA, ShopeePay, Livin, dll.
              </small>
            </div>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: method === 'qris' ? '5px solid #16a34a' : '2px solid #cbd5e1',
                background: '#fff',
              }}
            />
          </button>

          {/* 2. Opsi COD */}
          <button
            type="button"
            onClick={() => setMethod('cod')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 14,
              textAlign: 'left',
              background: method === 'cod' ? '#fffbeb' : '#fff',
              border: method === 'cod' ? '1.5px solid #d97706' : '1px solid var(--line)',
              boxShadow: method === 'cod' ? '0 0 0 3px rgba(217, 119, 6, .12)' : 'none',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#fef3c7',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              💵
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <b style={{ fontSize: 13.5, color: '#0f172a' }}>Bayar Tunai di Tempat (COD)</b>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: '#fef3c7', color: '#92400e' }}>
                  Bebas Admin
                </span>
              </div>
              <small style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 1 }}>
                Bayar uang tunai langsung ke jastiper saat serah terima di kampus.
              </small>
            </div>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: method === 'cod' ? '5px solid #d97706' : '2px solid #cbd5e1',
                background: '#fff',
              }}
            />
          </button>
        </div>

        {/* TAMPILAN QRIS JASTIPER */}
        {method === 'qris' && (
          <section
            style={{
              background: '#fff',
              border: '1.5px solid #e2e8f0',
              borderRadius: 16,
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: '#e11d48' }}>QRIS</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#e0f2fe', color: '#0369a1' }}>
                  {qrisConfig.provider || 'DANA Bisnis'}
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#64748b' }}>Pembayaran Digital Nasional</span>
            </div>

            <b style={{ fontSize: 14, color: '#0f172a', display: 'block' }}>
              {qrisConfig.merchantName || 'JustTip - Hafiz Anggara'}
            </b>
            <small style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 2 }}>
              NMID: {qrisConfig.nmid || 'ID102403040012'} {qrisConfig.rekening ? `· ${qrisConfig.rekening}` : ''}
            </small>

            {/* QR Code Container */}
            <div
              style={{
                margin: '14px auto',
                width: 190,
                height: 190,
                background: '#fff',
                border: '2px solid #cbd5e1',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {qrisConfig.photo ? (
                <img
                  src={qrisConfig.photo}
                  alt="QRIS Jastiper"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <svg viewBox="0 0 160 160" width="170" height="170">
                  <rect width="160" height="160" fill="#fff" />
                  {/* Outer markers */}
                  <rect x="10" y="10" width="36" height="36" fill="#0f172a" rx="4" />
                  <rect x="16" y="16" width="24" height="24" fill="#fff" rx="2" />
                  <rect x="22" y="22" width="12" height="12" fill="#0f172a" rx="1" />

                  <rect x="114" y="10" width="36" height="36" fill="#0f172a" rx="4" />
                  <rect x="120" y="16" width="24" height="24" fill="#fff" rx="2" />
                  <rect x="126" y="22" width="12" height="12" fill="#0f172a" rx="1" />

                  <rect x="10" y="114" width="36" height="36" fill="#0f172a" rx="4" />
                  <rect x="16" y="120" width="24" height="24" fill="#fff" rx="2" />
                  <rect x="22" y="126" width="12" height="12" fill="#0f172a" rx="1" />

                  {/* QR Pattern dots */}
                  <g fill="#0f172a">
                    <rect x="54" y="12" width="8" height="8" />
                    <rect x="68" y="12" width="14" height="8" />
                    <rect x="88" y="12" width="8" height="8" />
                    <rect x="54" y="26" width="16" height="8" />
                    <rect x="76" y="26" width="8" height="8" />
                    <rect x="92" y="26" width="14" height="8" />
                    <rect x="54" y="40" width="8" height="8" />
                    <rect x="70" y="40" width="12" height="8" />
                    <rect x="90" y="40" width="16" height="8" />

                    <rect x="12" y="54" width="14" height="8" />
                    <rect x="34" y="54" width="8" height="8" />
                    <rect x="50" y="54" width="16" height="8" />
                    <rect x="74" y="54" width="8" height="8" />
                    <rect x="90" y="54" width="20" height="8" />
                    <rect x="120" y="54" width="26" height="8" />

                    <rect x="12" y="68" width="8" height="8" />
                    <rect x="28" y="68" width="14" height="8" />
                    <rect x="50" y="68" width="8" height="8" />
                    <rect x="66" y="68" width="22" height="8" />
                    <rect x="98" y="68" width="8" height="8" />
                    <rect x="114" y="68" width="16" height="8" />
                    <rect x="138" y="68" width="10" height="8" />

                    <rect x="12" y="82" width="20" height="8" />
                    <rect x="40" y="82" width="8" height="8" />
                    <rect x="56" y="82" width="16" height="8" />
                    <rect x="80" y="82" width="12" height="8" />
                    <rect x="100" y="82" width="20" height="8" />
                    <rect x="128" y="82" width="18" height="8" />

                    <rect x="12" y="96" width="8" height="8" />
                    <rect x="28" y="96" width="18" height="8" />
                    <rect x="54" y="96" width="8" height="8" />
                    <rect x="70" y="96" width="14" height="8" />
                    <rect x="92" y="96" width="10" height="8" />
                    <rect x="110" y="96" width="22" height="8" />
                    <rect x="140" y="96" width="8" height="8" />

                    <rect x="54" y="114" width="12" height="8" />
                    <rect x="74" y="114" width="18" height="8" />
                    <rect x="100" y="114" width="8" height="8" />
                    <rect x="116" y="114" width="16" height="8" />
                    <rect x="140" y="114" width="8" height="8" />

                    <rect x="54" y="128" width="16" height="8" />
                    <rect x="78" y="128" width="8" height="8" />
                    <rect x="94" y="128" width="20" height="8" />
                    <rect x="122" y="128" width="12" height="8" />
                    <rect x="142" y="128" width="8" height="8" />

                    <rect x="54" y="142" width="8" height="8" />
                    <rect x="70" y="142" width="14" height="8" />
                    <rect x="92" y="142" width="10" height="8" />
                    <rect x="110" y="142" width="16" height="8" />
                    <rect x="134" y="142" width="16" height="8" />
                  </g>
                  {/* Center QRIS logo badge */}
                  <rect x="66" y="66" width="28" height="28" fill="#fff" rx="4" />
                  <rect x="68" y="68" width="24" height="24" fill="#e11d48" rx="3" />
                  <text x="80" y="83" fill="#fff" fontSize="8" fontWeight="900" textAnchor="middle">QRIS</text>
                </svg>
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 10, fontSize: 11.5, color: '#475569', textAlign: 'left', lineHeight: 1.5 }}>
              <b>Petunjuk Pembayaran:</b><br />
              1. Buka aplikasi bank atau e-wallet kamu.<br />
              2. Scan QRIS di atas.<br />
              3. Pastikan nominal pembayaran pas <b>{rp(co.total)}</b>.<br />
              4. Setelah bayar di aplikasi bank, klik tombol konfirmasi di bawah.
            </div>

            {paidSuccess && (
              <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: '#dcfce7', border: '1px solid #86efac', color: '#166534', fontSize: 12, fontWeight: 700 }}>
                ✓ Pembayaran QRIS Berhasil Diverifikasi! Dana 100% langsung diterima di akun {qrisConfig.provider || 'DANA/SeaBank'} Jastiper.
              </div>
            )}
          </section>
        )}

        {/* TAMPILAN COD */}
        {method === 'cod' && (
          <section
            style={{
              background: '#fffbeb',
              border: '1.5px solid #fde68a',
              borderRadius: 16,
              padding: '14px',
              fontSize: 12,
              color: '#92400e',
              lineHeight: 1.5,
              marginBottom: 14,
            }}
          >
            <b style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
              💡 Panduan Bayar di Tempat (COD Kampus):
            </b>
            Kamu tidak perlu membayar sekarang. Siapkan uang tunai sebesar <b>{rp(co.total)}</b> saat bertemu dengan Jastiper di <b>{selectedMp?.name}</b>.
          </section>
        )}
      </main>

      <footer className="co-bar solo">
        {method === 'qris' ? (
          <button
            type="button"
            className="btn wide"
            disabled={verifying || paidSuccess}
            onClick={handlePayQris}
            style={{ padding: 13, fontSize: 13.5, fontWeight: 800, background: '#16a34a', borderColor: '#16a34a' }}
          >
            {verifying
              ? 'Memverifikasi Pembayaran QRIS...'
              : paidSuccess
              ? '✓ Pembayaran Berhasil'
              : 'Saya Sudah Bayar via QRIS'}
          </button>
        ) : (
          <button
            type="button"
            className="btn wide"
            onClick={handlePayCod}
            style={{ padding: 13, fontSize: 13.5, fontWeight: 800 }}
          >
            Konfirmasi Pesanan COD (Bayar saat Ketemu)
          </button>
        )}
      </footer>
    </>
  );
}
