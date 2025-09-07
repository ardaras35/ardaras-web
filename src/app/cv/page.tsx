'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Lang = 'tr' | 'en';

export default function CVPage() {
  const [lang, setLang] = useState<Lang>('tr');
  const router = useRouter();

  // PNG sayfaları (public klasörü altında olduğundan emin ol)
  const cvImages: Record<Lang, string[]> = {
    tr: ['/cv-tr-1.png', '/cv-tr-2.png'],
    en: ['/cv-en-1.png', '/cv-en-2.png'],
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white' }}>
      {/* Üst kısım */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(10,10,10,0.95)',
          borderBottom: '1px solid rgba(100,181,246,0.2)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Sol üstte geri butonu */}
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push('/'); // fallback olarak ana sayfaya yönlendir
            }
          }}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '1rem',
            padding: '0.4rem 0.8rem',
            borderRadius: 6,
            border: '1px solid #64b5f6',
            background: 'transparent',
            color: '#64b5f6',
            cursor: 'pointer',
          }}
        >
          ← Geri
        </button>

        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg,#64b5f6,#42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}
        >
          CV
        </h1>

        {/* Dil butonları */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setLang('tr')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: lang === 'tr' ? '2px solid #64b5f6' : '1px solid #64b5f6',
              background: lang === 'tr' ? 'rgba(100,181,246,0.2)' : 'transparent',
              color: '#64b5f6',
              cursor: 'pointer',
            }}
          >
            Türkçe
          </button>
          <button
            onClick={() => setLang('en')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: lang === 'en' ? '2px solid #64b5f6' : '1px solid #64b5f6',
              background: lang === 'en' ? 'rgba(100,181,246,0.2)' : 'transparent',
              color: '#64b5f6',
              cursor: 'pointer',
            }}
          >
            English
          </button>
        </div>
      </header>

      {/* CV içerik */}
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {cvImages[lang].map((src, i) => (
          <div
            key={i}
            style={{
              marginBottom: '2rem',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {cvImages[lang].length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(100,181,246,0.9)',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                }}
              >
                Sayfa {i + 1}
              </div>
            )}
            <img
              src={src}
              alt={`CV ${lang.toUpperCase()} - Sayfa ${i + 1}`}
              style={{
                width: '100%',
                maxWidth: 800,
                borderRadius: 10,
                cursor: 'zoom-in',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              onClick={() => window.open(src, '_blank')}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
