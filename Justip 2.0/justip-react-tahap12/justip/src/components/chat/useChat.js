import { useState } from 'react';
import { SEED, hm, peerOf, autoReply, visible } from './chatData.js';

export function useChat() {
  const [convs, setConvs] = useState(SEED);
  const upd = (id, fn) => setConvs((l) => l.map((c) => (c.id === id ? fn(c) : c)));

  const send = (id, role, m) => {
    const conv = convs.find((c) => c.id === id), peer = peerOf(conv, role), n = conv.msgs.length;
    upd(id, (c) => ({ ...c, typing: peer, msgs: [...c.msgs, { id: Date.now(), from: role, time: hm(), ...m }], unread: { ...c.unread, [peer]: (c.unread[peer] || 0) + 1 } }));
    // demo: lawan bicara membalas otomatis
    setTimeout(() => upd(id, (c) => ({ ...c, typing: null, msgs: [...c.msgs, { id: Date.now() + 1, from: peer, text: autoReply(peer, n), time: hm() }], unread: { ...c.unread, [role]: (c.unread[role] || 0) + 1 } })), 1800);
  };
  const read = (id, role) => setConvs((l) => l.map((c) => (c.id === id && c.unread[role] ? { ...c, unread: { ...c.unread, [role]: 0 } } : c)));
  const start = ({ store, product }) => {
    const jastiperName = store || 'Justipper Terpercaya';
    const ex = convs.find((c) => c.pemesan.me && c.other.role === 'justipper' && c.other.name === jastiperName);
    if (ex) { upd(ex.id, (c) => ({ ...c, ctx: { type: 'product', name: product.name, price: product.price, art: product.art } })); return ex.id; }
    const id = `c${Date.now()}`;
    setConvs((l) => [{ id, pemesan: { name: 'Nur Arif', me: true }, other: { role: 'justipper', name: jastiperName }, ctx: { type: 'product', name: product.name, price: product.price, art: product.art }, unread: {}, msgs: [] }, ...l]);
    return id;
  };
  const unread = (role) => visible(convs, role).reduce((s, c) => s + (c.unread[role] || 0), 0);
  return { convs, send, read, start, unread, list: (role) => visible(convs, role) };
}
