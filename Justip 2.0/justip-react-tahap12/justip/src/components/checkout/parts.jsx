import { Ic } from '../ui.jsx';

export const CoHeader = ({ title, back, stepper }) => (
  <>
    <header className="bar"><button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button><h2>{title}</h2></header>
    {stepper && (
      <ol className="stepper" aria-label="Langkah checkout">
        {['Alamat', 'Pengiriman', 'Pembayaran', 'Konfirmasi'].map((s, i) => <li key={s} className={i === 0 ? 'on' : ''}><span>{i + 1}</span>{s}</li>)}
      </ol>
    )}
  </>
);
export const Radio = ({ on }) => <span className={`rd ${on ? 'on' : ''}`} aria-hidden="true" />;
export const Chip = ({ t, c }) => <span className={`tagc ${c ?? ''}`}>{t}</span>;
export const Row = ({ k, v, bold }) => <div className={`sumrow ${bold ? 'b' : ''}`}><span>{k}</span><b>{v}</b></div>;
