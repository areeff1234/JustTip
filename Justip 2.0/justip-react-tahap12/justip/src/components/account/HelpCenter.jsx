import { useState } from 'react';
import { Ic } from '../ui.jsx';
import { FAQ } from './accountData.js';
import { Bar } from './parts.jsx';

export default function HelpCenter({ role, back, say }) {
  const [q, setQ] = useState('');
  const list = FAQ[role].filter(([a, b]) => (a + b).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <Bar title="Pusat Bantuan" back={back} />
      <main className="scroll pad acc">
        <label className="search"><Ic n="search" size={20} /><input placeholder="Cari bantuan..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari bantuan" /></label>
        <h3 className="a-gt">Pertanyaan Umum</h3>
        <div className="a-faq">
          {list.map(([a, b]) => (<details key={a}><summary>{a}<Ic n="chevD" size={16} /></summary><p>{b}</p></details>))}
          {!list.length && <p className="empty">Tidak ada hasil untuk "{q}".</p>}
        </div>
        <h3 className="a-gt">Butuh bantuan lain?</h3>
        <div className="a-contact">
          <a href="mailto:bantuan@justip.id"><span className="a-ri"><Ic n="mail" size={20} /></span><b>Email</b><small>bantuan@justip.id</small></a>
          <button onClick={() => say('Chat bantuan hadir di tahap berikutnya')}><span className="a-ri"><Ic n="chat" size={20} /></span><b>Chat Bantuan</b><small>Segera hadir</small></button>
        </div>
        <div className="a-group">
          <button className="a-row" onClick={() => say('Syarat & Ketentuan hadir di tahap berikutnya')}><span className="a-ri"><Ic n="clip" size={20} /></span><span><b>Syarat & Ketentuan</b></span><Ic n="chevR" size={16} /></button>
          <button className="a-row" onClick={() => say('Kebijakan Privasi hadir di tahap berikutnya')}><span className="a-ri"><Ic n="shield" size={20} /></span><span><b>Kebijakan Privasi</b></span><Ic n="chevR" size={16} /></button>
        </div>
      </main>
    </>
  );
}
