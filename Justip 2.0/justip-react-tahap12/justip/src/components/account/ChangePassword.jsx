import { useState } from 'react';
import { Bar, Fld } from './parts.jsx';
import { auth, firebaseConfigured, requestPasswordReset, setAccountPassword } from '../../firebase.js';

const score = (v) => [v.length >= 8, /\d/.test(v), /[A-Z]/.test(v) || /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
const LV = ['Terlalu pendek', 'Lemah', 'Cukup', 'Kuat'];

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Kata sandi lama tidak cocok.',
  'auth/wrong-password': 'Kata sandi lama tidak cocok.',
  'auth/weak-password': 'Kata sandi baru terlalu lemah.',
  'auth/requires-recent-login': 'Sesi sudah lama. Keluar lalu masuk kembali sebelum mengubah kata sandi.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
  'auth/user-not-found': 'Akun dengan email tersebut tidak ditemukan.',
  'auth/invalid-email': 'Alamat email akun tidak valid.',
  'auth/operation-not-allowed': 'Login email dan kata sandi belum diaktifkan.',
  'auth/credential-already-in-use': 'Email ini sudah terhubung ke akun lain. Gunakan akun tersebut untuk login.',
  'auth/provider-already-linked': 'Akun ini sudah memiliki kata sandi. Keluar lalu masuk dengan email dan kata sandi untuk mengubahnya.',
  'auth/popup-closed-by-user': 'Verifikasi Google dibatalkan. Coba lagi untuk menyimpan kata sandi.',
  'auth/popup-blocked': 'Pop-up Google diblokir browser. Izinkan pop-up lalu coba lagi.',
  'auth/cancelled-popup-request': 'Permintaan verifikasi Google dibatalkan. Coba lagi.',
};

export default function ChangePassword({ back, say, acc }) {
  const [f, setF] = useState({ old: '', pw: '', pw2: '' });
  const [err, setErr] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const sc = f.pw ? (f.pw.length < 8 ? 0 : score(f.pw)) : -1;
  const user = auth?.currentUser;
  const providerIds = user?.providerData.map(({ providerId }) => providerId) || [];
  const hasPasswordProvider = providerIds.includes('password');
  const canSetPassword = Boolean(firebaseConfigured && user?.email && (hasPasswordProvider || providerIds.includes('google.com')));

  const resetPassword = async () => {
    setResetBusy(true);
    setMessage('');
    try {
      await requestPasswordReset(user?.email || acc?.profile?.email);
      setMessage('Tautan untuk mengatur ulang kata sandi sudah dikirim ke email akunmu.');
    } catch (error) {
      setMessage(AUTH_ERRORS[error.code] || error.message || 'Tautan pemulihan gagal dikirim.');
    } finally {
      setResetBusy(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (hasPasswordProvider && !f.old) er.old = 'Masukkan kata sandi lama.';
    if (f.pw.length < 8) er.pw = 'Kata sandi baru minimal 8 karakter.';
    else if (hasPasswordProvider && f.pw === f.old) er.pw = 'Kata sandi baru harus berbeda dari yang lama.';
    if (f.pw2 !== f.pw || !f.pw2) er.pw2 = 'Konfirmasi kata sandi tidak sama.';
    setErr(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    setMessage('');
    try {
      await setAccountPassword(f.pw, f.old);
      say(hasPasswordProvider ? 'Kata sandi berhasil diubah.' : 'Kata sandi Justip berhasil dibuat. Sekarang kamu bisa login dengan email.');
      back();
    } catch (error) {
      setMessage(AUTH_ERRORS[error.code] || error.message || 'Kata sandi gagal diubah.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="a-form" onSubmit={submit} noValidate>
      <Bar title="Ubah Kata Sandi" back={back} />
      <main className="scroll pad acc">
        <p className="lead">Gunakan kombinasi huruf, angka, dan simbol agar akunmu lebih aman.</p>
        {canSetPassword ? (
          <>
            {hasPasswordProvider && (
              <Fld label="Kata sandi lama" icon="lock" type="password" placeholder="Kata sandi lama" value={f.old} onChange={set('old')} error={err.old} autoComplete="current-password" />
            )}
            {!hasPasswordProvider && (
              <p className="lead">Akunmu masuk dengan Google, jadi tidak memiliki kata sandi lama Justip. Saat menyimpan, Google akan meminta verifikasi sebagai penggantinya.</p>
            )}
            <Fld label="Kata sandi baru" icon="lock" type="password" placeholder="Kata sandi baru" value={f.pw} onChange={set('pw')} error={err.pw} autoComplete="new-password" />
            {sc >= 0 && (
              <div className={`a-str s${sc}`} aria-live="polite"><span><i /><i /><i /></span><small>Kekuatan: {LV[sc]}</small></div>
            )}
            <Fld label="Ulangi kata sandi baru" icon="lock" type="password" placeholder="Ulangi kata sandi baru" value={f.pw2} onChange={set('pw2')} error={err.pw2} autoComplete="new-password" />
            <button className="lnk resend" type="button" onClick={resetPassword} disabled={resetBusy}>
              {resetBusy ? 'Mengirim tautan...' : 'Lupa password? Kirim tautan pemulihan'}
            </button>
          </>
        ) : (
          <p className="lead" role="status">
            {!firebaseConfigured
              ? 'Pengaturan kata sandi memerlukan akun email yang terhubung.'
              : providerIds.includes('google.com')
                ? 'Akun ini masuk dengan Google. Kelola kata sandi melalui akun Google-mu.'
                : 'Akun email dan kata sandi tidak tersedia untuk sesi ini.'}
          </p>
        )}
        {message && <p className={message.startsWith('Tautan untuk') ? 'a-pass-message' : 'ferr'} role="status">{message}</p>}
      </main>
      {canSetPassword && (
        <footer className="co-bar solo"><button className="btn wide" disabled={busy || resetBusy}>{busy ? 'Menyimpan...' : 'Simpan Kata Sandi'}</button></footer>
      )}
    </form>
  );
}
