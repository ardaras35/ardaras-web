'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  } as const;

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'grey',
      }}
    >
      {/* Logo ve başlık */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
        }}
      >
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
          Portfolyo
        </span>
      </Link>

      {/* Menü Linkleri */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {[
          { href: '/about', label: 'Hakkımda' },
          { href: '/projects', label: 'Projeler' },
          { href: '/technologies', label: 'Teknolojiler' },
          { href: '/contact', label: 'İletişim' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={linkStyle}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
