import { useState } from 'react';

export const COLOR = { 1: 'White', 2: 'Rose Gold', 3: 'Navy', 4: 'White', 6: 'Black' };

export const PAY_OPTIONS = [
  {
    id: 'qris',
    name: 'QRIS',
    sub: 'Bisa scan dari BCA, GoPay, DANA, ShopeePay, Livin, dll',
    tag: 'Rekomendasi',
  },
  {
    id: 'cod',
    name: 'Bayar Tunai di Tempat (COD)',
    sub: 'Bayar uang pas langsung ke Jastiper saat ketemuan di kampus',
    tag: 'Bebas Admin',
  },
];

export const CAMPUS_MEETING_POINTS = [
  { id: 'ti_lab', name: 'Gedung TI Kampus Unsoed (Lantai 1)', desc: 'Lobi depan atau depan Lab Komputer TI', open: '08:00 - 17:00 WIB' },
  { id: 'gazebo_ti', name: 'Gazebo Depan TI Kampus', desc: 'Area santai depan jurusan TI', open: '08:00 - 18:00 WIB' },
  { id: 'kantin_ft', name: 'Kantin Fakultas Teknik Unsoed', desc: 'Meja utama kantin teknik', open: '09:00 - 16:00 WIB' },
  { id: 'halte_unsoed', name: 'Halte Kampus Utama Unsoed', desc: 'Samping pos satpam gerbang utama', open: '07:30 - 18:30 WIB' },
  { id: 'perpus_pusat', name: 'Perpustakaan Pusat Unsoed', desc: 'Lobi lantai 1 perpustakaan', open: '08:30 - 16:30 WIB' },
];

export const shortAddr = (t = '') => {
  if (!t) return '';
  const parts = t.split(',').map((s) => s.trim()).filter(Boolean);
  return parts.slice(-2).join(', ') || t;
};

export const ADDRS = [
  { id: 1, label: 'Alamat Utama', name: 'Mahasiswa Pemesan', phone: '+62 812 3456 7890', text: 'Gedung TI Kampus Unsoed, Purwokerto', short: 'Kampus TI, Purwokerto' },
];

export const COURIERS = [
  { id: 'cod_campus', name: 'COD Titik Temu Kampus', desc: 'Ketemuan langsung di area kampus yang ditentukan jastiper', price: 0, tag: 'Bebas Ongkir' },
];

export const eta = () => 'Hari ini (COD Kampus)';

export const payInfo = (id) => {
  if (id === 'cod') {
    return { name: 'Bayar Tunai saat Ketemuan (COD)', sub: 'Bayar tunai di kampus' };
  }
  return { name: 'QRIS', sub: 'Scan QRIS Jastiper' };
};

export function useCheckout() {
  const [cart, setCart] = useState([]); // { p, qty, size }
  const [selectedMpId, setSelectedMpId] = useState('mp1');
  const [notes, setNotes] = useState('');
  const [payId, setPayId] = useState('qris');

  const subtotal = cart.reduce((s, i) => s + i.p.price * i.qty, 0);
  // BMC: Biaya layanan 2,5% dari subtotal, maksimal Rp5.000
  const fee = Math.min(5000, Math.round(subtotal * 0.025));
  const ship = 0; // 100% Bebas Ongkir Titik Temu Kampus
  const total = subtotal + fee;
  const stores = [...new Set(cart.map((i) => i.p.store || i.p.justipper))];

  return {
    cart,
    selectedMpId,
    setSelectedMpId,
    notes,
    setNotes,
    payId,
    setPayId,
    subtotal,
    fee,
    ship,
    total,
    stores,
    start: (p, size) => setCart([{ p, qty: 1, size }]),
    add: (p) =>
      setCart((c) =>
        c.some((i) => i.p.id === p.id)
          ? c.map((i) => (i.p.id === p.id ? { ...i, qty: i.qty + 1 } : i))
          : [...c, { p, qty: 1 }]
      ),
    qty: (id, d) =>
      setCart((c) =>
        c.map((i) =>
          i.p.id === id ? { ...i, qty: Math.max(1, Math.min(99, i.qty + d)) } : i
        )
      ),
    remove: (id) => setCart((c) => c.filter((i) => i.p.id !== id)),
    removeStore: (st) =>
      setCart((c) => c.filter((i) => (i.p.store || i.p.justipper) !== st)),
    clear: () => setCart([]),
  };
}
