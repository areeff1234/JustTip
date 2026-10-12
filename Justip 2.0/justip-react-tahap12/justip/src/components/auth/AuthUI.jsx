import { useState } from 'react';
import { Ic } from '../ui.jsx';
import Logo from '../Logo.jsx';

export function Field({ icon, type = 'text', placeholder, value, onChange, error, autoComplete, inputMode }) {
  const [show, setShow] = useState(false);
  const pw = type === 'password';
  return (
    <div className="fld">
      <label className={`inp ${error ? 'err' : ''}`}>
        <Ic n={icon} size={18} />
        <input type={pw && show ? 'text' : type} placeholder={placeholder} value={value} inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} aria-label={placeholder} aria-invalid={!!error} />
        {pw && (
          <button type="button" className="eye" onClick={() => setShow(!show)} aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}>
            <Ic n={show ? 'eye' : 'eyeoff'} size={18} />
          </button>
        )}
      </label>
      {error && <small className="ferr" role="alert">{error}</small>}
    </div>
  );
}

export const BackBtn = ({ onClick }) => (
  <button type="button" className="icon-btn back" onClick={onClick} aria-label="Kembali"><Ic n="back" /></button>
);

export const Wordmark = () => (
  <div className="brand center">
    <Logo bg="#38BDF8" fg="#fff" /><b>just<i>ip</i></b>
  </div>
);

export const RoleIcon = ({ n }) => <span className="role-ic"><Ic n={n} size={24} /></span>;
