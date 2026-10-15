# Justip (Tahap 1: Splash + Beranda sementara)
```
npm install
npm run dev          # development
npm run build        # build produksi -> dist/
npm run build:single # 1 file HTML untuk live preview -> dist-single/index.html
```

## Deploy ke Vercel

Import repository GitHub di Vercel, lalu atur **Root Directory** ke
`Justip 2.0/justip-react-tahap12/justip`. Gunakan **Build Command** `npm run build`
dan **Output Directory** `dist`. Vercel akan membangun ulang aplikasi saat ada
push baru ke branch yang terhubung.

Struktur: `src/components` (Splash, Logo, Home), `src/styles` (global, splash, home), `src/data.jsx` (data sementara).

## Tahap 2: Beranda, Kategori, Daftar Produk, Detail Barang
Navigasi: Beranda -> Kategori / Daftar Produk -> Detail (tombol kembali + bottom nav).
Halaman: `Home`, `Kategori`, `ProductList`, `Detail` di `src/components`. Data sementara di `src/data.js`.

## Tahap 3: Onboarding, Login, Daftar (3 peran)
Alur: Splash -> Onboarding -> Pilih Peran -> Login -> Beranda.
Daftar: Login -> Daftar -> Pilih Peran -> Form -> Verifikasi Email (kode demo 123456) -> Berhasil -> Beranda.
Peran: Pemesan, Justipper, Penjual (`src/components/auth/roles.js`). Dengan Firebase, pengguna dapat masuk memakai Google (pemilih akun selalu ditampilkan) atau email/password. Pendaftaran email membuat akun Firebase dan mengirim tautan verifikasi; Google langsung mendaftarkan atau masuk menggunakan peran yang dipilih. Satu akun Firebase dapat memiliki peran Pemesan dan Justipper sekaligus; pilih peran saat masuk dan gunakan menu Akun untuk berpindah peran. Akun lama tetap mempertahankan peran yang sudah terdaftar dan peran kedua ditambahkan saat akun yang sama masuk dengan peran tersebut. Tanpa konfigurasi, alur email/password dan pendaftaran hanya berjalan sebagai demo lokal.

## Tahap 4: Tampilan per peran
- `components/pemesan/PemesanApp.jsx`: Beranda, Kategori, Daftar Produk, Detail.
- `components/justipper/`: Saldo, toggle online, Pesanan Terdekat (terima pesanan), Peta, Pesanan, Saldo.
- `components/penjual/`: Toko, statistik, Produk Saya (tambah/ubah/aktif-nonaktif/hapus), Pesanan.

## Tahap 5: Checkout & Pembayaran
Alur: Detail -> Pesan Sekarang -> Checkout -> Alamat -> Pengiriman -> Pembayaran -> Konfirmasi -> Pembayaran Berhasil -> Pesanan.
State checkout ada di `components/checkout/checkout.js` (hook `useCheckout`).

## Tahap 6: Alur Justipper menerima & mengantar pesanan
Alur: Notifikasi Pesanan Baru -> Detail Pesanan -> Terima -> Detail Lokasi & Rute -> Konfirmasi Pengambilan -> Dalam Perjalanan -> Tiba di Lokasi -> Unggah Bukti (foto + tanda tangan) -> Pesanan Selesai.
Kode: `components/justipper/TripFlow.jsx` (8 layar), `MapView.jsx`, `tripArt.jsx`, gaya di `styles/trip.css`. Saldo & riwayat bertambah saat pesanan selesai.

## Tahap 7: Profil & Pengaturan Akun (semua peran)
`components/account/`: `Account.jsx` (beranda akun + menu + dialog keluar), `EditProfile`, `ChangePassword`, `Addresses`, `NotifSettings`, `HelpCenter`, data di `accountData.js`.
Tiap peran punya statistik, aksen warna, label alamat, topik notifikasi, dan FAQ sendiri. State profil/alamat/preferensi ada di `App.jsx`; alamat Pemesan dibagi dengan checkout (`useCheckout(addrs, setAddrs)`).

## Tahap 8: Tambah & Ubah Barang (Penjual)
`components/penjual/ProductForm.jsx`: foto produk (maks. 5, foto pertama = sampul), nama, kategori, harga (format Rp), stok, kondisi, keaslian, deskripsi, tombol Publikasikan dan Simpan Draf. Harga >= Rp 5.000.000 memunculkan lencana "bernilai tinggi" + kelengkapan (nota, garansi). Daftar produk menampilkan foto asli dan status Draf/Aktif/Nonaktif.

## Tahap 9: Kelola Pesanan Penjual
`components/penjual/SellerOrders.jsx` (daftar + tab Perlu Diproses / Diproses / Siap Diambil) dan `OrderDetail.jsx` (pembeli, jumlah barang, status pembayaran, linimasa). Alur: Perlu Diproses -> Proses Pesanan -> Konfirmasi Siap Diambil (dialog). Pesanan yang belum dibayar tidak bisa diproses. State pesanan di `PenjualApp.jsx`; badge jumlah pesanan baru di Beranda dan bottom nav.

## Tahap 10: Dompet & Pendapatan Justipper
`components/justipper/Wallet.jsx`: saldo tersedia, total penghasilan, dana sedang ditarik, tab Pendapatan (rincian jasa + ongkir per pesanan) / Transaksi / Penarikan (status Diproses -> Berhasil), halaman Tarik Saldo dan Rekening Pencairan (tambah, utama, hapus). Data & aturan demo di `walletData.js` (minimal tarik Rp 20.000, penarikan otomatis berhasil setelah 8 detik). State dompet di `JustipperApp.jsx`; pesanan selesai otomatis menambah penghasilan.

## Tahap 11: Kondisi Khusus
`components/states/StateView.jsx` (ilustrasi + komponen tampilan kondisi, `Offline` layar penuh) dan `styles/states.css`.
- **Barang tidak ditemukan:** pencarian di Daftar Produk kini berfungsi; hasil kosong menampilkan saran kata kunci.
- **Pembayaran gagal:** `checkout/FailedPage.jsx` (Coba Lagi / Ganti Metode / Kembali ke Checkout). Demo: OVO selalu gagal.
- **Pesanan dibatalkan:** `pemesan/OrderDetail.jsx`; batalkan dengan alasan, status pengembalian dana (Saldo Justip langsung, metode lain 1–3 hari kerja, COD tanpa pengembalian). Ada 1 pesanan contoh yang sudah dibatalkan.
- **Verifikasi akun:** `account/Verification.jsx` untuk Justipper (identitas) dan Penjual (toko): Belum, Ditinjau, Terverifikasi, Ditolak. Demo: hasil peninjauan dipilih manual.
- **Tidak ada koneksi:** mendeteksi `online/offline` browser; tombol "Demo: simulasikan tanpa koneksi" di halaman Akun.

## Tahap 12: Chat
`components/chat/`: `useChat.js` (Firestore realtime dan data demo), `ChatList.jsx`, `ChatRoom.jsx`, `chatData.js`.
Chat Pemesan <-> Justipper tersimpan dan diperbarui realtime melalui Cloud Firestore. Percakapan memerlukan lawan bicara yang sudah login dan memiliki profil Google Justip; chat dari produk/pesanan mencocokkan nama mitra/pemesan dengan profil tersebut. Chat Firebase menggunakan teks agar dapat berjalan tanpa mengaktifkan billing untuk Firebase Storage. Tanpa sesi Firebase, UI memakai data chat demo lokal dengan balasan otomatis dan lampiran demo.

### Menyiapkan Firebase
1. Buat project Firebase, tambahkan aplikasi Web, aktifkan **Google** dan **Email/Password** di Authentication > Sign-in method, lalu buat database Cloud Firestore dalam **Production mode**.
2. Salin `.env.example` ke `.env.local` dan isi nilai konfigurasi Web App dari Firebase Console. `storageBucket` boleh disalin dari konfigurasi walaupun Storage belum diaktifkan. Jangan commit `.env.local`. Untuk Vercel, masukkan variabel yang sama ke Project Settings > Environment Variables.
3. Tambahkan domain lokal/produksi ke Authentication > Settings > Authorized domains.
4. Dari folder `justip`, jalankan `firebase login`, `firebase use --add`, lalu `firebase deploy --only firestore:rules` untuk memasang rules dari `firestore.rules`.
5. `firebase.json` hanya memuat konfigurasi deploy rules; koleksi Firestore dibuat otomatis saat pengguna login/chat pertama kali.
