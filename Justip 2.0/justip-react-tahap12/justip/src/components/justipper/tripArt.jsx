// Ilustrasi alur Justipper (SVG sederhana)
const Box = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 10l22-8 22 8v26l-22 8-22-8z" fill="#e9b97c" /><path d="M0 10l22 8 22-8M22 18v26" fill="none" stroke="#c98f4e" strokeWidth="2" /><path d="M13 6l22 8v9l-6-3v-4z" fill="#f4d3a4" /></g>
);
export const BellArt = () => (
  <svg className="t-art" viewBox="0 0 160 100" aria-hidden="true">
    <g stroke="#9fd8f8" strokeWidth="4" strokeLinecap="round"><path d="M26 40l12 8M30 62l12-2M134 40l-12 8M132 60l-12-2M60 8l4 10M100 8l-4 10" /></g>
    <circle cx="80" cy="52" r="32" fill="#2fa9f0" />
    <path d="M80 32c-9 0-15 7-15 16v8l-5 7h40l-5-7v-8c0-9-6-16-15-16zM74 68a6 6 0 0 0 12 0z" fill="#fff" />
    <circle cx="106" cy="27" r="9" fill="#e8475a" stroke="#fff" strokeWidth="3" /><text x="106" y="31" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">1</text>
  </svg>
);
export const StoreOk = () => (
  <svg className="t-art" viewBox="0 0 160 110" aria-hidden="true">
    <circle cx="80" cy="56" r="50" fill="#e3f3fd" />
    <rect x="42" y="46" width="62" height="42" rx="3" fill="#fff" stroke="#bfe3f8" strokeWidth="2" />
    <path d="M38 46l6-20h54l6 20z" fill="#2fa9f0" /><path d="M38 46a8 8 0 0 0 16 0 8 8 0 0 0 16 0 8 8 0 0 0 16 0 8 8 0 0 0 16 0z" fill="#7fd0fa" />
    <rect x="50" y="58" width="26" height="30" fill="#cfeafb" /><Box x={96} y={50} s={.8} />
    <circle cx="112" cy="84" r="14" fill="#2fa9f0" stroke="#fff" strokeWidth="3" /><path d="M105 84l5 5 9-10" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const BoxPin = () => (
  <svg className="t-art" viewBox="0 0 160 110" aria-hidden="true">
    <ellipse cx="80" cy="62" rx="68" ry="44" fill="#e3f3fd" />
    <path d="M30 80V54l18-14 18 14v26zM96 80V50l20-16 20 16v30z" fill="#cfeafb" />
    <Box x={52} y={50} s={1} />
    <path d="M110 18c-12 0-20 9-20 20 0 14 20 30 20 30s20-16 20-30c0-11-8-20-20-20z" fill="#2fa9f0" /><circle cx="110" cy="38" r="7" fill="#fff" />
  </svg>
);
export const DoneArt = () => (
  <svg className="t-art big" viewBox="0 0 180 130" aria-hidden="true">
    <g strokeLinecap="round" strokeWidth="4"><path d="M30 40l6 5" stroke="#2fa9f0" /><path d="M150 36l-6 6" stroke="#2fa9f0" /><path d="M24 80l8-2" stroke="#fbbf24" /><path d="M156 84l-9-3" stroke="#34d399" /><path d="M64 10l3 8" stroke="#34d399" /><path d="M120 8l-3 8" stroke="#2fa9f0" /></g>
    <circle cx="90" cy="66" r="40" fill="#38bdf8" /><circle cx="90" cy="66" r="40" fill="none" stroke="#cfeafb" strokeWidth="4" />
    <path d="M70 67l14 14 28-30" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
