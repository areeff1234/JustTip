import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { title } from '../../data.js';
import { ORDER_STAGES, useJustip } from '../../context/JustipContext.jsx';

export default function JustipperOrderDetail({ o, back, onChat, onUpdateStage, say }) {
  if (!o) return null;

  const { balance, developerQris, qrisConfig } = useJustip();
  const [customNote, setCustomNote] = useState('');
  const [showManualSelect, setShowManualSelect] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [qrisDevActive, setQrisDevActive] = useState(false);

  const isDone = o.status === 'selesai' || o.stage === 'selesai';
  const isNew = o.status === 'baru' && o.stage !== 'selesai' && (!o.stage || o.stage === 'baru');
  const isQris = (o.method || '').toLowerCase().includes('qris');

  const subtotal = o.subtotal || (o.price * (o.qty || 1)) || 0;
  const platformFee = o.platformFee != null ? o.platformFee : Math.min(5000, Math.round(subtotal * 0.025));
  const pgFeeDev = Math.round(platformFee * 0.007);

  // Normalisasi stage
  const rawStage = o.stage || (isDone ? 'selesai' : isNew ? 'baru' : 'diterima');
  const curStage = rawStage === 'perjalanan' ? 'antar' : rawStage;

  const STAGES = [
    { id: 'diterima', num: 1, label: '1. Terima Pesanan', badge: 'Diterima', icon: 'check', desc: 'Jastiper mengonfirmasi siap membelikan titipan' },
    { id: 'belanja', num: 2, label: '2. Membelikan Produk', badge: 'Membelikan', icon: 'bag', desc: 'Jastiper sedang membeli barang di toko asal' },
    { id: 'antar', num: 3, label: '3. Antar', badge: 'Antar', icon: 'scooter', desc: 'Barang sedang dibawa diantar menuju kampus' },
    { id: 'tiba', num: 4, label: '4. Sampai Tujuan COD', badge: 'Sampai COD', icon: 'pin', desc: 'Jastiper sudah sampai di titik temu COD, siap ketemuan' },
    { id: 'selesai', num: 5, label: '5. Selesai', badge: 'Selesai', icon: 'shield', desc: 'Barang sudah diserahkan ke pembeli & transaksi selesai' },
  ];

  // Cari index progress aktif (0 untuk baru, 1 untuk diterima, dst)
  const stageIndexMap = { baru: 0, diterima: 1, belanja: 2, antar: 3, perjalanan: 3, tiba: 4, selesai: 5 };
  const currentStepNum = stageIndexMap[curStage] ?? 0;

  const telUrl = o.phone ? `tel:${o.phone.replace(/[\s-]/g, '')}` : 'tel:081234567890';

  // Logika Tombol Tahap Berurutan
  const getNextStageInfo = () => {
    switch (curStage) {
      case 'baru':
        return {
          next: 'diterima',
          stepNum: 1,
          btnText: '✓ 1. Terima Pesanan Ini',
          title: 'Terima Pesanan',
          desc: 'Konfirmasi bahwa kamu menyetujui dan siap membelikan pesanan ini.',
          color: '#0284c7',
          bg: '#e0f2fe',
        };
      case 'diterima':
        return {
          next: 'belanja',
          stepNum: 2,
          btnText: '🛍️ 2. Mulai Membelikan Produk',
          title: 'Membelikan Produk',
          desc: 'Beri tahu pembeli bahwa kamu sedang berada di toko membelikan barangnya.',
          color: '#0284c7',
          bg: '#e0f2fe',
        };
      case 'belanja':
        return {
          next: 'antar',
          stepNum: 3,
          btnText: '🛵 3. Mulai Antar ke Kampus',
          title: 'Antar Pesanan',
          desc: 'Barang sudah berhasil dibeli! Sekarang mulai bawa dan antar menuju kampus.',
          color: '#4338ca',
          bg: '#e0e7ff',
        };
      case 'antar':
        return {
          next: 'tiba',
          stepNum: 4,
          btnText: '📍 4. Sudah Sampai di Tujuan COD',
          title: 'Sampai Tujuan COD',
          desc: 'Kamu sudah tiba di titik temu kampus. Pembeli akan bersiap menemui kamu.',
          color: '#059669',
          bg: '#d1fae5',
        };
      case 'tiba':
        return {
          next: 'selesai',
          stepNum: 5,
          btnText: '✅ 5. Selesaikan Pesanan (Serah Terima Berhasil)',
          title: 'Selesai',
          desc: isQris
            ? 'Barang sudah diserahkan. Uang 100% di akun tokomu. Silakan setor komisi dev 2,5%.'
            : 'Barang sudah diserahkan. Uang tunai COD sudah kamu terima utuh. Silakan setor komisi dev 2,5%.',
          color: '#16a34a',
          bg: '#dcfce7',
        };
      default:
        return null;
    }
  };

  const nextAction = getNextStageInfo();

  const handleAdvance = (targetStage, customDesc) => {
    const stageId = targetStage || nextAction?.next;
    if (!stageId) return;

    // Skenario 1: Mitra memegang 100% uang belanja (lewat QRIS toko atau tunai COD).
    // Saat menyelesaikan pesanan, mitra menyetorkan komisi 2,5% ke QRIS Developer.
    if (stageId === 'selesai') {
      setShowFeeModal(true);
      return;
    }

    if (onUpdateStage) {
      onUpdateStage(o.id, stageId, customDesc || '');
    }
    if (say) {
      const targetObj = STAGES.find((s) => s.id === stageId);
      say(`Tahap diperbarui: ${targetObj?.label || stageId}`);
    }
  };

  const handleConfirmPayFeeQris = () => {
    if (onUpdateStage) {
      onUpdateStage(
        o.id,
        'selesai',
        `Pesanan selesai. Fee platform dibayar via QRIS Developer (Biaya PG 0,7% = Rp ${pgFeeDev}).`,
        'qris_dev'
      );
    }
    setShowFeeModal(false);
    setQrisDevActive(false);
    if (say) say('Pesanan selesai! Pembayaran fee platform via QRIS Developer dikonfirmasi.');
  };

  const it = o.items?.[0] || o;

  return (
    <>
      <header className="bar">
        <button className="icon-btn" onClick={back} aria-label="Kembali">
          <Ic n="back" />
        </button>
        <h2>Alur Pesanan Jastiper</h2>
      </header>

      <main className="scroll pad trip" style={{ paddingBottom: 90 }}>
        {/* Header Nomor Pesanan & Tag */}
        <section className="t-head" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <b style={{ fontSize: 16 }}>{o.no}</b>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: 8,
                background: isDone ? '#dcfce7' : currentStepNum > 0 ? '#e0f2fe' : '#fef3c7',
                color: isDone ? '#166534' : currentStepNum > 0 ? '#0369a1' : '#92400e',
              }}
            >
              {isDone
                ? '5. Selesai'
                : currentStepNum > 0
                ? `${STAGES[currentStepNum - 1]?.label}`
                : 'Menunggu Diterima'}
            </span>
          </div>
          <small style={{ color: '#64748b' }}>Waktu order: {o.date || 'Hari ini'}</small>
        </section>

        {/* ======================================================== */}
        {/* STEPPER BERTAHAP & BERURUTAN (5 TAHAPAN PASTI) */}
        {/* ======================================================== */}
        <section
          className="t-card"
          style={{
            padding: '16px 14px',
            marginBottom: 14,
            border: '1.5px solid #bae6fd',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(2, 132, 199, .06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Ic n="shield" size={15} /> Alur Tahapan Jastip
            </h3>
            <span style={{ fontSize: 11, fontWeight: 700, color: currentStepNum === 5 ? '#16a34a' : '#0284c7' }}>
              Tahap {currentStepNum} dari 5
            </span>
          </div>

          {/* Timeline Bar Visual */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', marginBottom: 16 }}>
            {/* Garis konektor */}
            <div
              style={{
                position: 'absolute',
                top: 13,
                left: '10%',
                right: '10%',
                height: 3,
                background: '#e2e8f0',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: '#16a34a',
                  width: `${Math.min(100, Math.max(0, ((currentStepNum - 1) / 4) * 100))}%`,
                  transition: 'width .3s ease',
                }}
              />
            </div>

            {STAGES.map((s) => {
              const isPassed = currentStepNum > s.num;
              const isCurrent = currentStepNum === s.num;
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 2,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: isPassed ? '#16a34a' : isCurrent ? '#0284c7' : '#f1f5f9',
                      border: isCurrent ? '2px solid #38bdf8' : isPassed ? '2px solid #16a34a' : '2px solid #cbd5e1',
                      color: isPassed || isCurrent ? '#fff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      boxShadow: isCurrent ? '0 0 0 4px rgba(2, 132, 199, .18)' : 'none',
                      transition: 'all .2s ease',
                    }}
                  >
                    {isPassed ? '✓' : s.num}
                  </div>
                  <span
                    style={{
                      fontSize: 9.5,
                      lineHeight: 1.2,
                      marginTop: 6,
                      fontWeight: isCurrent ? 800 : isPassed ? 700 : 500,
                      color: isCurrent ? '#0284c7' : isPassed ? '#166534' : '#64748b',
                    }}
                  >
                    {s.badge}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Kotak Panduan Langkah Saat Ini & Tombol Update Cepat */}
          {!isDone && nextAction && (
            <div
              style={{
                background: nextAction.bg,
                border: `1.5px solid ${nextAction.color}33`,
                borderRadius: 12,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: nextAction.color,
                    color: '#fff',
                  }}
                >
                  Langkah Selanjutnya
                </span>
                <b style={{ fontSize: 13, color: nextAction.color }}>{nextAction.title}</b>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 11.5, color: '#334155', lineHeight: 1.45 }}>
                {nextAction.desc}
              </p>

              <button
                type="button"
                className="btn wide"
                onClick={() => handleAdvance()}
                style={{
                  background: nextAction.color,
                  borderColor: nextAction.color,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13,
                  padding: '10px 14px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, .2)',
                }}
              >
                {nextAction.btnText}
              </button>
            </div>
          )}

          {/* Jika Pesanan Sudah Selesai */}
          {isDone && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: 12,
                padding: '12px 14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
              <b style={{ fontSize: 14, color: '#166534', display: 'block' }}>
                Pesanan Ini Telah Selesai!
              </b>
              <p style={{ margin: '4px 0 0', fontSize: 11.5, color: '#15803d', lineHeight: 1.4 }}>
                Serah terima barang di titik temu kampus sukses dilakukan. Terima kasih sudah membantu pembeli kampus!
              </p>
            </div>
          )}

          {/* Toggle Ubah Manual jika Jastiper mau loncat tahap */}
          {!isDone && (
            <div style={{ marginTop: 10, textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowManualSelect(!showManualSelect)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 11,
                  color: '#64748b',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 2,
                }}
              >
                {showManualSelect ? 'Sembunyikan Opsi Manual' : '⚙️ Pilih tahap secara manual'}
              </button>

              {showManualSelect && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        handleAdvance(s.id);
                        setShowManualSelect(false);
                      }}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: curStage === s.id ? 800 : 600,
                        border: '1px solid',
                        borderColor: curStage === s.id ? '#0284c7' : '#cbd5e1',
                        background: curStage === s.id ? '#e0f2fe' : '#fff',
                        color: curStage === s.id ? '#0284c7' : '#475569',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* INFORMASI PEMESAN & KONTAK LANGSUNG */}
        {/* ======================================================== */}
        <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
            Informasi Pembeli
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <b style={{ fontSize: 14, color: '#0f172a', display: 'block' }}>{o.buyer || 'Nur Arif'}</b>
              <small style={{ color: '#64748b', fontSize: 11.5 }}>{o.phone || '+62 812 3456 7890'}</small>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className="btn sm out"
                onClick={() => onChat && onChat(o)}
                style={{ padding: '6px 10px', fontSize: 11.5, fontWeight: 700 }}
              >
                <Ic n="chat" size={14} /> Chat
              </button>
              <a
                href={telUrl}
                className="btn sm out"
                style={{ padding: '6px 10px', fontSize: 11.5, fontWeight: 700, textDecoration: 'none' }}
              >
                <Ic n="call" size={14} /> Telepon
              </a>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* TITIK TEMU COD KAMPUS */}
        {/* ======================================================== */}
        <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
            Lokasi Titik Temu COD Kampus
          </h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Ic n="pin" size={18} />
            </span>
            <div>
              <b style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>
                {o.dest || o.to || 'Gedung TI Kampus Unsoed (Lantai 1)'}
              </b>
              <small style={{ color: '#0284c7', fontSize: 11, fontWeight: 600, display: 'block', marginTop: 1 }}>
                Sistem COD Mahasiswa · Bebas Ongkir Ekspedisi
              </small>
              {o.notes && (
                <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0', marginTop: 6, fontSize: 11, color: '#475569' }}>
                  <b>Catatan dari Pembeli:</b> {o.notes}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* BARANG TITIPAN YANG HARUS DIBELI */}
        {/* ======================================================== */}
        <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
            Barang yang Dibelikan
          </h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span
              style={{
                width: 54,
                height: 54,
                borderRadius: 10,
                background: '#f8fafc',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {ART[it?.art || o.art || 'box']}
            </span>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 13, color: '#0f172a', display: 'block', lineHeight: 1.3 }}>
                {title(it) || it?.name || o.name}
              </b>
              <small style={{ color: '#64748b', fontSize: 11, display: 'block', marginTop: 1 }}>
                Toko Asal: {o.storeAddr || o.store || 'Toko Resmi'}
              </small>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <b style={{ color: '#0284c7', fontSize: 13 }}>{rp(it?.price || o.price)}</b>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
                  Qty: {it?.qty || o.qty || 1} barang
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* STATUS KAS & METODE PEMBAYARAN */}
        {/* ======================================================== */}
        <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
            Status Kas & Pembayaran
          </h3>

          {/* Status Kas & Pembayaran */}
          {isQris ? (
            <div
              style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: 12,
                padding: 12,
                fontSize: 12,
                color: '#166534',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <b style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                  <Ic n="check" size={16} /> Lunas via QRIS Toko Kamu ({qrisConfig?.provider || 'DANA Bisnis'})
                </b>
                <b style={{ fontSize: 15, color: '#166534' }}>+{rp(o.total)}</b>
              </div>
              <div style={{ background: '#fff', padding: '8px 10px', borderRadius: 8, border: '1px solid #bbf7d0', marginBottom: 6, fontSize: 11.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span>Uang Masuk ke Akun Toko (100%):</span>
                  <b style={{ color: '#166534' }}>+{rp(o.total)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span>Hak Bersih Mitra Jastiper (97,5%):</span>
                  <b style={{ color: '#0369a1' }}>{rp(o.total - platformFee)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Komisi Developer (2,5%):</span>
                  <b style={{ color: '#0284c7' }}>{rp(platformFee)}</b>
                </div>
              </div>
              <small style={{ fontSize: 11, display: 'block', color: '#15803d' }}>
                ✓ Uang pembeli 100% langsung masuk ke e-wallet {qrisConfig?.provider || 'DANA'} kamu! Komisi dev 2,5% disetor via QRIS Developer saat pesanan diselesaikan.
              </small>
            </div>
          ) : (
            <div
              style={{
                background: '#fffbeb',
                border: '1.5px solid #fde68a',
                borderRadius: 12,
                padding: 12,
                fontSize: 12,
                color: '#92400e',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <b>💵 Pembayaran Tunai COD:</b>
                <b style={{ fontSize: 15, color: '#b45309', fontWeight: 800 }}>+{rp(o.total)}</b>
              </div>
              <p style={{ margin: '2px 0 6px', fontSize: 11.5 }}>
                Uang tunai utuh sebesar <b>{rp(o.total)}</b> diterima langsung di tanganmu saat serah terima di kampus.
              </p>
              <div style={{ background: '#fef3c7', padding: '6px 8px', borderRadius: 6, fontSize: 11, color: '#b45309' }}>
                Komisi developer 2,5% (<b>{rp(platformFee)}</b>) dibayar langsung lewat scan <b>QRIS Developer</b> saat menyelesaikan pesanan (tanpa sistem saldo).
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ======================================================== */}
      {/* FOOTER BAR DENGAN TOMBOL TAHAP BERIKUTNYA */}
      {/* ======================================================== */}
      <footer className="co-bar solo">
        {!isDone && nextAction ? (
          <button
            type="button"
            className="btn wide"
            onClick={() => handleAdvance()}
            style={{
              background: nextAction.color,
              borderColor: nextAction.color,
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 800,
              padding: '12px 14px',
            }}
          >
            {nextAction.btnText}
          </button>
        ) : (
          <button
            type="button"
            className="btn wide out"
            onClick={back}
            style={{ fontSize: 13, fontWeight: 700 }}
          >
            Kembali ke Daftar Pesanan
          </button>
        )}
      </footer>

      {/* ======================================================== */}
      {/* MODAL TAGIHAN & PEMBAYARAN FEE PLATFORM (COD via QRIS DEV) */}
      {/* ======================================================== */}
      {showFeeModal && (
        <div
          className="dlg"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowFeeModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 360,
              width: '92%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#fff',
              borderRadius: 16,
              padding: '18px 16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#fef3c7',
                color: '#b45309',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 8px',
              }}
            >
              <Ic n="shield" size={24} />
            </div>

            <b style={{ fontSize: 15, color: '#0f172a', display: 'block' }}>
              Setor Komisi Developer 2,5% (Skenario 1)
            </b>
            <p style={{ fontSize: 11.5, color: '#64748b', margin: '4px 0 10px', lineHeight: 1.4 }}>
              {isQris
                ? `Pembeli telah mentransfer penuh +${rp(o.total)} ke QRIS tokomu (${qrisConfig?.provider || 'DANA/SeaBank'}). Silakan transfer komisi developer 2,5% (${rp(platformFee)}) ke QRIS Developer berikut:`
                : `Kamu telah menerima uang tunai penuh +${rp(o.total)} dari pembeli di lokasi COD. Silakan transfer komisi developer 2,5% (${rp(platformFee)}) ke QRIS Developer berikut:`}
            </p>

            {/* Rincian Box */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '10px 12px',
                marginBottom: 12,
                fontSize: 12,
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Total Diterima Mitra ({isQris ? 'QRIS Toko' : 'Tunai COD'}):</span>
                <b style={{ color: '#16a34a' }}>+{rp(o.total)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Hak Bersih Mitra Jastiper (97,5%):</span>
                <b style={{ color: '#0369a1' }}>{rp(o.total - platformFee)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Komisi Developer (2,5%):</span>
                <b style={{ color: '#0284c7' }}>{rp(platformFee)}</b>
              </div>
            </div>

            {/* QR Code Panel Developer */}
            <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 2 }}>
                <b style={{ fontSize: 13, color: '#0369a1' }}>
                  {developerQris?.merchantName || 'JustTip Official Developer (Bitforce TI-A)'}
                </b>
                <span style={{ fontSize: 10, background: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                  {developerQris?.provider || 'DANA Dev'}
                </span>
              </div>
              <small style={{ fontSize: 10.5, color: '#64748b', display: 'block' }}>
                NMID: {developerQris?.nmid || 'ID102403040001'} {developerQris?.rekening ? `· ${developerQris.rekening}` : ''}
              </small>

              {/* QR Code SVG */}
              <div
                style={{
                  margin: '10px auto',
                  width: 140,
                  height: 140,
                  background: '#fff',
                  padding: 8,
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <rect width="100" height="100" fill="#fff" />
                  <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                  <rect x="15" y="15" width="15" height="15" fill="#fff" />
                  <rect x="18" y="18" width="9" height="9" fill="#0f172a" />
                  <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                  <rect x="70" y="15" width="15" height="15" fill="#fff" />
                  <rect x="73" y="18" width="9" height="9" fill="#0f172a" />
                  <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                  <rect x="15" y="70" width="15" height="15" fill="#fff" />
                  <rect x="18" y="73" width="9" height="9" fill="#0f172a" />
                  <circle cx="50" cy="50" r="10" fill="#0284c7" />
                </svg>
              </div>

              <div style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', marginBottom: 2 }}>
                {rp(platformFee)}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: '#b45309',
                  background: '#fef3c7',
                  padding: '2px 6px',
                  borderRadius: 4,
                  display: 'inline-block',
                  marginBottom: 10,
                  fontWeight: 600,
                }}
              >
                ⚠️ Ada Biaya PG 0,7% (-{rp(pgFeeDev)}) sistem perbankan QRIS
              </div>

              <button
                type="button"
                className="btn wide"
                onClick={handleConfirmPayFeeQris}
                style={{ fontSize: 12.5, fontWeight: 800, background: '#0284c7', borderColor: '#0284c7', marginBottom: 6 }}
              >
                ✓ Konfirmasi Sudah Transfer QRIS Developer
              </button>
            </div>

            <button
              type="button"
              className="btn wide out"
              onClick={() => setShowFeeModal(false)}
              style={{ marginTop: 10, fontSize: 11.5 }}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  );
}
