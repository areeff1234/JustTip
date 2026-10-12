import { useState, useEffect } from 'react';
import { Ic } from '../ui.jsx';

export default function AdminPinModal({ onSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  const press = (digit) => {
    if (err) setErr('');
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 6) {
        if (next === '123456') {
          setTimeout(() => onSuccess(), 200);
        } else {
          setTimeout(() => {
            setErr('PIN salah, silakan coba lagi');
            setPin('');
          }, 300);
        }
      }
    }
  };

  const del = () => {
    if (err) setErr('');
    setPin((p) => p.slice(0, -1));
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= '0' && e.key <= '9') press(e.key);
      else if (e.key === 'Backspace') del();
      else if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pin, err]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        animation: 'fade .2s ease both',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: '24px 20px',
          maxWidth: 320,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 12px',
          }}
        >
          <Ic n="shield" size={26} />
        </div>

        <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
          PIN Akses Admin & Dev
        </h3>
        <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
          Masukkan 6 digit PIN rahasia tim Bitforce untuk membuka portal.
        </p>

        {/* 6 Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '22px 0 10px' }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              style={{
                width: 13,
                height: 13,
                borderRadius: '50%',
                border: `2px solid ${err ? '#ef4444' : pin.length > i ? '#0284c7' : '#cbd5e1'}`,
                background: pin.length > i ? (err ? '#ef4444' : '#0284c7') : 'transparent',
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>

        {/* Error message */}
        <div style={{ minHeight: 18, margin: '4px 0 10px', fontSize: 11.5, fontWeight: 600, color: err ? '#ef4444' : 'transparent' }}>
          {err || 'placeholder'}
        </div>

        {/* Numeric Keypad Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 260, margin: '0 auto 14px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => press(String(n))}
              style={{
                height: 48,
                borderRadius: 14,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: 18,
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 48,
              borderRadius: 14,
              background: 'none',
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => press('0')}
            style={{
              height: 48,
              borderRadius: 14,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: 18,
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'pointer',
            }}
          >
            0
          </button>
          <button
            type="button"
            onClick={del}
            style={{
              height: 48,
              borderRadius: 14,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'grid',
              placeItems: 'center',
              color: '#64748b',
              cursor: 'pointer',
            }}
            aria-label="Hapus"
          >
            <Ic n="back" size={18} />
          </button>
        </div>

        <small style={{ fontSize: 10.5, color: '#94a3b8' }}>
          PIN Keamanan Tim Bitforce
        </small>
      </div>
    </div>
  );
}
