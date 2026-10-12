import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';
import { Bar, Fld } from '../account/parts.jsx';
import { CATEGORIES } from '../../data.js';

const MAX_PHOTO = 5, HIGH = 5000000, DESC_MIN = 15, DESC_MAX = 1000;
const KONDISI = ['Baru (dari luar negeri)', 'Baru (lokal)', 'Bekas Seperti Baru', 'Pre-order'];
const LABEL = ['Original', 'Pre-order', 'Edisi Terbatas', 'Tanpa label'];
const cats = CATEGORIES.map(([, n]) => n);
const idr = (v) => (v ? Number(v).toLocaleString('id-ID') : '');

const Chips = ({ list, value, onPick, label }) => (
  <div className="chipsel wrap" role="radiogroup" aria-label={label}>
    {list.map((l) => (
      <button
        type="button"
        key={l}
        role="radio"
        aria-checked={value === l}
        className={value === l ? 'on' : ''}
        onClick={() => onPick(l)}
      >
        {l}
      </button>
    ))}
  </div>
);

export function TitipanRow({ p, onEdit, onToggle, onDelete }) {
  const [menu, setMenu] = useState(false);
  return (
    <article className={`sprow ${p.active ? '' : 'off'}`}>
      <span className="sp-img">
        {p.photos?.[0] ? <img className="sp-ph" src={p.photos[0]} alt="" /> : ART[p.art || 'box']}
      </span>
      <div className="sp-info">
        <h4>{p.name}{p.label ? <><br />({p.label})</> : null}</h4>
        <b>{rp(p.price)}</b>
        <small>Kuota/Stok: {p.stock} slot{p.cat ? ` · ${p.cat}` : ''}</small>
      </div>
      <div className="sp-act">
        <button onClick={() => onEdit(p)} aria-label="Ubah barang titipan"><Ic n="pencil" size={16} /></button>
        <button onClick={() => setMenu(!menu)} aria-label="Menu pilihan" aria-expanded={menu}><Ic n="moreV" size={16} /></button>
      </div>
      <button
        className={`stat ${p.draft ? 'draft' : p.active ? 'on' : ''}`}
        onClick={() => onToggle(p.id)}
        aria-pressed={p.active}
      >
        {p.draft ? 'Draf' : p.active ? 'Aktif' : 'Nonaktif'}
      </button>
      {menu && (
        <div className="menu" role="menu">
          <button role="menuitem" onClick={() => { onToggle(p.id); setMenu(false); }}>
            {p.draft ? 'Publikasikan' : p.active ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button role="menuitem" className="del" onClick={() => { onDelete(p.id); setMenu(false); }}>
            <Ic n="trash" size={14} /> Hapus
          </button>
        </div>
      )}
    </article>
  );
}

export function TitipanPage({ products, onAdd, onEdit, onToggle, onDelete }) {
  const [tab, setTab] = useState('semua');
  const filtered = products.filter((p) => {
    if (tab === 'aktif') return p.active && !p.draft;
    if (tab === 'draf') return p.draft;
    return true;
  });

  return (
    <main className="scroll pad">
      <div className="pg-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 className="pg-t" style={{ margin: 0 }}>Katalog Titipan</h2>
          <small style={{ color: 'var(--muted)', fontSize: 12 }}>Buka slot titipan untuk konsumen</small>
        </div>
        <button className="btn sm" onClick={onAdd}><Ic n="plus" size={16} /> Tambah Titipan</button>
      </div>

      <div className="seg" role="tablist" style={{ marginBottom: 14 }}>
        {[['semua', `Semua (${products.length})`], ['aktif', 'Aktif'], ['draf', 'Draf']].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>

      <div className="splist">
        {filtered.map((p) => (
          <TitipanRow
            key={p.id}
            p={p}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
        {!filtered.length && (
          <div style={{ textAlign: 'center', padding: '36px 16px', background: '#fff', borderRadius: 16, border: '1px dashed var(--line)' }}>
            <Ic n="bag" size={40} style={{ color: 'var(--sky)', opacity: 0.6, marginBottom: 8 }} />
            <h4 style={{ margin: '0 0 6px', color: 'var(--navy)' }}>Belum Ada Titipan {tab !== 'semua' ? tab : ''}</h4>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 16px' }}>
              Tambahkan barang belanjaan atau slot titipan agar konsumen bisa menitip kepadamu.
            </p>
            <button className="btn sm" onClick={onAdd}><Ic n="plus" size={14} /> Tambah Titipan Pertama</button>
          </div>
        )}
      </div>
    </main>
  );
}

export function TitipanForm({ edit, back, onSave }) {
  const [f, setF] = useState({
    name: edit?.name ?? '',
    cat: edit?.cat ?? '',
    price: edit ? String(edit.price) : '',
    stock: edit ? String(edit.stock) : '5',
    desc: edit?.desc ?? '',
    kondisi: edit?.kondisi ?? 'Baru (dari luar negeri)',
    label: edit?.label ?? 'Original',
    nota: !!edit?.nota,
    garansi: !!edit?.garansi,
  });
  const [photos, setPhotos] = useState(edit?.photos ?? []);
  const [err, setErr] = useState({});

  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const num = (v) => v.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  const price = Number(f.price) || 0;
  const high = price >= HIGH;

  const addPhotos = (e) => {
    const urls = [...e.target.files].slice(0, MAX_PHOTO - photos.length).map((x) => URL.createObjectURL(x));
    setPhotos((p) => [...p, ...urls]);
    setErr((s) => ({ ...s, photos: '' }));
    e.target.value = '';
  };
  const cover = (i) => setPhotos((p) => [p[i], ...p.filter((_, k) => k !== i)]);
  const drop = (i) => setPhotos((p) => p.filter((_, k) => k !== i));

  const submit = (publish) => (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = 'Nama barang minimal 3 karakter.';
    if (publish) {
      if (!f.cat) er.cat = 'Pilih kategori barang titipan.';
      if (!price) er.price = 'Masukkan estimasi harga barang yang valid.';
      if (!Number(f.stock)) er.stock = 'Kuota/stok titipan minimal 1 slot.';
      if (f.desc.trim().length < DESC_MIN) er.desc = `Deskripsi/catatan titipan minimal ${DESC_MIN} karakter.`;
    }
    setErr(er);
    if (Object.keys(er).length) return;

    onSave({
      ...(edit ?? { id: Date.now(), art: 'box' }),
      name: f.name.trim(),
      cat: f.cat,
      price,
      stock: Number(f.stock) || 0,
      desc: f.desc.trim(),
      kondisi: f.kondisi,
      label: f.label === 'Tanpa label' ? '' : f.label,
      photos,
      nota: high && f.nota,
      garansi: high && f.garansi,
      draft: !publish,
      active: publish ? true : false,
    }, publish);
  };

  return (
    <form className="a-form pf" onSubmit={submit(true)} noValidate>
      <Bar title={edit ? 'Ubah Barang Titipan' : 'Buka Slot Titipan Baru'} back={back} />
      <main className="scroll pad acc">
        <section className="pf-hero">
          <Ic n="bag" size={24} />
          <span>
            <b>Buka jastip barang untuk konsumen</b>
            <small>Tampilkan foto jelas, kuota bagasi, dan estimasi harga agar konsumen langsung menitip padamu.</small>
          </span>
        </section>

        <span className="a-lab">Foto Barang Titipan <em className="pf-n">{photos.length}/{MAX_PHOTO}</em></span>
        <div className="pf-photos">
          {photos.map((u, i) => (
            <div className={`pf-ph ${i === 0 ? 'main' : ''}`} key={u}>
              <img src={u} alt={`Foto titipan ${i + 1}`} />
              {i === 0 ? <i>Utama</i> : <button type="button" className="pf-cv" onClick={() => cover(i)}>Jadikan utama</button>}
              <button type="button" className="pf-x" onClick={() => drop(i)} aria-label={`Hapus foto ${i + 1}`}><Ic n="trash" size={13} /></button>
            </div>
          ))}
          {photos.length < MAX_PHOTO && (
            <label className="pf-add">
              <Ic n="camera" size={22} />
              <b>Tambah</b>
              <input type="file" accept="image/*" multiple onChange={addPhotos} aria-label="Tambah foto titipan" />
            </label>
          )}
        </div>
        {err.photos ? <small className="ferr" role="alert">{err.photos}</small> : <p className="a-hint left">Foto pertama jadi sampul katalog. Tampilkan contoh produk asli atau dari toko resmi.</p>}

        <Fld
          label="Nama Barang Titipan"
          icon="tag"
          placeholder="Contoh: Sepatu Nike Air Force 1 / Tumbler Stanley"
          value={f.name}
          onChange={set('name')}
          error={err.name}
        />

        <span className="a-lab">Kategori Barang</span>
        <Chips list={cats} value={f.cat} onPick={set('cat')} label="Kategori" />
        {err.cat && <small className="ferr" role="alert">{err.cat}</small>}

        <Fld
          label="Estimasi Harga Barang (Rp)"
          icon="cart"
          placeholder="0"
          value={idr(f.price)}
          onChange={(v) => set('price')(num(v))}
          error={err.price}
          inputMode="numeric"
        />
        {high && <p className="pf-hv"><Ic n="shield" size={14} />Barang bernilai tinggi · {rp(price)}</p>}

        <span className="a-lab">Kuota Bagasi / Stok Titipan</span>
        <div className="pf-stock">
          <button type="button" aria-label="Kurangi kuota" onClick={() => set('stock')(String(Math.max(0, (Number(f.stock) || 0) - 1)))}>−</button>
          <input value={f.stock} inputMode="numeric" aria-label="Kuota slot titipan" onChange={(e) => set('stock')(num(e.target.value))} />
          <button type="button" aria-label="Tambah kuota" onClick={() => set('stock')(String(Math.min(999, (Number(f.stock) || 0) + 1)))}>+</button>
        </div>
        {err.stock && <small className="ferr" role="alert">{err.stock}</small>}

        <span className="a-lab">Kondisi Barang</span>
        <Chips list={KONDISI} value={f.kondisi} onPick={set('kondisi')} label="Kondisi barang" />

        <span className="a-lab">Keaslian / Label Titipan</span>
        <Chips list={LABEL} value={f.label || 'Tanpa label'} onPick={set('label')} label="Label titipan" />

        {high && (
          <section className="pf-trust" aria-label="Jaminan keaslian barang bernilai tinggi">
            <b>Jaminan untuk barang bernilai tinggi</b>
            <label className="chk">
              <input type="checkbox" checked={f.nota} onChange={(e) => set('nota')(e.target.checked)} />
              <span /> Ada nota / bukti struk pembelian resmi
            </label>
            <label className="chk">
              <input type="checkbox" checked={f.garansi} onChange={(e) => set('garansi')(e.target.checked)} />
              <span /> Bergaransi internasional / resmi
            </label>
            <small>Konsumen akan melihat badge jaminan ini. Wajib sertakan saat serah terima barang.</small>
          </section>
        )}

        <span className="a-lab">Deskripsi & Catatan Jastip <em className="pf-n">{f.desc.length}/{DESC_MAX}</em></span>
        <textarea
          className={`pf-desc ${err.desc ? 'err' : ''}`}
          rows={5}
          maxLength={DESC_MAX}
          aria-label="Deskripsi dan catatan titipan"
          aria-invalid={!!err.desc}
          placeholder="Tulis negara/toko tempat kamu beli, jadwal belanja, varian warna/ukuran yang bisa dititip, dan aturan titip."
          value={f.desc}
          onChange={(e) => set('desc')(e.target.value)}
        />
        {err.desc && <small className="ferr" role="alert">{err.desc}</small>}
      </main>
      <footer className="co-bar pf-bar">
        <button type="button" className="btn out" onClick={submit(false)}>Simpan Draf</button>
        <button className="btn"><Ic n="check" size={18} />{edit && !edit.draft ? 'Simpan Perubahan' : 'Publikasikan Titipan'}</button>
      </footer>
    </form>
  );
}
