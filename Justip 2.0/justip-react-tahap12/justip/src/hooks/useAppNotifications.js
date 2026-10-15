import { useEffect, useRef } from 'react';

const orderId = (order) => String(order.id ?? order.no);
const orderSignature = (order) => {
  const latest = order.timeline?.[order.timeline.length - 1];
  return `${latest?.stage ?? order.stage ?? order.status}:${latest?.time ?? order.date ?? ''}:${latest?.desc ?? ''}`;
};

const isOrderRecipient = (order, session) => {
  if (session.role === 'pemesan') {
    return order.buyer === session.name || (session.phone && order.phone === session.phone);
  }
  if (session.role === 'justipper') {
    return order.justipper === session.name || order.store?.includes(session.name);
  }
  return false;
};

const conversationMessage = (conversation) => {
  const last = conversation.lastMessage || conversation.msgs?.[conversation.msgs.length - 1];
  return last ? {
    id: last.id || last.createdAt?.toMillis?.() || last.time,
    senderRole: last.senderRole || last.from,
    text: last.text,
  } : null;
};

function showNotification(title, body) {
  try {
    const notification = new Notification(title, { body, tag: `${title}:${body}` });
    notification.addEventListener('click', () => window.focus(), { once: true });
  } catch (error) {
    console.error('Gagal menampilkan notifikasi perangkat:', error);
  }
}

export default function useAppNotifications({ session, prefs, orders, conversations, transactions, products, mitras, withdrawals, isRealtime }) {
  const previous = useRef({
    identity: null,
    orders: new Map(),
    conversations: new Map(),
    transactions: new Set(),
    products: new Set(),
    mitras: new Map(),
    withdrawals: new Map(),
  });
  const identity = session ? `${session.uid || session.email || session.name}:${session.role}` : '';

  useEffect(() => {
    if (!identity || !session) {
      previous.current = {
        identity: null,
        orders: new Map(),
        conversations: new Map(),
        transactions: new Set(),
        products: new Set(),
        mitras: new Map(),
        withdrawals: new Map(),
      };
      return;
    }

    const orderMap = new Map(orders.map((order) => [orderId(order), orderSignature(order)]));
    const conversationMap = new Map(conversations.map((conversation) => {
      const message = conversationMessage(conversation);
      return [conversation.id, message ? `${message.id}:${message.senderRole}` : ''];
    }));
    const transactionIds = new Set(transactions.map((transaction) => String(transaction.id)));
    const productIds = new Set(products.map((product) => String(product.id)));
    const mitraStatuses = new Map(mitras.map((mitra) => [String(mitra.id), mitra.status]));
    const withdrawalStatuses = new Map(withdrawals.map((item) => [String(item.id), item.status]));
    const old = previous.current;

    if (old.identity !== identity) {
      previous.current = {
        identity, orders: orderMap, conversations: conversationMap, transactions: transactionIds,
        products: productIds, mitras: mitraStatuses, withdrawals: withdrawalStatuses,
      };
      return;
    }

    if (prefs?.push && 'Notification' in window && Notification.permission === 'granted') {
      for (const order of orders) {
        const id = orderId(order);
        const wasPresent = old.orders.has(id);
        if (!isOrderRecipient(order, session)) continue;

        if (session.role === 'justipper' && !wasPresent && prefs.t?.new) {
          showNotification('Titipan masuk', `${order.no || order.name || 'Pesanan baru'} dari ${order.buyer || 'Pemesan'}`);
        } else if (wasPresent && old.orders.get(id) !== orderSignature(order) && prefs.t?.order) {
          showNotification('Status titipan diperbarui', `${order.no || order.name || 'Pesanan'}: ${order.timeline?.at(-1)?.desc || order.stage || order.status}`);
        }
      }

      if (prefs.t?.chat && !isRealtime) {
        for (const conversation of conversations) {
          const message = conversationMessage(conversation);
          if (!message || !old.conversations.has(conversation.id)) continue;
          const signature = `${message.id}:${message.senderRole}`;
          if (old.conversations.get(conversation.id) !== signature && message.senderRole !== session.role) {
            showNotification('Pesan chat baru', message.text || 'Kamu menerima pesan baru.');
          }
        }
      }

      if (session.role === 'justipper' && prefs.t?.payment) {
        for (const transaction of transactions) {
          if (!old.transactions.has(String(transaction.id)) && transaction.type === 'in') {
            showNotification('Pembayaran diterima', transaction.title || 'Ada pembayaran baru.');
          }
        }
      }

      if (session.role === 'pemesan' && prefs.t?.promo) {
        for (const product of products) {
          if (!old.products.has(String(product.id)) && product.active !== false) {
            showNotification('Info rute baru', `${product.rute || product.store || product.name} membuka titipan baru.`);
          }
        }
      }

      if (session.role === 'admin' && prefs.t?.revenue) {
        for (const transaction of transactions) {
          if (!old.transactions.has(String(transaction.id)) && transaction.type === 'in') {
            showNotification('Laporan bagi hasil diperbarui', transaction.title || 'Transaksi baru tercatat.');
          }
        }
      }

      if (session.role === 'admin' && prefs.t?.verif) {
        for (const mitra of mitras) {
          if (mitra.status === 'pending' && old.mitras.get(String(mitra.id)) !== 'pending') {
            showNotification('Pengajuan verifikasi mitra', `${mitra.name} menunggu verifikasi.`);
          }
        }
      }

      if (session.role === 'admin' && prefs.t?.monitoring) {
        for (const withdrawal of withdrawals) {
          if (old.withdrawals.has(String(withdrawal.id)) && old.withdrawals.get(String(withdrawal.id)) !== withdrawal.status) {
            showNotification('Monitoring settlement', `${withdrawal.name}: ${withdrawal.status}.`);
          }
        }
      }
    }

    previous.current = {
      identity, orders: orderMap, conversations: conversationMap, transactions: transactionIds,
      products: productIds, mitras: mitraStatuses, withdrawals: withdrawalStatuses,
    };
  }, [identity, session, prefs, orders, conversations, transactions, products, mitras, withdrawals, isRealtime]);
}
