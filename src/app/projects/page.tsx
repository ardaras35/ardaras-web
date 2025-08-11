'use client';

import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants } from "framer-motion";
import { useEffect, useState, Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 3D Gezegen Component'i (Texture'lı)
function Planet({ 
  texture,
  position, 
  size = 1, 
  rotationSpeed = 0.01,
  orbitSpeed = 0,
  distance = 0,
  emissive = false
}: {
  texture: string;
  position: [number, number, number];
  size?: number;
  rotationSpeed?: number;
  orbitSpeed?: number;
  distance?: number;
  emissive?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [colorMap] = useLoader(TextureLoader, [texture]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Kendi ekseni etrafında dön
      meshRef.current.rotation.y += rotationSpeed;
      
      // Güneş etrafında dön (orbit)
      if (orbitSpeed > 0) {
        const time = state.clock.getElapsedTime() * orbitSpeed;
        meshRef.current.position.x = Math.cos(time) * distance;
        meshRef.current.position.z = Math.sin(time) * distance;
      }
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <meshStandardMaterial 
        map={colorMap} 
        emissive={emissive ? "#000033" : "#000000"}
        emissiveMap={emissive ? colorMap : undefined}
        emissiveIntensity={emissive ? 0.2 : 0}
      />
    </Sphere>
  );
}

// Gerçek zamanlı Dünya component'i
function EarthPlanet({ position, size, rotationSpeed, orbitSpeed, distance }: {
  position: [number, number, number];
  size: number;
  rotationSpeed: number;
  orbitSpeed: number;
  distance: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  
  // Gerçek zamanlı saat güncelleme
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000); // Her dakika kontrol et
    return () => clearInterval(interval);
  }, []);

  // Gece/Gündüz texture seçimi
  const isNight = currentHour < 6 || currentHour >= 18;
  
  const earthTexture = isNight 
    ? "/textures/earth-night.jpg"
    : "/textures/earth-day.jpg";
    
  const [colorMap] = useLoader(TextureLoader, [earthTexture]);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      
      if (orbitSpeed > 0) {
        const time = state.clock.getElapsedTime() * orbitSpeed;
        meshRef.current.position.x = Math.cos(time) * distance;
        meshRef.current.position.z = Math.sin(time) * distance;
      }
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <meshStandardMaterial 
        map={colorMap}
        emissive={isNight ? "#001122" : "#000000"}
        emissiveIntensity={isNight ? 0.15 : 0}
      />
    </Sphere>
  );
}

// 3D Güneş Sistemi
function SolarSystem({ scrollY }: { scrollY: any }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Scroll ile kamera hareketi
  const cameraZ = useTransform(scrollY, [0, 4000], [10, -50]);
  const cameraX = useTransform(scrollY, [0, 2000, 4000], [0, 15, -10]);
  
  useFrame((state) => {
    if (groupRef.current) {
      state.camera.position.z = cameraZ.get();
      state.camera.position.x = cameraX.get();
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Güneş */}
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#FDB813" />
        <pointLight intensity={1.5} />
      </Sphere>

      {/* Dünya (Gerçek zamanlı gece/gündüz) */}
      <EarthPlanet
        position={[8, 0, 0]}
        size={1}
        rotationSpeed={0.01}
        orbitSpeed={0.001}
        distance={8}
      />

      {/* Ay */}
      <Planet
        texture="/textures/moon.jpg"
        position={[10, 0, 0]}
        size={0.3}
        rotationSpeed={0.02}
        orbitSpeed={0.01}
        distance={2}
      />

      {/* Mars */}
      <Planet
        texture="/textures/mars.jpg"
        position={[15, 0, 0]}
        size={0.8}
        rotationSpeed={0.015}
        orbitSpeed={0.0007}
        distance={15}
      />

      {/* Jüpiter */}
      <Planet
        texture="/textures/jupiter.jpg"
        position={[25, 0, 0]}
        size={3}
        rotationSpeed={0.02}
        orbitSpeed={0.0003}
        distance={25}
      />

      {/* Neptün */}
      <Planet
        texture="/textures/neptune.jpg"
        position={[35, 0, 0]}
        size={1.5}
        rotationSpeed={0.018}
        orbitSpeed={0.0001}
        distance={35}
        emissive={true}
      />

      {/* Yıldızlar */}
      <Stars />
    </group>
  );
}

// Yıldız sistemi
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (starsRef.current) {
      const positions = new Float32Array(5000 * 3);
      for (let i = 0; i < 5000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      }
      starsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry />
      <pointsMaterial color="white" size={2} />
    </points>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse takip efekti
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Arka plan renk geçişi
  const bgColor = useTransform(
    scrollY,
    [0, 1000, 2000, 3000, 4000],
    [
      'radial-gradient(ellipse at center, #0f1419 0%, #000 70%)',
      'radial-gradient(ellipse at center, #1a0000 0%, #000 70%)', 
      'radial-gradient(ellipse at center, #2a1a00 0%, #000 70%)',
      'radial-gradient(ellipse at center, #001a3a 0%, #000 70%)',
      'radial-gradient(ellipse at center, #000011 0%, #000 100%)'
    ]
  );

  // Harfler animasyonu
  const letterVariants: Variants = {
    hidden: { 
      x: 300, 
      opacity: 0, 
      rotate: 90
    },
    visible: (i: number = 0) => ({
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        delay: 0.5 + i * 0.15,
        duration: 0.9,
        type: "spring" as const,
        stiffness: 80,
        damping: 12
      }
    })
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 3D Canvas Arka Plan */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <SolarSystem scrollY={scrollY} />
          </Suspense>
        </Canvas>
      </div>

      {/* Animasyonlu arka plan overlay */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: bgColor,
          zIndex: -1,
          opacity: 0.7
        }}
      />

      {/* Mouse takip efekti (Kuyruklu yıldız) */}
      <motion.div
        style={{
          position: 'fixed',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'white',
          pointerEvents: 'none',
          zIndex: 100,
          boxShadow: '0 0 20px white',
        }}
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Ana Sayfa İçeriği */}
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span 
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '500',
              marginBottom: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            🚀 Gerçek Zamanlı 3D Güneş Sistemi
          </span>
        </motion.div>

        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>
          Merhaba, ben{' '}
          <span style={{ color: '#00d4ff' }}>
            {/* ARDA */}
            {['A', 'r', 'd', 'a'].map((letter, index) => (
              <motion.span
                key={`arda-${index}`}
                custom={index}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'inline-block' }}
              >
                {letter}
              </motion.span>
            ))}
            {' '}
            {/* ARAS */}
            {['A', 'r', 'a', 's'].map((letter, index) => (
              <motion.span
                key={`aras-${index}`}
                custom={index + 4}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'inline-block' }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p 
          style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2rem'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          Frontend Geliştirici • React, Next.js, TypeScript
        </motion.p>

        <motion.button
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(135deg, #00d4ff, #0070f3)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0, 212, 255, 0.3)',
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 15px 40px rgba(0, 212, 255, 0.5)',
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          onClick={() => {
            // Scroll ile projeler bölümüne git
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
              projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          🌌 3D Uzay Yolculuğuna Başla
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center'
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            y: [0, 10, 0], 
            opacity: 1 
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity },
            opacity: { delay: 3, duration: 0.8 }
          }}
        >
          <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Gerçek Zamanlı Güneş Sistemi - {new Date().getHours() < 6 || new Date().getHours() >= 18 ? '🌙 Gece Modu' : '☀️ Gündüz Modu'}
          </div>
          <div style={{ fontSize: '1.5rem' }}>↓</div>
        </motion.div>
      </main>

      {/* Hakkımda Bölümü */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '800px', textAlign: 'center' }}>
          <motion.h2 
            style={{ fontSize: '3rem', marginBottom: '2rem', color: '#ff6b47' }}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            🔴 Mars İstasyonu - Hakkımda
          </motion.h2>
          <motion.p 
            style={{ fontSize: '1.3rem', lineHeight: '1.8', marginBottom: '2rem' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Frontend geliştirme dünyasında 3+ yıllık deneyim. Modern web teknolojileri ile kullanıcı deneyimini ön planda tutan, performanslı uygulamalar geliştiriyorum.
          </motion.p>
          <motion.div 
            style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {['React', 'Next.js', 'TypeScript', 'Three.js'].map((skill) => (
              <div key={skill} style={{
                padding: '0.8rem 1.5rem',
                background: 'rgba(255, 107, 71, 0.2)',
                borderRadius: '25px',
                border: '1px solid rgba(255, 107, 71, 0.4)',
                backdropFilter: 'blur(10px)'
              }}>
                {skill}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projeler Bölümü (Jüpiter) */}
      <section id="projects" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1000px', textAlign: 'center' }}>
          <motion.h2 
            style={{ fontSize: '3rem', marginBottom: '3rem', color: '#f39c12' }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            🪐 Jüpiter Sistemi - Projelerim
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'E-Ticaret Platformu', tech: 'React + Node.js', desc: 'Modern e-ticaret çözümü' },
              { title: 'Dashboard App', tech: 'Next.js + TypeScript', desc: 'Admin panel uygulaması' },
              { title: '3D Portfolio Website', tech: 'Next.js + Three.js', desc: 'Bu site!' }
            ].map((project, index) => (
              <motion.div
                key={project.title}
                style={{
                  padding: '2rem',
                  background: 'rgba(243, 156, 18, 0.1)',
                  borderRadius: '20px',
                  border: '1px solid rgba(243, 156, 18, 0.3)',
                  backdropFilter: 'blur(15px)',
                }}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f39c12' }}>
                  {project.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                  {project.desc}
                </p>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#f39c12',
                  padding: '0.3rem 0.8rem',
                  background: 'rgba(243, 156, 18, 0.2)',
                  borderRadius: '15px'
                }}>
                  {project.tech}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* İletişim Bölümü (Neptün) */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <motion.h2 
            style={{ fontSize: '3rem', marginBottom: '2rem', color: '#3742fa' }}
            initial={{ opacity: 0, rotate: -180 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1 }}
          >
            🔵 Neptün - İletişim
          </motion.h2>
          <motion.p 
            style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Uzay yolculuğu sona erdi! Benimle iletişime geçmek için:
          </motion.p>
          <motion.div 
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <a href="mailto:arda@example.com" style={{
              padding: '1rem 2rem',
              background: 'rgba(55, 66, 250, 0.2)',
              borderRadius: '50px',
              border: '1px solid rgba(55, 66, 250, 0.4)',
              color: 'white',
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              📧 arda@example.com
            </a>
            <a href="https://linkedin.com" style={{
              padding: '1rem 2rem',
              background: 'rgba(55, 66, 250, 0.2)',
              borderRadius: '50px',
              border: '1px solid rgba(55, 66, 250, 0.4)',
              color: 'white',
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              💼 LinkedIn
            </a>
            <a href="https://github.com" style={{
              padding: '1rem 2rem',
              background: 'rgba(55, 66, 250, 0.2)',
              borderRadius: '50px',
              border: '1px solid rgba(55, 66, 250, 0.4)',
              color: 'white',
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              🐙 GitHub
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}