import { useState } from 'react';
import BottomNav from '../BottomNav.jsx';
import { useToast } from '../shared.jsx';
import ChatList from '../chat/ChatList.jsx';
import ChatRoom from '../chat/ChatRoom.jsx';
import Account from '../account/Account.jsx';
import PenjualHome from './PenjualHome.jsx';
import { ProductsPage } from './SellerProducts.jsx';
import ProductForm from './ProductForm.jsx';
import SellerOrders from './SellerOrders.jsx';
import OrderDetail from './OrderDetail.jsx';
import { S_PRODUCTS, S_ORDERS } from '../../data.js';

const NAV = (n, c) => [['home', 'Beranda'], ['grid', 'Produk'], ['box', 'Pesanan', n], ['chat', 'Chat', c], ['user', 'Akun']];

export default function PenjualApp({ session, logout, acc, chat }) {
  const [roomId, setRoomId] = useState(null);
  const [deep, setDeep] = useState(false);
  const [tab, setTab] = useState('Beranda');
  const [products, setProducts] = useState(S_PRODUCTS);
  const [orders, setOrders] = useState(S_ORDERS);
  const [oid, setOid] = useState(null);
  const [ostart, setOstart] = useState('baru');
  const [form, setForm] = useState(null); // null | { edit?: produk }
  const [toast, say] = useToast();

  const save = (p, publish) => {
    const exists = products.some((x) => x.id === p.id);
    setProducts((l) => (exists ? l.map((x) => (x.id === p.id ? p : x)) : [p, ...l]));
    setForm(null); setTab('Produk');
    say(!publish ? 'Draf disimpan' : exists ? 'Produk diperbarui & dipublikasikan' : 'Produk dipublikasikan');
  };
  const todo = orders.filter((o) => o.status === 'baru').length;
  const setStatus = (id, status, msg) => { setOrders((l) => l.map((o) => (o.id === id ? { ...o, status } : o))); say(msg); };
  const seeOrders = (t = 'baru') => { setOstart(t); setTab('Pesanan'); };
  const rowProps = {
    onEdit: (p) => setForm({ edit: p }),
    onToggle: (id) => setProducts((l) => l.map((x) => (x.id === id ? { ...x, active: x.draft ? true : !x.active, draft: false } : x))),
    onDelete: (id) => { setProducts((l) => l.filter((x) => x.id !== id)); say('Produk dihapus'); },
  };

  const room = chat.convs.find((c) => c.id === roomId);
  if (room) return <div className="app"><div className="page"><ChatRoom conv={room} role="penjual" back={() => setRoomId(null)} send={chat.send} read={chat.read} /></div></div>;
  const cur = orders.find((o) => o.id === oid);
  if (cur) return <div className="app"><div className="page"><OrderDetail o={cur} back={() => setOid(null)} setStatus={setStatus} />{toast}</div></div>;
  if (form) return <div className="app"><div className="page"><ProductForm edit={form.edit} back={() => setForm(null)} onSave={save} /></div></div>;
  return (
    <div className="app">
      <div className="page">
        {tab === 'Beranda' && <PenjualHome products={products} goTab={setTab} todo={todo} seeOrders={seeOrders} onAdd={() => setForm({})} say={say} rowProps={rowProps} />}
        {tab === 'Produk' && <ProductsPage products={products} onAdd={() => setForm({})} {...rowProps} />}
        {tab === 'Pesanan' && <SellerOrders orders={orders} start={ostart} open={setOid} setStatus={setStatus} />}
        {tab === 'Chat' && <ChatList list={chat.list('penjual')} role="penjual" open={setRoomId} />}
        {tab === 'Akun' && <Account role="penjual" acc={acc} logout={logout} say={say} onDeep={setDeep} stats={[['Produk', products.length], ['Pesanan', 56], ['Rating', '4.8']]} />}
        {toast}
      </div>
      {!deep && <BottomNav items={NAV(todo, chat.unread('penjual'))} active={tab} onChange={(t) => { setOstart('baru'); setTab(t); }} />}
    </div>
  );
}
