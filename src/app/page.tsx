'use client';

import { useRouter } from 'next/navigation'; // yönlendirme yapmak için hook

export default function HomePage() {
  const router = useRouter(); // router nesnesini oluştur

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Merhaba, ben <span style={{ color: '#0070f3' }}>Arda Aras</span>
      </h1>

      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        Frontend geliştirici • React, Next.js, TypeScript
      </p>

      <button
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#0070f3',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => router.push('./projects')} // yönlendirme burada yapılır
      >
        Projelere Göz At
      </button>
    </main>
  );
}
