// Logo Justip: tas belanja + huruf J + garis kecepatan (SVG, warna bisa diganti)
const BODY = 'M480 460H870Q915 460 922 510L968 880Q976 968 900 968H470Q383 968 385 885L417 540Q420 462 480 460Z';
const J = 'M735 532H815Q838 532 835 565L795 760Q770 915 625 916Q520 915 492 825Q488 800 505 797L550 768Q585 755 590 790Q592 818 620 818Q650 815 658 770L695 570Q700 535 735 532Z';

export default function Logo({ bg = '#38BDF8', fg = '#fff', animated = false, className = '' }) {
  return (
    <svg className={`logo ${animated ? 'logo-anim' : ''} ${className}`} viewBox="190 270 800 720" role="img" aria-label="Justip">
      <g className="l-bag">
        <path className="l-handle" d="M541 462A129 129 0 0 1 799 462" fill="none" stroke={fg} strokeWidth="63" />
        <path d={BODY} fill={fg} />
        <path className="l-j" d={J} fill={bg} />
      </g>
      <g fill={fg} stroke={bg} strokeWidth="16" paintOrder="stroke">
        <rect className="l-s l-s1" x="296" y="594" width="204" height="50" rx="25" />
        <rect className="l-s l-s2" x="203" y="676" width="265" height="46" rx="23" />
        <rect className="l-s l-s3" x="283" y="750" width="185" height="47" rx="23" />
      </g>
    </svg>
  );
}
