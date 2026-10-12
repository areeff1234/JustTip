import Logo from '../Logo.jsx';

export default function Success({ onStart, onLogin }) {
  return (
    <div className="auth center-y">
      <div className="ok-art">
        <i className="cf a" /><i className="cf b" /><i className="cf c" /><i className="cf d" /><i className="cf e" />
        <div className="ok-blob"><Logo fg="#2fa9f0" bg="#fff" className="ok-logo" /></div>
        <span className="ok-badge"><svg viewBox="0 0 24 24"><path d="M6 12.500l4 4 8-9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </div>
      <h1 className="h2 c">Pendaftaran Berhasil!</h1>
      <p className="lead c">Akun Anda sudah berhasil dibuat.<br />Selamat bergabung di Justip!</p>
      <button className="btn wide" onClick={onStart}>Mulai Menggunakan</button>
      <button className="lnk resend" onClick={onLogin}>Kembali ke Login</button>
    </div>
  );
}
