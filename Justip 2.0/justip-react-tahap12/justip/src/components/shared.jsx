import { useState } from 'react';
import { Ic } from './ui.jsx';

export const Avatar = ({ v = 'a', src }) => (
  <span className="avatar" aria-hidden="true">
    {src ? <img className="av-img" src={src} alt="" /> : (
      <svg viewBox="0 0 40 40"><circle cx="20" cy="16" r="8" fill="#f2c9a5" />
        <path d="M8 38c1-10 7-13 12-13s11 3 12 13z" fill={v === 'b' ? '#1f2937' : '#38bdf8'} />
        <path d="M12 14c0-8 16-8 16 0-3-3-13-3-16 0z" fill="#3b2a20" />
        {v === 'b' && <path d="M14 20c1 6 11 6 12 0-3 3-9 3-12 0z" fill="#3b2a20" />}</svg>
    )}
  </span>
);

export function useToast() {
  const [t, setT] = useState('');
  const say = (m) => { setT(m); clearTimeout(window.__jt); window.__jt = setTimeout(() => setT(''), 1900); };
  return [t ? <div className="toast" role="status">{t}</div> : null, say];
}

export const Placeholder = ({ title, text = 'Halaman ini hadir di tahap berikutnya.' }) => (
  <div className="soon"><b>{title}</b>{text}</div>
);

export const TopBar = ({ title, v, onBell }) => (
  <header className="top"><span className="bar-sp" /><h2 className="top-t">{title}</h2>
    <div className="top-r"><button className="icon-btn" aria-label="Notifikasi" onClick={onBell}><Ic n="bell" /></button><Avatar v={v} /></div></header>
);
