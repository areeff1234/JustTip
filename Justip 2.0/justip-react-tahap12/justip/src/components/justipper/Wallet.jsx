import { useEffect, useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { Field } from '../auth/AuthUI.jsx';
import { Bar, Fld } from '../account/parts.jsx';
import { BANKS, MIN_WD, bankColor, mask } from './walletData.js';

const idr = (v) => (v ? Number(v).toLocaleString('id-ID') : '');
const Logo = ({ b }) => <span className="plogo" style={{ background: bankColor(b) }}>{b.slice(0, 2)}</span>;
const Status = ({ s }) => <span className={`o-tag ${s === 'ok' ? 'ok' : 'warn'}`}>{s === 'ok' ? 'Berhasil' : 'Diproses'}</span>;

function Rekening({ banks, setBanks, back, say }) {
  const [add, setAdd] = useState(false), [del, setDel] = useState(null);
  const [f, setF] = useState({ bank: 'BCA', no: '', name: '' }), [err, setErr] = useState({});
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const save = (e) => {
    e.preventDefault();
    const er = {};
    if (!/^\d{8,16}$/.test(f.no)) er.no = 'Nomor rekening 8–16 digit angka.';
    if (f.name.trim().length < 3) er.name = 'Nama pemilik minimal 3 karakter.';
    setErr(er);
    if (Object.keys(er).length) return;
    setBanks((l) => [...l, { id: Date.now(), ...f, name: f.name.trim(), main: !l.length }]);
    setAdd(false); setF({ bank: 'BCA', no: '', name: '' }); say('Rekening ditambahkan');
  };
  const main = (id) => { setBanks((l) => l.map((x) => ({ ...x, main: x.id === id }))); say('Rekening utama diganti'); };
  const remove = (id) => {
    if (del !== id) return setDel(id);
    setBanks((l) => { const r = l.filter((x) => x.id !== id); return r.length && !r.some((x) => x.main) ? r.map((x, i) => ({ ...x, main: !i })) : r; });
    setDel(null); say('Rekening dihapus');
  };
  if (add) return (
    <form className="a-form" onSubmit={save} noValidate>
      <Bar title="Tambah Rekening" back={() => setAdd(false)} />
      <main className="scroll pad acc">
        <span className="a-lab">Bank</span>
        <div className="chipsel wrap" role="radiogroup" aria-label="Bank">{BANKS.map(([b]) => <button type="button" key={b} role="radio" aria-checked={f.bank === b} className={f.bank === b ? 'on' : ''} onClick={() => set('bank')(b)}>{b}</button>)}</div>
        <Fld label="Nomor rekening" icon="wallet" placeholder="Contoh: 1234567890" value={f.no} onChange={(v) => set('no')(v.replace(/\D/g, ''))} error={err.no} inputMode="numeric" />
        <Fld label="Nama pemilik rekening" icon="user" placeholder="Sesuai buku tabungan" value={f.name} onChange={set('name')} error={err.name} />
        <p className="demo">Mode demo: rekening belum diverifikasi ke bank.</p>
      </main>
      <footer className="co-bar solo"><button className="btn wide">Simpan Rekening</button></footer>
    </form>
  );
  return (<>
    <Bar title="Rekening Pencairan" back={back} />
    <main className="scroll pad acc">
      <div className="a-alist">
        {banks.map((b) => (
          <article className={`a-addr ${b.main ? 'main' : ''}`} key={b.id}>
            <div className="w-bank"><Logo b={b.bank} /><span><b>{b.bank} {mask(b.no)}</b><small>a.n. {b.name}</small></span>{b.main && <span className="tagc blue">Utama</span>}</div>
            <div className="a-act">
              {!b.main && <button onClick={() => main(b.id)}><Ic n="check" size={14} />Jadikan Utama</button>}
              <button className="dng" onClick={() => remove(b.id)} onBlur={() => setDel(null)}><Ic n="trash" size={14} />{del === b.id ? 'Yakin hapus?' : 'Hapus'}</button>
            </div>
          </article>
        ))}
        {!banks.length && <p className="empty">Belum ada rekening. Tambahkan untuk menarik saldo.</p>}
      </div>
    </main>
    <footer className="co-bar solo"><button className="btn wide" onClick={() => setAdd(true)}><Ic n="plus" size={16} />Tambah Rekening</button></footer>
  </>);
}

function Withdraw({ balance, banks, back, onDone, goRek }) {
  const [amt, setAmt] = useState(''), [sel, setSel] = useState((banks.find((b) => b.main) ?? banks[0])?.id), [err, setErr] = useState('');
  const n = Number(amt) || 0, bank = banks.find((b) => b.id === sel);
  const submit = (e) => {
    e.preventDefault();
    if (!bank) return setErr('Tambahkan rekening pencairan dulu.');
    if (n < MIN_WD) return setErr(`Minimal penarikan ${rp(MIN_WD)}.`);
    if (n > balance) return setErr('Jumlah melebihi saldo tersedia.');
    onDone(n, bank);
  };
  return (
    <form className="a-form" onSubmit={submit} noValidate>
      <Bar title="Tarik Saldo" back={back} />
      <main className="scroll pad acc">
        <section className="w-avail"><small>Saldo tersedia</small><b>{rp(balance)}</b></section>
        <Fld label="Jumlah penarikan (Rp)" icon="wallet" placeholder="0" value={idr(amt)} onChange={(v) => { setAmt(v.replace(/\D/g, '').replace(/^0+/, '')); setErr(''); }} error={err} inputMode="numeric" />
        <div className="chipsel wrap">{[50000, 100000].filter((v) => v <= balance).map((v) => <button type="button" key={v} onClick={() => { setAmt(String(v)); setErr(''); }}>{rp(v)}</button>)}<button type="button" onClick={() => { setAmt(String(balance)); setErr(''); }}>Semua</button></div>
        <span className="a-lab">Cairkan ke</span>
        {banks.length ? (
          <div className="w-banks" role="radiogroup" aria-label="Rekening tujuan">
            {banks.map((b) => (
              <button type="button" key={b.id} role="radio" aria-checked={sel === b.id} className={`payrow ${sel === b.id ? 'on' : ''}`} onClick={() => setSel(b.id)}>
                <Logo b={b.bank} /><span><b>{b.bank} {mask(b.no)}</b><small>a.n. {b.name}</small></span><span className={`rd ${sel === b.id ? 'on' : ''}`} aria-hidden="true" />
              </button>))}
          </div>
        ) : <p className="empty">Belum ada rekening.</p>}
        <button type="button" className="addmore" onClick={goRek}><Ic n="plus" size={14} /> Kelola Rekening</button>
        <p className="a-hint left">Minimal penarikan {rp(MIN_WD)}. Dana biasanya masuk dalam 1×24 jam kerja (demo: otomatis berhasil setelah beberapa detik).</p>
      </main>
      <footer className="co-bar solo"><button className="btn wide" disabled={!n}>Tarik {n ? rp(n) : 'Dana'}</button></footer>
    </form>
  );
}

export default function WalletPage({ w, say, onDeep, back }) {
  const { balance, txs, banks, setBanks, withdraw } = w;
  const [sub, setSub] = useState(null), [tab, setTab] = useState('in');
  useEffect(() => { onDeep(!!sub); return () => onDeep(false); }, [sub]);
  const ins = txs.filter((t) => t.type === 'in'), outs = txs.filter((t) => t.type === 'out');
  const earned = ins.reduce((s, t) => s + t.amount, 0), pending = outs.filter((t) => t.status === 'proses').reduce((s, t) => s + t.amount, 0);
  const main = banks.find((b) => b.main) ?? banks[0];

  if (sub === 'rek') return <Rekening banks={banks} setBanks={setBanks} back={() => setSub(null)} say={say} />;
  if (sub === 'tarik') return <Withdraw balance={balance} banks={banks} back={() => setSub(null)} goRek={() => setSub('rek')}
    onDone={(n, b) => { withdraw(n, b); setTab('out'); setSub(null); say('Penarikan sedang diproses'); }} />;

  const list = tab === 'in' ? ins : tab === 'out' ? outs : txs;
  const EMPTY = { in: 'Belum ada penghasilan.', all: 'Belum ada transaksi.', out: 'Belum ada penarikan.' };
  return (
    <main className="scroll pad">
      <div className="pg-head" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {back && <button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button>}
        <h2 className="pg-t" style={{ margin: 0 }}>Saldo Justip</h2>
      </div>
      <div className="saldo static"><span className="s-ic"><Ic n="wallet" size={30} /></span><span><small>Saldo tersedia</small><b>{rp(balance)}</b></span></div>
      <div className="w-stats"><span><small>Total penghasilan</small><b>{rp(earned)}</b></span><span><small>Sedang ditarik</small><b>{rp(pending)}</b></span></div>
      <button className="btn wide" onClick={() => (main ? (balance >= MIN_WD ? setSub('tarik') : say(`Saldo minimal ${rp(MIN_WD)} untuk menarik`)) : setSub('rek'))}>{main ? 'Tarik Saldo' : 'Tambah Rekening untuk Menarik'}</button>
      {main && <button className="chg w-rek" onClick={() => setSub('rek')}><Logo b={main.bank} /><span><small>Rekening pencairan</small><b>{main.bank} {mask(main.no)}</b></span><Ic n="chevR" size={16} /></button>}

      <div className="seg" role="tablist">{[['in', 'Pendapatan'], ['all', 'Transaksi'], ['out', 'Penarikan']].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>
      <ul className="w-list">
        {list.map((t) => (
          <li key={t.id}>
            <span className={`w-ic ${t.type}`}><Ic n={t.type === 'in' ? 'scooter' : 'wallet'} size={18} /></span>
            <span><b>{t.title}</b><small>{t.time}{t.type === 'in' && t.jasa ? ` · Komisi Jasa ${rp(t.jasa)}` : ''}</small>{t.type === 'out' && <Status s={t.status} />}</span>
            <b className={t.type === 'in' ? 'plus' : 'minus'}>{t.type === 'in' ? '+' : '−'} {rp(t.amount)}</b>
          </li>))}
        {!list.length && <p className="empty">{EMPTY[tab]}</p>}
      </ul>
    </main>
  );
}
