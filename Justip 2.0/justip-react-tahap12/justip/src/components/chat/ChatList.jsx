import { useState } from 'react';
import { Ic } from '../ui.jsx';
import { view } from './chatData.js';

export const ChAv = ({ name, role }) => <span className={`ch-av r-${role}`} aria-hidden="true">{name.trim()[0]?.toUpperCase()}</span>;

export default function ChatList({ list, role, open, error }) {
  const [q, setQ] = useState('');
  const rows = list.map((c) => ({ c, v: view(c, role) })).filter(({ v }) => v.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <main className="scroll pad">
      <h2 className="pg-t">Chat</h2>
      {error && <p className="ch-error" role="alert">{error}</p>}
      <label className="search"><Ic n="search" size={20} /><input placeholder="Cari percakapan..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari percakapan" /></label>
      <div className="ch-list">
        {rows.map(({ c, v }) => (
          <button key={c.id} className="ch-row" onClick={() => open(c.id)}>
            <ChAv name={v.name} role={c.other.role === role ? 'pemesan' : role === 'pemesan' ? c.other.role : 'pemesan'} />
            <span className="ch-mid"><b>{v.name}<em>{v.label}</em></b><small className={v.unread ? 'new' : ''}>{v.last}</small></span>
            <span className="ch-end"><small>{v.time}</small>{v.unread ? <i className="badge">{v.unread}</i> : null}</span>
          </button>
        ))}
        {!rows.length && <p className="empty">{q ? `Tidak ada percakapan untuk "${q}".` : 'Belum ada percakapan.'}</p>}
      </div>
    </main>
  );
}
