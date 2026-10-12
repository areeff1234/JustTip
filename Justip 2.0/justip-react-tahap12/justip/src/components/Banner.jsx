import Logo from './Logo.jsx';

export default function Banner({ children, tall }) {
  return (
    <section className={`banner ${tall ? '' : 'big'}`}>
      <div className="cloud c1" /><div className="cloud c2" />
      <svg className="plane-b" viewBox="0 0 64 64" aria-hidden="true"><path d="M60 8c-2-2-6-1-9 2L38 23 12 14l-4 4 20 13-8 9-8-1-3 3 9 4 4 9 3-3-1-8 9-8 13 20 4-4-9-26 13-13c3-3 4-7 2-9z" /></svg>
      <Logo bg="#38BDF8" fg="#fff" className="b-logo" />
      <div className="b-text">{children}</div>
    </section>
  );
}
