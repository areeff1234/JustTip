import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { title } from '../../data.js';
import { Bar } from '../account/parts.jsx';
import { Radio } from '../checkout/parts.jsx';
import StateView from '../states/StateView.jsx';
import { ORDER_STAGES } from '../../context/JustipContext.jsx';

const REASONS = [
  'Salah pilih barang atau ukuran',
  'Ingin ubah titik temu ketemuan',
  'Menemukan harga lebih murah',
  'Tidak jadi menitip',
  'Alasan lain',
];

const Row = ({ k, v, bold, green }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, marginBottom: 5 }}>
    <span style={{ color: '#64748b' }}>{k}</span>
    <b style={{ color: green ? '#16a34a' : '#0f172a', fontWeight: bold ? 800 : 600 }}>{v}</b>
  </div>
);

function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Tepat Waktu', 'Barang Aman']);
  const TAG_OPTIONS = ['Tepat Waktu', 'Barang Aman', 'Ramah', 'Komunikatif'];

  const toggleTag = (t) => {
    setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleSend = () => {
    onSubmit({
      rating,
      comment: comment.trim(),
      tags: selectedTags,
    });
  };

  return (
    <section className="t-card" style={{ padding: 14, marginBottom: 12, background: '#fffbeb', border: '1.5px solid #fde68a' }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 13, color: '#92400e', display: 'flex', alignItems: 'center', gap: 6 }}>
        ⭐ Kasih Ulasan Buat Jastiper
      </h3>
      <p style={{ margin: '0 0 10px', fontSize: 11.5, color: '#b45309', lineHeight: 1.4 }}>
        Gimana pengalaman kamu titip barang? Ulasan kamu sangat membantu reputasi teman jastiper di kampus.
      </p>

      {/* Star Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 24,
                color: s <= rating ? '#f59e0b' : '#cbd5e1',
                padding: '0 2px',
              }}
            >
              ★
            </button>
          ))}
        </div>
        <b style={{ fontSize: 13, color: '#b45309' }}>{rating} / 5 Bintang</b>
      </div>

      {/* Tag Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {TAG_OPTIONS.map((tag) => {
          const on = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              style={{
                padding: '4px 9px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                border: '1px solid',
                borderColor: on ? '#f59e0b' : '#e2e8f0',
                background: on ? '#fef3c7' : '#fff',
                color: on ? '#92400e' : '#64748b',
                cursor: 'pointer',
              }}
            >
              {on ? '✓ ' : '+ '}
              {tag}
            </button>
          );
        })}
      </div>

      <textarea
        placeholder="Tulis ulasan singkat di sini..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, outline: 'none', resize: 'none', marginBottom: 10 }}
      />

      <button
        type="button"
        className="btn sm wide"
        onClick={handleSend}
        style={{ padding: '9px 12px', fontSize: 12.5, fontWeight: 800, background: '#d97706', borderColor: '#d97706' }}
      >
        Kirim Ulasan
      </button>
    </section>
  );
}

export default function OrderDetail({ o, back, cancel, say, onChat, onReview }) {
  const [dlg, setDlg] = useState(false);
  const [why, setWhy] = useState('');

  if (!o) return null;

  const batal = o.status === 'batal';
  const c = o.cancel;

  const isDone = o.status === 'selesai' || o.stage === 'selesai';
  const isNew = o.status === 'baru' && !isDone;
  const isQris = (o.method || '').toLowerCase().includes('qris');

  const normStage = (s) => (s === 'perjalanan' ? 'antar' : s || 'baru');
  const curStage = normStage(o.stage || (isDone ? 'selesai' : isNew ? 'baru' : 'diterima'));
  const STAGE_KEYS = ['diterima', 'belanja', 'antar', 'tiba', 'selesai'];
  const curStageIndex = STAGE_KEYS.indexOf(curStage);

  const telUrl = o.justipperPhone ? `tel:${o.justipperPhone.replace(/[\s-]/g, '')}` : 'tel:081322004411';
  const subtotal = o.subtotal || (o.price * (o.qty || 1)) || 0;
  const jasa = o.jasa || o.jastipFee || 15000;
  const platformFee = o.platformFee != null ? o.platformFee : Math.min(5000, Math.round(subtotal * 0.025));
  const insuranceFee = o.insurance ? (o.insuranceFee ?? 2000) : 0;
  const totalTagihan = o.total || (subtotal + jasa + platformFee + insuranceFee);

  // Status banner context berurutan
  const getBannerConfig = () => {
    switch (curStage) {
      case 'selesai':
        return {
          bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', badgeBg: '#dcfce7',
          badge: '✓ 5. Selesai', title: 'Barang Sudah Diterima!',
          desc: 'Serah terima di titik temu kampus sudah selesai. Transaksi sukses!',
        };
      case 'tiba':
        return {
          bg: '#ecfdf5', border: '#a7f3d0', color: '#065f46', badgeBg: '#d1fae5',
          badge: '📍 4. Sampai Tujuan COD', title: 'Jastiper Sudah Tiba di Titik Temu',
          desc: `Jastiper ${o.justipper || 'Hafiz'} sudah sampai di ${o.dest || 'titik temu kampus'}. Silakan temui jastiper ya!`,
        };
      case 'antar':
        return {
          bg: '#eef2ff', border: '#c7d2fe', color: '#3730a3', badgeBg: '#e0e7ff',
          badge: '🛵 3. Sedang Diantar', title: 'Jastiper Menuju Kampus',
          desc: `Barang sudah dibeli dan sekarang sedang diantar ${o.justipper || 'Hafiz'} menuju kampus.`,
        };
      case 'belanja':
        return {
          bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1', badgeBg: '#e0f2fe',
          badge: '🛍️ 2. Membelikan Produk', title: 'Jastiper Berada di Toko',
          desc: `Jastiper sedang membelikan barang titipanmu di ${o.storeAddr || o.store || 'toko asal'}.`,
        };
      case 'diterima':
        return {
          bg: '#f0fdfa', border: '#99f6e4', color: '#115e59', badgeBg: '#ccfbf1',
          badge: '✓ 1. Pesanan Diterima', title: 'Jastiper Siap Berangkat Belanja',
          desc: `${o.justipper || 'Hafiz'} sudah menyetujui pesanan dan bersiap membelikan titipanmu.`,
        };
      case 'baru':
      default:
        return {
          bg: '#fffbeb', border: '#fde68a', color: '#92400e', badgeBg: '#fef3c7',
          badge: '⏳ Menunggu Konfirmasi', title: 'Pesanan Masuk ke Jastiper',
          desc: `Menunggu jastiper ${o.justipper || 'Hafiz Anggara'} memeriksa & menerima pesananmu.`,
        };
    }
  };

  const banner = getBannerConfig();

  return (
    <>
      <Bar title="Detail Pesanan" back={back} />
      <main className="scroll pad trip">
        {/* Banner Status */}
        {batal ? (
          <StateView art="cancel" title="Pesanan Dibatalkan" text={`${o.no} dibatalkan.`} />
        ) : (
          <div style={{ background: banner.bg, border: `1px solid ${banner.border}`, borderRadius: 14, padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: banner.badgeBg, color: banner.color }}>
                {banner.badge}
              </span>
              <small style={{ color: '#64748b', fontSize: 11 }}>{o.date}</small>
            </div>
            <b style={{ fontSize: 14, color: banner.color, display: 'block' }}>{banner.title}</b>
            <p style={{ margin: '3px 0 0', fontSize: 11.5, color: banner.color, lineHeight: 1.4 }}>
              {banner.desc}
            </p>
          </div>
        )}

        {/* Stepper Tracking Tahapan Pesanan */}
        {!batal && (
          <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
                Status Titipan
              </h3>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0284c7' }}>
                {ORDER_STAGES.find((s) => s.id === curStage)?.label || 'Dalam Proses'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: 10 }}>
              {ORDER_STAGES.map((s, idx) => {
                const isPassed = curStageIndex > idx;
                const isCurrent = curStageIndex === idx;
                return (
                  <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: isPassed ? '#16a34a' : isCurrent ? '#0284c7' : '#cbd5e1',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      boxShadow: isCurrent ? '0 0 0 3px rgba(2, 132, 199, 0.2)' : 'none',
                    }}>
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span style={{ fontSize: 9.5, color: isCurrent ? '#0284c7' : isPassed ? '#0f172a' : '#94a3b8', fontWeight: isCurrent ? 800 : isPassed ? 700 : 500, marginTop: 4, textAlign: 'center' }}>
                      {s.badge}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Riwayat Linimasa Pesanan */}
            {o.timeline && o.timeline.length > 0 && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                {o.timeline.slice(-2).reverse().map((tl, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, color: '#475569', marginBottom: 3 }}>
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>•</span>
                    <span style={{ flex: 1 }}>{tl.desc}</span>
                    <span style={{ color: '#94a3b8', fontSize: 10 }}>{tl.time}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Ulasan & Rating Mitra */}
        {isDone && !batal && (
          o.review ? (
            <section className="t-card" style={{ padding: 14, marginBottom: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontSize: 13, color: '#166534' }}>
                  ⭐ Ulasan Kamu
                </h3>
                <span style={{ fontSize: 11, color: '#64748b' }}>{o.review.date}</span>
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: s <= o.review.rating ? '#eab308' : '#cbd5e1', fontSize: 16 }}>★</span>
                ))}
              </div>
              {o.review.tags && o.review.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {o.review.tags.map((t) => (
                    <span key={t} style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#dcfce7', color: '#166534' }}>
                      ✓ {t}
                    </span>
                  ))}
                </div>
              )}
              {o.review.comment && (
                <p style={{ margin: 0, fontSize: 12, color: '#334155', fontStyle: 'italic' }}>"{o.review.comment}"</p>
              )}
            </section>
          ) : (
            <ReviewForm onSubmit={onReview} />
          )
        )}

        {/* Profil Jastiper */}
        <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
              Jastiper Kamu
            </h3>
            <span style={{ fontSize: 10.5, background: '#dcfce7', color: '#166534', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
              ✓ Mahasiswa TI
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#0284c7',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              flexShrink: 0,
            }}>
              {o.justipper ? o.justipper.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'HA'}
            </div>
            <div>
              <b style={{ fontSize: 14, color: '#0f172a', display: 'block' }}>{o.justipper || 'Hafiz Anggara'}</b>
              <small style={{ color: '#0284c7', fontSize: 11.5, fontWeight: 600, display: 'block' }}>
                <Ic n="plane" size={11} /> {o.storeAddr || 'Yogyakarta ⇄ Purwokerto'}
              </small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn sm out"
              style={{ flex: 1, padding: '8px 10px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={() => onChat ? onChat(o) : say('Membuka chat jastiper...')}
            >
              <Ic n="chat" size={14} /> Chat Jastiper
            </button>
            <a
              href={telUrl}
              className="btn sm out"
              style={{ flex: 1, padding: '8px 10px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', color: 'inherit' }}
            >
              <Ic n="phone" size={14} /> WhatsApp
            </a>
          </div>
        </section>

        {/* Titik Temu di Kampus */}
        <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 12.5, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
            Titik Temu di Kampus (COD)
          </h3>
          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 10, marginBottom: 6, fontSize: 12 }}>
            <div style={{ color: '#475569', fontWeight: 700, marginBottom: 2 }}>
              <Ic n="pin" size={13} /> Lokasi Ketemuan:
            </div>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: 13 }}>{o.dest || 'Gedung TI Kampus Unsoed, Purwokerto'}</div>
            {o.meetingPoint?.time && (
              <small style={{ color: '#0284c7', fontWeight: 600, display: 'block', marginTop: 2 }}>
                ⏰ Jam Ketemuan: {o.meetingPoint.time}
              </small>
            )}
          </div>
          {o.notes && (
            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 4 }}>
              <b>Catatan Patokan:</b> "{o.notes}"
            </div>
          )}
        </section>

        {/* Barang Titipan */}
        <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
              Barang Titipan
            </h3>
            {o.isCustomRequest && (
              <span style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                ⭐ Titip Bebas
              </span>
            )}
          </div>

          {o.items && o.items.length > 0 ? (
            o.items.map(({ p, qty }, idx) => (
              <div className="cf-item" key={p?.id || idx} style={{ marginBottom: 8 }}>
                <span className="ci-img sm">{ART[p?.art || o.art || 'box']}</span>
                <div>
                  <small style={{ fontSize: 12, fontWeight: 700 }}>{title(p || { name: o.name })}</small>
                  <b style={{ color: '#0284c7' }}>{rp(p?.price || o.price)}</b>
                </div>
                <i>×{qty}</i>
              </div>
            ))
          ) : (
            <div className="cf-item">
              <span className="ci-img sm">{ART[o.art || 'box']}</span>
              <div>
                <small style={{ fontSize: 12, fontWeight: 700 }}>{o.name}</small>
                <b style={{ color: '#0284c7' }}>{rp(o.price)}</b>
              </div>
              <i>×{o.qty || 1}</i>
            </div>
          )}
        </section>

        {/* Rincian Pembayaran */}
        <section className="t-card" style={{ padding: 14, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 12.5, textTransform: 'uppercase', letterSpacing: 0.5, color: '#475569' }}>
            Rincian Pembayaran
          </h3>

          <Row k="Harga Barang Toko" v={rp(subtotal)} />
          <Row k="Jasa Titip Mitra" v={rp(jasa)} />
          <Row k="Ongkos Kirim" v="Gratis (COD Kampus)" green />
          <Row k="Biaya Layanan JustTip (2,5%)" v={rp(platformFee)} />
          {o.insurance && <Row k="Asuransi & Garansi Makanan" v={rp(insuranceFee)} green />}

          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 8, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <b style={{ fontSize: 13.5, color: '#0f172a' }}>Total Tagihan</b>
              <b style={{ fontSize: 16, color: '#0284c7' }}>{rp(totalTagihan)}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: 12 }}>
              <span style={{ color: '#64748b' }}>Metode Pembayaran</span>
              <b style={{ color: isQris ? '#16a34a' : '#d97706' }}>
                {o.method || (isQris ? 'QRIS' : 'COD')} {o.paid ? '(Lunas)' : '(Bayar saat Ketemu)'}
              </b>
            </div>
          </div>

          {/* Info Status Pembayaran */}
          {isQris ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 10, marginTop: 10, fontSize: 11.5, color: '#166534', lineHeight: 1.4 }}>
              <b>✓ Pembayaran QRIS Lunas:</b> Uang sebesar {rp(totalTagihan)} sudah berhasil diverifikasi (Split Payment otomatis 97,5% ke rekening Mitra &amp; 2,5% ke Developer).
            </div>
          ) : (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 10, marginTop: 10, fontSize: 11.5, color: '#92400e', lineHeight: 1.4 }}>
              <b>💵 Bayar Tunai (COD):</b> Siapkan uang tunai sebesar <b>{rp(totalTagihan)}</b> saat serah terima barang langsung dengan Jastiper di kampus.
            </div>
          )}
        </section>
      </main>

      {!batal && !isDone && (
        <footer className="co-bar solo">
          <button className="btn out wide" onClick={() => setDlg(true)}>
            Batalkan Titipan
          </button>
        </footer>
      )}

      {dlg && (
        <div className="dlg" role="dialog" aria-modal="true" onClick={() => setDlg(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <b>Batalkan titipan?</b>
            <p>Pilih alasan pembatalan titipan:</p>
            <div className="rs-list" role="radiogroup">
              {REASONS.map((r) => (
                <button key={r} role="radio" aria-checked={why === r} className={why === r ? 'on' : ''} onClick={() => setWhy(r)}>
                  {r}<Radio on={why === r} />
                </button>
              ))}
            </div>
            <button className="btn danger wide" disabled={!why} onClick={() => { cancel(o.no, why); setDlg(false); }}>
              Ya, Batalkan
            </button>
            <button className="btn out wide" onClick={() => setDlg(false)}>
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  );
}
