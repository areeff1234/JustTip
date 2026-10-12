import { useState } from 'react';
import { Ic } from '../ui.jsx';
import { Field } from '../auth/AuthUI.jsx';
import { isPhone } from '../auth/roles.js';
import { CoHeader, Radio, Chip } from './parts.jsx';
import { shortAddr } from './checkout.js';

const TYPES = [['house', 'Rumah'], ['store', 'Kantor'], ['pin', 'Lainnya']];

export default function AddressPage({ co, go, back }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [editId, setEditId] = useState(null);
  const [f, setF] = useState({ name: '', phone: '', text: '' });
  const [err, setErr] = useState({});
  const a = co.addr;
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const edit = (ad) => { setEditId(ad.id); setType(ad.label === 'Alamat Utama' ? 'Rumah' : ad.label); setF({ name: ad.name, phone: ad.phone, text: ad.text }); setErr({}); };
  const save = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = 'Nama penerima minimal 3 karakter.';
    if (!isPhone(f.phone)) er.phone = 'Nomor telepon tidak valid.';
    if (f.text.trim().length < 10) er.text = 'Tulis alamat lengkap (jalan, RT/RW, kecamatan, kota).';
    setErr(er);
    if (Object.keys(er).length) return;
    const old = co.addrs.find((x) => x.id === editId);
    co.saveAddr({ id: editId ?? Date.now(), label: old?.label === 'Alamat Utama' ? 'Alamat Utama' : type, name: f.name.trim(), phone: f.phone.trim(), text: f.text.trim(), short: shortAddr(f.text) });
    setType(null); setEditId(null); setF({ name: '', phone: '', text: '' });
  };

  return (
    <>
      <CoHeader title="Alamat Pengiriman" back={back} />
      <main className="scroll pad">
        <section className="addr">
          <div className="addr-top"><Chip t={a.label} c="blue" /><button onClick={() => edit(a)} aria-label="Ubah alamat"><Ic n="pencil" size={18} /></button></div>
          <b>{a.name}</b><p>{a.phone}</p><p className="at">{a.text}</p>
        </section>

        <button className="pick" onClick={() => setOpen(!open)} aria-expanded={open}><Ic n="pin" size={18} /><span>Pilih Alamat Lain</span><Ic n={open ? 'chevD' : 'chevR'} size={16} /></button>
        {open && (
          <div className="addrlist">
            {co.addrs.map((x) => (
              <button key={x.id} className={x.id === co.addrId ? 'on' : ''} onClick={() => { co.setAddrId(x.id); setOpen(false); }}>
                <span><b>{x.label}</b><small>{x.name} · {x.short}</small></span><Radio on={x.id === co.addrId} />
              </button>))}
          </div>
        )}

        <div className="sec"><h3>{editId ? 'Ubah Alamat' : 'Tambah Alamat Baru'}</h3></div>
        <div className="types">
          {TYPES.map(([ic, l]) => <button key={l} className={type === l ? 'on' : ''} onClick={() => { setType(l); if (editId) setEditId(null); }}><span><Ic n={ic} size={20} /></span>{l}</button>)}
        </div>
        {type && (
          <form className="addrform" onSubmit={save} noValidate>
            <Field icon="user" placeholder="Nama penerima" value={f.name} onChange={set('name')} error={err.name} />
            <Field icon="call" type="tel" placeholder="Nomor telepon" value={f.phone} onChange={set('phone')} error={err.phone} inputMode="tel" />
            <Field icon="pin" placeholder="Alamat lengkap" value={f.text} onChange={set('text')} error={err.text} />
            <button className="btn wide">{editId ? 'Simpan Perubahan' : 'Simpan Alamat'}</button>
          </form>
        )}
      </main>
      <footer className="co-bar solo"><button className="btn wide" onClick={() => go('kurir')}>Lanjut ke Pengiriman</button></footer>
    </>
  );
}
