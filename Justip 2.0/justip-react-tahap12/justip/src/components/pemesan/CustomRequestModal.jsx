import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { CAMPUS_MEETING_POINTS } from '../checkout/checkout.js';

const CATS = ['Makanan & Oleh-oleh', 'Fashion & Sepatu', 'Skincare & Makeup', 'Alat Tulis & Buku', 'Lainnya'];

export default function CustomRequestModal({ isOpen, onClose, onSubmit, say }) {
  const [name, setName] = useState('');
  const [store, setStore] = useState('');
  const [kota, setKota] = useState('Yogyakarta');
  const [cat, setCat] = useState(CATS[0]);
  const [price, setPrice] = useState('50000');
  const [fee, setFee] = useState('15000');
  const [meetingPointId, setMeetingPointId] = useState('ti_lab');
  const [note, setNote] = useState('');
  const [insurance, setInsurance] = useState(true);

  if (!isOpen) return null;

  const numPrice = Math.max(0, parseInt(price.replace(/\D/g, ''), 10) || 0);
  const numFee = Math.max(0, parseInt(fee.replace(/\D/g, ''), 10) || 0);
  const platformFee = Math.min(5000, Math.round(numPrice * 0.025));
  const insFee = insurance ? 2000 : 0;
  const total = numPrice + numFee + platformFee + insFee;

  const selectedMp = CAMPUS_MEETING_POINTS.find((m) => m.id === meetingPointId) || CAMPUS_MEETING_POINTS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      if (say) say('Masukkan nama barang titipan');
      return;
    }
    if (numPrice <= 0) {
      if (say) say('Masukkan perkiraan harga barang');
      return;
    }

    onSubmit({
      name: name.trim(),
      store: store.trim() || 'Toko Rekomendasi Jastiper',
      kota,
      cat,
      price: numPrice,
      fee: numFee,
      meetingPoint: selectedMp,
      note: note.trim(),
      insurance,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 412,
          maxHeight: '90vh',
          background: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflowY: 'auto',
          padding: '20px 18px 28px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="bag" size={18} />
            </span>
            <div>
              <b style={{ fontSize: 16, color: '#0f172a' }}>Request Titipan Bebas</b>
              <small style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Titip barang apapun di luar katalog</small>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
              Nama Barang Titipan *
            </label>
            <input
              type="text"
              placeholder="Contoh: Bakpia Kukus Tugu Jogja Rasa Keju"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: 10, fontSize: 13, outline: 'none' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Kota Asal Belanja
              </label>
              <select
                value={kota}
                onChange={(e) => setKota(e.target.value)}
                style={{ width: '100%', padding: '10px 8px', border: '1.5px solid #cbd5e1', borderRadius: 10, fontSize: 12.5, outline: 'none', background: '#fff' }}
              >
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Semarang">Semarang</option>
                <option value="Solo">Solo</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Toko / Outlet (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Toko Resmi Malioboro"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: 10, fontSize: 12.5, outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
              Kategori Barang
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: cat === c ? '#0284c7' : '#e2e8f0',
                    background: cat === c ? '#e0f2fe' : '#f8fafc',
                    color: cat === c ? '#0284c7' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Perkiraan Harga Toko (Rp) *
              </label>
              <input
                type="number"
                placeholder="50000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: 10, fontSize: 13, outline: 'none' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Tawaran Tips Jastip (Rp)
              </label>
              <input
                type="number"
                placeholder="15000"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: 10, fontSize: 13, outline: 'none' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
              Titik Temu Kampus (COD Bebas Ongkir)
            </label>
            <select
              value={meetingPointId}
              onChange={(e) => setMeetingPointId(e.target.value)}
              style={{ width: '100%', padding: '10px 10px', border: '1.5px solid #cbd5e1', borderRadius: 10, fontSize: 12.5, outline: 'none', background: '#fff' }}
            >
              {CAMPUS_MEETING_POINTS.map((mp) => (
                <option key={mp.id} value={mp.id}>
                  {mp.name} — {mp.desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
              Catatan / Varian / Instruksi Khusus
            </label>
            <textarea
              placeholder="Contoh: Tolong cari yang expired paling lama, varian original box isi 10."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #cbd5e1', borderRadius: 10, fontSize: 12, outline: 'none', resize: 'none' }}
            />
          </div>

          {/* Asuransi Checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 10,
            background: insurance ? '#f0fdf4' : '#f8fafc',
            border: insurance ? '1px solid #86efac' : '1px solid #e2e8f0',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={insurance}
              onChange={(e) => setInsurance(e.target.checked)}
              style={{ accentColor: '#16a34a', width: 16, height: 16 }}
            />
            <div style={{ flex: 1, fontSize: 11.5 }}>
              <span style={{ fontWeight: 700, color: '#166534' }}>Asuransi & Garansi Makanan (+Rp 2.000)</span>
              <small style={{ display: 'block', color: '#64748b' }}>Garansi anti-basi & ganti rugi 100% jika rusak di jalan</small>
            </div>
          </label>

          {/* Rincian Perkiraan Total */}
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 4 }}>
              <span>Harga Barang Toko</span>
              <b>{rp(numPrice)}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 4 }}>
              <span>Jasa Titip Mitra</span>
              <b>{rp(numFee)}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 4 }}>
              <span>Biaya Layanan Platform (2,5%)</span>
              <b>{rp(platformFee)}</b>
            </div>
            {insurance && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', marginBottom: 4 }}>
                <span>Asuransi JustTip Care</span>
                <b>+{rp(insFee)}</b>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0f172a', borderTop: '1px dashed #cbd5e1', paddingTop: 6, marginTop: 4, fontWeight: 800 }}>
              <span>Perkiraan Total Bayar (COD)</span>
              <span style={{ color: '#0284c7', fontSize: 14 }}>{rp(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn wide"
            style={{ marginTop: 4, padding: 13, fontSize: 13.5, fontWeight: 800 }}
          >
            Ajukan Request Titipan Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
