import { useState } from 'react';
import { Field, BackBtn, Wordmark } from './AuthUI.jsx';
import { isEmail, isPhone, roleName } from './roles.js';
import { DUMMY_USERS } from '../../context/JustipContext.jsx';

const Apple = () => <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M16.400 12.600c0-2.300 1.900-3.400 2-3.500-1.100-1.600-2.800-1.800-3.400-1.800-1.400-.1-2.800.9-3.500.9s-1.800-.8-3-.8c-1.500 0-3 .9-3.800 2.300-1.600 2.800-.4 7 1.200 9.300.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7 2-1.100 2.800-2.200c.9-1.300 1.200-2.500 1.300-2.600-.1 0-2.500-1-2.500-3.900zM14.100 5.700c.6-.8 1.100-1.900.9-3-.9 0-2.100.6-2.700 1.400-.6.7-1.100 1.800-1 2.900 1 .1 2.100-.5 2.800-1.300z" /></svg>;

export default function Login({ role, back, goRegister, onLogin, onSecretAdmin }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [taps, setTaps] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!id.trim()) er.id = 'Email atau nomor telepon wajib diisi.';
    else if (!isEmail(id.trim()) && !isPhone(id)) er.id = 'Masukkan email atau nomor telepon yang valid.';
    if (!pw) er.pw = 'Password wajib diisi.';
    else if (pw.length < 6) er.pw = 'Password minimal 6 karakter.';
    setErr(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    setTimeout(() => onLogin({ role, name: id.includes('@') ? id.split('@')[0] : id, email: isEmail(id.trim()) ? id.trim() : '', phone: isEmail(id.trim()) ? '' : id.trim() }), 700);
  };
  const social = (n) => { setBusy(true); setTimeout(() => onLogin({ role, name: n }), 700); };

  const handleDevTap = () => {
    const next = taps + 1;
    setTaps(next);
    if (next >= 3) {
      setTaps(0);
      if (onSecretAdmin) onSecretAdmin();
    }
  };

  const dummy = DUMMY_USERS[role] || DUMMY_USERS.pemesan;

  return (
    <form className="auth" onSubmit={submit} noValidate>
      <BackBtn onClick={back} />
      <Wordmark />
      <h1 className="h2">Selamat datang kembali!</h1>
      <p className="lead c">Masuk sebagai {roleName(role)} untuk melanjutkan perjalanan Anda.</p>
      
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

      <Field icon="mail" placeholder="Email atau nomor telepon" value={id} onChange={setId} error={err.id} autoComplete="username" />
      <Field icon="lock" type="password" placeholder="Password" value={pw} onChange={setPw} error={err.pw} autoComplete="current-password" />
      <div className="rowx">
        <label className="chk"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span /> Ingat saya</label>
        <button type="button" className="lnk">Lupa password?</button>
      </div>
      <button className="btn wide" disabled={busy}>{busy ? 'Memproses...' : 'Masuk'}</button>
      <div className="or"><span>atau</span></div>
      <button type="button" className="btn out" onClick={() => social('Pengguna Google')} disabled={busy}><i className="g-ic">G</i> Lanjut dengan Google</button>
      <button type="button" className="btn out" onClick={() => social('Pengguna Apple')} disabled={busy}><Apple /> Lanjut dengan Apple</button>
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
