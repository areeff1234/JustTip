import { Ic } from '../ui.jsx';
import { Bar } from './parts.jsx';
import StateView from '../states/StateView.jsx';

export const VSTAT = { belum: 'Belum diverifikasi', review: 'Sedang ditinjau', ok: 'Terverifikasi', tolak: 'Ditolak, perlu diajukan ulang' };
const HEAD = {
  belum: ['verify', 'Verifikasi Dulu', 'Lengkapi dokumen agar akunmu dipercaya pembeli dan bisa dipakai penuh.'],
  review: ['review', 'Sedang Ditinjau', 'Dokumenmu sudah kami terima. Peninjauan biasanya selesai dalam 1×24 jam kerja.'],
  ok: ['verify', 'Terverifikasi', 'Akunmu sudah terverifikasi. Lencana terpercaya tampil di profilmu.'],
  tolak: ['reject', 'Verifikasi Ditolak', ''],
};

export default function Verification({ cfg, acc, back, say }) {
  const v = acc.verif, vc = cfg.verif, [art, t, d] = HEAD[v.s];
  const locked = v.s === 'review' || v.s === 'ok';
  const ready = vc.docs.every(([k, , opt]) => opt || v.docs[k]);
  const pick = (k) => (e) => { const f = e.target.files[0]; if (f) acc.setVerif((s) => ({ ...s, docs: { ...s.docs, [k]: f.name } })); e.target.value = ''; };
  const set = (s, extra) => acc.setVerif((x) => ({ ...x, s, ...extra }));
  return (
    <>
      <Bar title={vc.title} back={back} />
      <main className="scroll pad acc">
        <StateView art={art} title={t} text={v.s === 'tolak' ? v.reason : d} />
        <h3 className="a-gt">Dokumen</h3>
        {vc.docs.map(([k, label, opt]) => (
          <div className="vf-doc" key={k}>
            <span className={`a-ri ${v.docs[k] ? 'vf-ok' : ''}`}><Ic n={v.docs[k] ? 'check' : 'camera'} size={20} /></span>
            <span><b>{label}{opt ? ' (opsional)' : ''}</b><small>{v.docs[k] || 'Belum diunggah'}</small></span>
            {!locked && <label className="vf-up">{v.docs[k] ? 'Ganti' : 'Unggah'}<input type="file" accept="image/*" onChange={pick(k)} aria-label={`Unggah ${label}`} /></label>}
          </div>
        ))}
        {v.s === 'review' && (
          <p className="demo">Mode demo, pilih hasil peninjauan:<br />
            <button className="lnk" onClick={() => { set('ok'); say('Akun terverifikasi'); }}>Setujui</button> · <button className="lnk" onClick={() => set('tolak', { reason: 'Foto KTP buram atau terpotong. Unggah ulang foto yang jelas dan terbaca.' })}>Tolak</button></p>
        )}
      </main>
      {!locked && <footer className="co-bar solo"><button className="btn wide" disabled={!ready} onClick={() => { set('review'); say('Dokumen dikirim untuk ditinjau'); }}>{v.s === 'tolak' ? 'Ajukan Ulang' : 'Kirim untuk Verifikasi'}</button></footer>}
    </>
  );
}
