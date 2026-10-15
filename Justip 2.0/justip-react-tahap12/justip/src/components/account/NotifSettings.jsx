import { useEffect, useState } from 'react';
import { TOPICS } from './accountData.js';
import { Bar, Switch } from './parts.jsx';
import { Ic } from '../ui.jsx';
import { auth, registerPushDevice, unregisterPushDevice } from '../../firebase.js';

export default function NotifSettings({ role, acc, back }) {
  const [message, setMessage] = useState('');
  const p = acc.prefs;
  const upd = (k) => (v) => acc.setPrefs((s) => ({ ...s, [k]: v }));
  const tog = (k) => (v) => acc.setPrefs((s) => ({ ...s, t: { ...s.t, [k]: v } }));
  const off = !p.push && !p.email;
  useEffect(() => {
    if (p.push && (!('Notification' in window) || Notification.permission !== 'granted')) {
      acc.setPrefs((s) => ({ ...s, push: false }));
      setMessage('Izin notifikasi browser sudah tidak aktif. Aktifkan kembali untuk menerima pemberitahuan perangkat.');
    }
  }, [p.push]);
  const setPush = async (enabled) => {
    setMessage('');
    if (!enabled) {
      if (auth?.currentUser) {
        try {
          await unregisterPushDevice();
        } catch (error) {
          console.error('Gagal menonaktifkan token notifikasi push:', error);
          setMessage(`Push dinonaktifkan di aplikasi, tetapi token perangkat gagal dihapus: ${error.message}`);
        }
      }
      upd('push')(false);
      return;
    }
    if (!('Notification' in window)) {
      setMessage('Browser ini tidak mendukung notifikasi perangkat.');
      return;
    }
    try {
      const permission = Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();
      if (permission !== 'granted') {
        setMessage(permission === 'denied'
          ? 'Izin notifikasi diblokir. Aktifkan izin Justip melalui pengaturan browser.'
          : 'Izin notifikasi belum diberikan, jadi notifikasi perangkat tetap nonaktif.');
        return;
      }
      if (auth?.currentUser) await registerPushDevice();
      upd('push')(true);
      setMessage(auth?.currentUser
        ? 'Notifikasi perangkat aktif. Pesan chat dapat diterima saat aplikasi tidak terbuka setelah backend Firebase aktif.'
        : 'Notifikasi browser aktif saat Justip terbuka. Login Firebase diperlukan untuk push saat aplikasi tertutup.');
    } catch (error) {
      console.error('Gagal meminta izin notifikasi browser:', error);
      setMessage(error.message || 'Izin notifikasi gagal diminta. Periksa pengaturan browser lalu coba lagi.');
    }
  };
  return (
    <>
      <Bar title="Notifikasi" back={back} />
      <main className="scroll pad acc">
        <h3 className="a-gt">Saluran</h3>
        <div className="a-group">
          <div className="a-sw"><span className="a-ri"><Ic n="bell" size={20} /></span><span><b>Notifikasi Perangkat</b><small>Pemberitahuan browser saat Justip terbuka</small></span><Switch on={p.push} set={setPush} label="Notifikasi perangkat" /></div>
          <div className="a-sw"><span className="a-ri"><Ic n="mail" size={20} /></span><span><b>Notifikasi Email</b><small>Pesan chat via email setelah backend Resend aktif</small></span><Switch on={p.email} set={upd('email')} label="Notifikasi email" /></div>
        </div>
        <p className="a-hint">Push dan email server terhubung untuk pesan chat setelah konfigurasi Firebase aktif. Notifikasi pesanan dan rute masih memakai data lokal, jadi hanya tampil saat aplikasi terbuka.</p>
        {message && <p className="a-hint" role="status">{message}</p>}
        {acc.notificationError && <p className="ferr" role="alert">{acc.notificationError}</p>}
        <h3 className="a-gt">Jenis notifikasi</h3>
        <div className={`a-group ${off ? 'dim' : ''}`}>
          {TOPICS[role].map(([k, t, d]) => (
            <div className="a-sw" key={k}><span><b>{t}</b><small>{d}</small></span><Switch on={!!p.t[k]} set={tog(k)} label={t} /></div>
          ))}
        </div>
        {off && <p className="a-hint">Notifikasi perangkat dan email nonaktif.</p>}
      </main>
    </>
  );
}
