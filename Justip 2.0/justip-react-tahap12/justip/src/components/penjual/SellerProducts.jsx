import { useState } from 'react';
import { Ic, rp } from '../ui.jsx';
import { ART } from '../art.jsx';

export function ProductRow({ p, onEdit, onToggle, onDelete }) {
  const [menu, setMenu] = useState(false);
  return (
    <article className={`sprow ${p.active ? '' : 'off'}`}>
      <span className="sp-img">{p.photos?.[0] ? <img className="sp-ph" src={p.photos[0]} alt="" /> : ART[p.art]}</span>
      <div className="sp-info">
        <h4>{p.name}{p.label ? <><br />({p.label})</> : null}</h4>
        <b>{rp(p.price)}</b><small>Stok: {p.stock}{p.cat ? ` · ${p.cat}` : ''}</small>
      </div>
      <div className="sp-act">
        <button onClick={() => onEdit(p)} aria-label="Ubah produk"><Ic n="pencil" size={16} /></button>
        <button onClick={() => setMenu(!menu)} aria-label="Menu produk" aria-expanded={menu}><Ic n="moreV" size={16} /></button>
      </div>
      <button className={`stat ${p.draft ? 'draft' : p.active ? 'on' : ''}`} onClick={() => onToggle(p.id)} aria-pressed={p.active}>{p.draft ? 'Draf' : p.active ? 'Aktif' : 'Nonaktif'}</button>
      {menu && (
        <div className="menu" role="menu">
          <button role="menuitem" onClick={() => { onToggle(p.id); setMenu(false); }}>{p.draft ? 'Publikasikan' : p.active ? 'Nonaktifkan' : 'Aktifkan'}</button>
          <button role="menuitem" className="del" onClick={() => onDelete(p.id)}><Ic n="trash" size={14} /> Hapus</button>
        </div>
      )}
    </article>
  );
}

export function ProductsPage({ products, onAdd, ...rest }) {
  return (
    <main className="scroll pad">
      <div className="pg-head"><h2 className="pg-t">Produk Saya</h2><button className="btn sm" onClick={onAdd}><Ic n="plus" size={16} /> Tambah Produk</button></div>
      <div className="splist">
        {products.map((p) => <ProductRow key={p.id} p={p} {...rest} />)}
        {!products.length && <p className="empty">Belum ada produk. Tambahkan produk pertamamu.</p>}
      </div>
    </main>
  );
}
