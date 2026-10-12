import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import BottomNav from '../BottomNav.jsx';
import { useToast } from '../shared.jsx';
import { useJustip } from '../../context/JustipContext.jsx';

const TEAM = [
  { name: 'Muhammad Amin', nim: '2403040016', role: 'Developer' },
  { name: 'Hafiz Anggara Saputra', nim: '2403040012', role: 'Developer' },
  { name: 'Faizna Ramadhani', nim: '2403040014', role: 'UI/UX Designer' },
  { name: 'Agisfin Qolbi Indama', nim: '2403040025', role: 'Marketing & Media' },
  { name: 'Nur Arif', nim: '2403040052', role: 'Marketing & Media' },
  { name: 'Adillia Adhani Hadi Utami', nim: '2403040068', role: 'Operasional & Mitra' },
];

const BMC_BLOCKS = [
  { title: '1. Customer Segments', desc: 'Dua sisi pasar: Mahasiswa kampus yang butuh titip barang (Buyer) & Mahasiswa yang sering bepergian/traveler (Mitra Jastip).' },
  { title: '2. Value Propositions', desc: 'Platform khusus jastip berbasis lokasi, etalase terpusat, status Ready/Pre-Order, pembayaran aman satu kali di checkout, biaya layanan transparan.' },
  { title: '3. Channels', desc: 'Aplikasi JustTip, sistem COD di titik temu kampus yang ditentukan jastiper (bebas ongkir kurir), pembayaran via QRIS/COD, dan komunitas mahasiswa kampus.' },
  { title: '4. Customer Relationships', desc: 'Self-service lewat aplikasi, chat langsung buyer-mitra, rating & review mitra, customer service & penanganan komplain.' },
  { title: '5. Revenue Streams', desc: 'Biaya layanan 2,5% dari subtotal transaksi (maksimal Rp5.000 per transaksi). Rencana tahap lanjut: featured listing, iklan, dan fitur premium mitra.' },
  { title: '6. Key Activities', desc: 'Pengembangan MVP aplikasi, riset kebutuhan, verifikasi dan onboarding mitra jastip, pengawasan keamanan transaksi.' },
  { title: '7. Key Resources', desc: '6 anggota kelompok Bitforce (2 Developer, 1 UI/UX, 2 Marketing, 1 Operasional), brand JustTip, server/cloud, kas kelompok Rp2.000.000.' },
  { title: '8. Key Partnerships', desc: 'Penyedia Payment Gateway/QRIS resmi, hosting cloud, toko/merchant belanja yang sering jadi tujuan jastip, mitra jastip kampus.' },
  { title: '9. Cost Structure', desc: 'Biaya payment gateway (~0,7% per transaksi), fixed cost domain & hosting, promo & referral. Target BEP: 165 transaksi/bulan.' },
];

const NAV = [
  ['chart', 'Finansial'],
  ['clip', 'Transaksi'],
  ['shield', 'Mitra'],
  ['user', 'Tim & BMC'],
];

export default function AdminApp({ session, logout }) {
  const {
    orders,
    withdrawals,
    mitras,
    approveWithdrawal,
    approveMitra,
    verifyDevFee,
  } = useJustip();

  const [tab, setTab] = useState('Finansial');
  const [subMitra, setSubMitra] = useState('verif');
  const [selectedBmc, setSelectedBmc] = useState(null);
  const [txFilter, setTxFilter] = useState('semua');
  const [toast, say] = useToast();

  const txs = orders.map((o) => {
    const subtotal = o.subtotal || (o.price * (o.qty || 1)) || 0;
    const platformFee = o.platformFee != null ? o.platformFee : Math.min(5000, Math.round(subtotal * 0.025));
    const pgFee = o.pgFee != null ? o.pgFee : Math.round(subtotal * 0.007);
    const net = o.net != null ? o.net : (platformFee - pgFee);
    const item = o.name || (o.items && o.items[0]?.p ? (o.items[0].p.name || o.items[0].p) : null) || 'Barang Jastip';
    return {
      id: o.no || `#JST${o.id}`,
      orderId: o.id,
      date: o.date || 'Hari ini',
      buyer: o.buyer || 'Pelanggan',
      justipper: o.justipper || 'Hafiz Anggara',
      item,
      subtotal,
      platformFee,
      pgFee,
      net,
      method: o.method || 'QRIS',
      feePaymentMethod: o.feePaymentMethod,
      feePaidToDev: o.feePaidToDev === true,
      status: o.status === 'selesai' ? 'selesai' : o.status === 'batal' ? 'batal' : 'proses',
      courier: o.courier || 'Titik Temu Kampus',
    };
  });

  const wds = withdrawals;

  // Kalkulasi Finansial Sesuai BMC & Status Setoran
  const totalSubtotal = txs.reduce((s, t) => s + t.subtotal, 0);
  const totalPlatformFee = txs.reduce((s, t) => s + t.platformFee, 0);
  const totalPgFee = txs.reduce((s, t) => s + t.pgFee, 0);
  const netPlatformProfit = totalPlatformFee - totalPgFee;

  // Rincian Saldo Developer: Sudah Masuk vs Masih Tertahan
  const feeMasuk = txs.filter((t) => t.feePaidToDev).reduce((s, t) => s + t.platformFee, 0);
  const feeTertahan = txs.filter((t) => !t.feePaidToDev).reduce((s, t) => s + t.platformFee, 0);
  const feeTertahanSelesai = txs.filter((t) => !t.feePaidToDev && t.status === 'selesai').reduce((s, t) => s + t.platformFee, 0);

  // Target BEP: 165 transaksi / bulan (BMC hal. 5 & 8)
  const bepTarget = 165;
  const currentCount = txs.length + 32; // simulasi akumulasi bulan berjalan
  const bepPercent = Math.min(100, Math.round((currentCount / bepTarget) * 100));

  const handleApproveMitra = (id) => {
    approveMitra(id);
    say('Mitra jastip berhasil diverifikasi');
  };

  const handleApproveWd = (id) => {
    approveWithdrawal(id);
    say('Pencairan dana disetujui & berhasil ditransfer');
  };

  const copySecretLink = () => {
    const secretUrl = `${window.location.origin}${window.location.pathname}?admin`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(secretUrl);
      say('Link rahasia disalin ke clipboard');
    } else {
      say(`Link rahasia: ${secretUrl}`);
    }
  };

  const filteredTxs = txs.filter((t) => {
    if (txFilter === 'selesai') return t.status === 'selesai';
    if (txFilter === 'proses') return t.status === 'proses';
    if (txFilter === 'masuk') return t.feePaidToDev;
    if (txFilter === 'tertahan') return !t.feePaidToDev;
    return true;
  });

  return (
    <div className="app">
      <div className="page">
        {/* Header Admin Proposional */}
        <header className="adm-header">
          <div className="adm-brand">
            <span className="adm-brand-logo"><Ic n="shield" size={19} /></span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="adm-brand-title">Admin & Dev</span>
                <span className="adm-badge-dev">BITFORCE</span>
              </div>
              <small className="adm-brand-sub">Teknik Informatika (A) · Kewirausahaan</small>
            </div>
          </div>
          <div className="adm-header-actions">
            <button
              onClick={copySecretLink}
              className="adm-btn-action"
              aria-label="Salin link rahasia"
              title="Salin Link Rahasia"
            >
              <Ic n="share" size={16} />
            </button>
            <button
              onClick={logout}
              className="adm-btn-action danger"
              aria-label="Keluar"
              title="Keluar dari Admin"
            >
              <Ic n="out" size={16} />
            </button>
          </div>
        </header>

      {/* TAB 1: FINANSIAL & BEP */}
      {tab === 'Finansial' && (
        <main className="scroll adm-content">
          {/* Hero Revenue Card */}
          <div className="adm-hero-card">
            <div className="adm-hero-top">
              <span className="adm-hero-label">Akumulasi Komisi Platform (2,5%)</span>
              <span className="adm-hero-pill">Biaya 2,5% (Maks 5rb)</span>
            </div>
            <div className="adm-hero-amount">{rp(totalPlatformFee)}</div>
            <div className="adm-hero-note">Total potensi bagi hasil developer dari {txs.length} transaksi</div>
          </div>

          {/* Card Status Saldo Developer: Masuk vs Tertahan (Permintaan Khusus) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 0 14px' }}>
            <div
              style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: 14,
                padding: '12px 14px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, .06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  Saldo Sudah Masuk
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#166534' }}>
                +{rp(feeMasuk)}
              </div>
              <small style={{ fontSize: 10.5, color: '#15803d', display: 'block', marginTop: 3 }}>
                ✓ Lunas di kas QRIS Dev ({txs.filter((t) => t.feePaidToDev).length} order)
              </small>
            </div>

            <div
              style={{
                background: '#fffbeb',
                border: '1.5px solid #fde68a',
                borderRadius: 14,
                padding: '12px 14px',
                boxShadow: '0 2px 8px rgba(217, 119, 6, .06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                  Saldo Masih Tertahan
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#b45309' }}>
                {rp(feeTertahan)}
              </div>
              <small style={{ fontSize: 10.5, color: '#92400e', display: 'block', marginTop: 3 }}>
                ⏳ {feeTertahanSelesai > 0 ? `${rp(feeTertahanSelesai)} dari pesanan selesai belum disetor` : 'Belum disetor mitra'}
              </small>
            </div>
          </div>

          {/* Grid Metrics (3 Kolom Proporsional) */}
          <div className="adm-metrics-grid">
            <div className="adm-metric-card">
              <span className="adm-metric-title">Biaya PG (0,7%)</span>
              <b className="adm-metric-val red">-{rp(totalPgFee)}</b>
              <small className="adm-metric-sub">Fee QRIS (COD Rp0)</small>
            </div>
            <div className="adm-metric-card">
              <span className="adm-metric-title">Laba Bersih</span>
              <b className="adm-metric-val green">+{rp(netPlatformProfit)}</b>
              <small className="adm-metric-sub">Kas bersih dev</small>
            </div>
            <div className="adm-metric-card">
              <span className="adm-metric-title">Total GMV</span>
              <b className="adm-metric-val blue">{rp(totalSubtotal)}</b>
              <small className="adm-metric-sub">Nilai belanja</small>
            </div>
          </div>

          {/* Target Titik Impas (BEP) */}
          <section className="adm-bep-card">
            <div className="adm-bep-header">
              <div>
                <b className="adm-bep-title">Target Titik Impas (BEP)</b>
                <small className="adm-bep-sub">Target: 165 transaksi/bulan (Fixed cost Rp350k)</small>
              </div>
              <span className="adm-bep-tag">{bepPercent}%</span>
            </div>
            <div className="adm-progress-track">
              <div className="adm-progress-bar" style={{ width: `${bepPercent}%` }} />
            </div>
            <div className="adm-bep-footer">
              <span><b>{currentCount}</b> transaksi tercapai</span>
              <span>Sisa <b>{bepTarget - currentCount}</b> transaksi lagi</span>
            </div>
          </section>

          {/* Action Button */}
          <button className="btn sm out wide" style={{ padding: 12, fontSize: 12.5 }} onClick={() => setTab('Transaksi')}>
            <Ic n="clip" size={15} /> Buka Buku Besar Transaksi ({txs.length})
          </button>

          {/* Transaksi Terbaru */}
          <div className="adm-sec-head">
            <h3>Transaksi Terbaru</h3>
            <button onClick={() => setTab('Transaksi')}>Lihat Semua <Ic n="chevR" size={12} /></button>
          </div>
          <div className="adm-tx-list">
            {txs.slice(0, 3).map((t) => (
              <div key={t.id} className="adm-tx-card">
                <div className="adm-tx-top">
                  <div>
                    <b className="adm-tx-id">{t.item}</b>
                    <span className="adm-tx-date">{t.date}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: '#dcfce7', color: '#166534' }}>
                    {t.status === 'selesai' ? 'Sukses' : 'Diproses'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{t.buyer} · Mitra: <b>{t.justipper}</b></span>
                  <b style={{ color: '#16a34a', fontSize: 13 }}>+{rp(t.platformFee)}</b>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* TAB 2: TRANSAKSI (BUKU BESAR) */}
      {tab === 'Transaksi' && (
        <main className="scroll adm-content">
          <div className="adm-sec-head">
            <div>
              <h3>Buku Besar Transaksi</h3>
              <small style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Rincian komisi 2,5% dan potongan Payment Gateway 0,7%</small>
            </div>
          </div>

          <div className="seg" role="tablist" style={{ marginBottom: 8 }}>
            {[
              ['semua', `Semua (${txs.length})`],
              ['masuk', `✓ Sudah Masuk (${txs.filter((t) => t.feePaidToDev).length})`],
              ['tertahan', `⏳ Tertahan (${txs.filter((t) => !t.feePaidToDev).length})`],
            ].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={txFilter === k} className={txFilter === k ? 'on' : ''} onClick={() => setTxFilter(k)}>
                {l}
              </button>
            ))}
          </div>

          <div className="adm-tx-list">
            {filteredTxs.map((t) => (
              <article key={t.id} className="adm-tx-card">
                <div className="adm-tx-top">
                  <div>
                    <b className="adm-tx-id">{t.id}</b>
                    <span className="adm-tx-date">{t.date}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: t.status === 'selesai' ? '#dcfce7' : '#fef3c7', color: t.status === 'selesai' ? '#166534' : '#92400e' }}>
                    {t.status === 'selesai' ? 'Pesanan Selesai' : 'Sedang Diproses'}
                  </span>
                </div>

                <div className="adm-tx-item">
                  <b>{t.item}</b>
                  <span style={{ color: '#0f172a', fontWeight: 800 }}>{rp(t.subtotal)}</span>
                </div>

                <div className="adm-tx-breakdown">
                  <div>
                    <small>Komisi Platform (2,5%)</small>
                    <b style={{ color: '#0284c7' }}>{rp(t.platformFee)}</b>
                  </div>
                  <div>
                    <small>Biaya PG (0,7%)</small>
                    {t.pgFee > 0 ? (
                      <b style={{ color: '#e11d48' }}>
                        -{rp(t.pgFee)}{' '}
                        <small style={{ fontSize: 9.5, color: '#0369a1', background: '#e0f2fe', padding: '1px 4px', borderRadius: 3, fontWeight: 700 }}>
                          {t.feePaymentMethod === 'qris_dev' ? 'QRIS Dev' : 'QRIS'}
                        </small>
                      </b>
                    ) : (
                      <b style={{ color: '#166534', fontSize: 12 }}>
                        Rp 0 <small style={{ fontSize: 10, color: '#166534', background: '#dcfce7', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>Direct</small>
                      </b>
                    )}
                  </div>
                  <div>
                    <small>Laba Bersih Kas</small>
                    <b style={{ color: '#16a34a' }}>+{rp(t.net)}</b>
                  </div>
                </div>

                <div className="adm-tx-bottom">
                  <span>Pembeli: <b>{t.buyer}</b> · Mitra: <b>{t.justipper}</b></span>
                  <span>{t.courier}</span>
                </div>

                {/* Status Setoran Komisi 2,5% Mitra ke Developer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px dashed #e2e8f0',
                    fontSize: 11.5,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {t.feePaidToDev ? (
                      <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#dcfce7', color: '#166534' }}>
                        ✓ Komisi 2,5% Lunas Masuk Kas
                      </span>
                    ) : (
                      <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#fef3c7', color: '#92400e' }}>
                        ⏳ Tertahan ({t.status === 'selesai' ? 'Pesanan Selesai tapi Mitra Belum Setor' : 'Pesanan Masih Berjalan'})
                      </span>
                    )}
                  </div>

                  {!t.feePaidToDev && (
                    <button
                      type="button"
                      onClick={() => {
                        verifyDevFee(t.orderId);
                        say(`Setoran komisi ${t.id} (${rp(t.platformFee)}) diverifikasi lunas masuk kas!`);
                      }}
                      style={{
                        padding: '4px 9px',
                        fontSize: 10.5,
                        fontWeight: 700,
                        borderRadius: 6,
                        border: '1px solid #16a34a',
                        background: '#f0fdf4',
                        color: '#166534',
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Verifikasi Masuk Kas
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {/* TAB 3: MITRA & VERIFIKASI */}
      {tab === 'Mitra' && (
        <main className="scroll adm-content">
          <div className="adm-sec-head">
            <div>
              <h3>Operasional Mitra Jastip</h3>
              <small style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Verifikasi identitas KTM dan penarikan saldo</small>
            </div>
          </div>

          <div className="seg" role="tablist">
            <button role="tab" aria-selected={subMitra === 'verif'} className={subMitra === 'verif' ? 'on' : ''} onClick={() => setSubMitra('verif')}>
              Verifikasi KTM ({mitras.filter((m) => m.status === 'pending').length} baru)
            </button>
            <button role="tab" aria-selected={subMitra === 'wd'} className={subMitra === 'wd' ? 'on' : ''} onClick={() => setSubMitra('wd')}>
              Tarik Saldo ({wds.filter((w) => w.status === 'pending').length})
            </button>
          </div>

          {subMitra === 'verif' && (
            <div className="adm-tx-list">
              {mitras.map((m) => (
                <div key={m.id} className="adm-mitra-card">
                  <div className="adm-mitra-top">
                    <div>
                      <b className="adm-mitra-name">{m.name}</b>
                      <div className="adm-mitra-meta">NIM: {m.nim} · {m.kampus}</div>
                      <span className="adm-mitra-route">Rute: {m.rute}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: m.status === 'verified' ? '#dcfce7' : '#fef3c7', color: m.status === 'verified' ? '#166534' : '#92400e' }}>
                      {m.status === 'verified' ? 'Terverifikasi' : 'Menunggu Validasi'}
                    </span>
                  </div>

                  <div className="adm-mitra-actions">
                    <span style={{ fontSize: 11, color: '#64748b' }}>{m.completed} pesanan selesai · ★ {m.rating}</span>
                    {m.status === 'pending' ? (
                      <button className="btn sm" style={{ padding: '6px 12px', fontSize: 11.5 }} onClick={() => handleApproveMitra(m.id)}>
                        <Ic n="check" size={13} /> Verifikasi KTM
                      </button>
                    ) : (
                      <small style={{ color: '#16a34a', fontWeight: 700, fontSize: 11 }}>Aktif Terima Pesanan</small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {subMitra === 'wd' && (
            <div className="adm-tx-list">
              {wds.map((w) => (
                <div key={w.id} className="adm-tx-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <b style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>{w.name}</b>
                    <small style={{ fontSize: 11, color: '#64748b' }}>{w.bank} {w.no} · {w.time}</small>
                    <b style={{ fontSize: 13.5, color: '#0284c7', display: 'block', marginTop: 2 }}>{rp(w.amount)}</b>
                  </div>
                  <div>
                    {w.status === 'pending' ? (
                      <button className="btn sm" style={{ padding: '7px 12px', fontSize: 11.5 }} onClick={() => handleApproveWd(w.id)}>
                        Setujui Transfer
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '4px 8px', borderRadius: 6 }}>
                        Ditransfer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* TAB 4: TIM BITFORCE & BMC BLOCKS */}
      {tab === 'Tim & BMC' && (
        <main className="scroll adm-content">
          {/* Secret Link Banner */}
          <div style={{ background: '#f0f9ff', padding: 14, borderRadius: 14, border: '1px dashed #38bdf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b style={{ fontSize: 12.5, color: '#0284c7' }}>Link Rahasia Admin / Dev</b>
                <small style={{ display: 'block', fontSize: 11, color: '#64748b' }}>Buka langsung tanpa login publik:</small>
              </div>
              <button className="btn sm" style={{ padding: '6px 10px', fontSize: 11 }} onClick={copySecretLink}>
                Salin Link
              </button>
            </div>
            <code style={{ display: 'block', background: '#fff', padding: '6px 8px', borderRadius: 8, marginTop: 6, fontSize: 11, color: '#0f172a', overflowX: 'auto' }}>
              {window.location.origin}{window.location.pathname}?admin
            </code>
          </div>

          {/* Team Members Card */}
          <div className="adm-team-card">
            <b style={{ fontSize: 13, color: '#0f172a', display: 'block', marginBottom: 8 }}>Tim Bitforce (Teknik Informatika)</b>
            {TEAM.map((t, idx) => (
              <div key={t.nim} className="adm-team-item">
                <div>
                  <b style={{ color: '#0f172a' }}>{idx + 1}. {t.name}</b>
                  <small style={{ color: '#64748b', marginLeft: 6 }}>NIM: {t.nim}</small>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, background: '#f0f9ff', color: '#0284c7', padding: '2px 8px', borderRadius: 6 }}>
                  {t.role}
                </span>
              </div>
            ))}
          </div>

          {/* 9 Blocks BMC Canvas */}
          <div className="adm-sec-head">
            <h3>9 Elemen Business Model Canvas</h3>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {BMC_BLOCKS.map((b) => (
              <div
                key={b.title}
                className={`adm-bmc-item ${selectedBmc === b.title ? 'on' : ''}`}
                onClick={() => setSelectedBmc(selectedBmc === b.title ? null : b.title)}
              >
                <div className="adm-bmc-item-head">
                  <span className="adm-bmc-title">{b.title}</span>
                  <Ic n="chevR" size={14} style={{ transform: selectedBmc === b.title ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
                {selectedBmc === b.title && (
                  <p className="adm-bmc-body">{b.desc}</p>
                )}
              </div>
            ))}
          </div>

          <button className="btn out wide" style={{ marginTop: 14 }} onClick={logout}>
            <Ic n="out" size={16} /> Keluar dari Akun Admin
          </button>
        </main>
      )}

        {toast}
      </div>
      <BottomNav items={NAV} active={tab} onChange={setTab} />
    </div>
  );
}
