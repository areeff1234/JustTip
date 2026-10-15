import { useEffect, useRef, useState } from 'react';
import { useChat } from './components/chat/useChat.js';
import { Offline } from './components/states/StateView.jsx';
import Splash from './components/Splash.jsx';
import PemesanApp from './components/pemesan/PemesanApp.jsx';
import JustipperApp from './components/justipper/JustipperApp.jsx';
import AdminApp from './components/admin/AdminApp.jsx';
import AdminPinModal from './components/admin/AdminPinModal.jsx';
import Onboarding from './components/auth/Onboarding.jsx';
import RoleSelect from './components/auth/RoleSelect.jsx';
import Login from './components/auth/Login.jsx';
import RegisterForm from './components/auth/RegisterForm.jsx';
import VerifyEmail from './components/auth/VerifyEmail.jsx';
import Success from './components/auth/Success.jsx';
import { ADDRS } from './components/checkout/checkout.js';
import { ADDR0, initPrefs } from './components/account/accountData.js';
import {
  auth as firebaseAuth,
  firebaseConfigured,
  getSignedInProfile,
  logoutFromFirebase,
  observeAuth,
  registerWithEmail,
  resendVerificationEmail,
  setActiveRole,
  signInWithEmail,
  signInWithGoogle,
  verifyEmailAndLoadProfile,
} from './firebase.js';

export default function App() {
  const [splash, setSplash] = useState(true);
  const [session, setSession] = useState(null); // { role, name }
  const [role, setRole] = useState('pemesan');
  const [draft, setDraft] = useState(null); // data pendaftaran
  const [auth, setAuth] = useState([{ page: 'onboarding' }]);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', extra: '', photo: null });
  const [addrs, setAddrs] = useState({ pemesan: ADDRS, ...ADDR0 });
  const [prefs, setPrefs] = useState(initPrefs);
  const [verif, setVerif] = useState({ justipper: { s: 'belum', docs: {} } });
  const [pinOpen, setPinOpen] = useState(false);
  const [authPending, setAuthPending] = useState(firebaseConfigured);
  const [authError, setAuthError] = useState('');
  const [verificationUser, setVerificationUser] = useState(null);
  const authAttemptRole = useRef(null);
  const sessionRef = useRef(null);
  const chat = useChat(session);
  const [net, setNet] = useState(() => navigator.onLine);
  const [fakeOff, setFakeOff] = useState(false);
  useEffect(() => {
    const on = () => setNet(true), off = () => setNet(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    if (!firebaseConfigured) return undefined;
    return observeAuth(async (user) => {
      if (!user) {
        setVerificationUser(null);
        setAuthPending(false);
        return;
      }
      if (!user.emailVerified) {
        try {
          const pendingProfile = await getSignedInProfile(user);
          if (firebaseAuth.currentUser?.uid !== user.uid) return;
          if (pendingProfile) {
            setVerificationUser(user);
            setDraft((current) => (current?.email === user.email ? current : { email: user.email }));
            setAuth([{ page: 'verify' }]);
          }
        } catch (error) {
          setAuthError(`Profil pendaftaran belum dapat dimuat: ${error.message}`);
        } finally {
          setAuthPending(false);
        }
        return;
      }
      // Jika login sudah ditangani manual (misal via Google popup), skip observer
      if (authAttemptRole.current) { setAuthPending(false); return; }
      // Jika sesi sudah aktif untuk user yang sama (misal setelah enter() dipanggil), skip
      if (sessionRef.current?.uid === user.uid) { setAuthPending(false); return; }
      try {
        const signedInProfile = await getSignedInProfile(user);
        if (firebaseAuth.currentUser?.uid !== user.uid) return;
        // Double-check setelah await: pastikan sesi belum di-set oleh enter() atau proses lain
        if (authAttemptRole.current) { setAuthPending(false); return; }
        if (sessionRef.current?.uid === user.uid) { setAuthPending(false); return; }
        if (signedInProfile) {
          setProfile({
            name: signedInProfile.name,
            email: signedInProfile.email,
            phone: signedInProfile.phone,
            extra: '',
            photo: signedInProfile.photoURL || null,
          });
          sessionRef.current = signedInProfile;
          setSession(signedInProfile);
          setAuthError('');
        } else {
          setAuthError('Profil Google belum lengkap. Silakan login kembali.');
        }
      } catch (error) {
        setAuthError(`Sesi Google tidak dapat dimuat: ${error.message}`);
      } finally {
        setAuthPending(false);
      }
    }, (error) => {
      setAuthError(`Sesi Google tidak dapat diperiksa: ${error.message}`);
      setAuthPending(false);
    });
  }, []);

  // Akses rahasia admin via URL query (?admin) atau URL hash (#admin)
  useEffect(() => {
    const checkAdmin = () => {
      const q = window.location.search.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if ((q.includes('admin') || h.includes('admin')) && session?.role !== 'admin') {
        setPinOpen(true);
      }
    };
    checkAdmin();
    window.addEventListener('hashchange', checkAdmin);
    return () => window.removeEventListener('hashchange', checkAdmin);
  }, [session]);

  const offline = !net || fakeOff;
  const retry = () => { const ok = navigator.onLine; if (ok) { setNet(true); setFakeOff(false); } return ok; };

  const enterAdmin = () => {
    setPinOpen(true);
  };

  const onPinSuccess = () => {
    window.location.hash = '#admin';
    setSession({
      role: 'admin',
      name: 'Admin Bitforce (TI-A)',
      email: 'admin@bitforce.it',
      phone: '081234567890',
    });
    setPinOpen(false);
  };

  const onPinCancel = () => {
    setPinOpen(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  // --- navigasi auth ---
  const aGo = (page) => setAuth((s) => [...s, { page }]);
  const aBack = () => {
    setAuth((s) => {
      if (s.length > 1) return s.slice(0, -1);
      const curPage = s[0]?.page;
      if (curPage === 'login') return [{ page: 'role' }];
      if (curPage === 'role') return [{ page: 'onboarding' }];
      if (curPage === 'regrole') return [{ page: 'login' }];
      if (curPage === 'regform') return [{ page: 'regrole' }];
      if (curPage === 'verify') return [{ page: 'regform' }];
      return [{ page: 'onboarding' }];
    });
  };
  const aRoot = (page) => setAuth([{ page }]);
  const enter = (u) => {
    authAttemptRole.current = null;
    sessionRef.current = u; // tandai sesi aktif sebelum setSession agar observer tidak override
    if (u.uid && u.role) setActiveRole(u.uid, u.role);
    setProfile({ name: u.name ?? '', email: u.email ?? '', phone: u.phone ?? '', extra: u.extra ?? '', photo: u.photoURL ?? null });
    setSession(u);
    setAuthError('');
  };
  const startGoogleLogin = async (selectedRole) => {
    authAttemptRole.current = selectedRole;
    try {
      return await signInWithGoogle(selectedRole);
    } catch (error) {
      authAttemptRole.current = null;
      throw error;
    }
  };
  const startEmailLogin = async (selectedRole, email, password) => {
    authAttemptRole.current = selectedRole;
    try {
      return await signInWithEmail(selectedRole, email, password);
    } catch (error) {
      authAttemptRole.current = null;
      throw error;
    }
  };
  const switchRole = (nextRole) => {
    if (!session?.roles?.includes(nextRole)) return;
    setActiveRole(session.uid, nextRole);
    setSession((current) => current ? { ...current, role: nextRole } : current);
  };
  const logout = () => {
    if (session?.role === 'admin') {
      window.history.replaceState({}, '', window.location.pathname);
    }
    sessionRef.current = null; // reset ref saat logout
    setSession(null);
    logoutFromFirebase().catch((error) => setAuthError(`Gagal keluar dari Google: ${error.message}`));
    // Arahkan ke pilih peran (bukan langsung login) agar user bisa ganti peran dengan mudah
    setAuth([{ page: 'onboarding' }, { page: 'role' }]);
  };

  const a = auth[auth.length - 1].page;

  const authView = (
    <div className="page">
      {a === 'onboarding' && <Onboarding onStart={() => aGo('role')} />}
      {a === 'role' && <RoleSelect mode="login" back={aBack} goLogin={() => aGo('login')} onPick={(r) => { setRole(r); aGo('login'); }} onSecretAdmin={enterAdmin} />}
      {a === 'login' && <Login role={role} back={aBack} goRegister={() => aGo('regrole')} onLogin={(user) => enter({ ...user, role })} onGoogleLogin={startGoogleLogin} onEmailLogin={startEmailLogin} onSecretAdmin={enterAdmin} initialError={authError} />}
      {a === 'regrole' && <RoleSelect mode="register" back={aBack} goLogin={() => aRoot('login')} onPick={(r) => { setRole(r); aGo('regform'); }} onSecretAdmin={enterAdmin} />}
      {a === 'regform' && <RegisterForm role={role} back={aBack} onRegister={registerWithEmail} onDone={(d) => { setDraft(d); setVerificationUser(d.user || null); firebaseConfigured ? aRoot('verify') : aGo('verify'); }} />}
      {a === 'verify' && <VerifyEmail
        email={draft?.email}
        back={aBack}
        user={verificationUser || draft?.user}
        initialError={draft?.verificationError}
        onVerify={firebaseConfigured ? verifyEmailAndLoadProfile : undefined}
        onResend={firebaseConfigured ? resendVerificationEmail : undefined}
        onOk={(verifiedProfile) => {
          if (verifiedProfile) {
            setVerificationUser(null);
            enter(verifiedProfile);
          } else {
            aGo('success');
          }
        }}
      />}
      {a === 'success' && <Success onStart={() => enter({ role, name: draft?.name, email: draft?.email, phone: draft?.tel, extra: draft?.extra })} onLogin={() => aRoot('login')} />}
    </div>
  );

  const r = session?.role;
  const upd = (set) => (fn) => set((s) => ({ ...s, [r]: typeof fn === 'function' ? fn(s[r]) : fn }));
  const acc = r && {
    profile,
    setProfile,
    addrs: addrs[r],
    setAddrs: upd(setAddrs),
    prefs: prefs[r],
    setPrefs: upd(setPrefs),
    verif: verif[r],
    setVerif: upd(setVerif),
    roles: session.roles || [r],
    switchRole,
    simOffline: () => setFakeOff(true),
  };
  const Shell = { pemesan: PemesanApp, justipper: JustipperApp, admin: AdminApp }[session?.role];
  const appView = Shell ? <Shell key={session.role} session={session} logout={logout} acc={acc} chat={chat} /> : null;

  return (
    <div className="phone">
      {session ? appView : <div className="app">{authPending ? <p className="lead c">Memeriksa sesi Google...</p> : authView}</div>}
      {offline && !splash && <Offline onRetry={retry} />}
      {splash && <Splash onDone={() => setSplash(false)} />}
      {pinOpen && <AdminPinModal onSuccess={onPinSuccess} onCancel={onPinCancel} />}
    </div>
  );
}
