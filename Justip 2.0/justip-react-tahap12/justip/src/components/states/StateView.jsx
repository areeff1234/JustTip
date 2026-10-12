import { useState } from 'react';

// Ilustrasi kondisi khusus (SVG sederhana, warna mengikuti tema Justip)
const A = {
  search: (<><circle cx="76" cy="62" r="34" fill="#fff" stroke="#38bdf8" strokeWidth="7" /><path d="M101 88l24 24" stroke="#38bdf8" strokeWidth="9" strokeLinecap="round" /><path d="M64 52l24 20M88 52L64 72" stroke="#9fd3f3" strokeWidth="6" strokeLinecap="round" /></>),
  payfail: (<><rect x="30" y="38" width="100" height="66" rx="10" fill="#fff" stroke="#38bdf8" strokeWidth="5" /><path d="M30 58h100" stroke="#38bdf8" strokeWidth="9" /><rect x="42" y="78" width="28" height="9" rx="3" fill="#cfeafb" /><circle cx="126" cy="98" r="19" fill="#e8475a" stroke="#fff" strokeWidth="4" /><path d="M119 91l14 14M133 91l-14 14" stroke="#fff" strokeWidth="5" strokeLinecap="round" /></>),
  cancel: (<><path d="M80 22l42 20v38L80 100 38 80V42z" fill="#e3f3fd" stroke="#38bdf8" strokeWidth="5" strokeLinejoin="round" /><path d="M38 42l42 20 42-20M80 62v38" fill="none" stroke="#38bdf8" strokeWidth="4" /><circle cx="120" cy="96" r="19" fill="#e8475a" stroke="#fff" strokeWidth="4" /><path d="M112 96h16" stroke="#fff" strokeWidth="5" strokeLinecap="round" /></>),
  verify: (<><path d="M80 18l40 14v30c0 26-18 42-40 50-22-8-40-24-40-50V32z" fill="#e3f3fd" stroke="#38bdf8" strokeWidth="5" strokeLinejoin="round" /><path d="M62 64l13 13 24-26" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></>),
  review: (<><path d="M80 18l40 14v30c0 26-18 42-40 50-22-8-40-24-40-50V32z" fill="#fff6dc" stroke="#d9b86c" strokeWidth="5" strokeLinejoin="round" /><circle cx="80" cy="62" r="18" fill="none" stroke="#d9b86c" strokeWidth="6" /><path d="M80 52v11l8 5" fill="none" stroke="#d9b86c" strokeWidth="5" strokeLinecap="round" /></>),
  reject: (<><path d="M80 18l40 14v30c0 26-18 42-40 50-22-8-40-24-40-50V32z" fill="#ffe9ec" stroke="#e8475a" strokeWidth="5" strokeLinejoin="round" /><path d="M66 48l28 28M94 48L66 76" stroke="#e8475a" strokeWidth="8" strokeLinecap="round" /></>),
  offline: (<><path d="M30 62a70 70 0 0 1 100 0M48 80a44 44 0 0 1 64 0" fill="none" stroke="#9fd3f3" strokeWidth="9" strokeLinecap="round" /><circle cx="80" cy="98" r="7" fill="#38bdf8" /><path d="M34 28l92 92" stroke="#e8475a" strokeWidth="8" strokeLinecap="round" /></>),
};
export const Art = ({ k }) => <svg className="sv-art" viewBox="0 0 160 125" aria-hidden="true">{A[k]}</svg>;

// actions: [label, onClick, 'out' | 'lnk' | undefined]
export default function StateView({ art, title, text, actions = [], full, children }) {
  return (
    <section className={`sv ${full ? 'full' : ''}`} role="status">
      <Art k={art} /><h2>{title}</h2>{text && <p>{text}</p>}{children}
      {actions.length > 0 && (
        <div className="sv-act">{actions.map(([l, fn, kind]) => <button key={l} className={kind === 'lnk' ? 'lnk' : `btn wide ${kind ?? ''}`} onClick={fn}>{l}</button>)}</div>
      )}
    </section>
  );
}

// Layar penuh saat tidak ada koneksi. onRetry() mengembalikan true bila sudah online lagi.
export function Offline({ onRetry }) {
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState('');
  const retry = () => { setBusy(true); setMsg(''); setTimeout(() => { setBusy(false); if (!onRetry()) setMsg('Masih belum terhubung. Periksa Wi-Fi atau data seluler, lalu coba lagi.'); }, 1200); };
  return (
    <div className="offl">
      <StateView full art="offline" title="Tidak Ada Koneksi" text="Sepertinya internetmu terputus. Data kamu tetap aman dan akan dilanjutkan setelah terhubung lagi."
        actions={[[busy ? 'Menghubungkan...' : 'Coba Lagi', busy ? () => {} : retry]]}>
        <ul className="sv-tips"><li>Periksa Wi-Fi atau data seluler</li><li>Matikan lalu aktifkan mode pesawat</li></ul>
        {msg && <small className="ferr c" role="alert">{msg}</small>}
      </StateView>
    </div>
  );
}
