import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { Bar, Fld } from '../account/parts.jsx';
import { CATEGORIES } from '../../data.js';

const MAX_PHOTO = 5, HIGH = 5000000, DESC_MIN = 20, DESC_MAX = 1000;
const KONDISI = ['Baru', 'Bekas Seperti Baru', 'Bekas Layak Pakai'];
const LABEL = ['Original', 'Pre-order', 'Tanpa label'];
const cats = CATEGORIES.map(([, n]) => n);
const idr = (v) => (v ? Number(v).toLocaleString('id-ID') : '');

const Chips = ({ list, value, onPick, label }) => (
  <div className="chipsel wrap" role="radiogroup" aria-label={label}>
    {list.map((l) => <button type="button" key={l} role="radio" aria-checked={value === l} className={value === l ? 'on' : ''} onClick={() => onPick(l)}>{l}</button>)}
  </div>
);

export default function ProductForm({ edit, back, onSave }) {
  const [f, setF] = useState({
    name: edit?.name ?? '', cat: edit?.cat ?? '', price: edit ? String(edit.price) : '', stock: edit ? String(edit.stock) : '1',
    desc: edit?.desc ?? '', kondisi: edit?.kondisi ?? 'Baru', label: edit?.label ?? 'Original', nota: !!edit?.nota, garansi: !!edit?.garansi,
  });
  const [photos, setPhotos] = useState(edit?.photos ?? []);
  const [err, setErr] = useState({});
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const num = (v) => v.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  const price = Number(f.price) || 0, high = price >= HIGH;

  const addPhotos = (e) => {
    const urls = [...e.target.files].slice(0, MAX_PHOTO - photos.length).map((x) => URL.createObjectURL(x));
    setPhotos((p) => [...p, ...urls]); setErr((s) => ({ ...s, photos: '' })); e.target.value = '';
  };
  const cover = (i) => setPhotos((p) => [p[i], ...p.filter((_, k) => k !== i)]);
  const drop = (i) => setPhotos((p) => p.filter((_, k) => k !== i));

  const submit = (publish) => (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = 'Nama barang minimal 3 karakter.';
    if (publish) {
      if (!photos.length) er.photos = 'Tambahkan minimal 1 foto produk.';
      if (!f.cat) er.cat = 'Pilih kategori barang.';
      if (!price) er.price = 'Masukkan harga yang valid.';
      if (!Number(f.stock)) er.stock = 'Stok minimal 1 untuk dipublikasikan.';
      if (f.desc.trim().length < DESC_MIN) er.desc = `Deskripsi minimal ${DESC_MIN} karakter.`;
    }
    setErr(er);
    if (Object.keys(er).length) return;
    onSave({
      ...(edit ?? { id: Date.now(), art: 'box' }),
      name: f.name.trim(), cat: f.cat, price, stock: Number(f.stock) || 0, desc: f.desc.trim(), kondisi: f.kondisi,
      label: f.label === 'Tanpa label' ? '' : f.label, photos, nota: high && f.nota, garansi: high && f.garansi,
      draft: !publish, active: publish ? true : false,
    }, publish);
  };

  return (
    <form className="a-form pf" onSubmit={submit(true)} noValidate>
      <Bar title={edit ? 'Ubah Barang' : 'Tambah Barang'} back={back} />
      <main className="scroll pad acc">
        <section className="pf-hero"><Ic n="shield" size={22} /><span><b>Tampilkan barangmu dengan meyakinkan</b><small>Foto jelas dan deskripsi lengkap membantu pembeli berani membeli barang bernilai tinggi.</small></span></section>

        <span className="a-lab">Foto Produk <em className="pf-n">{photos.length}/{MAX_PHOTO}</em></span>
        <div className="pf-photos">
          {photos.map((u, i) => (
            <div className={`pf-ph ${i === 0 ? 'main' : ''}`} key={u}>
              <img src={u} alt={`Foto produk ${i + 1}`} />
              {i === 0 ? <i>Utama</i> : <button type="button" className="pf-cv" onClick={() => cover(i)}>Jadikan utama</button>}
              <button type="button" className="pf-x" onClick={() => drop(i)} aria-label={`Hapus foto ${i + 1}`}><Ic n="trash" size={13} /></button>
            </div>
          ))}
          {photos.length < MAX_PHOTO && (
            <label className="pf-add"><Ic n="camera" size={22} /><b>Tambah</b>
              <input type="file" accept="image/*" multiple onChange={addPhotos} aria-label="Tambah foto produk" /></label>
          )}
        </div>
        {err.photos ? <small className="ferr" role="alert">{err.photos}</small> : <p className="a-hint left">Foto pertama jadi sampul. Ambil dari beberapa sisi, termasuk detail dan kelengkapan.</p>}

        <Fld label="Nama Barang" icon="tag" placeholder="Contoh: Sony WH-1000XM5" value={f.name} onChange={set('name')} error={err.name} />

        <span className="a-lab">Kategori</span>
        <Chips list={cats} value={f.cat} onPick={set('cat')} label="Kategori" />
        {err.cat && <small className="ferr" role="alert">{err.cat}</small>}

        <Fld label="Harga (Rp)" icon="cart" placeholder="0" value={idr(f.price)} onChange={(v) => set('price')(num(v))} error={err.price} inputMode="numeric" />
        {high && <p className="pf-hv"><Ic n="shield" size={14} />Barang bernilai tinggi · {rp(price)}</p>}

        <span className="a-lab">Stok</span>
        <div className="pf-stock">
          <button type="button" aria-label="Kurangi stok" onClick={() => set('stock')(String(Math.max(0, (Number(f.stock) || 0) - 1)))}>−</button>
          <input value={f.stock} inputMode="numeric" aria-label="Stok" onChange={(e) => set('stock')(num(e.target.value))} />
          <button type="button" aria-label="Tambah stok" onClick={() => set('stock')(String(Math.min(9999, (Number(f.stock) || 0) + 1)))}>+</button>
        </div>
        {err.stock && <small className="ferr" role="alert">{err.stock}</small>}

        <span className="a-lab">Kondisi Barang</span>
        <Chips list={KONDISI} value={f.kondisi} onPick={set('kondisi')} label="Kondisi barang" />
        <span className="a-lab">Keaslian</span>
        <Chips list={LABEL} value={f.label || 'Tanpa label'} onPick={set('label')} label="Label produk" />

        {high && (
          <section className="pf-trust" aria-label="Kelengkapan barang bernilai tinggi">
            <b>Kelengkapan untuk barang bernilai tinggi</b>
            <label className="chk"><input type="checkbox" checked={f.nota} onChange={(e) => set('nota')(e.target.checked)} /><span /> Ada nota / bukti pembelian asli</label>
            <label className="chk"><input type="checkbox" checked={f.garansi} onChange={(e) => set('garansi')(e.target.checked)} /><span /> Bergaransi resmi</label>
            <small>Pembeli melihat lencana ini di halaman produk. Pastikan sesuai kondisi barang.</small>
          </section>
        )}

        <span className="a-lab">Deskripsi <em className="pf-n">{f.desc.length}/{DESC_MAX}</em></span>
        <textarea className={`pf-desc ${err.desc ? 'err' : ''}`} rows={5} maxLength={DESC_MAX} aria-label="Deskripsi produk" aria-invalid={!!err.desc}
          placeholder="Tulis spesifikasi, ukuran, kelengkapan (box, nota, aksesori), dan cacat jika ada." value={f.desc} onChange={(e) => set('desc')(e.target.value)} />
        {err.desc && <small className="ferr" role="alert">{err.desc}</small>}
      </main>
      <footer className="co-bar pf-bar">
        <button type="button" className="btn out" onClick={submit(false)}>Simpan Draf</button>
        <button className="btn"><Ic n="check" size={18} />{edit && !edit.draft ? 'Simpan & Publikasi' : 'Publikasikan'}</button>
      </footer>
    </form>
  );
}
