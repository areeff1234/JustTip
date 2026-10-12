import { useState } from 'react';
import { Field, BackBtn } from './AuthUI.jsx';
import { isEmail, isPhone, roleName } from './roles.js';

const EXTRA = {
  justipper: ['pin', 'Kota domisili / rute jastip'],
  admin: ['shield', 'NIM / Kode Akses Tim Bitforce'],
};

export default function RegisterForm({ role, back, onDone }) {
  const [f, setF] = useState({ nama: '', email: '', tel: '', extra: '', pw: '', pw2: '' });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const extra = EXTRA[role];

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.nama.trim().length < 3) er.nama = 'Nama lengkap minimal 3 karakter.';
    if (!isEmail(f.email.trim())) er.email = 'Masukkan email yang valid.';
    if (!isPhone(f.tel)) er.tel = 'Nomor telepon tidak valid (contoh: 0812 3456 7890).';
    if (extra && !f.extra.trim()) er.extra = `${extra[1]} wajib diisi.`;
    if (f.pw.length < 8) er.pw = 'Password minimal 8 karakter.';
    if (f.pw2 !== f.pw || !f.pw2) er.pw2 = 'Konfirmasi password tidak sama.';
    setErr(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    setTimeout(() => onDone({ name: f.nama.trim(), email: f.email.trim(), tel: f.tel.trim(), extra: f.extra.trim() }), 600);
  };

  return (
    <form className="auth" onSubmit={submit} noValidate>
      <BackBtn onClick={back} />
      <h1 className="h1">Daftar sebagai {roleName(role)}</h1>
      <p className="lead">Lengkapi data diri Anda untuk melanjutkan.</p>
      <Field icon="user" placeholder="Nama Lengkap" value={f.nama} onChange={set('nama')} error={err.nama} autoComplete="name" />
      <Field icon="mail" type="email" placeholder="Email" value={f.email} onChange={set('email')} error={err.email} autoComplete="email" />
      <Field icon="call" type="tel" placeholder="Nomor Telepon" value={f.tel} onChange={set('tel')} error={err.tel} autoComplete="tel" inputMode="tel" />
      {extra && <Field icon={extra[0]} placeholder={extra[1]} value={f.extra} onChange={set('extra')} error={err.extra} />}
      <Field icon="lock" type="password" placeholder="Password" value={f.pw} onChange={set('pw')} error={err.pw} autoComplete="new-password" />
      <Field icon="lock" type="password" placeholder="Konfirmasi Password" value={f.pw2} onChange={set('pw2')} error={err.pw2} autoComplete="new-password" />
      <button className="btn wide" disabled={busy}>{busy ? 'Memproses...' : 'Daftar'}</button>
      <p className="terms">Dengan mendaftar, Anda menyetujui<br /><button type="button" className="lnk">Syarat & Ketentuan</button> dan <button type="button" className="lnk">Kebijakan Privasi</button> Justip.</p>
    </form>
  );
}
