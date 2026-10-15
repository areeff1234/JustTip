import { useEffect, useRef, useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { ChAv } from './ChatList.jsx';
import { QUICK, ROLE_LABEL, view, peerOf } from './chatData.js';

export default function ChatRoom({ conv, role, back, send, read, subscribeMessages, error, allowImages }) {
  const [text, setText] = useState('');
  const box = useRef(null);
  const v = view(conv, role), peer = peerOf(conv, role), n = conv.msgs.length;
  useEffect(() => { read(conv.id, role); if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [n, conv.typing]);
  useEffect(() => subscribeMessages?.(conv.id), [conv.id, subscribeMessages]);

  const go = (t) => { const m = t.trim(); if (m) { send(conv.id, role, { text: m }); setText(''); } };
  const x = conv.ctx;
  return (
    <>
      <header className="bar ch-head">
        <button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button>
        <ChAv name={v.name} role={peer} />
        <span><b>{v.name}</b><small>{conv.typing === peer ? 'sedang mengetik...' : v.label}</small></span>
      </header>
      {x && (
        <div className="ch-ctx">
          {x.type === 'product' ? <><span className="ch-ci">{ART[x.art]}</span><span><small>Menanyakan barang</small><b>{x.name}</b><em>{rp(x.price)}</em></span></>
            : <><span className="ch-ci"><Ic n="box" size={22} /></span><span><small>Pesanan {x.no}</small><b>{x.name}</b></span></>}
        </div>
      )}
      <main className="scroll ch-msgs" ref={box} aria-live="polite">
        {!n && <p className="ch-empty">Mulai percakapan dengan {v.name}. Tanyakan stok, harga, atau pengiriman.</p>}
        {conv.msgs.map((m) => (
          <div key={m.id} className={`ch-b ${m.from === role ? 'me' : ''}`}>
            {m.img ? <img src={m.img} alt="Foto terkirim" /> : <p>{m.text}</p>}
            <small>{m.time}</small>
          </div>
        ))}
        {conv.typing === peer && <div className="ch-b typing" aria-label={`${v.name} sedang mengetik`}><i /><i /><i /></div>}
      </main>
      <div className="ch-quick" aria-label="Balasan cepat">{QUICK[role].map((q) => <button key={q} onClick={() => go(q)}>{q}</button>)}</div>
      {error && <p className="ch-error" role="alert">{error}</p>}
      <form className="ch-comp" onSubmit={(e) => { e.preventDefault(); go(text); }}>
        {allowImages && <label className="ch-att" aria-label="Kirim foto"><Ic n="camera" size={22} /></label>}
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Tulis pesan untuk ${ROLE_LABEL[peer].toLowerCase()}...`} aria-label="Tulis pesan" maxLength={500} />
        <button className="ch-send" disabled={!text.trim()} aria-label="Kirim"><Ic n="navi" size={20} /></button>
      </form>
    </>
  );
}
