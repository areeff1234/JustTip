import { useState } from 'react';
import { BackBtn, RoleIcon } from './AuthUI.jsx';
import { Ic } from '../ui.jsx';
import { ROLES } from './roles.js';

// mode "login": halaman "Pilih Peran Anda"; mode "register": halaman "Daftar Akun Justip"
export default function RoleSelect({ mode, back, onPick, goLogin, onSecretAdmin }) {
  const [sel, setSel] = useState('pemesan');
  const [taps, setTaps] = useState(0);
  const reg = mode === 'register';

  const handleDevTap = () => {
    const next = taps + 1;
    setTaps(next);
    if (next >= 3) {
      setTaps(0);
      if (onSecretAdmin) onSecretAdmin();
    }
  };

  return (
    <div className="auth role-page">
      <BackBtn onClick={back} />
      <div className="role-intro">
        <span className="role-kicker"><i /> RUANG JASTIP ANDA</span>
        <h1 className="h1">{reg ? 'Daftar Akun Justip' : 'Pilih Peran Anda'}</h1>
        <p className="lead">{reg ? 'Pilih peran utama Anda untuk melanjutkan proses pendaftaran.' : 'Pilih cara paling pas untuk mulai menggunakan Justip.'}</p>
        <div className="role-promise">
          <Ic n="shield" size={18} />
          <span><b>Satu akun, banyak kemudahan</b><small>Peran bisa diganti kapan saja.</small></span>
        </div>
      </div>
      <div className="roles">
        {ROLES.map((r) => (
          <button key={r.id} type="button" className={`role ${sel === r.id ? 'on' : ''}`} onMouseEnter={() => setSel(r.id)} onFocus={() => setSel(r.id)} onClick={() => onPick(r.id)}>
            <RoleIcon n={r.icon} />
            <span className="role-copy">
              <small className="role-label">{r.id === 'pemesan' ? 'BELANJA LEBIH MUDAH' : 'PELUANG PENGHASILAN'}</small>
              <b>{r.name}</b>
              <small className="role-description">{reg ? r.reg : r.pick}</small>
            </span>
            <span className="role-action"><Ic n="chevR" size={17} /></span>
          </button>
        ))}
      </div>
      <p className="foot">Sudah punya akun? <button type="button" className="lnk" onClick={goLogin}>Login</button></p>
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <button
          type="button"
          onClick={handleDevTap}
          style={{ background: 'none', border: 'none', fontSize: 11, color: '#94a3b8', cursor: 'pointer', padding: '4px 8px' }}
        >
          JustTip v0.12 · Bitforce TI {taps > 0 ? `(${taps}/3)` : ''}
        </button>
      </div>
    </div>
  );
}
