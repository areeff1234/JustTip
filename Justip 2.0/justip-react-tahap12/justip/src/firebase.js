import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(config).every((value) => (
  typeof value === 'string' && value.trim() !== '' && !value.trim().startsWith('your-')
));
const app = firebaseConfigured ? (getApps().length ? getApp() : initializeApp(config)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export function observeAuth(callback, onError) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback, onError);
}

const isJustipRole = (role) => ['pemesan', 'justipper'].includes(role);
const activeRoleKey = (uid) => `justip-active-role:${uid}`;
const getProfileRoles = (profile) => (
  Array.isArray(profile.roles) ? profile.roles : (isJustipRole(profile.role) ? [profile.role] : [])
);

export function setActiveRole(uid, role) {
  if (uid && isJustipRole(role)) sessionStorage.setItem(activeRoleKey(uid), role);
}

async function saveRoleForUser(user, privateSnap, publicSnap, role) {
  const privateRef = doc(db, 'users', user.uid);
  const publicRef = doc(db, 'publicProfiles', user.uid);
  const existingRoles = publicSnap.exists() ? getProfileRoles(publicSnap.data()) : [];
  const roles = [...new Set([...existingRoles, role])];
  const name = user.displayName || user.email?.split('@')[0] || 'Pengguna Justip';
  const timestamp = serverTimestamp();
  const batch = writeBatch(db);
  let hasWrites = false;

  if (!privateSnap.exists()) {
    batch.set(privateRef, {
      uid: user.uid,
      email: user.email || '',
      displayName: name,
      phone: '',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    hasWrites = true;
  }

  if (!publicSnap.exists()) {
    batch.set(publicRef, {
      uid: user.uid,
      displayName: name,
      photoURL: user.photoURL || '',
      role,
      roles: [role],
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    hasWrites = true;
  } else if (!existingRoles.includes(role)) {
    // Gunakan array lengkap (bukan arrayUnion) agar Firestore Rules lolos:
    // rules mewajibkan roles baru tetap mengandung semua role lama.
    // arrayUnion pada field yang belum ada akan menghasilkan ['justipper'] saja
    // (tanpa 'pemesan'), yang akan ditolak oleh rules.
    batch.update(publicRef, {
      roles,
      updatedAt: timestamp,
    });
    hasWrites = true;
  }

  if (hasWrites) {
    try {
      await batch.commit();
    } catch (error) {
      const code = error.code ? ` (${error.code})` : '';
      throw new Error(`Firestore gagal menyimpan peran "${role}"${code}: ${error.message}`);
    }
  }
  setActiveRole(user.uid, role);
  return roles;
}

function profileFromSnapshots(user, privateSnap, publicSnap, role, roles) {
  const privateData = privateSnap.data();
  const publicData = publicSnap.data();
  return {
    uid: user.uid,
    role,
    roles,
    name: publicData.displayName || user.displayName || '',
    email: privateData.email || user.email || '',
    phone: privateData.phone || '',
    photoURL: publicData.photoURL || user.photoURL || '',
  };
}

export async function signInWithGoogle(role) {
  if (!auth || !db) {
    throw new Error('Login Google belum aktif. Lengkapi konfigurasi Firebase di file .env.local.');
  }
  if (!isJustipRole(role)) {
    throw new Error('Login Google hanya tersedia untuk Pemesan dan Justipper.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;
  const privateRef = doc(db, 'users', user.uid);
  const publicRef = doc(db, 'publicProfiles', user.uid);
  const [privateSnap, publicSnap] = await Promise.all([getDoc(privateRef), getDoc(publicRef)]);
  if (publicSnap.exists() && !isJustipRole(publicSnap.data().role)) {
    await signOut(auth);
    throw new Error('Profil akun tidak memiliki peran Justip yang valid.');
  }

  let savedRoles;
  try {
    savedRoles = await saveRoleForUser(user, privateSnap, publicSnap, role);
  } catch (error) {
    await signOut(auth);
    throw new Error(`Profil Google tidak dapat disimpan. Pastikan Firestore aktif dan rules sudah dipasang. ${error.message}`);
  }
  const profile = {
    uid: user.uid,
    role,
    roles: savedRoles,
    name: user.displayName || user.email?.split('@')[0] || 'Pengguna Justip',
    email: user.email || '',
    phone: privateSnap.exists() ? privateSnap.data().phone || '' : '',
    photoURL: user.photoURL || '',
  };
  return profile;
}

export async function signInWithEmail(role, email, password) {
  if (!auth || !db) throw new Error('Firebase belum dikonfigurasi.');
  if (!isJustipRole(role)) throw new Error('Login hanya tersedia untuk Pemesan dan Justipper.');
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  if (!credential.user.emailVerified) {
    throw new Error('auth/email-not-verified');
  }
  const [privateSnap, publicSnap] = await Promise.all([
    getDoc(doc(db, 'users', credential.user.uid)),
    getDoc(doc(db, 'publicProfiles', credential.user.uid)),
  ]);
  if (!privateSnap.exists() || !publicSnap.exists()) {
    await signOut(auth);
    throw new Error('Profil akun tidak ditemukan. Hubungi dukungan Justip.');
  }
  if (!isJustipRole(publicSnap.data().role)) {
    await signOut(auth);
    throw new Error('Profil akun tidak memiliki peran Justip yang valid.');
  }
  let roles;
  try {
    roles = await saveRoleForUser(credential.user, privateSnap, publicSnap, role);
  } catch (error) {
    await signOut(auth);
    throw new Error(`Peran akun tidak dapat diperbarui. Pastikan Firestore rules sudah dipasang. ${error.message}`);
  }
  return profileFromSnapshots(credential.user, privateSnap, publicSnap, role, roles);
}

export async function registerWithEmail({ role, name, email, phone, extra, password }) {
  if (!auth || !db) throw new Error('Firebase belum dikonfigurasi.');
  if (!isJustipRole(role)) {
    throw new Error('Pendaftaran hanya tersedia untuk Pemesan dan Justipper.');
  }

  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = credential.user;
  try {
    await updateProfile(user, { displayName: name.trim() });
    const timestamp = serverTimestamp();
    const batch = writeBatch(db);
    batch.set(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email || email.trim(),
      displayName: name.trim(),
      phone: phone.trim(),
      extra: extra.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    batch.set(doc(db, 'publicProfiles', user.uid), {
      uid: user.uid,
      displayName: name.trim(),
      photoURL: '',
      role,
      roles: [role],
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    await batch.commit();
  } catch (error) {
    await deleteUser(user);
    throw new Error(`Akun belum dapat disiapkan di Firestore: ${error.message}`);
  }

  setActiveRole(user.uid, role);
  let verificationError = '';
  try {
    await sendEmailVerification(user);
  } catch (error) {
    verificationError = `Akun sudah dibuat, tetapi email verifikasi belum terkirim: ${error.message}`;
  }

  return {
    user,
    profile: {
      uid: user.uid,
      role,
      roles: [role],
      name: name.trim(),
      email: user.email || email.trim(),
      phone: phone.trim(),
      extra: extra.trim(),
      photoURL: '',
    },
    verificationError,
  };
}

export async function resendVerificationEmail(user) {
  if (!auth || !user) throw new Error('Sesi pendaftaran tidak ditemukan. Silakan daftar kembali.');
  await sendEmailVerification(user);
}

export async function verifyEmailAndLoadProfile(user) {
  if (!auth || !user) throw new Error('Sesi pendaftaran tidak ditemukan. Silakan daftar kembali.');
  await reload(user);
  if (!user.emailVerified) throw new Error('Email belum terverifikasi. Klik tautan yang dikirim ke email, lalu coba lagi.');
  const profile = await getSignedInProfile(user);
  if (!profile) throw new Error('Profil terverifikasi tidak ditemukan di Firestore.');
  return profile;
}

export async function getSignedInProfile(user) {
  if (!db || !user) return null;
  const [privateSnap, publicSnap] = await Promise.all([
    getDoc(doc(db, 'users', user.uid)),
    getDoc(doc(db, 'publicProfiles', user.uid)),
  ]);
  if (!privateSnap.exists() || !publicSnap.exists()) return null;

  const privateData = privateSnap.data();
  const publicData = publicSnap.data();
  const roles = getProfileRoles(publicData);
  const selectedRole = sessionStorage.getItem(activeRoleKey(user.uid));
  const role = roles.includes(selectedRole) ? selectedRole : publicData.role;
  if (!isJustipRole(role) || !roles.includes(role)) return null;
  if (!role) return null;
  return {
    uid: user.uid,
    role,
    roles,
    name: publicData.displayName || user.displayName || '',
    email: privateData.email || user.email || '',
    phone: privateData.phone || '',
    photoURL: publicData.photoURL || user.photoURL || '',
  };
}

export async function logoutFromFirebase() {
  if (auth) await signOut(auth);
}
