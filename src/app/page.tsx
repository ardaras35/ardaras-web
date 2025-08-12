'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
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
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>

      <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white', overflow: 'hidden' }}>
        {/* Arka plan */}
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
            >
              <Image
                src="/logo.png"
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

            <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
              {(['home', 'about', 'projects', 'contact'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeSection === section ? '#64b5f6' : '#ccc',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '0.5rem 0',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#64b5f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = activeSection === section ? '#64b5f6' : '#ccc')}
                >
                  {section === 'home' ? 'Ana Sayfa' : section === 'about' ? 'Hakkımda' : section === 'projects' ? 'Projeler' : 'İletişim'}
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
              
              <a
                href="/cv"
                style={{
                  background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 5px 15px rgba(100, 181, 246, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(100, 181, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(100, 181, 246, 0.3)';
                }}
              >
               CV
              </a>
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
            overflow: 'hidden',
          }}
        >
          <TechColumnsBackground />

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
              Jr. Full Stack Developer 
              <br />
              Güncel teknolojiler ile kullanıcı deneyimini ön planda tutan web/mobil uygulamaları geliştiriyorum.
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
                🚀 Projelerim
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
              Merhaba, Ben Arda. 21 yaşındayım. Ege Üniversitesi Bilgisayar Programcılığı mezunuyum.
              Kullanıcı odaklı, modern web/mobil uygulamalar geliştirmeye ilgili bir geliştiriciyim. 
              React, Next.js ve TypeScript gibi teknolojilerle projeler üretiyorum.
              Clean code yazmayı seven, sürekli öğrenmeye, öğrendiklerimi projelerimde uygulamaya açık bir geliştiriciyim.
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
        <section id="projects" style={{ padding: '6rem 2rem', background: 'rgba(10, 10, 10, 0.8)', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 20%, rgba(100, 181, 246, 0.1) 0%, transparent 70%)',
              zIndex: -1,
            }}
          />
          
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h3
                style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                🚀 Projelerim
              </h3>
              <p style={{ fontSize: '1.2rem', color: '#b0bec5', maxWidth: '600px', margin: '0 auto' }}>
                Modern teknolojiler kullanarak geliştirdiğim projeler. Kodlarına göz atabilirsiniz.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
              {[
                {
                  title: 'Yapay Zeka ile Video Düzenleme Aracı',
                  desc: 'React Native ile geliştirilmiş bir video düzenleme aracı. Videonuzda durduğunuz, takıldığınız, yerleri otomatik tespit edip silen bir uygulama.',
                  tech: ['React Native', 'TensorFlow.js', 'FFmpeg'],
                  gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  icon: '🎬',
                  github: 'https://github.com/ardaras35/portfolio-nextjs',
                  features: ['Ses ve görüntü işleme', 'Kullanıcı dostu arayüz', 'Gerçek zamanlı önizleme'],
                  status: 'Geliştiriliyor',
                  year: '2024'
                },
                {
                  title: 'Nöbetçi Öğretmen Görüntüleme Uygulaması',
                  desc: 'React Native ile geliştirilmiş öğretmenlerin nöbet durumlarını görüntüleyebileceği kullanıcı dostu mobil uygulama.',
                  tech: ['React Native'],
                  gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  icon: '📋',
                  github: 'https://github.com/ardaras35/react-native-nobetproje',
                  features: ['Real-time sync', 'Kullanıcı dostu arayüz', 'Görev yönetimi'],
                  status: 'Tamamlandı',
                  year: '2025'
                },
              ].map((project, i) => (
                <div
                  key={i}
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.8))',
                    borderRadius: '25px',
                    border: '1px solid rgba(100, 181, 246, 0.2)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.4s ease',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-15px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(100, 181, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <div style={{ padding: '2rem 2rem 1rem 2rem', position: 'relative', flex: 1 }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        padding: '0.3rem 0.8rem',
                        background: project.status === 'Tamamlandı' 
                          ? 'linear-gradient(90deg, #4caf50, #45a049)' 
                          : 'linear-gradient(90deg, #ff9800, #f57c00)',
                        color: 'white',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      {project.status}
                    </div>

                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        background: project.gradient,
                        borderRadius: '20px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        boxShadow: '0 10px 25px rgba(100, 181, 246, 0.3)',
                      }}
                    >
                      {project.icon}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.6rem', color: '#64b5f6', fontWeight: '700', margin: 0 }}>
                        {project.title}
                      </h4>
                      <span style={{ color: '#64b5f6', fontSize: '0.9rem', opacity: 0.7 }}>
                        {project.year}
                      </span>
                    </div>

                    <p style={{ color: '#b0bec5', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                      {project.desc}
                    </p>

                    <div style={{ marginBottom: '2rem' }}>
                      <h5 style={{ color: '#64b5f6', fontSize: '0.9rem', marginBottom: '0.8rem', fontWeight: '600' }}>
                        ✨ Özellikler
                      </h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {project.features.map((feature, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '4px', height: '4px', background: '#64b5f6', borderRadius: '50%' }} />
                            <span style={{ color: '#b0bec5', fontSize: '0.85rem' }}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                      {project.tech.map((tech, j) => (
                        <span
                          key={j}
                          style={{
                            background: 'rgba(100, 181, 246, 0.2)',
                            color: '#64b5f6',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            border: '1px solid rgba(100, 181, 246, 0.3)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '1.5rem 2rem 2rem 2rem',
                      background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.05), rgba(66, 165, 245, 0.05))',
                      borderTop: '1px solid rgba(100, 181, 246, 0.1)',
                      marginTop: 'auto',
                    }}
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #24292e, #1a1e22)',
                        color: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: '15px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.8rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                      }}
                    >
                      <span>💻</span>
                      {project.status === 'Geliştiriliyor' ? 'Gelişmeleri Takip Et' : 'GitHub\'da İncele'}
                    </a>

                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.8rem',
                        background: 'rgba(100, 181, 246, 0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(100, 181, 246, 0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem' }}>💡</span>
                        <span style={{ color: '#b0bec5', fontSize: '0.85rem' }}>
                          {project.status === 'Geliştiriliyor' 
                            ? 'Proje aktif olarak geliştirilmektedir.'
                            : 'GitHub\'da kaynak kodları ve daha fazla detay bulabilirsiniz.'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                textAlign: 'center',
                marginTop: '4rem',
                padding: '3rem 2rem',
                background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.1), rgba(66, 165, 245, 0.05))',
                borderRadius: '25px',
                border: '1px solid rgba(100, 181, 246, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h4
                style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                🎯 Daha Fazla Proje
              </h4>
              <p style={{ color: '#b0bec5', marginBottom: '2rem', fontSize: '1.1rem' }}>
                GitHub profilimde daha fazla proje ve açık kaynak katkılarımı keşfedebilirsiniz
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://github.com/ardaras35"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    background: 'linear-gradient(135deg, #24292e, #1a1e22)',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🐙</span>
                  GitHub Profilim
                </a>

                <a
                  href="/cv"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 25px rgba(100, 181, 246, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(100, 181, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(100, 181, 246, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📄</span>
                  CV 
                </a>
              </div>
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
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
              {[
                { label: '📧 E-posta', href: 'mailto:aardarass35@gmail.com', text: 'aardarass35@gmail.com' },
                { label: '🐙 GitHub', href: 'https://github.com/ardaras35', text: 'GitHub profilime erişin.' },
                { label: '📞 Whatsapp', href: 'https://wa.me/905308901750', text: 'Whatsapp üzerinden ulaşın.' },
                { label: '📄 CV Görüntüle', href: '/cv', text: 'Özgeçmişimi inceleyin.' },
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
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    display: 'block',
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
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
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
    </>
  );
}