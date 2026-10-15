import { useState } from 'react';
import { Ic, Stars, rp } from './ui.jsx';
import { ART } from './art.jsx';
import { CATEGORIES, title } from '../data.js';
import { useJustip } from '../context/JustipContext.jsx';
import StateView from './states/StateView.jsx';

const SUGGEST = ['Sepatu', 'Elektronik', 'Tas', 'Kecantikan', 'Peralatan'];
const SORTS = [
  ['recommended', 'Rekomendasi'],
  ['priceAsc', 'Harga terendah'],
  ['priceDesc', 'Harga tertinggi'],
  ['rating', 'Rating tertinggi'],
  ['discount', 'Diskon terbesar'],
];

export default function ProductList({ go, back, pick, onRequestCustom }) {
  const open = (p) => (pick ? pick(p) : go('detail', p));
  const [fav, setFav] = useState({});
  const [q, setQ] = useState('');
  const [panel, setPanel] = useState(null);
  const [sort, setSort] = useState('recommended');
  const [category, setCategory] = useState('');
  const [filters, setFilters] = useState({ inStock: false, discounted: false, topRated: false });
  const { products } = useJustip();
  const key = q.trim().toLowerCase();
  const activeProducts = products.filter((p) => p.active !== false);
  const matched = activeProducts.filter((p) => {
    if (key && ![p.name, p.tag, p.label, p.store, p.cat, p.justipper].filter(Boolean).join(' ').toLowerCase().includes(key)) return false;
    if (category && p.cat !== category) return false;
    if (filters.inStock && !(Number(p.stock) > 0)) return false;
    if (filters.discounted && !(Number(p.disc) > 0)) return false;
    if (filters.topRated && !(Number(p.rating) >= 4.8)) return false;
    return true;
  });
  const shown = [...matched].sort((a, b) => {
    if (sort === 'priceAsc') return Number(a.price) - Number(b.price);
    if (sort === 'priceDesc') return Number(b.price) - Number(a.price);
    if (sort === 'rating') return Number(b.rating) - Number(a.rating);
    if (sort === 'discount') return Number(b.disc) - Number(a.disc);
    return 0;
  });
  const filterCount = Object.values(filters).filter(Boolean).length;
  const togglePanel = (name) => setPanel((current) => current === name ? null : name);
  const toggleFilter = (name) => setFilters((current) => ({ ...current, [name]: !current[name] }));
  const clearSearchAndFilters = () => {
    setQ('');
    setCategory('');
    setFilters({ inStock: false, discounted: false, topRated: false });
    setSort('recommended');
  };
  return (
    <>
      <header className="bar">
        <button className="icon-btn" onClick={back} aria-label="Kembali"><Ic n="back" /></button>
        <label className="search flex"><Ic n="search" size={20} /><input placeholder="Cari barang, toko, atau link..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari barang" /></label>
      </header>
      <div className="product-tools">
        <div className="chips">
          <button type="button" aria-expanded={panel === 'sort'} onClick={() => togglePanel('sort')}><Ic n="sort" size={16} />{SORTS.find(([value]) => value === sort)?.[1] || 'Urutkan'} <Ic n="chevD" size={14} /></button>
          <button type="button" aria-expanded={panel === 'category'} onClick={() => togglePanel('category')}>{category || 'Kategori'} <Ic n="chevD" size={14} /></button>
          <button type="button" aria-expanded={panel === 'filter'} onClick={() => togglePanel('filter')}><Ic n="filter" size={16} />Filter{filterCount > 0 ? ` (${filterCount})` : ''}</button>
        </div>
        {panel === 'sort' && (
          <section className="product-panel" aria-label="Urutkan produk">
            <h3>Urutkan berdasarkan</h3>
            {SORTS.map(([value, label]) => (
              <button type="button" className="product-option" key={value} aria-pressed={sort === value} onClick={() => { setSort(value); setPanel(null); }}>
                <span>{label}</span><i className={sort === value ? 'selected' : ''} />
              </button>
            ))}
          </section>
        )}
        {panel === 'category' && (
          <section className="product-panel category-panel" aria-label="Pilih kategori">
            <h3>Kategori barang</h3>
            <button type="button" className="product-option" aria-pressed={!category} onClick={() => { setCategory(''); setPanel(null); }}>
              <span>Semua kategori</span><i className={!category ? 'selected' : ''} />
            </button>
            {CATEGORIES.map(([, name]) => (
              <button type="button" className="product-option" key={name} aria-pressed={category === name} onClick={() => { setCategory(name); setPanel(null); }}>
                <span>{name}</span><i className={category === name ? 'selected' : ''} />
              </button>
            ))}
          </section>
        )}
        {panel === 'filter' && (
          <section className="product-panel" aria-label="Filter produk">
            <div className="product-panel-head">
              <h3>Filter produk</h3>
              {filterCount > 0 && <button type="button" onClick={() => setFilters({ inStock: false, discounted: false, topRated: false })}>Reset</button>}
            </div>
            {[
              ['inStock', 'Stok tersedia saja'],
              ['discounted', 'Sedang ada diskon'],
              ['topRated', 'Rating 4,8 ke atas'],
            ].map(([name, label]) => (
              <label className="product-option filter-option" key={name}>
                <span>{label}</span>
                <input type="checkbox" checked={filters[name]} onChange={() => toggleFilter(name)} />
              </label>
            ))}
            <button type="button" className="btn product-done" onClick={() => setPanel(null)}>Tampilkan {shown.length} produk</button>
          </section>
        )}
      </div>
      <main className="scroll list">
        {!shown.length && (
          <StateView
            art="search"
            title="Barang Tidak Ditemukan"
            text={key
              ? `Kami tidak menemukan hasil untuk "${q.trim()}". Periksa ejaan atau buat request titipan bebas untuk barang ini.`
              : 'Tidak ada produk yang cocok dengan kategori atau filter yang dipilih.'}
            actions={[
              ['Reset Pencarian & Filter', clearSearchAndFilters],
              ...(onRequestCustom ? [['Titip Bebas Barang Ini', onRequestCustom]] : []),
            ]}
          >
            <div className="sv-chips" aria-label="Coba cari">{SUGGEST.map((c) => <button key={c} onClick={() => setQ(c)}>{c}</button>)}</div>
          </StateView>
        )}
        {shown.map((p) => (
          <article className="row" key={p.id}>
            <button className="rimg" onClick={() => open(p)} aria-label={title(p)}>
              <span className="disc">-{p.disc}%</span>{ART[p.art]}
            </button>
            <div className="rinfo" onClick={() => open(p)}>
              <h4>{title(p)}</h4>
              <small style={{ color: 'var(--sky)', fontWeight: 600 }}>{p.justipper || p.store} · {p.rute || 'Purwokerto ⇄ Yogyakarta'}</small>
              <Stars v={p.rating} c={p.reviews} />
              <div className="pr"><b>{rp(p.price)}</b><s>{rp(p.old)}</s></div>
              <span className="pill">-{p.disc}%</span>
              {Number(p.stock ?? 99) <= 0 && <span className="stock-error">Stok habis</span>}
            </div>
            <button className={`fav ${fav[p.id] ? 'on' : ''}`} aria-label="Favorit" onClick={() => setFav({ ...fav, [p.id]: !fav[p.id] })}><Ic n="heart" size={18} filled={fav[p.id]} /></button>
          </article>
        ))}
        {shown.length > 0 && <small className="product-result-count">Menampilkan {shown.length} produk</small>}
      </main>
    </>
  );
}
