// Chat antar peran (demo). Menghubungkan Konsumen/Pemesan langsung dengan Justipper.
export const hm = () => new Date().toTimeString().slice(0, 5);
export const ROLE_LABEL = { pemesan: 'Konsumen', justipper: 'Justipper' };
export const QUICK = {
  pemesan: ['Apakah barang titipan ini masih bisa dibeli?', 'Bisa nego fee jasa titip?', 'Estimasi sampai kapan ya kak?'],
  justipper: ['Bisa banget kak, siap saya belikan!', 'Barang sudah saya amankan ya.', 'Sedang dalam perjalanan ke lokasimu.'],
};
const AUTO = {
  justipper: ['Siap kak, barang titipan langsung saya belikan ya!', 'Baik kak, nanti saya update foto struk belanjanya ya.'],
  pemesan: ['Baik kak, terima kasih banyak ya!', 'Oke kak, kabari kalau sudah jalan ya.'],
};
export const autoReply = (role, n) => AUTO[role][n % AUTO[role].length];

const P = (name, price, art) => ({ type: 'product', name, price, art });
export const SEED = [
  {
    id: 'c1',
    pemesan: { name: 'Nur Arif', me: true },
    other: { role: 'justipper', name: 'Hafiz Anggara' },
    ctx: { type: 'order', no: '#JST882910', name: 'Sneakers Nike Air Force 1 07' },
    unread: { pemesan: 0, justipper: 1 },
    msgs: [
      { id: 1, from: 'pemesan', text: 'Halo Fiz, titipan sepatu Nike Air Force 1 sudah ku bayar ya. Besok sore serah terima di Gedung TI kampus kan?', time: '10:16' },
      { id: 2, from: 'justipper', text: 'Halo Rif! Siap, barang sudah ku belikan di Foot Locker Malioboro. Besok pas selesai kelas algoritma langsung ku antar ke parkiran TI ya!', time: '10:18' },
    ],
  },
  {
    id: 'c2',
    pemesan: { name: 'Nur Arif', me: true },
    other: { role: 'justipper', name: 'Hafiz Anggara' },
    ctx: { type: 'product', name: 'Bakpia Kukus Tugu Jogja Original', price: 55000, art: 'food' },
    unread: { pemesan: 1, justipper: 0 },
    msgs: [
      { id: 1, from: 'justipper', text: 'Rif, besok aku mampir ke Stasiun Tugu. Mau sekalian titip Bakpia Kukus Tugu yang varian keju apa coklat?', time: '11:05' },
    ],
  },
];

// tampilan percakapan dari sudut pandang peran tertentu
export const peerOf = (c, role) => (role === 'pemesan' ? c.other.role : 'pemesan');
export const view = (c, role) => {
  const last = c.msgs[c.msgs.length - 1];
  return {
    name: role === 'pemesan' ? c.other.name : c.pemesan.name, label: ROLE_LABEL[peerOf(c, role)],
    last: last ? `${last.from === role ? 'Kamu: ' : ''}${last.img ? 'Foto' : last.text}` : 'Belum ada pesan', time: last?.time ?? '', unread: c.unread[role] || 0,
  };
};
export const visible = (convs, role) => convs.filter((c) => (role === 'pemesan' ? c.pemesan.me : c.other.role === role && c.msgs.length));
