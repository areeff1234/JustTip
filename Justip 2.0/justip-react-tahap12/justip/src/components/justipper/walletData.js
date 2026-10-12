// Dompet Justipper (demo). Aturan penarikan di bawah adalah contoh, sesuaikan dengan kebijakan Justip.
export const MIN_WD = 20000;
export const BANKS = [['BCA', '#0a5db8'], ['BRI', '#0a4aa3'], ['Mandiri', '#e8a400'], ['BNI', '#e8590c']];
export const bankColor = (n) => BANKS.find(([b]) => b === n)?.[1] ?? '#38bdf8';
export const mask = (no) => `•••• ${no.slice(-4)}`;
export const stamp = () => `Hari ini, ${new Date().toTimeString().slice(0, 5)}`;
// type: in = penghasilan pesanan, out = penarikan (status: proses | ok)
export const TX0 = [
  { id: 3, type: 'in', title: 'Pembayaran QRIS Titipan Sepatu (#JT-2041)', jasa: 15000, amount: 350000, time: 'Hari ini, 08:12' },
  { id: 2, type: 'in', title: 'Komisi Jastip Kemeja Flannel (#JT-2038)', jasa: 10000, amount: 10000, time: 'Kemarin, 17:40' },
  { id: 1, type: 'in', title: 'Pembayaran QRIS Buku Diktat TI (#JT-2030)', jasa: 8000, amount: 93000, time: 'Kemarin, 11:05' },
];
