import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';

const Plane = () => (
  <svg className="plane" viewBox="0 0 64 64" aria-hidden="true">
    <path fill="#fff" d="M60 8c-2-2-6-1-9 2L38 23 12 14l-4 4 20 13-8 9-8-1-3 3 9 4 4 9 3-3-1-8 9-8 13 20 4-4-9-26 13-13c3-3 4-7 2-9z" />
  </svg>
);

export default function Splash({ onDone }) {
  const [exit, setExit] = useState(false);

  // otomatis selesai; tap layar = lewati
  useEffect(() => {
    const t = setTimeout(() => setExit(true), 4200);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!exit) return;
    const t = setTimeout(onDone, 750);
    return () => clearTimeout(t);
  }, [exit, onDone]);

  return (
    <div className={`splash ${exit ? 'exit' : ''}`} onClick={() => setExit(true)} role="presentation">
      <div className="ring r1" /><div className="ring r2" />
      <Plane />
      <div className="splash-center">
        <Logo animated bg="#38BDF8" fg="#fff" className="splash-logo" />
        <h1 className="wordmark" aria-label="justip">
          {'justip'.split('').map((c, i) => (
            <span key={i} style={{ animationDelay: `${1.5 + i * 0.08}s` }}>{c}</span>
          ))}
        </h1>
        <p className="tagline">Jasa Titip, Lebih Mudah!</p>
      </div>
      <div className="home-bar" />
    </div>
  );
}
