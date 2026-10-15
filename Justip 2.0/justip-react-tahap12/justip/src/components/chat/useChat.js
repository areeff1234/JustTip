import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, firebaseConfigured } from '../../firebase.js';
import { SEED, hm, visible } from './chatData.js';

const displayNameKey = (name = '') => name
  .replace(/\s*\([^)]*\)/g, '')
  .trim()
  .toLocaleLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, ' ');

const messageTime = (timestamp) => timestamp?.toDate?.().toTimeString().slice(0, 5) || hm();

function adaptConversation(snapshot, uid) {
  const data = snapshot.data();
  const profiles = Object.values(data.participantProfiles || {});
  const buyer = profiles.find((profile) => profile.role === 'pemesan');
  const justipper = profiles.find((profile) => profile.role === 'justipper');
  const unread = {};
  profiles.forEach((profile) => {
    unread[profile.role] = data.unread?.[profile.uid] || 0;
  });
  const last = data.lastMessage;

  return {
    id: snapshot.id,
    pemesan: buyer ? { ...buyer, me: buyer.uid === uid } : { name: 'Pemesan', me: false },
    other: justipper || { role: 'justipper', name: 'Justipper' },
    ctx: data.ctx || null,
    unread,
    updatedAt: data.updatedAt,
    msgs: last ? [{
      id: last.id || 'last',
      from: last.senderRole,
      text: last.text || '',
      img: last.imageUrl || '',
      time: messageTime(last.createdAt),
    }] : [],
    lastMessage: last || null,
  };
}

export function useChat(session) {
  const [convs, setConvs] = useState(SEED);
  const [error, setError] = useState('');
  const isRealtime = Boolean(firebaseConfigured && db && session?.uid);

  useEffect(() => {
    if (!isRealtime) {
      setConvs(SEED);
      return undefined;
    }

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', session.uid),
    );
    return onSnapshot(q, (snapshot) => {
      setConvs(snapshot.docs
        .map((conversation) => adaptConversation(conversation, session.uid))
        .sort((left, right) => (
          (right.updatedAt?.toMillis?.() || 0) - (left.updatedAt?.toMillis?.() || 0)
        )));
      setError('');
    }, (snapshotError) => {
      setError(`Tidak dapat memuat chat: ${snapshotError.message}`);
    });
  }, [isRealtime, session?.uid]);

  const subscribeMessages = useCallback((id) => {
    if (!isRealtime) return () => {};
    const q = query(
      collection(db, 'conversations', id, 'messages'),
      orderBy('createdAt', 'asc'),
    );
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((message) => {
        const data = message.data();
        return {
          id: message.id,
          from: data.senderRole,
          text: data.text || '',
          img: data.imageUrl || '',
          time: messageTime(data.createdAt),
        };
      });
      setConvs((current) => current.map((conversation) => (
        conversation.id === id ? { ...conversation, msgs } : conversation
      )));
    }, (snapshotError) => {
      setError(`Tidak dapat memuat pesan: ${snapshotError.message}`);
    });
  }, [isRealtime]);

  const send = async (id, role, message) => {
    if (!isRealtime) {
      const conversation = convs.find((item) => item.id === id);
      if (!conversation) return;
      const peer = role === 'pemesan' ? conversation.other.role : 'pemesan';
      const localMessage = {
        id: Date.now(),
        from: role,
        time: hm(),
        ...message,
      };
      setConvs((current) => current.map((item) => (
        item.id === id
          ? { ...item, msgs: [...item.msgs, localMessage], unread: { ...item.unread, [peer]: (item.unread[peer] || 0) + 1 } }
          : item
      )));
      setTimeout(() => {
        setConvs((current) => current.map((item) => {
          if (item.id !== id) return item;
          const reply = {
            id: Date.now() + 1,
            from: peer,
            text: message.text,
            time: hm(),
          };
          return { ...item, msgs: [...item.msgs, reply], unread: { ...item.unread, [role]: (item.unread[role] || 0) + 1 } };
        }));
      }, 1800);
      return;
    }

    try {
      const conversation = convs.find((item) => item.id === id);
      if (!conversation) throw new Error('Percakapan tidak ditemukan.');
      const peer = [conversation.pemesan, conversation.other].find((item) => item.uid !== session.uid);
      if (!peer?.uid) throw new Error('Akun lawan bicara tidak valid.');

      const conversationRef = doc(db, 'conversations', id);
      const messageRef = doc(collection(conversationRef, 'messages'));
      const batch = writeBatch(db);
      batch.set(messageRef, {
        senderId: session.uid,
        senderRole: role,
        text: message.text || '',
        imageUrl: '',
        createdAt: serverTimestamp(),
      });
      batch.update(conversationRef, {
        lastMessage: {
          id: messageRef.id,
          senderId: session.uid,
          senderRole: role,
          text: message.text || '',
          imageUrl: '',
          createdAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
        [`unread.${peer.uid}`]: increment(1),
      });
      await batch.commit();
      setError('');
    } catch (sendError) {
      setError(`Pesan tidak terkirim: ${sendError.message}`);
    }
  };

  const read = async (id, role) => {
    if (!isRealtime) {
      setConvs((current) => current.map((conversation) => (
        conversation.id === id && conversation.unread[role]
          ? { ...conversation, unread: { ...conversation.unread, [role]: 0 } }
          : conversation
      )));
      return;
    }

    try {
      await updateDoc(doc(db, 'conversations', id), { [`unread.${session.uid}`]: 0 });
      setError('');
    } catch (readError) {
      setError(`Status pesan belum terbaca: ${readError.message}`);
    }
  };

  const start = async ({ store, peerName, product, order }) => {
    if (!isRealtime) {
      const name = peerName || store || 'Justipper Terpercaya';
      const isBuyer = session?.role !== 'justipper';
      const existing = convs.find((conversation) => (
        isBuyer
          ? conversation.pemesan.me && conversation.other.role === 'justipper' && conversation.other.name === name
          : conversation.pemesan.name === name && conversation.other.role === 'justipper'
      ));
      if (existing) {
        setConvs((current) => current.map((conversation) => (
          conversation.id === existing.id
            ? { ...conversation, ctx: product
              ? { type: 'product', name: product.name, price: product.price, art: product.art }
              : { type: 'order', no: order?.no, name: order?.name } }
            : conversation
        )));
        return existing.id;
      }
      const id = `c${Date.now()}`;
      setConvs((current) => [{
        id,
        pemesan: { name: isBuyer ? session?.name || 'Nur Arif' : name, me: isBuyer },
        other: { role: 'justipper', name: isBuyer ? name : session?.name || 'Hafiz Anggara' },
        ctx: product
          ? { type: 'product', name: product.name, price: product.price, art: product.art }
          : { type: 'order', no: order?.no, name: order?.name },
        unread: {},
        msgs: [],
      }, ...current]);
      return id;
    }

    const targetRole = session.role === 'pemesan' ? 'justipper' : 'pemesan';
    const requestedName = displayNameKey(peerName || store);
    if (!requestedName) throw new Error('Nama lawan bicara belum tersedia untuk chat ini.');

    const matches = await getDocs(query(
      collection(db, 'publicProfiles'),
      where('roles', 'array-contains', targetRole),
    ));
    const target = matches.docs
      .map((profile) => ({ uid: profile.id, ...profile.data(), role: targetRole }))
      .find((profile) => displayNameKey(profile.displayName) === requestedName);
    if (!target) {
      throw new Error(`Akun ${targetRole === 'justipper' ? 'Justipper' : 'Pemesan'} "${peerName || store}" belum terhubung ke Justip. Minta lawan bicara login dengan Google terlebih dahulu.`);
    }
    if (target.uid === session.uid) throw new Error('Anda tidak dapat memulai chat dengan akun sendiri.');

    const conversations = await getDocs(query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', session.uid),
    ));
    const existing = conversations.docs.find((conversation) => (
      conversation.data().participants.includes(target.uid)
    ));
    const ctx = product
      ? { type: 'product', name: product.name, price: product.price, art: product.art }
      : { type: 'order', no: order?.no, name: order?.name };
    if (existing) {
      await updateDoc(existing.ref, { ctx, updatedAt: serverTimestamp() });
      return existing.id;
    }

    const currentProfile = {
      uid: session.uid,
      role: session.role,
      displayName: session.name,
      photoURL: session.photoURL || '',
    };
    const targetProfile = {
      uid: target.uid,
      role: target.role,
      displayName: target.displayName,
      photoURL: target.photoURL || '',
    };
    const conversationRef = doc(collection(db, 'conversations'));
    await writeBatch(db)
      .set(conversationRef, {
        participants: [session.uid, target.uid],
        participantProfiles: {
          [session.uid]: currentProfile,
          [target.uid]: targetProfile,
        },
        unread: { [session.uid]: 0, [target.uid]: 0 },
        ctx,
        lastMessage: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      .commit();
    return conversationRef.id;
  };

  const unread = (role) => visible(convs, role)
    .reduce((sum, conversation) => sum + (conversation.unread[role] || 0), 0);

  return {
    convs,
    error,
    isRealtime,
    send,
    read,
    start,
    subscribeMessages,
    unread,
    list: (role) => visible(convs, role),
  };
}
