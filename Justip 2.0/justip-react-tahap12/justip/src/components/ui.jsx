// Komponen kecil yang dipakai di banyak halaman
const P = {
  home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  box: 'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10',
  chat: 'M4 5h16v11H9l-5 4z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  bell: 'M6 17v-6a6 6 0 0 1 12 0v6l2 2H4zM10 21h4',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5',
  back: 'M19 12H5M11 6l-6 6 6 6',
  share: 'M12 15V3M8 7l4-4 4 4M5 12v8h14v-8',
  heart: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
  chevR: 'M9 5l7 7-7 7', chevD: 'M5 9l7 7 7-7',
  shirt: 'M8 3L3 7l3 3 2-1v12h8V9l2 1 3-3-5-4a4 4 0 0 1-8 0z',
  phone: 'M7 2h10v20H7zM11 18h2',
  bottle: 'M10 3h4v3h-4zM8 6h8v15H8zM8 12h8',
  food: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10',
  bag: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',
  house: 'M3 11l9-8 9 8v9H3zM9 20v-6h6v6',
  dumbbell: 'M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12',
  game: 'M6 8h12a3 3 0 0 1 3 3v4a3 3 0 0 1-5 2l-1-2H9l-1 2a3 3 0 0 1-5-2v-4a3 3 0 0 1 3-3zM8 11v3M6.5 12.5h3M16 12h.01M18 13h.01',
  plus: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v8M8 12h8',
  chart: 'M3 3v18h18M7 16l4-6 4 2 5-7',
  car: 'M4 16v-4l2-5h12l2 5v4zM4 16v2M20 16v2M7 13h.01M17 13h.01',
  dots: 'M6 12h.01M12 12h.01M18 12h.01',
  shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5',
  filter: 'M4 6h16M7 12h10M10 18h4', sort: 'M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4',
  plane: 'M21 3L10 14M21 3l-7 18-4-7-7-4z',
  truck: 'M2 6h11v10H2zM13 10h5l3 3v3h-8M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
  ruler: 'M3 15L15 3l6 6L9 21zM8 10l2 2M11 7l2 2',
  tag: 'M3 12V4h8l10 10-8 8zM7.5 8h.01',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeoff: 'M3 3l18 18M10 6a9 9 0 0 1 12 6 12 12 0 0 1-3 3.500M6 7.500A12 12 0 0 0 2 12s4 7 10 7a9 9 0 0 0 4-1M10 10a3 3 0 0 0 4 4',
  call: 'M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  store: 'M4 9l1-5h14l1 5M4 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 4 0M5 12v8h14v-8M10 20v-5h4v5',
  scooter: 'M5 19a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5zM19 19a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5zM7.500 16.500H15l-2-9h-3M15 7.500h3M8 4h3',
  check: 'M5 12l5 5 9-10',
  pin: 'M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  out: 'M9 4H5v16h4M16 8l4 4-4 4M20 12H9',
  wallet: 'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l2-3h12v3M16 13h3',
  headset: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1zM17 19c0 1.500-2 2-5 2',
  map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  mega: 'M4 10v4h3l8 5V5L7 10zM18 9a4 4 0 0 1 0 6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v3M12 18v3M3 12h3M18 12h3M5.600 5.600l2.100 2.100M16.300 16.300l2.100 2.100M5.600 18.400l2.100-2.100M16.300 7.700l2.100-2.100',
  pencil: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
  moreV: 'M12 6h.01M12 12h.01M12 18h.01',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  clip: 'M9 4h6v3H9zM7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1M9 12h6M9 16h4',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  copy: 'M9 9h11v11H9zM5 15V5h10',
  camera: 'M4 8h4l2-3h4l2 3h4v11H4zM12 17a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7z',
  navi: 'M21 3L3 11l8 2 2 8z',
  cart: 'M3 4h3l2 12h11l2-8H7M10 20h.01M17 20h.01',
};
export const Ic = ({ n, size = 22, filled, className = '' }) => (
  <svg className={`ic ${filled ? 'filled' : ''} ${className}`} style={{ width: size, height: size }} viewBox="0 0 24 24" aria-hidden="true"><path d={P[n]} /></svg>
);
export const rp = (n) => 'Rp ' + n.toLocaleString('id-ID');
export const Stars = ({ v, c }) => <span className="rate"><b>★</b> {v}{c ? ` (${c})` : ''}</span>;

// Logo toko (disederhanakan)
export const Brand = ({ k, size = 44 }) => (
  <span className="brand-ic" style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24">
      {k === 'nike' && <path d="M3 15c4 3 12-1 18-8-5 3-10 6-13 5-2-.7-3 1-5 3z" fill="#fff" />}
      {k === 'apple' && <path d="M12 8c2-2 4-2 4-4-2 0-3.500 1-4 2-1.500-1-4-1-5 1-2 3 0 9 2 10 1 1 2 0 3 0s2 1 3 0c1-1 2-3 2-3-2-1-2-4 0-5-1-1-3-2-5-1z" fill="#111" transform="scale(.9) translate(1.300 2)" />}
      {k === 'adidas' && <path d="M4 18l4-8 3 2-3 6zM10 18l4-12 3 2-4 10zM16 18l4-16 3 2-5 14z" fill="#fff" transform="translate(-2 3) scale(.9)" />}
    </svg>
  </span>
);
