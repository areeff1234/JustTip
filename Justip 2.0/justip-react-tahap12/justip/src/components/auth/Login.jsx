import { useEffect, useState } from 'react';
import { Field, BackBtn, Wordmark } from './AuthUI.jsx';
import { isEmail, isPhone, roleName } from './roles.js';
import { DUMMY_USERS } from '../../context/JustipContext.jsx';
import { firebaseConfigured, requestPasswordReset } from '../../firebase.js';

export default function Login({ role, back, goRegister, onLogin, onGoogleLogin, onEmailLogin, onSecretAdmin, initialError }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState({});
  const [googleError, setGoogleError] = useState(initialError || '');
  const [loginError, setLoginError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [taps, setTaps] = useState(0);

  useEffect(() => {
    if (initialError) setGoogleError(initialError);
  }, [initialError]);

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!id.trim()) er.id = 'Email wajib diisi.';
    else if (firebaseConfigured ? !isEmail(id.trim()) : (!isEmail(id.trim()) && !isPhone(id))) {
      er.id = firebaseConfigured ? 'Masukkan alamat email yang valid.' : 'Masukkan email atau nomor telepon yang valid.';
    }
    if (!pw) er.pw = 'Password wajib diisi.';
    else if (pw.length < 6) er.pw = 'Password minimal 6 karakter.';
    setErr(er);
    if (Object.keys(er).length) return;
    if (firebaseConfigured) {
      setBusy(true);
      setLoginError('');
      try {
        onLogin(await onEmailLogin(role, id.trim(), pw));
      } catch (error) {
        const messages = {
          'auth/invalid-credential': 'Email atau password tidak cocok.',
          'auth/invalid-email': 'Format email tidak valid.',
          'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
          'auth/operation-not-allowed': 'Login email belum diaktifkan di Firebase Authentication.',
          'auth/email-not-verified': 'Email belum diverifikasi. Periksa email—halaman verifikasi akan dibuka otomatis.',
        };
        setLoginError(messages[error.code] || messages[error.message] || error.message || 'Login gagal. Silakan coba lagi.');
      } finally {
        setBusy(false);
      }
      return;
    }
    setBusy(true);
    setTimeout(() => onLogin({ role, name: id.includes('@') ? id.split('@')[0] : id, email: isEmail(id.trim()) ? id.trim() : '', phone: isEmail(id.trim()) ? '' : id.trim() }), 700);
  };
  const google = async () => {
    setBusy(true);
    setGoogleError('');
    try {
      const user = await onGoogleLogin(role);
      onLogin(user);
    } catch (error) {
      const messages = {
        'auth/unauthorized-domain': 'Domain aplikasi belum diizinkan di Firebase Authentication.',
        'auth/popup-blocked': 'Popup login diblokir browser. Izinkan popup lalu coba lagi.',
        'auth/popup-closed-by-user': 'Jendela login ditutup sebelum selesai.',
      };
      setGoogleError(messages[error.code] || error.message || 'Login Google gagal. Silakan coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!isEmail(id.trim())) {
      setErr((current) => ({ ...current, id: 'Masukkan email akun untuk menerima tautan pemulihan.' }));
      setResetMessage('');
      return;
    }
    setResetBusy(true);
    setResetMessage('');
    try {
      await requestPasswordReset(id.trim());
      setResetMessage('Tautan untuk mengatur ulang kata sandi sudah dikirim. Periksa email dan folder spam.');
    } catch (error) {
      const messages = {
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
        'auth/operation-not-allowed': 'Pemulihan kata sandi belum diaktifkan.',
      };
      setResetMessage(messages[error.code] || error.message || 'Tautan pemulihan gagal dikirim.');
    } finally {
      setResetBusy(false);
    }
  };

  const handleDevTap = () => {
    const next = taps + 1;
    setTaps(next);
    if (next >= 3) {
      setTaps(0);
      if (onSecretAdmin) onSecretAdmin();
    }
  };

  return (
    <form className="auth" onSubmit={submit} noValidate>
      <BackBtn onClick={back} />
      <Wordmark />
      <h1 className="h2 login-title">Selamat datang kembali!</h1>
      <p className="lead c">Masuk sebagai {roleName(role)}. Email yang sama bisa digunakan untuk Pemesan dan Justipper.</p>

      {!firebaseConfigured && <>
      {/* 1-Click Login Dummy Account */}
      {role === 'pemesan' && (
        <div style={{ marginBottom: 14, padding: '10px 12px', background: '#f0f9ff', border: '1px dashed #38bdf8', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: 0.5 }}>⚡ Akun Dummy Pelanggan</span>
            <span style={{ fontSize: 10, background: '#e0f2fe', color: '#0284c7', padding: '1px 6px', borderRadius: 6, fontWeight: 700 }}>1-Click Login</span>
          </div>
          <button
            type="button"
            className="btn out"
            style={{ width: '100%', borderColor: '#38bdf8', background: '#fff', color: '#0284c7', fontWeight: 700, padding: '9px 12px', fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => {
              setId(DUMMY_USERS.pemesan.email);
              setPw('pelanggan123');
              setBusy(true);
              setTimeout(() => onLogin(DUMMY_USERS.pemesan), 300);
            }}
          >
            Masuk Cepat: <b>Nur Arif</b> (Pelanggan)
          </button>
        </div>
      )}

      {role === 'justipper' && (
        <div style={{ marginBottom: 14, padding: '10px 12px', background: '#f0fdf4', border: '1px dashed #22c55e', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: 0.5 }}>⚡ Akun Dummy Mitra Jastip</span>
            <span style={{ fontSize: 10, background: '#dcfce7', color: '#16a34a', padding: '1px 6px', borderRadius: 6, fontWeight: 700 }}>1-Click Login</span>
          </div>
          <button
            type="button"
            className="btn out"
            style={{ width: '100%', borderColor: '#22c55e', background: '#fff', color: '#15803d', fontWeight: 700, padding: '9px 12px', fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => {
              setId(DUMMY_USERS.justipper.email);
              setPw('mitra123');
              setBusy(true);
              setTimeout(() => onLogin(DUMMY_USERS.justipper), 300);
            }}
          >
            Masuk Cepat: <b>Hafiz Anggara</b> (Mitra TI)
          </button>
        </div>
      )}

      {role === 'admin' && (
        <div style={{ marginBottom: 14, padding: '10px 12px', background: '#f8fafc', border: '1px dashed #64748b', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>⚡ Akun Developer & Admin</span>
            <span style={{ fontSize: 10, background: '#e2e8f0', color: '#475569', padding: '1px 6px', borderRadius: 6, fontWeight: 700 }}>1-Click Login</span>
          </div>
          <button
            type="button"
            className="btn out"
            style={{ width: '100%', borderColor: '#64748b', background: '#fff', color: '#334155', fontWeight: 700, padding: '9px 12px', fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => {
              setId(DUMMY_USERS.admin.email);
              setPw('bitforce123');
              setBusy(true);
              setTimeout(() => onLogin(DUMMY_USERS.admin), 300);
            }}
          >
            Masuk Cepat: <b>Tim Bitforce</b> (Admin)
          </button>
        </div>
      )}

      <Field icon="mail" placeholder={firebaseConfigured ? 'Email' : 'Email atau nomor telepon'} value={id} onChange={setId} error={err.id} autoComplete={firebaseConfigured ? 'email' : 'username'} />
      <Field icon="lock" type="password" placeholder="Password" value={pw} onChange={setPw} error={err.pw} autoComplete="current-password" />
      <div className="rowx">
        <label className="chk"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span /> Ingat saya</label>
      </div>
      <button className="btn wide" disabled={busy}>{busy ? 'Memproses...' : 'Masuk'}</button>
      <div className="or"><span>atau</span></div>
      </>}
      {firebaseConfigured && <>
        <Field icon="mail" type="email" placeholder="Email" value={id} onChange={setId} error={err.id} autoComplete="email" />
        <Field icon="lock" type="password" placeholder="Password" value={pw} onChange={setPw} error={err.pw} autoComplete="current-password" />
        <div className="rowx">
          <span />
          <button type="button" className="lnk" onClick={resetPassword} disabled={busy || resetBusy}>
            {resetBusy ? 'Mengirim tautan...' : 'Lupa kata sandi?'}
          </button>
        </div>
        {resetMessage && <p className="reset-message" role="status">{resetMessage}</p>}
        <button className="btn wide" disabled={busy}>{busy ? 'Memproses...' : 'Masuk dengan Email'}</button>
        <div className="or"><span>atau masuk dengan</span></div>
      </>}
      <button type="button" className="btn out" onClick={google} disabled={busy || !firebaseConfigured}><i className="g-ic">G</i> Lanjut dengan Google</button>
      {loginError && <p className="ferr c" role="alert">{loginError}</p>}
      {googleError && <p className="ferr c" role="alert">{googleError}</p>}
      {!firebaseConfigured && <p className="foot">Login Google akan aktif setelah konfigurasi Firebase dipasang.</p>}
      <p className="foot">Belum punya akun? <button type="button" className="lnk" onClick={goRegister}>Daftar</button></p>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button
          type="button"
          onClick={handleDevTap}
          style={{ background: 'none', border: 'none', fontSize: 11, color: '#94a3b8', cursor: 'pointer', padding: '4px 8px' }}
        >
          JustTip v0.12 · Bitforce TI {taps > 0 ? `(${taps}/3)` : ''}
        </button>
      </div>
    </form>
  );
}
