import { createContext, useContext, useEffect, useState } from 'react';
import { PRODUCTS as BASE_PRODUCTS } from '../data.js';

const JustipContext = createContext(null);

export const ORDER_STAGES = [
  { id: 'diterima', num: 1, label: '1. Terima Pesanan', badge: 'Diterima', icon: 'check', desc: 'Jastiper mengonfirmasi siap membelikan pesanan' },
  { id: 'belanja', num: 2, label: '2. Membelikan Produk', badge: 'Membelikan', icon: 'bag', desc: 'Jastiper sedang membelikan barang di toko asal' },
  { id: 'antar', num: 3, label: '3. Antar', badge: 'Antar', icon: 'scooter', desc: 'Barang sedang dibawa diantar menuju kampus' },
  { id: 'tiba', num: 4, label: '4. Sampai Tujuan COD', badge: 'Sampai COD', icon: 'pin', desc: 'Jastiper sudah tiba di tujuan COD, siap ketemuan' },
  { id: 'selesai', num: 5, label: '5. Selesai', badge: 'Selesai', icon: 'shield', desc: 'Barang sudah diterima pemesan & pesanan selesai' },
];

export const INITIAL_MEETING_POINTS = [
  { id: 'mp1', name: 'Gedung TI / Depan Lab Komputer', desc: 'Fakultas Teknik, Lantai 1', time: '15:30 - 17:00' },
  { id: 'mp2', name: 'Kantin Fakultas Teknik', desc: 'Meja tengah dekat kasir', time: '12:00 - 13:30' },
  { id: 'mp3', name: 'Perpustakaan Pusat Unsoed', desc: 'Lobi depan dekat gazebo', time: '16:00 - 17:30' },
  { id: 'mp4', name: 'Gerbang Utama Kampus', desc: 'Pos satpam gerbang depan', time: '17:00 - 18:00' },
];

export const INITIAL_QRIS = {
  provider: 'DANA Bisnis',
  merchantName: 'JustTip - Hafiz Anggara',
  nmid: 'ID102403040012',
  rekening: '0812-3456-7890 (DANA Bisnis)',
  photo: null,
};

export const DEVELOPER_QRIS = {
  provider: 'DANA Bisnis Dev',
  merchantName: 'JustTip Kas Developer (Bitforce TI-A)',
  nmid: 'ID102403040001',
  rekening: '0812-9876-5432 (DANA / SeaBank Dev)',
  photo: null,
};

export const DUMMY_USERS = {
  pemesan: {
    role: 'pemesan',
    name: 'Nur Arif',
    email: 'arif@kampus.ac.id',
    phone: '081234567890',
    extra: 'Kampus Purwokerto',
  },
  justipper: {
    role: 'justipper',
    name: 'Hafiz Anggara',
    email: 'hafiz@jastip.id',
    phone: '081322004411',
    extra: 'Purwokerto ⇄ Yogyakarta',
  },
  admin: {
    role: 'admin',
    name: 'Admin Bitforce (TI-A)',
    email: 'admin@bitforce.it',
    phone: '081234567890',
  },
};

const INITIAL_MITRA = [
  { id: 1, name: 'Hafiz Anggara', nim: '2403040012', kampus: 'Teknik Informatika (A)', rute: 'Purwokerto ⇄ Yogyakarta', rating: '4.9', completed: 18, status: 'verified', ktm: 'KTM Terverifikasi' },
  { id: 2, name: 'Faizna Ramadhani', nim: '2403040014', kampus: 'Teknik Informatika (A)', rute: 'Purwokerto ⇄ Bandung', rating: '4.8', completed: 12, status: 'verified', ktm: 'KTM Terverifikasi' },
  { id: 3, name: 'Agisfin Qolbi', nim: '2403040025', kampus: 'Teknik Informatika (A)', rute: 'Banyumas ⇄ Semarang', rating: '5.0', completed: 6, status: 'pending', ktm: 'Menunggu Verifikasi KTM' },
  { id: 4, name: 'Dimas Pratama', nim: '2403040089', kampus: 'Teknik Elektro', rute: 'Jakarta ⇄ Purwokerto', rating: '-', completed: 0, status: 'pending', ktm: 'Menunggu Verifikasi KTM' },
];

const INITIAL_WD = [
  { id: 'WD-801', name: 'Hafiz Anggara', bank: 'BCA', no: '1234567890', amount: 150000, status: 'pending', time: 'Hari ini, 08:30' },
  { id: 'WD-802', name: 'Faizna Ramadhani', bank: 'Mandiri', no: '9876543210', amount: 85000, status: 'done', time: 'Kemarin, 15:40' },
];

const INITIAL_TX0 = [
  { id: 101, type: 'in', title: 'Pembayaran QRIS Masuk (#JST882910)', jasa: 15000, ongkir: 0, amount: 355000, time: 'Hari ini, 10:15', status: 'ok' },
  { id: 103, type: 'out', title: 'Penarikan ke BCA 1234567890', amount: 50000, time: 'Hari ini, 08:30', status: 'proses' },
];

const INITIAL_ORDERS = [
  {
    id: 1,
    no: '#JST882910',
    date: 'Hari ini, 10:15',
    buyer: 'Nur Arif',
    phone: '+62 812 3456 7890',
    dest: 'Gedung TI / Depan Lab Komputer (Lantai 1)',
    meetingPoint: INITIAL_MEETING_POINTS[0],
    justipper: 'Hafiz Anggara',
    items: [{ p: BASE_PRODUCTS[0], qty: 1, size: 40 }],
    name: 'Sneakers Nike Air Force 1 07',
    art: 'shoe',
    price: 350000,
    qty: 1,
    subtotal: 350000,
    jastipFee: 25000,
    platformFee: 5000,
    pgFee: 2450,
    net: 2550,
    ship: 0,
    total: 355000,
    method: 'QRIS',
    status: 'selesai',
    stage: 'selesai',
    paid: true,
    feePaidToDev: true,
    feePaymentMethod: 'qris_dev',
    timeline: [
      { stage: 'baru', time: 'Hari ini, 09:10', desc: 'Pesanan masuk lewat pembayaran QRIS' },
      { stage: 'diterima', time: 'Hari ini, 09:15', desc: 'Dikonfirmasi oleh Hafiz Anggara' },
      { stage: 'belanja', time: 'Hari ini, 09:35', desc: 'Barang dibeli di Foot Locker Malioboro' },
      { stage: 'perjalanan', time: 'Hari ini, 10:00', desc: 'Perjalanan rute Jogja ke Kampus Purwokerto' },
      { stage: 'tiba', time: 'Hari ini, 10:10', desc: 'Sampai di Gedung TI Depan Lab Komputer' },
      { stage: 'selesai', time: 'Hari ini, 10:15', desc: 'Serah terima barang selesai & komisi 2,5% lunas disetor ke developer' },
    ],
    review: {
      rating: 5,
      comment: 'Barang ori dan tepat waktu sampai di kampus. Mantap jastipnya!',
      tags: ['Tepat Waktu', 'Barang Aman', 'Ramah'],
      date: 'Hari ini, 10:20',
    },
    from: 'Foot Locker Malioboro, Yogyakarta',
    to: 'Gedung TI Kampus Unsoed, Purwokerto',
    store: 'Hafiz Anggara (TI-A)',
    storeAddr: 'Foot Locker Malioboro No. 24, Yogyakarta',
  },
  {
    id: 2,
    no: '#JST882915',
    date: 'Baru saja',
    buyer: 'Nur Arif',
    phone: '+62 812 3456 7890',
    dest: 'Gedung TI / Depan Lab Komputer (Lantai 1)',
    meetingPoint: INITIAL_MEETING_POINTS[0],
    justipper: 'Hafiz Anggara',
    items: [{ p: BASE_PRODUCTS[2], qty: 2 }],
    name: 'Bakpia Kukus Tugu Jogja Original',
    art: 'food',
    price: 55000,
    qty: 2,
    subtotal: 110000,
    jastipFee: 15000,
    platformFee: 2750,
    pgFee: 0,
    net: 2750,
    ship: 0,
    total: 112750,
    method: 'Bayar Tunai saat Ketemuan (COD)',
    status: 'baru',
    stage: 'baru',
    paid: false,
    feePaidToDev: false,
    feePaymentMethod: 'cod',
    timeline: [
      { stage: 'baru', time: 'Baru saja', desc: 'Pesanan dibuat, siap dicek oleh Hafiz Anggara' },
    ],
    from: 'Store Resmi Stasiun Tugu Jogja',
    to: 'Gedung TI Kampus Unsoed, Purwokerto',
    store: 'Hafiz Anggara (TI-A)',
    storeAddr: 'Store Resmi Stasiun Tugu Jogja',
  },
  {
    id: 3,
    no: '#JST882902',
    date: 'Kemarin, 16:45',
    buyer: 'Faizna Ramadhani',
    phone: '+62 813 9876 5432',
    dest: 'Gazebo Utama Fakultas Teknik',
    meetingPoint: INITIAL_MEETING_POINTS[1],
    justipper: 'Hafiz Anggara',
    items: [{ p: BASE_PRODUCTS[1], qty: 1 }],
    name: 'Tumbler Stainless LocknLock 500ml',
    art: 'tumbler',
    price: 180000,
    qty: 1,
    subtotal: 180000,
    jastipFee: 20000,
    platformFee: 4500,
    pgFee: 32,
    net: 4468,
    ship: 0,
    total: 184500,
    method: 'QRIS',
    status: 'selesai',
    stage: 'selesai',
    paid: true,
    feePaidToDev: false,
    feePaymentMethod: 'unpaid',
    timeline: [
      { stage: 'baru', time: 'Kemarin, 14:00', desc: 'Pesanan masuk via QRIS Toko Hafiz' },
      { stage: 'diterima', time: 'Kemarin, 14:10', desc: 'Diterima oleh Hafiz' },
      { stage: 'belanja', time: 'Kemarin, 15:00', desc: 'Barang dibeli' },
      { stage: 'antar', time: 'Kemarin, 16:00', desc: 'Diantar ke Gazebo FT' },
      { stage: 'tiba', time: 'Kemarin, 16:30', desc: 'Sampai di lokasi COD' },
      { stage: 'selesai', time: 'Kemarin, 16:45', desc: 'Serah terima selesai. Komisi dev 2,5% (Rp 4.500) masih tertahan (belum disetor mitra).' },
    ],
    from: 'Mall Malioboro, Yogyakarta',
    to: 'Gazebo FT Kampus Unsoed, Purwokerto',
    store: 'Hafiz Anggara (TI-A)',
    storeAddr: 'Mall Malioboro, Yogyakarta',
  },
];

const loadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
};

export function JustipProvider({ children }) {
  // 1. Unified Products Catalog
  const [products, setProducts] = useState(() =>
    loadStorage(
      'justip_products',
      BASE_PRODUCTS.map((p) => ({
        ...p,
        active: true,
        stock: p.stock ?? 10,
        justipper: p.justipper || 'Hafiz Anggara',
        store: p.store || 'Hafiz Anggara (TI-A)',
        rute: p.rute || 'Purwokerto ⇄ Yogyakarta',
      }))
    )
  );

  // 2. Unified Orders
  const [orders, setOrders] = useState(() => loadStorage('justip_orders', INITIAL_ORDERS));

  // 3. Titik Temu Kampus (Dikelola oleh Jastiper)
  const [meetingPoints, setMeetingPoints] = useState(() =>
    loadStorage('justip_meeting_points', INITIAL_MEETING_POINTS)
  );

  // 4. QRIS Jastiper
  const [qrisConfig, setQrisConfig] = useState(() =>
    loadStorage('justip_qris', INITIAL_QRIS)
  );

  // 5. Saldo Dompet Jastiper
  const [balance, setBalance] = useState(() => loadStorage('justip_balance', 185000));
  const [txs, setTxs] = useState(() => loadStorage('justip_txs', INITIAL_TX0));
  const [banks, setBanks] = useState(() =>
    loadStorage('justip_banks', [
      { id: 1, bank: 'BCA', no: '1234567890', name: 'Hafiz Anggara', main: true },
      { id: 2, bank: 'Mandiri', no: '9876543210', name: 'Hafiz Anggara', main: false },
    ])
  );

  // 6. Withdrawals & Mitras
  const [withdrawals, setWithdrawals] = useState(() => loadStorage('justip_withdrawals', INITIAL_WD));
  const [mitras, setMitras] = useState(() => loadStorage('justip_mitras', INITIAL_MITRA));

  // Simpan Otomatis ke LocalStorage
  useEffect(() => { saveStorage('justip_products', products); }, [products]);
  useEffect(() => { saveStorage('justip_orders', orders); }, [orders]);
  useEffect(() => { saveStorage('justip_meeting_points', meetingPoints); }, [meetingPoints]);
  useEffect(() => { saveStorage('justip_qris', qrisConfig); }, [qrisConfig]);
  useEffect(() => { saveStorage('justip_balance', balance); }, [balance]);
  useEffect(() => { saveStorage('justip_txs', txs); }, [txs]);
  useEffect(() => { saveStorage('justip_banks', banks); }, [banks]);
  useEffect(() => { saveStorage('justip_withdrawals', withdrawals); }, [withdrawals]);
  useEffect(() => { saveStorage('justip_mitras', mitras); }, [mitras]);

  // Handlers Titik Temu Jastiper
  const addMeetingPoint = (mp) => {
    const item = { id: `mp_${Date.now()}`, ...mp };
    setMeetingPoints((list) => [...list, item]);
    return item;
  };

  const deleteMeetingPoint = (id) => {
    setMeetingPoints((list) => list.filter((m) => m.id !== id));
  };

  // Handler QRIS Jastiper
  const updateQris = (cfg) => {
    setQrisConfig((old) => ({ ...old, ...cfg }));
  };

  // Handlers Produk
  const addProduct = (p) => {
    const item = {
      id: Date.now(),
      art: p.art || 'box',
      rating: 4.9,
      reviews: 1,
      old: p.price * 1.2,
      disc: 15,
      ...p,
      justipper: p.justipper || 'Hafiz Anggara',
      store: p.store || 'Hafiz Anggara (TI-A)',
      rute: p.rute || 'Purwokerto ⇄ Yogyakarta',
      active: true,
    };
    setProducts((list) => [item, ...list]);
    return item;
  };

  const updateProduct = (p) => {
    setProducts((list) => list.map((item) => (item.id === p.id ? { ...item, ...p } : item)));
  };

  const toggleProduct = (id) => {
    setProducts((list) =>
      list.map((item) => (item.id === id ? { ...item, active: !item.active, draft: false } : item))
    );
  };

  const deleteProduct = (id) => {
    setProducts((list) => list.filter((item) => item.id !== id));
  };

  // Handler Buat Pesanan (100% COD Titik Temu Kampus & QRIS)
  const createOrder = ({
    cart,
    buyerName,
    buyerPhone,
    meetingPoint,
    payMethod, // 'QRIS' atau 'Bayar Tunai saat Ketemuan (COD)'
    subtotal,
    fee,
    total,
    notes = '',
    isPaid = false,
  }) => {
    const validatedCart = cart.map((item) => {
      const product = products.find((p) => p.id === item.p.id);
      if (!product || product.active === false) {
        throw new Error(`${item.p.name} sudah tidak tersedia.`);
      }
      const stock = Number(product.stock ?? 99);
      if (!Number.isFinite(stock) || stock <= 0 || item.qty > stock) {
        throw new Error(`Stok ${product.name} tersisa ${Math.max(0, stock)} slot, jumlah pesanan melebihi stok.`);
      }
      return { ...item, p: product };
    });
    const firstItem = validatedCart[0]?.p || BASE_PRODUCTS[0];
    const firstQty = validatedCart[0]?.qty || 1;
    const justipper = firstItem.justipper || 'Hafiz Anggara';
    const store = firstItem.store || `${justipper} (TI-A)`;

    const platformFee = Math.min(5000, Math.round(subtotal * 0.025));
    const isQris = payMethod.toLowerCase().includes('qris');
    const pgFee = isQris ? Math.round(subtotal * 0.007) : 0;
    const net = platformFee - pgFee;
    const destText = meetingPoint ? `${meetingPoint.name} (${meetingPoint.desc})` : 'Gedung TI Kampus Unsoed, Purwokerto';

    const newOrder = {
      id: Date.now(),
      no: `#JST${Date.now().toString().slice(-6)}`,
      date: 'Baru saja',
      buyer: buyerName || 'Nur Arif',
      phone: buyerPhone || '+62 812 3456 7890',
      dest: destText,
      meetingPoint: meetingPoint || meetingPoints[0],
      justipper,
      items: validatedCart,
      name: firstItem.name,
      art: firstItem.art || 'box',
      price: firstItem.price,
      qty: firstQty,
      subtotal,
      jastipFee: Math.round(subtotal * 0.1),
      platformFee,
      pgFee,
      net,
      ship: 0,
      total,
      method: payMethod,
      status: 'baru',
      stage: 'baru',
      paid: isPaid || isQris,
      timeline: [
        {
          stage: 'baru',
          time: 'Baru saja',
          desc: isQris
            ? 'Pembayaran QRIS lunas diverifikasi, pesanan masuk ke antrean jastiper'
            : 'Pesanan COD berhasil dibuat, pembayaran tunai saat serah terima di kampus',
        },
      ],
      from: firstItem.tokoAsal || 'Yogyakarta',
      to: 'Gedung TI Kampus Unsoed, Purwokerto',
      store,
      storeAddr: firstItem.tokoAsal || 'Foot Locker Malioboro, Yogyakarta',
      notes,
      stockReserved: true,
    };

    // Skenario 1 (QRIS Toko Pribadi): Pembayaran QRIS 100% langsung masuk ke e-wallet/rekening jastiper
    if (isPaid || isQris) {
      setTxs((h) => [
        {
          id: Date.now(),
          type: 'in',
          title: `Pembayaran QRIS Toko Masuk (${newOrder.no})`,
          jasa: newOrder.jastipFee || 15000,
          ongkir: 0,
          amount: total,
          time: 'Baru saja',
          status: 'ok',
          note: `Pembayaran QRIS 100% lunas dari ${buyerName || 'Pembeli'}. Diterima di akun QRIS Mitra. Komisi dev 2,5% (${platformFee.toLocaleString('id-ID')}) disetor saat pesanan selesai.`,
        },
        ...h,
      ]);
    }

    setProducts((list) =>
      list.map((product) => {
        const reserved = validatedCart.find((item) => item.p.id === product.id);
        return reserved
          ? { ...product, stock: Math.max(0, Number(product.stock ?? 99) - reserved.qty) }
          : product;
      })
    );
    setOrders((list) => [newOrder, ...list]);
    return newOrder;
  };

  // Handler Request Titipan Bebas
  const createCustomRequest = ({
    name,
    store = '',
    kota = 'Luar Kota',
    price = 50000,
    fee = 15000,
    insurance = false,
    meetingPoint = null,
    notes = '',
    payMethod = 'Bayar Tunai saat Ketemuan (COD)',
    buyer = 'Nur Arif',
    phone = '+62 812 3456 7890',
  }) => {
    const subtotal = Number(price) || 50000;
    const jastipFee = Number(fee) || 15000;
    const platformFee = Math.min(5000, Math.round(subtotal * 0.025));
    const insuranceFee = insurance ? 2000 : 0;
    const total = subtotal + jastipFee + platformFee + insuranceFee;
    const destText = meetingPoint ? `${meetingPoint.name} (${meetingPoint.desc})` : 'Gedung TI Kampus Unsoed, Purwokerto';

    const newReq = {
      id: Date.now(),
      no: `#REQ${Date.now().toString().slice(-6)}`,
      date: 'Baru saja',
      buyer,
      phone,
      dest: destText,
      meetingPoint: meetingPoint || meetingPoints[0],
      justipper: 'Hafiz Anggara',
      isCustomRequest: true,
      items: [],
      name,
      art: 'box',
      price: subtotal,
      qty: 1,
      subtotal,
      jastipFee,
      platformFee,
      insurance,
      insuranceFee,
      pgFee: 0,
      net: platformFee,
      ship: 0,
      total,
      method: payMethod,
      status: 'baru',
      stage: 'baru',
      paid: false,
      from: kota ? `${store || 'Toko'} (${kota})` : (store || 'Luar Kota'),
      to: 'Gedung TI Kampus Unsoed, Purwokerto',
      store: `${store || 'Toko'} (${kota || 'Luar Kota'})`,
      storeAddr: `${store || 'Toko'}, ${kota || 'Kota Asal'}`,
      notes,
      timeline: [
        { stage: 'baru', time: 'Baru saja', desc: 'Request titip bebas diajukan oleh pemesan' },
      ],
    };

    setOrders((list) => [newReq, ...list]);
    return newReq;
  };

  // Update Tahapan Pesanan oleh Jastiper
  const updateOrderStage = (orderId, nextStage, stageNote, feeMethod = 'auto') => {
    if (nextStage === 'selesai') {
      finishOrder(orderId, feeMethod);
      return;
    }
    const STAGE_DESC = {
      baru: 'Pesanan baru masuk, siap dicek oleh jastiper',
      diterima: 'Pesanan diterima & dikonfirmasi oleh jastiper',
      belanja: 'Jastiper sedang membelikan produk di toko asal',
      antar: 'Barang sedang dibawa diantar menuju titik temu kampus',
      perjalanan: 'Barang sedang dibawa diantar menuju titik temu kampus',
      tiba: 'Jastiper sudah sampai di tujuan COD, siap serah terima',
      selesai: 'Barang sudah diserahkan ke pemesan, transaksi sukses',
    };
    const note = stageNote || STAGE_DESC[nextStage] || 'Tahap pesanan diperbarui';

    setOrders((list) =>
      list.map((o) => {
        if (o.id !== orderId) return o;
        const timeline = o.timeline || [];
        return {
          ...o,
          stage: nextStage,
          status: nextStage === 'baru' ? 'baru' : 'proses',
          timeline: [...timeline, { stage: nextStage, time: 'Baru saja', desc: note }],
        };
      })
    );
  };

  const acceptOrder = (orderId) => {
    updateOrderStage(orderId, 'diterima', 'Pesanan diterima & dijadwalkan oleh jastiper');
  };

  const finishOrder = (orderId, feeMethod = 'auto') => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const isCod = (target.method || '').toLowerCase().includes('cod') || (target.method || '').toLowerCase().includes('tunai');
    const subtotal = target.subtotal || (target.price * (target.qty || 1)) || 0;
    const platformFee = target.platformFee != null ? target.platformFee : Math.min(5000, Math.round(subtotal * 0.025));

    let pgFee = target.pgFee != null ? target.pgFee : 0;
    let paymentNote = '';
    let finalFeeMethod = feeMethod;

    // Skenario 1 (QRIS Toko Pribadi & COD):
    // Mitra menerima 100% uang langsung dari pembeli (via QRIS Toko atau Cash COD).
    // Komisi developer 2,5% disetorkan lewat scan QRIS Developer saat pesanan diselesaikan.
    pgFee = Math.round(platformFee * 0.007); // Potongan MDR 0,7% sistem perbankan QRIS
    finalFeeMethod = 'qris_dev';
    paymentNote = `Setor komisi developer 2,5% (${platformFee.toLocaleString('id-ID')}) via scan QRIS Developer. Potongan PG 0,7% (Rp ${pgFee}).`;
    setTxs((h) => [
      {
        id: Date.now(),
        type: 'out',
        title: `Setor Fee Platform (${target.no})`,
        amount: platformFee,
        time: 'Baru saja',
        status: 'ok',
        note: paymentNote,
      },
      ...h,
    ]);

    setOrders((list) =>
      list.map((o) => {
        if (o.id !== orderId) return o;
        const timeline = o.timeline || [];
        return {
          ...o,
          status: 'selesai',
          stage: 'selesai',
          paid: true,
          pgFee,
          feePaidToDev: true,
          feePaymentMethod: finalFeeMethod,
          timeline: [...timeline, { stage: 'selesai', time: 'Baru saja', desc: 'Serah terima di titik temu kampus selesai. Komisi 2,5% disetorkan ke developer.' }],
        };
      })
    );
  };

  const verifyDevFee = (orderId) => {
    setOrders((list) =>
      list.map((o) =>
        o.id === orderId
          ? {
              ...o,
              feePaidToDev: true,
              feePaymentMethod: 'qris_dev',
            }
          : o
      )
    );
  };

  const addOrderReview = (orderId, reviewData) => {
    setOrders((list) =>
      list.map((o) => (o.id === orderId ? { ...o, review: { ...reviewData, date: 'Baru saja' } } : o))
    );
    setMitras((list) =>
      list.map((m) => {
        const targetOrder = orders.find((o) => o.id === orderId);
        if (targetOrder && (m.name === targetOrder.justipper || m.name.includes(targetOrder.justipper))) {
          const curRating = parseFloat(m.rating) || 4.8;
          const newRating = ((curRating * (m.completed || 10) + reviewData.rating) / ((m.completed || 10) + 1)).toFixed(1);
          return { ...m, rating: newRating, completed: (m.completed || 0) + 1 };
        }
        return m;
      })
    );
  };

  const cancelOrder = (no, reason, by = 'Kamu') => {
    const target = orders.find((o) => o.no === no);
    if (target?.stockReserved && !['batal', 'selesai'].includes(target.status)) {
      setProducts((list) =>
        list.map((product) => {
          const reserved = target.items?.find((item) => item.p.id === product.id);
          return reserved
            ? { ...product, stock: Number(product.stock ?? 0) + reserved.qty }
            : product;
        })
      );
    }
    setOrders((list) =>
      list.map((o) =>
        o.no === no
          ? {
              ...o,
              status: 'batal',
              cancel: {
                by,
                reason,
                at: 'Hari ini',
                refund: o.method === 'QRIS' ? 'proses' : 'none',
              },
            }
          : o
      )
    );
  };

  const requestWithdrawal = (amount, b) => {
    const id = Date.now();
    const wdId = `WD-${String(id).slice(-3)}`;
    setBalance((x) => x - amount);

    setTxs((h) => [
      {
        id,
        type: 'out',
        status: 'proses',
        title: `Penarikan ke ${b.bank} ${b.no ? `(..${b.no.slice(-4)})` : ''}`,
        amount,
        time: 'Baru saja',
      },
      ...h,
    ]);

    setWithdrawals((w) => [
      {
        id: wdId,
        txId: id,
        name: b.name || 'Hafiz Anggara',
        bank: b.bank,
        no: b.no,
        amount,
        status: 'pending',
        time: 'Baru saja',
      },
      ...w,
    ]);
  };

  const approveWithdrawal = (wdId) => {
    const wd = withdrawals.find((w) => w.id === wdId);
    if (wd) {
      setWithdrawals((list) =>
        list.map((w) => (w.id === wdId ? { ...w, status: 'done' } : w))
      );
      setTxs((list) =>
        list.map((t) => (t.id === wd.txId ? { ...t, status: 'ok' } : t))
      );
    }
  };

  const approveMitra = (mitraId) => {
    setMitras((list) =>
      list.map((m) =>
        m.id === mitraId ? { ...m, status: 'verified', ktm: 'KTM Terverifikasi' } : m
      )
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem('justip_products');
    localStorage.removeItem('justip_orders');
    localStorage.removeItem('justip_meeting_points');
    localStorage.removeItem('justip_qris');
    localStorage.removeItem('justip_balance');
    localStorage.removeItem('justip_txs');
    localStorage.removeItem('justip_banks');
    localStorage.removeItem('justip_withdrawals');
    localStorage.removeItem('justip_mitras');

    setProducts(
      BASE_PRODUCTS.map((p) => ({
        ...p,
        active: true,
        stock: p.stock ?? 10,
        justipper: p.justipper || 'Hafiz Anggara',
        store: p.store || 'Hafiz Anggara (TI-A)',
        rute: p.rute || 'Purwokerto ⇄ Yogyakarta',
      }))
    );
    setOrders(INITIAL_ORDERS);
    setMeetingPoints(INITIAL_MEETING_POINTS);
    setQrisConfig(INITIAL_QRIS);
    setBalance(185000);
    setTxs(INITIAL_TX0);
    setBanks([
      { id: 1, bank: 'BCA', no: '1234567890', name: 'Hafiz Anggara', main: true },
      { id: 2, bank: 'Mandiri', no: '9876543210', name: 'Hafiz Anggara', main: false },
    ]);
    setWithdrawals(INITIAL_WD);
    setMitras(INITIAL_MITRA);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    toggleProduct,
    deleteProduct,
    orders,
    createOrder,
    createCustomRequest,
    acceptOrder,
    finishOrder,
    updateOrderStage,
    addOrderReview,
    cancelOrder,
    meetingPoints,
    addMeetingPoint,
    deleteMeetingPoint,
    qrisConfig,
    updateQris,
    balance,
    txs,
    banks,
    setBanks,
    requestWithdrawal,
    withdrawals,
    approveWithdrawal,
    mitras,
    approveMitra,
    verifyDevFee,
    resetDemoData,
    developerQris: DEVELOPER_QRIS,
    DUMMY_USERS,
  };

  return <JustipContext.Provider value={value}>{children}</JustipContext.Provider>;
}

export function useJustip() {
  const ctx = useContext(JustipContext);
  if (!ctx) throw new Error('useJustip must be used within JustipProvider');
  return ctx;
}
