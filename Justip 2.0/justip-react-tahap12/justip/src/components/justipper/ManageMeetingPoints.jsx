import { useState } from 'react';
import { Ic } from '../ui.jsx';
import { Bar } from '../account/parts.jsx';
import { useJustip } from '../../context/JustipContext.jsx';

export default function ManageMeetingPoints({ back, say }) {
  const { meetingPoints, addMeetingPoint, deleteMeetingPoint } = useJustip();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return say('Masukkan nama titik temu');
    addMeetingPoint({
      name: name.trim(),
      desc: desc.trim() || 'Area Kampus',
      time: time.trim() || '16:00 - 17:30',
    });
    setName('');
    setDesc('');
    setTime('');
    setAdding(false);
    say('Titik temu berhasil ditambahkan!');
  };

  return (
    <>
      <Bar title="Titik Temu COD Kampus" back={back} />
      <main className="scroll pad trip">
        <div style={{ background: '#f0f9ff', padding: '12px 14px', borderRadius: 14, border: '1px solid #bae6fd', marginBottom: 12 }}>
          <b style={{ fontSize: 13, color: '#0369a1', display: 'block' }}>📍 Atur Lokasi Ketemuan</b>
          <p style={{ margin: '3px 0 0', fontSize: 11.5, color: '#0284c7', lineHeight: 1.4 }}>
            Lokasi yang kamu tambahkan di sini akan otomatis muncul sebagai pilihan titik temu bagi pembeli saat checkout.
          </p>
        </div>

        {adding ? (
          <form onSubmit={handleAdd} style={{ background: '#fff', padding: 14, borderRadius: 16, border: '1px solid var(--line)', marginBottom: 14 }}>
            <b style={{ fontSize: 13.5, color: '#0f172a', display: 'block', marginBottom: 10 }}>Tambah Titik Temu Baru</b>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Nama Tempat di Kampus *
              </label>
              <input
                type="text"
                placeholder="Contoh: Gedung TI / Depan Lab Komputer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 12.5, outline: 'none' }}
                required
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Detail Patokan / Lantai
              </label>
              <input
                type="text"
                placeholder="Contoh: Lantai 1 dekat pintu lobi utama"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 12.5, outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Jam Standby / Ketemuan
              </label>
              <input
                type="text"
                placeholder="Contoh: 15:30 - 17:00 WIB"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 12.5, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn out sm wide"
                onClick={() => setAdding(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn sm wide"
                style={{ fontWeight: 800 }}
              >
                Simpan Titik Temu
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            className="btn wide"
            onClick={() => setAdding(true)}
            style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Ic n="plus" size={16} /> Tambah Lokasi Titik Temu
          </button>
        )}

        {/* Daftar Titik Temu Aktif */}
        <div style={{ display: 'grid', gap: 8 }}>
          {meetingPoints.map((mp) => (
            <div
              key={mp.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 14,
                background: '#fff',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ic n="pin" size={18} />
                </span>
                <div>
                  <b style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>{mp.name}</b>
                  <small style={{ fontSize: 11, color: '#64748b', display: 'block' }}>{mp.desc}</small>
                  {mp.time && (
                    <small style={{ fontSize: 10.5, color: '#0284c7', fontWeight: 600 }}>⏰ {mp.time}</small>
                  )}
                </div>
              </div>

              {meetingPoints.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    deleteMeetingPoint(mp.id);
                    say('Titik temu dihapus');
                  }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 6 }}
                  aria-label="Hapus titik temu"
                >
                  <Ic n="trash" size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
