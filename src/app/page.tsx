'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import TechColumnsBackground from '@/components/TechColumnsBackground';

type Particle = {
  width: number;
  height: number;
  left: number;
  top: number;
  duration: number;
  opacity: number;
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] =
    useState<'home' | 'about' | 'projects' | 'contact'>('home');

  // Partiküller: sadece client mount sonrası üret (SSR ile uyumlu)
  const particlesRef = useRef<Particle[] | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (mounted && !particlesRef.current) {
    particlesRef.current = Array.from({ length: 20 }, () => ({
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 5,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }

  const scrollToSection = (sectionId: 'home' | 'about' | 'projects' | 'contact') => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Aktif menü sekmesi
  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'contact'] as const;
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(id)),
        { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white', overflow: 'hidden' }}>
      {/* Sabit, gradient arka plan + partiküller */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0a0a0a 100%)',
          zIndex: -2,
        }}
      >
        {mounted &&
          particlesRef.current?.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${p.width}px`,
                height: `${p.height}px`,
                backgroundColor: '#64b5f6',
                borderRadius: '50%',
                left: `${p.left}%`,
                top: `${p.top}%`,
                animation: `float ${p.duration}s infinite ease-in-out`,
                opacity: p.opacity,
              }}
            />
          ))}
      </div>

      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: scrollY > 50 ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
          borderBottom: scrollY > 50 ? '1px solid rgba(100, 181, 246, 0.2)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Sol: Logo + İsim */}
          <button
            onClick={() => scrollToSection('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            aria-label="Ana sayfaya dön"
          >
            <Image
              src="/logo.png" // /public/logo.png
              alt="Arda Aras Logo"
              width={40}
              height={40}
              priority
              style={{ borderRadius: 8 }}
            />
            <span
              style={{
                fontSize: '1.6rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}
            >
              Arda Aras
            </span>
          </button>

          {/* Menü */}
          <nav style={{ display: 'flex', gap: '2.5rem' }}>
            {(['home', 'about', 'projects', 'contact'] as const).map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === section ? '#64b5f6' : '#ccc',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '0.5rem 0',
                  transition: 'color 0.3s ease',
                  textTransform: 'capitalize',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#64b5f6')}
                onMouseLeave={(e) => (e.currentTarget.style.color = activeSection === section ? '#64b5f6' : '#ccc')}
              >
                {section === 'home'
                  ? 'Ana Sayfa'
                  : section === 'about'
                  ? 'Hakkımda'
                  : section === 'projects'
                  ? 'Projeler'
                  : 'İletişim'}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === section ? '100%' : '0%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #64b5f6, #42a5f5)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '0 2rem',
          position: 'relative',
          overflow: 'hidden', // arka plan taşmalarını gizle
        }}
      >
        {/* Arka plan: hareketli teknoloji kolonları */}
        <TechColumnsBackground />

        {/* Ön plan içerik */}
        <div style={{ textAlign: 'center', maxWidth: '800px', zIndex: 1, position: 'relative' }}>
          <div style={{ fontSize: '1.2rem', color: '#64b5f6', marginBottom: '1rem', opacity: 0.9 }}>
            👋 Merhaba, ben
          </div>

          <h2
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff, #64b5f6, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2',
            }}
          >
            Arda Aras
          </h2>

          <p style={{ fontSize: '1.4rem', color: '#b0bec5', marginBottom: '3rem', lineHeight: '1.6' }}>
            Frontend Developer • React, Next.js, TypeScript ile
            <br />
            kullanıcı deneyimini ön planda tutan web uygulamaları geliştiriyorum
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollToSection('projects')}
              style={{
                background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                color: 'white',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(100, 181, 246, 0.3)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(100, 181, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(100, 181, 246, 0.3)';
              }}
            >
              🚀 Projelerimi İncele
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              style={{
                background: 'transparent',
                color: '#64b5f6',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                border: '2px solid #64b5f6',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#64b5f6';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#64b5f6';
              }}
            >
              💬 İletişim
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
          }}
        >
          <div style={{ fontSize: '0.9rem', color: '#64b5f6', marginBottom: '0.5rem' }}>Aşağı kaydır</div>
          <div style={{ fontSize: '1.5rem', color: '#64b5f6' }}>↓</div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        style={{
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8))',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h3
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🧑‍💻 Hakkımda
          </h3>
          <p style={{ fontSize: '1.3rem', color: '#b0bec5', lineHeight: '1.8', marginBottom: '3rem' }}>
            Frontend geliştirme alanında 3+ yıllık deneyime sahip, kullanıcı deneyimini ön planda tutan modern web
            uygulamaları geliştiren bir yazılımcıyım. Clean code yazmayı seven, sürekli öğrenmeye açık bir geliştiriciyim.
          </p>
          <p>Bu site React ve Next.js teknolojileri kullanılarak geliştirildi.</p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem',
            }}
          >
            {[
              { name: 'React Native', icon: '⚛️', level: '90%' },
              { name: 'React', icon: '🔥', level: '85%' },
              { name: 'TypeScript', icon: '📘', level: '80%' },
              { name: 'JavaScript', icon: '💛', level: '90%' },
              { name: 'SQL', icon: '🗄️', level: '90%' },
              { name: 'Python', icon: '🐍', level: '55%' },
              { name: 'Node.js', icon: '🟢', level: '20%' },
              { name: 'Next.js', icon: '⚡️', level: '75%' },
            ].map((skill, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(100, 181, 246, 0.1)',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  border: '1px solid rgba(100, 181, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0px)')}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{skill.icon}</div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{skill.name}</h4>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(100, 181, 246, 0.2)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: skill.level,
                      height: '100%',
                      background: 'linear-gradient(90deg, #64b5f6, #42a5f5)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: '6rem 2rem', background: 'rgba(10, 10, 10, 0.8)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '4rem',
              background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🚀 Projelerim
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: 'E-Ticaret Platformu',
                desc: 'Modern React ve Node.js ile geliştirilmiş tam özellikli e-ticaret sitesi',
                tech: ['React', 'Node.js', 'MongoDB'],
                gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
              },
              {
                title: 'Portfolio Website',
                desc: 'Next.js ve TypeScript ile geliştirilmiş responsive portfolio sitesi',
                tech: ['Next.js', 'TypeScript', 'CSS'],
                gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
              },
              {
                title: 'Task Management App',
                desc: 'React ve Firebase ile real-time görev yönetim uygulaması',
                tech: ['React', 'Firebase', 'CSS'],
                gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
              },
            ].map((project, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(100, 181, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.transform = 'translateY(-10px)';
                  target.style.boxShadow = '0 20px 40px rgba(100, 181, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.transform = 'translateY(0px)';
                  target.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    background: project.gradient,
                    borderRadius: '15px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  💻
                </div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#64b5f6' }}>{project.title}</h4>
                <p style={{ color: '#b0bec5', marginBottom: '1.5rem', lineHeight: '1.6' }}>{project.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {project.tech.map((tech, j) => (
                    <span
                      key={j}
                      style={{
                        background: 'rgba(100, 181, 246, 0.2)',
                        color: '#64b5f6',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.9rem',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        style={{
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8))',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h3
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            📞 İletişim
          </h3>
          <p style={{ fontSize: '1.25rem', color: '#b0bec5', marginBottom: '3rem', lineHeight: '1.6' }}>
            Projeleriniz için benimle iletişime geçebilirsiniz. Her zaman yeni fırsatlara açığım!
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'center',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            {[
              { label: '📧 Email', href: 'mailto:arda@example.com', text: 'arda@example.com' },
              { label: '💼 LinkedIn', href: '#', text: 'LinkedIn Profilim' },
              { label: '🐙 GitHub', href: '#', text: 'GitHub Profilim' },
            ].map((contact, i) => (
              <a
                key={i}
                href={contact.href}
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(100, 181, 246, 0.1)',
                  color: '#64b5f6',
                  textDecoration: 'none',
                  borderRadius: '15px',
                  border: '2px solid rgba(100, 181, 246, 0.3)',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#64b5f6';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(100, 181, 246, 0.1)';
                  e.currentTarget.style.color = '#64b5f6';
                  e.currentTarget.style.transform = 'translateY(0px)';
                }}
              >
                <div style={{ fontWeight: '600' }}>{contact.label}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{contact.text}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(100, 181, 246, 0.2)',
          background: 'rgba(10, 10, 10, 0.9)',
        }}
      >
        <p style={{ color: '#64b5f6', fontSize: '0.9rem' }}>© 2025 Arda Aras. Tüm hakları saklıdır.</p>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-10px) translateX(-50%);
          }
          60% {
            transform: translateY(-5px) translateX(-50%);
          }
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}
