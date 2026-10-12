import { useState } from 'react';
import BottomNav from '../BottomNav.jsx';
import { useToast } from '../shared.jsx';
import Account from '../account/Account.jsx';
import { rp } from '../ui.jsx';
import JustipperHome from './JustipperHome.jsx';
import { OrdersPage, MapPage } from './JustipperPages.jsx';
import ChatList from '../chat/ChatList.jsx';
import ChatRoom from '../chat/ChatRoom.jsx';
import { TitipanPage, TitipanForm } from './JustipperProducts.jsx';
import JustipperOrderDetail from './JustipperOrderDetail.jsx';
import ManageMeetingPoints from './ManageMeetingPoints.jsx';
import ManageQris from './ManageQris.jsx';
import { useJustip } from '../../context/JustipContext.jsx';

const NAV = (u) => [
  ['home', 'Beranda'],
  ['bag', 'Titipan'],
  ['box', 'Pesanan'],
  ['chat', 'Chat', u],
  ['user', 'Akun'],
];

export default function JustipperApp({ session, logout, acc, chat }) {
  const {
    products,
    addProduct,
    updateProduct,
    toggleProduct,
    deleteProduct,
    orders,
    acceptOrder,
    updateOrderStage,
    balance,
    txs,
    banks,
    setBanks,
    requestWithdrawal,
  } = useJustip();

  const [roomId, setRoomId] = useState(null);
  const [deep, setDeep] = useState(false);
  const [tab, setTab] = useState('Beranda');
  const [online, setOnline] = useState(true);
  const [detailOrder, setDetailOrder] = useState(null);
  const [ordStart, setOrdStart] = useState('masuk');
  const [toast, say] = useToast();
  const [form, setForm] = useState(null);
  const [subView, setSubView] = useState(null); // 'mp' | 'qris' | null

  // Status mapping berurutan:
  // new: baru / menunggu
  // active: diterima, belanja, antar, perjalanan, tiba (sedang berjalan)
  // done: selesai
  const st = (o) => {
    if (o.status === 'selesai' || o.stage === 'selesai') return 'done';
    if (['diterima', 'belanja', 'antar', 'perjalanan', 'tiba'].includes(o.stage) || o.status === 'proses') {
      return 'active';
    }
    return 'new';
  };

  const onDetail = (id) => {
    const target = orders.find((x) => x.id === id);
    if (target) setDetailOrder(target);
  };

  const handleQuickAccept = (o) => {
    if (!online) {
      return say('Aktifkan status online untuk menerima pesanan');
    }
    acceptOrder(o.id);
    updateOrderStage(o.id, 'diterima', 'Pesanan diterima & dikonfirmasi oleh jastiper');
    say('✓ Pesanan diterima! Lanjut ke tahap 2: Membelikan Produk.');
    const updated = orders.find((x) => x.id === o.id) || { ...o, stage: 'diterima', status: 'proses' };
    setDetailOrder(updated);
  };

  const withdraw = (amount, b) => {
    requestWithdrawal(amount, b);
    say('Permintaan penarikan saldo telah diajukan ke admin');
  };

  const saveProduct = (item, publish) => {
    if (form && form.id) {
      updateProduct({ ...form, ...item, active: publish });
    } else {
      addProduct({ ...item, active: publish });
    }
    setForm(null);
    say(publish ? 'Slot titipan berhasil dipublikasikan' : 'Draf titipan disimpan');
  };

  const currentDetail = detailOrder ? orders.find((x) => x.id === detailOrder.id) || detailOrder : null;

  if (subView === 'mp') {
    return (
      <div className="app">
        <div className="page">
          <ManageMeetingPoints back={() => setSubView(null)} say={say} />
          {toast}
        </div>
      </div>
    );
  }

  if (subView === 'qris') {
    return (
      <div className="app">
        <div className="page">
          <ManageQris back={() => setSubView(null)} say={say} />
          {toast}
        </div>
      </div>
    );
  }

  // Tampilan Rincian Pesanan & Stepper 5 Tahap Langsung
  if (currentDetail) {
    return (
      <div className="app">
        <div className="page">
          <JustipperOrderDetail
            o={currentDetail}
            back={() => setDetailOrder(null)}
            onChat={(o) => {
              setDetailOrder(null);
              setRoomId(chat.start({ store: o.store || 'Hafiz Anggara', product: { name: o.name, price: o.price, art: o.art } }));
              setTab('room');
            }}
            onUpdateStage={(id, nextStg, note, feeMethod) => {
              updateOrderStage(id, nextStg, note, feeMethod);
            }}
            say={say}
          />
          {toast}
        </div>
      </div>
    );
  }

  if (form) {
    return (
      <div className="app">
        <div className="page">
          <TitipanForm item={form.id ? form : null} back={() => setForm(null)} onSave={saveProduct} />
          {toast}
        </div>
      </div>
    );
  }

  const myProducts = products.filter((p) => p.justipper === 'Hafiz Anggara' || p.store?.includes('Hafiz Anggara'));
  const doneOrders = orders.filter((o) => st(o) === 'done');

  return (
    <div className="app">
      <div className="page">
        {tab === 'Beranda' && (
          <JustipperHome
            orders={orders}
            st={st}
            online={online}
            setOnline={setOnline}
            open={onDetail}
            onDetail={onDetail}
            onAccept={handleQuickAccept}
            goTab={setTab}
            balance={balance}
            say={say}
            products={myProducts}
            onAddProduct={() => setForm({})}
            onEditProduct={(p) => setForm(p)}
            onManageMp={() => setSubView('mp')}
            onManageQris={() => setSubView('qris')}
          />
        )}
        {tab === 'Titipan' && (
          <TitipanPage
            products={myProducts}
            onAdd={() => setForm({})}
            onEdit={(p) => setForm(p)}
            onToggle={(id) => { toggleProduct(id); say('Status produk diubah'); }}
            onDelete={(id) => { deleteProduct(id); say('Produk dihapus'); }}
          />
        )}
        {tab === 'Peta' && <MapPage orders={orders} st={st} />}
        {tab === 'Pesanan' && (
          <OrdersPage
            orders={orders}
            st={st}
            online={online}
            onDetail={onDetail}
            onAccept={handleQuickAccept}
            start={ordStart}
          />
        )}
        {tab === 'Akun' && (
          <Account
            role="justipper"
            acc={acc}
            logout={logout}
            say={say}
            onDeep={setDeep}
            stats={[
              ['Pesanan Selesai', doneOrders.length],
              ['Rating Mitra', '4.9 ★'],
            ]}
          />
        )}
        {tab === 'Chat' && <ChatList list={chat.list('justipper')} role="justipper" open={(id) => { setRoomId(id); setTab('room'); }} />}
        {tab === 'room' && chat.convs.find((c) => c.id === roomId) && (
          <ChatRoom
            conv={chat.convs.find((c) => c.id === roomId)}
            role="justipper"
            back={() => setTab('Chat')}
            send={chat.send}
            read={chat.read}
          />
        )}
        {toast}
      </div>
      {!deep && tab !== 'room' && <BottomNav items={NAV(chat.unread('justipper'))} active={tab} onChange={setTab} />}
    </div>
  );
}
