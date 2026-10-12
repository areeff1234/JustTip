import { useState } from 'react';
import { Ic } from '../ui.jsx';
import { Bar } from '../account/parts.jsx';
import { useJustip } from '../../context/JustipContext.jsx';

const PROVIDERS = ['DANA Bisnis', 'SeaBank', 'GoPay Merchant', 'BCA Merchant', 'Livin Usaha', 'Lainnya'];

export default function ManageQris({ back, say }) {
  const { qrisConfig, updateQris } = useJustip();
  const [provider, setProvider] = useState(qrisConfig.provider || 'DANA Bisnis');
  const [name, setName] = useState(qrisConfig.merchantName || 'JustTip - Hafiz Anggara');
  const [nmid, setNmid] = useState(qrisConfig.nmid || 'ID102403040012');
  const [rekening, setRekening] = useState(qrisConfig.rekening || '0812-3456-7890 (DANA Bisnis)');
  const [photo, setPhoto] = useState(qrisConfig.photo || null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result);
        say('Foto QRIS berhasil dipilih!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateQris({
      provider,
      merchantName: name.trim() || 'JustTip - Hafiz Anggara',
      nmid: nmid.trim() || 'ID102403040012',
      rekening: rekening.trim() || '0812-3456-7890',
      photo,
    });
    say('Pengaturan QRIS Toko berhasil disimpan!');
    back();
  };

  return (
    <>
      <Bar title="Kelola QRIS Jastiper" back={back} />
      <main className="scroll pad trip">
        {/* Banner Edukasi Skenario 1 */}
        <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: 14, border: '1px solid #bbf7d0', marginBottom: 14 }}>
          <b style={{ fontSize: 13, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📲</span> QRIS Toko Mandiri (Skenario 1)
          </b>
          <p style={{ margin: '4px 0 0', fontSize: 11.5, color: '#15803d', lineHeight: 1.45 }}>
            Upload QRIS dari aplikasi pribadimu (DANA Bisnis, SeaBank, GoPay, dll). Pembeli bisa scan dari rekening bank manapun, dan dana <b>100% langsung masuk ke e-wallet kamu</b> tanpa saldo tertahan di aplikasi.
          </p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 1. Pilih Aplikasi / Penyedia QRIS */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              Aplikasi / Penyedia QRIS Kamu
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PROVIDERS.map((p) => {
                const active = provider === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProvider(p)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 11.5,
                      fontWeight: 700,
                      border: active ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                      background: active ? '#e0f2fe' : '#fff',
                      color: active ? '#0369a1' : '#64748b',
                      cursor: 'pointer',
                      transition: 'all .15s',
                    }}
                  >
                    {active ? '✓ ' : ''}{p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Preview & Upload QRIS Container */}
          <div style={{ textAlign: 'center', background: '#fff', padding: 14, borderRadius: 16, border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 8 }}>
              Tampilan QR Code Toko ({provider})
            </span>

            <div
              style={{
                width: 180,
                height: 180,
                margin: '0 auto 10px',
                border: '2px dashed #cbd5e1',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#f8fafc',
              }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt="QRIS Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ padding: 10, color: '#94a3b8', fontSize: 11 }}>
                  <Ic n="camera" size={28} />
                  <span style={{ display: 'block', marginTop: 4 }}>Belum ada foto QRIS</span>
                </div>
              )}
            </div>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: '#f1f5f9',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                color: '#0284c7',
                cursor: 'pointer',
              }}
            >
              <Ic n="camera" size={16} />
              <span>{photo ? 'Ganti Foto QRIS' : 'Upload Foto QRIS'}</span>
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* 3. Nama Merchant / Toko */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
              Nama Merchant / Toko QRIS
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: JustTip - Hafiz Anggara"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 13, outline: 'none' }}
              required
            />
          </div>

          {/* 4. Nomor NMID */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
              Nomor NMID (Opsional, dari lembar QRIS)
            </label>
            <input
              type="text"
              value={nmid}
              onChange={(e) => setNmid(e.target.value)}
              placeholder="Contoh: ID102403040012"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 13, outline: 'none' }}
            />
          </div>

          {/* 5. Catatan Rekening / No. HP Akun */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
              Nomor Akun / No. HP E-Wallet
            </label>
            <input
              type="text"
              value={rekening}
              onChange={(e) => setRekening(e.target.value)}
              placeholder="Contoh: 0812-3456-7890 (DANA Bisnis)"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 13, outline: 'none' }}
            />
          </div>

          {/* Info Fee Developer */}
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 11, color: '#64748b', lineHeight: 1.45 }}>
            ℹ️ <b>Info Bagi Hasil:</b> Saat pembeli bayar lewat QRIS di atas, uang belanja masuk 100% ke akun tokomu. Setelah kamu selesai menyerahkan barang titipan di kampus, kamu tinggal menyetorkan komisi developer 2,5% via QRIS Developer.
          </div>

          <button
            type="submit"
            className="btn wide"
            style={{ marginTop: 4, padding: 13, fontSize: 13.5, fontWeight: 800 }}
          >
            Simpan Pengaturan QRIS Toko
          </button>
        </form>
      </main>
    </>
  );
}
