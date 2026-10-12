import { Ic } from '../ui.jsx';

const ROUTES = {
  rute: 'M52 38V92Q52 112 74 118L118 140Q132 148 132 170V220Q132 236 150 242L228 262',
  jalan: 'M78 96Q78 130 100 142L140 160Q158 170 160 196V214Q162 232 184 236L230 240',
};
const Pin = ({ x, y, n }) => (
  <g>
    <path d={`M${x - 8} ${y + 10}l8 12 8-12z`} fill="#2fa9f0" />
    <circle cx={x} cy={y} r="15" fill="#2fa9f0" stroke="#fff" strokeWidth="3" />
    <g transform={`translate(${x - 8} ${y - 8})`} style={{ color: '#fff' }}><Ic n={n} size={16} /></g>
  </g>
);

// Peta ilustrasi (GPS asli menyusul di tahap backend)
export default function MapView({ mode = 'rute', km, left, eta }) {
  const jalan = mode === 'jalan';
  return (
    <div className="t-map">
      <svg viewBox="0 0 300 300" role="img" aria-label="Peta rute pengantaran">
        <rect width="300" height="300" fill="#eef2f6" />
        <path d="M205 0C192 60 222 110 192 170S172 250 208 300" fill="none" stroke="#c9e6f8" strokeWidth="24" />
        <g fill="#dcecd6"><rect x="150" y="14" width="46" height="40" rx="8" /><rect x="14" y="196" width="70" height="52" rx="8" /></g>
        <g stroke="#fff" strokeWidth="10" fill="none"><path d="M0 76H300M0 178H300M0 268H300M60 0V300M132 0V300M262 0V300" /></g>
        <g stroke="#fff" strokeWidth="4" fill="none"><path d="M0 128H300M0 226H300M96 0V300M220 0V300" /></g>
        <path d={ROUTES[mode]} className="t-route" />
        {jalan ? (
          <><Pin x={230} y={226} n="house" />
            <circle cx="78" cy="96" r="16" fill="#2fa9f0" fillOpacity=".25" /><circle cx="78" cy="96" r="9" fill="#1f6fe0" stroke="#fff" strokeWidth="3" /></>
        ) : (
          <><Pin x={52} y={30} n="store" /><Pin x={228} y={254} n="house" /></>
        )}
      </svg>
      {jalan ? (
        <div className="t-stat">
          <span><Ic n="pin" size={14} /><small>Sisa Jarak</small><b>{left} km</b></span>
          <span><Ic n="map" size={14} /><small>Estimasi Tiba</small><b>{eta} menit</b></span>
        </div>
      ) : (
        <>
          <i className="t-lbl" style={{ left: '24%', top: '6%' }}>Toko</i>
          <i className="t-lbl km" style={{ left: '52%', top: '56%' }}>{km} km</i>
          <i className="t-lbl" style={{ left: '48%', top: '90%' }}>Lokasi Pengantaran</i>
          <span className="t-navi"><Ic n="navi" size={20} /></span>
        </>
      )}
    </div>
  );
}
