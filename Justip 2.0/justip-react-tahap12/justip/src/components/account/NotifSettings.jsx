import { TOPICS } from './accountData.js';
import { Bar, Switch } from './parts.jsx';
import { Ic } from '../ui.jsx';

export default function NotifSettings({ role, acc, back }) {
  const p = acc.prefs;
  const upd = (k) => (v) => acc.setPrefs((s) => ({ ...s, [k]: v }));
  const tog = (k) => (v) => acc.setPrefs((s) => ({ ...s, t: { ...s.t, [k]: v } }));
  const off = !p.push && !p.email;
  return (
    <>
      <Bar title="Notifikasi" back={back} />
      <main className="scroll pad acc">
        <h3 className="a-gt">Saluran</h3>
        <div className="a-group">
          <div className="a-sw"><span className="a-ri"><Ic n="bell" size={20} /></span><span><b>Notifikasi Push</b><small>Pemberitahuan langsung di perangkat</small></span><Switch on={p.push} set={upd('push')} label="Notifikasi push" /></div>
          <div className="a-sw"><span className="a-ri"><Ic n="mail" size={20} /></span><span><b>Notifikasi Email</b><small>Ringkasan dan info penting lewat email</small></span><Switch on={p.email} set={upd('email')} label="Notifikasi email" /></div>
        </div>
        <h3 className="a-gt">Jenis notifikasi</h3>
        <div className={`a-group ${off ? 'dim' : ''}`}>
          {TOPICS[role].map(([k, t, d]) => (
            <div className="a-sw" key={k}><span><b>{t}</b><small>{d}</small></span><Switch on={!!p.t[k]} set={tog(k)} label={t} /></div>
          ))}
        </div>
        {off && <p className="a-hint">Semua saluran nonaktif, jadi kamu tidak akan menerima notifikasi apa pun.</p>}
      </main>
    </>
  );
}
