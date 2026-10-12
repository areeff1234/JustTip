import { useRef, useState } from 'react';
import Logo from '../Logo.jsx';
import { Ic } from '../ui.jsx';

const SLIDES = [
  { t: ['Belanja dari mana saja,', 'Justip aja!'], d: 'Jasa titip barang favoritmu dengan aman, mudah dan terpercaya.' },
  { t: ['Titip ke Justipper,', 'barang sampai ke rumah'], d: 'Justipper terpercaya membelikan dan mengantarkan barang impianmu.' },
  { t: ['Buka jastip,', 'raih penghasilan tambahan'], d: 'Justipper dapat menawarkan barang titipan dan menjangkau konsumen lebih luas.' },
];

const Skyline = () => (
  <svg className="skyline" viewBox="0 0 300 200" aria-hidden="true">
    <g fill="#cfe9fb"><rect x="30" y="70" width="34" height="110" rx="3" /><rect x="72" y="100" width="28" height="80" rx="3" /><rect x="214" y="60" width="30" height="120" rx="3" /><rect x="252" y="105" width="26" height="75" rx="3" /></g>
    <g fill="#e8f6fe"><rect x="38" y="82" width="6" height="6" /><rect x="50" y="82" width="6" height="6" /><rect x="38" y="98" width="6" height="6" /><rect x="222" y="74" width="6" height="6" /><rect x="234" y="74" width="6" height="6" /><rect x="222" y="92" width="6" height="6" /></g>
  </svg>
);

export default function Onboarding({ onStart }) {
  const [i, setI] = useState(0);
  const x0 = useRef(null);
  const s = SLIDES[i];
  const swipe = (e) => {
    const dx = e.changedTouches[0].clientX - x0.current;
    if (Math.abs(dx) > 40) setI((v) => Math.max(0, Math.min(2, v + (dx < 0 ? 1 : -1))));
  };
  return (
    <div className="auth ob" onTouchStart={(e) => (x0.current = e.touches[0].clientX)} onTouchEnd={swipe}>
      <div className="ob-art" key={'a' + i}>
        <div className="blob" /><Skyline />
        <svg className="ob-plane" viewBox="0 0 64 64" aria-hidden="true"><path d="M60 8c-2-2-6-1-9 2L38 23 12 14l-4 4 20 13-8 9-8-1-3 3 9 4 4 9 3-3-1-8 9-8 13 20 4-4-9-26 13-13c3-3 4-7 2-9z" /></svg>
        <Logo fg="#2fa9f0" bg="#fff" className="ob-logo" />
      </div>
      <div className="ob-text" key={'t' + i}>
        <h1>{s.t[0]}<br />{s.t[1]}</h1>
        <p>{s.d}</p>
      </div>
      <div className="dots" role="tablist">
        {SLIDES.map((_, k) => <button key={k} role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}
      </div>
      <button className="btn wide between" onClick={onStart}><span /> Mulai <Ic n="back" size={18} className="flip" /></button>
    </div>
  );
}
