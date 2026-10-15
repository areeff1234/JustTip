import { useEffect, useRef, useState } from 'react';
import { BackBtn } from './AuthUI.jsx';

const DEMO = '123456';

function FirebaseVerifyEmail({ email, user, back, onVerify, onResend, onOk, initialError }) {
  const [error, setError] = useState(initialError || '');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  const verify = async () => {
    setBusy(true);
    setError('');
    try {
      const profile = await onVerify(user);
      onOk(profile);
    } catch (verifyError) {
      setError(verifyError.message || 'Verifikasi belum berhasil. Coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setBusy(true);
    setError('');
    try {
      await onResend(user);
      setError('Tautan verifikasi baru sudah dikirim. Periksa kotak masuk atau folder spam.');
    } catch (resendError) {
      setError(resendError.message || 'Tautan verifikasi gagal dikirim.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <BackBtn onClick={back} />
      <div className="mail-art">
        <svg viewBox="0 0 120 100" aria-hidden="true"><circle cx="56" cy="50" r="44" fill="#e3f3fd" /><rect x="22" y="30" width="68" height="46" rx="8" fill="#2fa9f0" /><path d="M24 36l32 22 32-22" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" /><circle cx="92" cy="72" r="14" fill="#fff" /><circle cx="92" cy="72" r="11" fill="#38bdf8" /><path d="M86 72l4 4 8-8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
      </div>
      <h1 className="h2 c">Verifikasi Email</h1>
      <p className="lead c">Kami mengirim tautan verifikasi ke<br /><b className="em">{email}</b></p>
      <p className="lead c">Buka tautan dari email tersebut, lalu kembali ke halaman ini dan tekan tombol di bawah.</p>
      {error && <small className="ferr c" role="status">{error}</small>}
      <button className="btn wide" type="button" onClick={verify} disabled={busy}>{busy ? 'Memeriksa...' : 'Saya sudah verifikasi email'}</button>
      <button className="lnk resend" type="button" onClick={resend} disabled={busy}>Kirim ulang tautan verifikasi</button>
      <p className="demo">Tidak menerima email? Periksa folder spam atau promosi.</p>
    </div>
  );
}

export default function VerifyEmail({ email, back, onOk, user, onVerify, onResend, initialError }) {
  const [d, setD] = useState(Array(6).fill(''));
  const [err, setErr] = useState('');
  const [sec, setSec] = useState(59);
  const refs = useRef([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => { if (sec <= 0) return; const t = setTimeout(() => setSec(sec - 1), 1000); return () => clearTimeout(t); }, [sec]);

  if (onVerify) {
    return (
      <FirebaseVerifyEmail
        email={email}
        user={user}
        back={back}
        onVerify={onVerify}
        onResend={onResend}
        initialError={initialError}
        onOk={onOk}
      />
    );
  }

  const put = (i, v) => {
    const c = v.replace(/\D/g, '');
    if (!c) { setD((a) => a.map((x, k) => (k === i ? '' : x))); return; }
    const next = [...d];
    c.slice(0, 6 - i).split('').forEach((ch, k) => (next[i + k] = ch));
    setD(next); setErr('');
    refs.current[Math.min(i + c.length, 5)]?.focus();
  };
  const key = (i, e) => { if (e.key === 'Backspace' && !d[i] && i > 0) refs.current[i - 1]?.focus(); };
  const submit = (e) => {
    e.preventDefault();
    const code = d.join('');
    if (code.length < 6) return setErr('Masukkan 6 digit kode verifikasi.');
    if (code !== DEMO) return setErr('Kode tidak sesuai. Periksa kembali email Anda.');
    onOk();
  };
  const mm = `00:${String(sec).padStart(2, '0')}`;

  return (
    <form className="auth" onSubmit={submit}>
      <BackBtn onClick={back} />
      <div className="mail-art">
        <svg viewBox="0 0 120 100" aria-hidden="true"><circle cx="56" cy="50" r="44" fill="#e3f3fd" /><rect x="22" y="30" width="68" height="46" rx="8" fill="#2fa9f0" /><path d="M24 36l32 22 32-22" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" /><circle cx="92" cy="72" r="14" fill="#fff" /><circle cx="92" cy="72" r="11" fill="#38bdf8" /><path d="M86 72l4 4 8-8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
      </div>
      <h1 className="h2 c">Verifikasi Email</h1>
      <p className="lead c">Kami telah mengirimkan kode verifikasi<br />ke email Anda.<br /><b className="em">{email}</b></p>
      <div className="otp">
        {d.map((v, i) => (
          <input key={i} ref={(el) => (refs.current[i] = el)} value={v} inputMode="numeric" maxLength={6} aria-label={`Digit ${i + 1}`}
            className={err ? 'err' : ''} onChange={(e) => put(i, e.target.value)} onKeyDown={(e) => key(i, e)} />
        ))}
      </div>
      {err && <small className="ferr c" role="alert">{err}</small>}
      <button className="btn wide">Verifikasi</button>
      {sec > 0
        ? <p className="resend">Kirim ulang kode ({mm})</p>
        : <button type="button" className="lnk resend" onClick={() => { setSec(59); setD(Array(6).fill('')); refs.current[0]?.focus(); }}>Kirim ulang kode</button>}
      <p className="demo">Mode demo: gunakan kode {DEMO}.</p>
    </form>
  );
}
