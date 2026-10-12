export const ROLES = [
  { id: 'pemesan', name: 'Pemesan', icon: 'user', pick: 'Ingin menitip barang dan belanja lewat jastiper terpercaya.', reg: 'Saya ingin menitip barang belanjaan.' },
  { id: 'justipper', name: 'Justipper', icon: 'scooter', pick: 'Buka jasa titip, tawarkan barang, dan antarkan ke konsumen.', reg: 'Saya ingin membuka jasa titip dan membelikan barang.' },
];
export const roleName = (id) => (id === 'admin' ? 'Admin & Dev' : ROLES.find((r) => r.id === id)?.name ?? '');
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
export const isPhone = (v) => /^(\+62|62|0)8\d{7,11}$/.test(v.replace(/[\s-]/g, ''));
