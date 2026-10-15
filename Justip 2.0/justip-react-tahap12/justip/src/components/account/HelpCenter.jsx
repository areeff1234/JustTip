import { useState } from 'react';
import { Ic } from '../ui.jsx';
import { FAQ } from './accountData.js';
import { Bar, Fld } from './parts.jsx';

const SUPPORT_EMAIL = 'n.arif5181@gmail.com';

const LEGAL_CONTENT = {
  terms: {
    title: 'Syarat & Ketentuan',
    updated: 'Terakhir diperbarui: 16 Oktober 2026',
    sections: [
      ['1. Ruang lingkup layanan', 'Justip membantu pemesan menemukan Jastipper dan mengelola permintaan titipan, komunikasi, serta informasi pesanan. Ketersediaan barang, pembelian, kondisi barang, dan penyerahan tetap perlu dikonfirmasi antara Pemesan dan Jastipper melalui aplikasi.'],
      ['2. Akun dan keamanan', 'Pengguna wajib memberikan informasi yang benar, menjaga akses ke akun, dan tidak menggunakan akun orang lain. Aktivitas yang dilakukan melalui akun menjadi tanggung jawab pemilik akun. Hubungi Pusat Bantuan jika menduga akun digunakan tanpa izin.'],
      ['3. Pesanan dan pembayaran', 'Periksa nama barang, jumlah, harga, biaya jasa, metode pembayaran, serta titik temu sebelum mengonfirmasi pesanan. Ikuti jumlah dan cara pembayaran yang ditampilkan pada pesanan; pembayaran QRIS atau COD dapat dilakukan langsung sesuai kesepakatan dan informasi transaksi. Jangan membagikan PIN, kata sandi, atau kode OTP kepada siapa pun.'],
      ['4. Tanggung jawab pengguna', 'Pemesan dan Jastipper bertanggung jawab berkomunikasi dengan sopan, memberikan informasi pesanan yang akurat, dan menyepakati waktu serta lokasi serah terima. Jangan menawarkan barang yang dilarang hukum, berbahaya, palsu, atau melanggar hak pihak lain.'],
      ['5. Pembatalan dan kendala', 'Jika terjadi keterlambatan, barang tidak tersedia, pembayaran bermasalah, atau perselisihan, hubungi pihak terkait melalui chat dan Pusat Bantuan. Pengembalian dana atau penyelesaian mengikuti status pembayaran, kesepakatan para pihak, dan ketentuan penyedia pembayaran jika digunakan.'],
      ['6. Ketersediaan aplikasi', 'Fitur dapat berubah, dihentikan sementara, atau tidak tersedia karena pemeliharaan, gangguan jaringan, atau layanan pihak ketiga. Informasi demo atau simulasi dalam aplikasi bukan bukti bahwa pembayaran atau pengiriman dana sungguhan telah terjadi.'],
      ['7. Perubahan ketentuan', 'Ketentuan dapat diperbarui untuk mencerminkan perubahan layanan atau aturan yang berlaku. Versi terbaru akan ditampilkan di halaman ini. Dengan tetap menggunakan Justip setelah perubahan berlaku, pengguna dianggap telah membaca ketentuan terbaru.'],
      ['8. Kontak', `Pertanyaan atau pengaduan dapat disampaikan ke ${SUPPORT_EMAIL}.`],
    ],
  },
  privacy: {
    title: 'Kebijakan Privasi',
    updated: 'Terakhir diperbarui: 16 Oktober 2026',
    sections: [
      ['1. Informasi yang digunakan', 'Justip dapat menggunakan nama, alamat email, nomor telepon, foto profil, pilihan peran, informasi alamat atau titik temu, detail pesanan, dan isi chat yang diberikan atau dibuat saat menggunakan fitur aplikasi. Informasi autentikasi dikelola oleh penyedia login; Justip tidak meminta kata sandi Google.'],
      ['2. Tujuan penggunaan', 'Informasi digunakan untuk membuat dan mengamankan akun, menampilkan profil, menjalankan pesanan dan chat, mengirim pemberitahuan yang dipilih pengguna, membantu menyelesaikan kendala, serta menjaga fungsi dan keamanan layanan.'],
      ['3. Penyimpanan dan penyedia layanan', 'Aplikasi dapat menyimpan preferensi dan data demo di perangkat. Saat Firebase dikonfigurasi, autentikasi, profil, dan chat tertentu diproses melalui Firebase/Google. Email bantuan dikirim melalui aplikasi email pengguna. Penyedia tersebut memproses data sesuai kebijakan mereka sendiri.'],
      ['4. Pembagian informasi', 'Informasi pesanan yang diperlukan dapat terlihat oleh pihak yang terlibat dalam transaksi, misalnya nama pemesan, detail barang, dan titik temu bagi Jastipper. Jangan menuliskan kata sandi, kode OTP, data kartu pembayaran, atau informasi sangat sensitif di chat. Justip tidak menjual informasi pribadi pengguna.'],
      ['5. Notifikasi dan pilihan pengguna', 'Pengguna dapat mengubah preferensi notifikasi di Profil. Notifikasi perangkat juga memerlukan izin browser. Pengguna dapat mencabut izin melalui pengaturan browser. Sebagian pemberitahuan mungkin tidak tersedia jika layanan terkait belum dikonfigurasi.'],
      ['6. Keamanan dan masa simpan', 'Kami menggunakan kontrol aplikasi dan layanan penyedia untuk membatasi akses, tetapi tidak ada sistem transmisi atau penyimpanan yang dapat dijamin aman sepenuhnya. Data disimpan selama diperlukan untuk fungsi layanan, penyelesaian kendala, atau kewajiban yang berlaku.'],
      ['7. Hak dan permintaan pengguna', `Untuk meminta koreksi atau penghapusan informasi akun, ajukan permintaan ke ${SUPPORT_EMAIL} dari alamat email yang terdaftar. Permintaan dapat memerlukan verifikasi kepemilikan akun dan tunduk pada data yang masih diperlukan untuk layanan atau kewajiban yang berlaku.`],
      ['8. Perubahan kebijakan', 'Kebijakan ini dapat diperbarui jika fitur atau cara pengelolaan data berubah. Versi terbaru akan ditampilkan di halaman ini.'],
    ],
  },
};

export default function HelpCenter({ role, back, say }) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState('');
  const [chatForm, setChatForm] = useState({ name: '', email: '', message: '' });
  const list = FAQ[role].filter(([a, b]) => (a + b).toLowerCase().includes(q.trim().toLowerCase()));
  const updateChat = (key) => (value) => setChatForm((current) => ({ ...current, [key]: value }));
  const openSupportEmail = (event) => {
    event.preventDefault();
    const subject = `Bantuan Justip - ${chatForm.name.trim()}`;
    const body = [
      `Nama: ${chatForm.name.trim()}`,
      `Email balasan: ${chatForm.email.trim()}`,
      '',
      chatForm.message.trim(),
    ].join('\n');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (page === 'terms' || page === 'privacy') {
    const document = LEGAL_CONTENT[page];
    return (
      <>
        <Bar title={document.title} back={() => setPage('')} />
        <main className="scroll pad acc a-legal">
          <p className="a-legal-date">{document.updated}</p>
          {document.sections.map(([heading, body]) => (
            <section key={heading}>
              <h3>{heading}</h3>
              <p>{body}</p>
            </section>
          ))}
        </main>
      </>
    );
  }

  if (page === 'chat') {
    return (
      <>
        <Bar title="Chat Bantuan" back={() => setPage('')} />
        <form className="a-form" onSubmit={openSupportEmail}>
          <main className="scroll pad acc">
            <p className="lead">Ceritakan kendalamu. Tombol kirim akan membuka aplikasi email dengan pesan yang sudah disiapkan untuk tim Justip.</p>
            <Fld label="Nama" icon="user" placeholder="Nama kamu" value={chatForm.name} onChange={updateChat('name')} autoComplete="name" />
            <Fld label="Email untuk balasan" icon="mail" type="email" placeholder="Email kamu" value={chatForm.email} onChange={updateChat('email')} autoComplete="email" />
            <label className="a-lab" htmlFor="support-message">Pesan</label>
            <textarea
              id="support-message"
              className="a-support-textarea"
              value={chatForm.message}
              onChange={(event) => updateChat('message')(event.target.value)}
              placeholder="Jelaskan pertanyaan atau kendalamu..."
              required
              rows={6}
              maxLength={3000}
            />
            <p className="a-hint">Email tujuan: {SUPPORT_EMAIL}. Pastikan aplikasi email di perangkatmu sudah disiapkan.</p>
          </main>
          <footer className="co-bar solo">
            <button className="btn wide" type="submit" disabled={!chatForm.name.trim() || !chatForm.email.trim() || !chatForm.message.trim()}>
              Buka email untuk mengirim
            </button>
          </footer>
        </form>
      </>
    );
  }

  return (
    <>
      <Bar title="Pusat Bantuan" back={back} />
      <main className="scroll pad acc">
        <label className="search"><Ic n="search" size={20} /><input placeholder="Cari bantuan..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari bantuan" /></label>
        <h3 className="a-gt">Pertanyaan Umum</h3>
        <div className="a-faq">
          {list.map(([a, b]) => (<details key={a}><summary>{a}<Ic n="chevD" size={16} /></summary><p>{b}</p></details>))}
          {!list.length && <p className="empty">Tidak ada hasil untuk "{q}".</p>}
        </div>
        <h3 className="a-gt">Butuh bantuan lain?</h3>
        <div className="a-contact">
          <a href={`mailto:${SUPPORT_EMAIL}`}><span className="a-ri"><Ic n="mail" size={20} /></span><b>Email</b><small>{SUPPORT_EMAIL}</small></a>
          <button type="button" onClick={() => setPage('chat')}><span className="a-ri"><Ic n="chat" size={20} /></span><b>Chat Bantuan</b><small>Hubungi tim Justip melalui email</small></button>
        </div>
        <div className="a-group">
          <button className="a-row" type="button" onClick={() => setPage('terms')}><span className="a-ri"><Ic n="clip" size={20} /></span><span><b>Syarat & Ketentuan</b></span><Ic n="chevR" size={16} /></button>
          <button className="a-row" type="button" onClick={() => setPage('privacy')}><span className="a-ri"><Ic n="shield" size={20} /></span><span><b>Kebijakan Privasi</b></span><Ic n="chevR" size={16} /></button>
        </div>
      </main>
    </>
  );
}
