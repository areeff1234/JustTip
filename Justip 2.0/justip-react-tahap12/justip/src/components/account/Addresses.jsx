import { useState } from 'react';
import { Ic } from '../ui.jsx';
import { Field } from '../auth/AuthUI.jsx';
import { isPhone } from '../auth/roles.js';
import { shortAddr } from '../checkout/checkout.js';
import { Bar } from './parts.jsx';

const MAIN = 'Alamat Utama';

export default function Addresses({ cfg, acc, back, say }) {
  const { addrs, setAddrs, profile } = acc;
  const [form, setForm] = useState(null);       // null | { id?, type }
  const [f, setF] = useState({ name: '', phone: '', text: '' });
  const [err, setErr] = useState({});
  const [del, setDel] = useState(null);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const openNew = () => { setF({ name: profile.name, phone: profile.phone, text: '' }); setErr({}); setForm({ type: cfg.types[0] }); };
  const openEdit = (a) => { setF({ name: a.name, phone: a.phone, text: a.text }); setErr({}); setForm({ id: a.id, type: a.label === MAIN ? MAIN : a.label }); };
  const save = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = 'Nama minimal 3 karakter.';
    if (!isPhone(f.phone)) er.phone = 'Nomor telepon tidak valid.';
    if (f.text.trim().length < 10) er.text = 'Tulis alamat lengkap (jalan, RT/RW, kecamatan, kota).';
    setErr(er);
    if (Object.keys(er).length) return;
    const a = { id: form.id ?? Date.now(), label: form.type, name: f.name.trim(), phone: f.phone.trim(), text: f.text.trim(), short: shortAddr(f.text) };
    setAddrs((l) => (form.id ? l.map((x) => (x.id === a.id ? a : x)) : [...l, a]));
    say(form.id ? 'Alamat diperbarui' : 'Alamat ditambahkan'); setForm(null);
  };
  const setMain = (id) => {
    setAddrs((l) => {
      const r = l.map((x) => (x.id === id ? { ...x, label: MAIN } : x.label === MAIN ? { ...x, label: 'Lainnya' } : x));
      return [r.find((x) => x.id === id), ...r.filter((x) => x.id !== id)];
    });
    say('Alamat utama diganti');
  };
  const remove = (id) => {
    if (del !== id) return setDel(id);
    setAddrs((l) => l.filter((x) => x.id !== id)); setDel(null); say('Alamat dihapus');
  };

  if (form) {
    const types = form.type === MAIN ? [MAIN] : cfg.types;
    return (
      <form className="a-form" onSubmit={save} noValidate>
        <Bar title={form.id ? 'Ubah Alamat' : 'Tambah Alamat'} back={() => setForm(null)} />
        <main className="scroll pad acc">
          <span className="a-lab">Jenis alamat</span>
          <div className="chipsel" role="radiogroup" aria-label="Jenis alamat">
            {types.map((t) => <button type="button" key={t} role="radio" aria-checked={form.type === t} className={form.type === t ? 'on' : ''} onClick={() => setForm({ ...form, type: t })}>{t}</button>)}
          </div>
          <div className="a-fld"><span className="a-lab">Nama penerima</span><Field icon="user" placeholder="Nama penerima" value={f.name} onChange={set('name')} error={err.name} /></div>
          <div className="a-fld"><span className="a-lab">Nomor telepon</span><Field icon="call" type="tel" placeholder="Nomor telepon" value={f.phone} onChange={set('phone')} error={err.phone} inputMode="tel" /></div>
          <div className="a-fld"><span className="a-lab">Alamat lengkap</span><Field icon="pin" placeholder="Jalan, RT/RW, kecamatan, kota" value={f.text} onChange={set('text')} error={err.text} /></div>
        </main>
        <footer className="co-bar solo"><button className="btn wide">Simpan Alamat</button></footer>
      </form>
    );
  }
  return (
    <>
      <Bar title={cfg.addrTitle} back={back} />
      <main className="scroll pad acc">
        <div className="a-alist">
          {addrs.map((a) => (
            <article className={`a-addr ${a.label === MAIN ? 'main' : ''}`} key={a.id}>
              <div className="a-at"><span className={`tagc ${a.label === MAIN ? 'blue' : ''}`}>{a.label}</span></div>
              <b>{a.name}</b><p>{a.phone}</p><p className="at">{a.text}</p>
              <div className="a-act">
                <button onClick={() => openEdit(a)}><Ic n="pencil" size={14} />Ubah</button>
                {a.label !== MAIN && <button onClick={() => setMain(a.id)}><Ic n="check" size={14} />Jadikan Utama</button>}
                {addrs.length > 1 && <button className="dng" onClick={() => remove(a.id)} onBlur={() => setDel(null)}><Ic n="trash" size={14} />{del === a.id ? 'Yakin hapus?' : 'Hapus'}</button>}
              </div>
            </article>
          ))}
        </div>
        {addrs.length < 2 && <p className="a-hint">Minimal satu alamat harus tersimpan.</p>}
      </main>
      <footer className="co-bar solo"><button className="btn wide" onClick={openNew}><Ic n="plus" size={16} />Tambah Alamat Baru</button></footer>
    </>
  );
}
