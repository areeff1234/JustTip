import { useEffect, useState } from 'react';
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
  const chat = useChat();
  const [net, setNet] = useState(() => navigator.onLine);
  const [fakeOff, setFakeOff] = useState(false);
  useEffect(() => {
    const on = () => setNet(true), off = () => setNet(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
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
  const enter = (u) => { setProfile({ name: u.name ?? '', email: u.email ?? '', phone: u.phone ?? '', extra: u.extra ?? '', photo: null }); setSession(u); };
  const logout = () => {
    if (session?.role === 'admin') {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setSession(null);
    setAuth([{ page: 'onboarding' }, { page: 'role' }, { page: 'login' }]);
  };

  const a = auth[auth.length - 1].page;

  const authView = (
    <div className="page">
      {a === 'onboarding' && <Onboarding onStart={() => aGo('role')} />}
      {a === 'role' && <RoleSelect mode="login" back={aBack} goLogin={() => aGo('login')} onPick={(r) => { setRole(r); aGo('login'); }} onSecretAdmin={enterAdmin} />}
      {a === 'login' && <Login role={role} back={aBack} goRegister={() => aGo('regrole')} onLogin={enter} onSecretAdmin={enterAdmin} />}
      {a === 'regrole' && <RoleSelect mode="register" back={aBack} goLogin={() => aRoot('login')} onPick={(r) => { setRole(r); aGo('regform'); }} onSecretAdmin={enterAdmin} />}
      {a === 'regform' && <RegisterForm role={role} back={aBack} onDone={(d) => { setDraft(d); aGo('verify'); }} />}
      {a === 'verify' && <VerifyEmail email={draft?.email} back={aBack} onOk={() => aGo('success')} />}
      {a === 'success' && <Success onStart={() => enter({ role, name: draft?.name, email: draft?.email, phone: draft?.tel, extra: draft?.extra })} onLogin={() => aRoot('login')} />}
    </div>
  );

  const r = session?.role;
  const upd = (set) => (fn) => set((s) => ({ ...s, [r]: typeof fn === 'function' ? fn(s[r]) : fn }));
  const acc = r && { profile, setProfile, addrs: addrs[r], setAddrs: upd(setAddrs), prefs: prefs[r], setPrefs: upd(setPrefs), verif: verif[r], setVerif: upd(setVerif), simOffline: () => setFakeOff(true) };
  const Shell = { pemesan: PemesanApp, justipper: JustipperApp, admin: AdminApp }[session?.role];
  const appView = Shell ? <Shell key={session.role} session={session} logout={logout} acc={acc} chat={chat} /> : null;

  return (
    <div className="phone">
      {session ? appView : <div className="app">{authView}</div>}
      {offline && !splash && <Offline onRetry={retry} />}
      {splash && <Splash onDone={() => setSplash(false)} />}
      {pinOpen && <AdminPinModal onSuccess={onPinSuccess} onCancel={onPinCancel} />}
    </div>
  );
}
