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
    <div className="auth">
      <BackBtn onClick={back} />
      <h1 className="h1">{reg ? 'Daftar Akun Justip' : 'Pilih Peran Anda'}</h1>
      <p className="lead">{reg ? 'Pilih peran utama Anda untuk melanjutkan proses pendaftaran.' : 'Lanjutkan dengan peran yang sesuai dengan kebutuhan Anda.'}</p>
      <div className="roles">
        {ROLES.map((r) => (
          <button key={r.id} className={`role ${sel === r.id ? 'on' : ''}`} onMouseEnter={() => setSel(r.id)} onFocus={() => setSel(r.id)} onClick={() => onPick(r.id)}>
            <RoleIcon n={r.icon} />
            <span><b>{r.name}</b><small>{reg ? r.reg : r.pick}</small></span>
            <Ic n="chevR" size={16} />
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
