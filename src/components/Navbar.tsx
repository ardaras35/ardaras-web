'use client'; 

import Link from 'next/link'; 

export default function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',            
        justifyContent: 'space-between', 
        padding: '1rem 2rem',        
        backgroundColor: 'grey'   
      }}
    >
      <div>
        <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Arda Aras
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/about">Hakkımda</Link>
        <Link href="/projects">Projeler</Link>
        <Link href="/technologies">Teknolojiler</Link>
        <Link href="/contact">İletişim</Link>
      </div>
    </nav>
  );
}
