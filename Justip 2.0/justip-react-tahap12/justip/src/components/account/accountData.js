// Konfigurasi Profil & Pengaturan per peran untuk Justip Kampus
export const ACC = {
  pemesan: { name: 'Pemesan', icon: 'user', addrTitle: null, addrSub: null, types: [], extra: null },
  justipper: { name: 'Justipper', icon: 'scooter', addrTitle: 'Lokasi Basecamp & Rute', addrSub: 'area standby & rute COD', types: ['Kampus', 'Kos', 'Lainnya'], extra: ['pin', 'Area standby / rute jastip'],
    verif: { title: 'Verifikasi Identitas & Jastiper', docs: [['ktp', 'Foto KTM / KTP'], ['selfie', 'Selfie dengan Kartu Identitas'], ['dom', 'Bukti Mahasiswa / Domisili', true]] } },
  admin: { name: 'Admin / Dev', icon: 'shield', addrTitle: 'Posko Operasional', addrSub: 'sekretariat tim Bitforce', types: ['Kampus', 'Headquarter'], extra: ['shield', 'NIM / Kode Akses Bitforce'] },
};
export const ADDR0 = {
  justipper: [{ id: 1, label: 'Basecamp Utama', name: 'Hafiz Anggara', phone: '+62 812 3456 7890', text: 'Gedung TI Lt. 2 Kampus Unsoed, Purwokerto', short: 'Kampus TI, Purwokerto' }],
  admin: [{ id: 1, label: 'Sekretariat Bitforce', name: 'Admin JustTip', phone: '+62 812 3456 7890', text: 'Laboratorium Rekayasa Perangkat Lunak Gedung TI, Purwokerto', short: 'Lab RPL TI, Unsoed' }],
};
// [kunci, judul, keterangan, aktif-awal]
export const TOPICS = {
  pemesan: [['order', 'Status titipan', 'Notifikasi update status & perjalanan jastiper', true], ['chat', 'Pesan chat', 'Balasan langsung dari Jastiper', true], ['promo', 'Info rute baru', 'Pemberitahuan saat jastiper buka rute titipan baru', false]],
  justipper: [['new', 'Titipan masuk', 'Langsung tahu saat ada pesanan titipan baru dari teman kampus', true], ['order', 'Pembaruan pesanan', 'Perubahan atau konfirmasi dari pembeli', true], ['payment', 'Bagi Hasil & QRIS', 'Notifikasi transfer masuk hasil transaksi titipan', true]],
  admin: [['revenue', 'Laporan Bagi Hasil', 'Akumulasi fee platform 2,5% transaksi', true], ['verif', 'Pengajuan Verifikasi Mitra', 'KTM/KTP jastiper baru masuk', true], ['monitoring', 'Monitoring Settlement', 'Pencatatan real-time QRIS & COD', true]],
};
export const initPrefs = () => Object.fromEntries(Object.entries(TOPICS).map(([r, l]) => [r, { push: false, email: false, t: Object.fromEntries(l.map(([k, , , on]) => [k, on])) }]));

export const notificationPrefsKey = (session) => (
  `justip_notification_prefs_${session?.uid || session?.email || session?.name || 'guest'}`
);

export const loadNotificationPrefs = (session) => {
  const defaults = initPrefs();
  try {
    const saved = JSON.parse(localStorage.getItem(notificationPrefsKey(session)) || 'null');
    if (!saved || typeof saved !== 'object') return defaults;
    return Object.fromEntries(Object.entries(defaults).map(([role, initial]) => {
      const stored = saved[role] || {};
      return [role, {
        push: stored.push === true,
        email: stored.email === true,
        t: Object.fromEntries(Object.entries(initial.t).map(([topic, enabled]) => [
          topic,
          typeof stored.t?.[topic] === 'boolean' ? stored.t[topic] : enabled,
        ])),
      }];
    }));
  } catch (error) {
    console.error('Gagal memuat preferensi notifikasi:', error);
    return defaults;
  }
};

export const saveNotificationPrefs = (session, prefs) => {
  try {
    localStorage.setItem(notificationPrefsKey(session), JSON.stringify(prefs));
  } catch (error) {
    console.error('Gagal menyimpan preferensi notifikasi:', error);
  }
};
export const FAQ = {
  pemesan: [
    ['Gimana cara jastip di Justip?', 'Pilih barang yang tersedia di katalog atau buat request titipan bebas. Tentukan titik temu COD di area kampus yang sudah disediakan Jastiper, lalu bayar pakai QRIS atau bayar tunai (COD) pas serah terima.'],
    ['Apakah ada ongkos kirim ekspedisi?', 'Nggak ada! Sistem Justip 100% COD di titik temu kampus (misal Gedung TI, Kantin, Halte Kampus), jadi bebas biaya kurir/ekspedisi.'],
    ['Gimana alur pembayaran QRIS?', 'Pilih metode QRIS pas checkout. Sistem akan menampilkan kode QRIS resmi dengan nominal pas. Pembayaran otomatis di-split: 97,5% langsung ke rekening Mitra Jastiper & 2,5% ke Kas Developer tanpa ada sistem saldo mengendap.'],
    ['Gimana kalau mau bayar tunai (COD)?', 'Pilih opsi COD pas checkout. Kamu cukup bawa uang pas saat ketemuan di titik temu kampus yang udah disepakati.'],
    ['Bisa chat langsung sama Jastiper?', 'Bisa banget! Tekan tombol chat untuk janjian waktu temu atau tanya detail barang titipanmu.'],
  ],
  justipper: [
    ['Gimana cara buka slot titipan?', 'Buka tab Titipan atau tekan tombol Tambah Titipan di Beranda. Masukkan nama barang, foto, harga beli, dan jasa titip yang kamu tentukan.'],
    ['Gimana cara nentuin titik temu COD?', 'Buka menu Titik Temu COD di Beranda Jastiper. Kamu bisa tambah atau hapus titik temu kampus yang strategis (misal Gazebo TI, Kantin Teknik). Pembeli nanti memilih dari daftar titik yang kamu buat.'],
    ['Gimana cara pasang foto QRIS toko?', 'Buka menu QRIS Toko di Beranda Jastiper. Upload foto kode QRIS tokomu dan simpan. Saat pembeli scan QRIS, dana otomatis langsung ditransfer ke rekening bank kamu tanpa perlu repot tarik saldo.'],
    ['Apakah ada saldo dompet yang mengendap di aplikasi?', 'Tidak ada! JustTip menggunakan sistem Direct Transfer & Split Payment. Uang hasil jastip langsung masuk ke rekening bank mitra tanpa ada dana yang tertahan di aplikasi. Untuk transaksi COD, jastiper cukup transfer fee platform 2,5% via QRIS Developer saat pesanan selesai.'],
  ],
};
