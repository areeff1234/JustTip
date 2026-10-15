import { useState } from 'react';
import Home from '../Home.jsx';
import Kategori from '../Kategori.jsx';
import ProductList from '../ProductList.jsx';
import Detail from '../Detail.jsx';
import BottomNav from '../BottomNav.jsx';
import { useToast } from '../shared.jsx';
import ChatList from '../chat/ChatList.jsx';
import ChatRoom from '../chat/ChatRoom.jsx';
import Account from '../account/Account.jsx';
import OrdersTab from './OrdersTab.jsx';
import OrderDetail from './OrderDetail.jsx';
import CustomRequestModal from './CustomRequestModal.jsx';
import { useCheckout } from '../checkout/checkout.js';
import CartPage from '../checkout/CartPage.jsx';
import PaymentPage from '../checkout/PaymentPage.jsx';
import SuccessPage from '../checkout/SuccessPage.jsx';

import { useJustip } from '../../context/JustipContext.jsx';

const NAV = (n) => [['home', 'Beranda'], ['grid', 'Kategori'], ['box', 'Pesanan'], ['chat', 'Chat', n], ['user', 'Akun']];
const NO_NAV = ['room', 'orderdetail', 'detail', 'checkout', 'bayar', 'sukses'];

export default function PemesanApp({ session, logout, acc, chat }) {
  const { orders, createOrder, createCustomRequest, cancelOrder, addOrderReview, meetingPoints } = useJustip();
  const [roomId, setRoomId] = useState(null);
  const [deep, setDeep] = useState(false);
  const [stack, setStack] = useState([{ page: 'home' }]);
  const [picking, setPicking] = useState(false);
  const [selNo, setSelNo] = useState(null);
  const [order, setOrder] = useState(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [toast, say] = useToast();
  const co = useCheckout();

  const cur = stack[stack.length - 1];
  const go = (page, product) => setStack((s) => [...s, { page, product }]);
  const back = () => { setPicking(false); setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)); };
  const tab = (n) => { setPicking(false); setStack([{ page: n === 'Beranda' ? 'home' : n === 'Kategori' ? 'kategori' : n }]); };
  const active = { home: 'Beranda', kategori: 'Kategori', list: 'Kategori' }[cur.page] ?? cur.page;

  const startOrder = (p, size) => { co.start(p, size); go('checkout'); };
  const openChat = async (request) => {
    try {
      const id = await chat.start(request);
      setRoomId(id);
      go('room');
    } catch (error) {
      say(error.message);
    }
  };
  const pick = (p) => { co.add(p); setPicking(false); back(); say('Produk ditambahkan ke pesanan'); };
  const cancel = (no, reason) => {
    cancelOrder(no, reason, 'Kamu');
    say('Pesanan dibatalkan');
  };

  const handleCustomSubmit = (data) => {
    const newReq = createCustomRequest({
      ...data,
      buyer: acc.profile?.name || session?.name || 'Nur Arif',
      phone: acc.profile?.phone || session?.phone || '+62 812 3456 7890',
    });
    say('Request titipan bebas berhasil diajukan!');
    setSelNo(newReq.no);
    go('orderdetail');
  };

  const pay = (isPaid = false, payMethod = 'QRIS') => {
    const selectedMp = meetingPoints.find((m) => m.id === co.selectedMpId) || meetingPoints[0];
    const o = createOrder({
      cart: co.cart,
      buyerName: acc.profile?.name || session?.name || 'Nur Arif',
      buyerPhone: acc.profile?.phone || session?.phone || '+62 812 3456 7890',
      meetingPoint: selectedMp,
      payMethod,
      subtotal: co.subtotal,
      fee: co.fee,
      total: co.total,
      notes: co.notes,
      isPaid,
    });
    setOrder(o);
    co.clear();
    go('sukses');
  };

  return (
    <div className="app">
      <div className="page">
        {cur.page === 'home' && <Home go={go} back={back} onRequestCustom={() => setCustomOpen(true)} />}
        {cur.page === 'kategori' && <Kategori go={go} back={back} />}
        {cur.page === 'list' && <ProductList go={go} back={back} pick={picking ? pick : undefined} onRequestCustom={() => setCustomOpen(true)} />}
        {cur.page === 'detail' && <Detail p={cur.product} back={back} onOrder={startOrder} onChat={(p) => openChat({ peerName: p.justipper || p.store, product: p })} />}
        {cur.page === 'checkout' && <CartPage co={co} go={go} back={back} addMore={() => { setPicking(true); go('list'); }} />}
        {cur.page === 'bayar' && <PaymentPage co={co} back={back} onPay={pay} say={say} />}
        {cur.page === 'sukses' && order && <SuccessPage order={order} say={say} onHome={() => tab('Beranda')} onDetail={() => tab('Pesanan')} />}
        {cur.page === 'Pesanan' && <OrdersTab orders={orders} open={(no) => { setSelNo(no); go('orderdetail'); }} />}
        {cur.page === 'orderdetail' && orders.find((o) => o.no === selNo) && (
          <OrderDetail
            o={orders.find((o) => o.no === selNo)}
            back={back}
            cancel={cancel}
            say={say}
            onReview={(review) => {
              const currentOrder = orders.find((o) => o.no === selNo);
              if (currentOrder) {
                addOrderReview(currentOrder.id, review);
                say('Terima kasih! Ulasan berhasil dikirim.');
              }
            }}
            onChat={(o) => {
              openChat({ peerName: o.justipper || o.store, order: o });
            }}
          />
        )}
        {cur.page === 'Akun' && <Account role="pemesan" acc={acc} logout={logout} say={say} onDeep={setDeep} stats={[['Pesanan', orders.length]]} />}
        {cur.page === 'Chat' && <ChatList list={chat.list('pemesan')} role="pemesan" open={(id) => { setRoomId(id); go('room'); }} error={chat.error} />}
        {cur.page === 'room' && chat.convs.find((c) => c.id === roomId) && <ChatRoom conv={chat.convs.find((c) => c.id === roomId)} role="pemesan" back={back} send={chat.send} read={chat.read} subscribeMessages={chat.subscribeMessages} error={chat.error} allowImages={!chat.isRealtime} />}
        {toast}
      </div>
      {!NO_NAV.includes(cur.page) && !deep && <BottomNav items={NAV(chat.unread('pemesan'))} active={active} onChange={tab} />}

      {/* Modal Request Titipan Bebas */}
      <CustomRequestModal
        isOpen={customOpen}
        onClose={() => setCustomOpen(false)}
        onSubmit={handleCustomSubmit}
        say={say}
      />
    </div>
  );
}
