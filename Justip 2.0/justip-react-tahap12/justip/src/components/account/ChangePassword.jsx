import { useState } from 'react';
import { Bar, Fld } from './parts.jsx';

const score = (v) => [v.length >= 8, /\d/.test(v), /[A-Z]/.test(v) || /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
const LV = ['Terlalu pendek', 'Lemah', 'Cukup', 'Kuat'];

export default function ChangePassword({ back, say }) {
  const [f, setF] = useState({ old: '', pw: '', pw2: '' });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const sc = f.pw ? (f.pw.length < 8 ? 0 : score(f.pw)) : -1;
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.old.length < 6) er.old = 'Masukkan kata sandi lama (min. 6 karakter).';
    if (f.pw.length < 8) er.pw = 'Kata sandi baru minimal 8 karakter.';
    else if (f.pw === f.old) er.pw = 'Kata sandi baru harus berbeda dari yang lama.';
    if (f.pw2 !== f.pw || !f.pw2) er.pw2 = 'Konfirmasi kata sandi tidak sama.';
    setErr(er);
    if (Object.keys(er).length) return;
    setBusy(true); setTimeout(() => { say('Kata sandi berhasil diubah'); back(); }, 700);
  };
  return (
    <form className="a-form" onSubmit={submit} noValidate>
      <Bar title="Ubah Kata Sandi" back={back} />
      <main className="scroll pad acc">
        <p className="lead">Gunakan kombinasi huruf, angka, dan simbol agar akunmu lebih aman.</p>
        <Fld label="Kata sandi lama" icon="lock" type="password" placeholder="Kata sandi lama" value={f.old} onChange={set('old')} error={err.old} autoComplete="current-password" />
        <Fld label="Kata sandi baru" icon="lock" type="password" placeholder="Kata sandi baru" value={f.pw} onChange={set('pw')} error={err.pw} autoComplete="new-password" />
        {sc >= 0 && (
          <div className={`a-str s${sc}`} aria-live="polite"><span><i /><i /><i /></span><small>Kekuatan: {LV[sc]}</small></div>
        )}
        <Fld label="Konfirmasi kata sandi baru" icon="lock" type="password" placeholder="Ulangi kata sandi baru" value={f.pw2} onChange={set('pw2')} error={err.pw2} autoComplete="new-password" />
        <p className="demo">Mode demo: kata sandi belum tersimpan ke server.</p>
      </main>
      <footer className="co-bar solo"><button className="btn wide" disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan Kata Sandi'}</button></footer>
    </form>
  );
}
