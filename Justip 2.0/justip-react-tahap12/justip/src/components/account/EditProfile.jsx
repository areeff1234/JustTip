import { useState } from 'react';
import { Avatar } from '../shared.jsx';
import { Ic } from '../ui.jsx';
import { isEmail, isPhone } from '../auth/roles.js';
import { Bar, Fld } from './parts.jsx';

export default function EditProfile({ role, cfg, acc, back, say }) {
  const p = acc.profile;
  const [f, setF] = useState({ name: p.name, email: p.email, phone: p.phone, extra: p.extra, photo: p.photo });
  const [err, setErr] = useState({});
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const pick = (e) => { const file = e.target.files[0]; if (file) set('photo')(URL.createObjectURL(file)); e.target.value = ''; };
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = 'Nama minimal 3 karakter.';
    if (!isEmail(f.email.trim())) er.email = 'Masukkan email yang valid.';
    if (!isPhone(f.phone)) er.phone = 'Nomor telepon tidak valid (contoh: 0812 3456 7890).';
    if (cfg.extra && !f.extra.trim()) er.extra = `${cfg.extra[1]} wajib diisi.`;
    setErr(er);
    if (Object.keys(er).length) return;
    acc.setProfile({ ...p, ...f, name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), extra: f.extra.trim() });
    say('Profil diperbarui'); back();
  };
  return (
    <form className="a-form" onSubmit={submit} noValidate>
      <Bar title="Edit Profil" back={back} />
      <main className="scroll pad acc">
        <label className="a-photo">
          <Avatar v={role === 'justipper' ? 'b' : 'a'} src={f.photo} />
          <span><Ic n="camera" size={15} /> Ubah Foto</span>
          <input type="file" accept="image/*" onChange={pick} />
        </label>
        <Fld label="Nama lengkap" icon="user" placeholder="Nama Lengkap" value={f.name} onChange={set('name')} error={err.name} autoComplete="name" />
        <Fld label="Email" icon="mail" type="email" placeholder="Email" value={f.email} onChange={set('email')} error={err.email} autoComplete="email" />
        <Fld label="Nomor telepon" icon="call" type="tel" placeholder="Nomor Telepon" value={f.phone} onChange={set('phone')} error={err.phone} inputMode="tel" autoComplete="tel" />
        {cfg.extra && <Fld label={cfg.extra[1]} icon={cfg.extra[0]} placeholder={cfg.extra[1]} value={f.extra} onChange={set('extra')} error={err.extra} />}
      </main>
      <footer className="co-bar solo"><button className="btn wide">Simpan Perubahan</button></footer>
    </form>
  );
}
