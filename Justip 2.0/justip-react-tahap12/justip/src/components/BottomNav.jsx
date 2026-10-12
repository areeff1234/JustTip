import { Ic } from './ui.jsx';

// items: [ikon, nama, badge?]
export default function BottomNav({ items, active, onChange }) {
  return (
    <nav className="nav" aria-label="Menu utama">
      {items.map(([icon, name, badge]) => (
        <button key={name} className={active === name ? 'on' : ''} onClick={() => onChange(name)}>
          <span className="nv"><Ic n={icon} />{badge ? <i className="badge">{badge}</i> : null}</span>{name}
        </button>
      ))}
    </nav>
  );
}
