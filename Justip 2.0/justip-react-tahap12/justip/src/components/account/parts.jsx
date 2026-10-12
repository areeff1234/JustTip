import { Ic } from '../ui.jsx';
import { Field } from '../auth/AuthUI.jsx';

export const Bar = ({ title, back }) => (
  <header className="bar"><button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button><h2>{title}</h2></header>
);
export const Fld = ({ label, ...p }) => (<div className="a-fld"><span className="a-lab">{label}</span><Field {...p} /></div>);
export const Switch = ({ on, set, label }) => (
  <button type="button" className="switch" role="switch" aria-checked={on} aria-label={label} onClick={() => set(!on)}><i /></button>
);
