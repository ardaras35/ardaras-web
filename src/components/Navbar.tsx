'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', // dikey ortalama
        padding: '1rem 2rem',
        backgroundColor: 'grey',
      }}
    >

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src="/logo.png" 
            alt="Logo"
            width={40}
            height={40}
          />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
            Portfolyo
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/about" style={{ color: 'white' }}>Hakkımda</Link>
        <Link href="/projects" style={{ color: 'white' }}>Projeler</Link>
        <Link href="/technologies" style={{ color: 'white' }}>Teknolojiler</Link>
        <Link href="/contact" style={{ color: 'white' }}>İletişim</Link>
      </div>
    </nav>
  );
}
