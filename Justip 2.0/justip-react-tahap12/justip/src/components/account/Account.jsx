import { useEffect, useState } from 'react';
import { Ic } from '../ui.jsx';
import { Avatar } from '../shared.jsx';
import { ACC } from './accountData.js';
import EditProfile from './EditProfile.jsx';
import ChangePassword from './ChangePassword.jsx';
import Addresses from './Addresses.jsx';
import NotifSettings from './NotifSettings.jsx';
import HelpCenter from './HelpCenter.jsx';
import Verification, { VSTAT } from './Verification.jsx';

const Row = ({ icon, title, sub, onClick }) => (
  <button className="a-row" onClick={onClick}>
    <span className="a-ri"><Ic n={icon} size={20} /></span>
    <span><b>{title}</b>{sub && <small>{sub}</small>}</span><Ic n="chevR" size={16} />
  </button>
);
const Group = ({ title, children }) => (<><h3 className="a-gt">{title}</h3><div className="a-group">{children}</div></>);

export default function Account({ role, acc, logout, stats, say, onDeep }) {
  const [sub, setSub] = useState(null);
  const [dlg, setDlg] = useState(false);
  useEffect(() => { onDeep(!!sub); return () => onDeep(false); }, [sub]);
  const cfg = ACC[role], { profile: p, prefs } = acc;
  const back = () => setSub(null);
  const common = { role, cfg, acc, back, say };

  if (sub === 'edit') return <EditProfile {...common} />;
  if (sub === 'pass') return <ChangePassword {...common} />;
  if (sub === 'addr') return <Addresses {...common} />;
  if (sub === 'notif') return <NotifSettings {...common} />;
  if (sub === 'verif') return <Verification {...common} />;
  if (sub === 'help') return <HelpCenter {...common} />;

  const on = [prefs.push && 'Perangkat', prefs.email && 'Email'].filter(Boolean).join(' & ') || 'Nonaktif';
  return (
    <>
      <main className={`scroll pad acc r-${role}`}>
        <section className="a-card">
          <Ic n={cfg.icon} size={120} className="a-wm" />
          <button className="a-av" onClick={() => setSub('edit')} aria-label="Ubah foto profil">
            <Avatar v={role === 'justipper' ? 'b' : 'a'} src={p.photo} /><i><Ic n="camera" size={14} /></i>
          </button>
          <div className="a-who">
            <b>{p.name || 'Pengguna Justip'}</b>
            <small>{p.email || p.phone || '-'}</small>
            <span className="a-chip"><Ic n={cfg.icon} size={13} />{cfg.name}{cfg.extra && p.extra ? ` • ${p.extra}` : ''}</span>
          </div>
        </section>
        <div className="a-stats">{stats.map(([k, v]) => <span key={k}><b>{v}</b><small>{k}</small></span>)}</div>

        <Group title="Akun">
          <Row icon="user" title="Edit Profil" sub="Nama, email, dan nomor telepon" onClick={() => setSub('edit')} />
          {cfg.verif && <Row icon="shield" title={cfg.verif.title} sub={VSTAT[acc.verif.s]} onClick={() => setSub('verif')} />}
          <Row icon="lock" title="Ubah Kata Sandi" sub="Perbarui keamanan akunmu" onClick={() => setSub('pass')} />
          {acc.roles?.includes(role === 'pemesan' ? 'justipper' : 'pemesan') && (
            <Row
              icon="user"
              title={`Beralih ke ${role === 'pemesan' ? 'Justipper' : 'Pemesan'}`}
              sub="Pindah peran tanpa keluar dari akun"
              onClick={() => acc.switchRole(role === 'pemesan' ? 'justipper' : 'pemesan')}
            />
          )}
          {cfg.addrTitle && (
            <Row icon="pin" title={cfg.addrTitle} sub={`${acc.addrs?.length || 0} ${cfg.addrSub}`} onClick={() => setSub('addr')} />
          )}
        </Group>
        <Group title="Pengaturan">
          <Row icon="bell" title="Notifikasi" sub={`Aktif: ${on}`} onClick={() => setSub('notif')} />
        </Group>
        <Group title="Bantuan">
          <Row icon="headset" title="Pusat Bantuan" sub="Pertanyaan umum dan hubungi kami" onClick={() => setSub('help')} />
        </Group>
        <button className="a-out" onClick={() => setDlg(true)}><Ic n="out" size={18} />Keluar</button>
        <p className="a-ver">Justip v0.12.0</p>
      </main>
      {dlg && (
        <div className="dlg" role="dialog" aria-modal="true" aria-labelledby="dlg-t" onClick={() => setDlg(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <span className="dlg-ic"><Ic n="out" size={26} /></span>
            <b id="dlg-t">Keluar dari akun?</b>
            <p>Kamu perlu masuk lagi untuk memakai Justip sebagai {cfg.name}.</p>
            <button className="btn out wide" onClick={() => setDlg(false)}>Batal</button>
            <button className="btn danger wide" onClick={logout}>Ya, Keluar</button>
          </div>
        </div>
      )}
    </>
  );
}
