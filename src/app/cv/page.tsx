'use client';

import { useState } from 'react';

export default function CVPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      console.log('CV indiriliyor...');
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(100, 181, 246, 0.2)',
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
          {/* Sol: Geri dön butonu */}
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#64b5f6',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(100, 181, 246, 0.3)',
            }}
          >
            <span>←</span>
            Ana Sayfaya Dön
          </a>

          {/* Orta: Başlık */}
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            📄 CV Görüntüle
          </h1>

          {/* Sağ: Aksiyon butonları */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'transparent',
                color: '#64b5f6',
                border: '2px solid rgba(100, 181, 246, 0.4)',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
              }}
            >
              🖨️ Yazdır
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              style={{
                background: isDownloading 
                  ? 'rgba(100, 181, 246, 0.5)' 
                  : 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
              }}
            >
              {isDownloading ? '⏳ İndiriliyor...' : '💾 PDF İndir'}
            </button>
          </div>
        </div>
      </header>

      {/* CV Container */}
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            background: 'white',
            color: '#333',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            minHeight: '1400px',
          }}
        >
          {/* CV Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              color: 'white',
              padding: '3rem 3rem 2rem 3rem',
              position: 'relative',
            }}
          >
            {/* Profil Fotoğrafı */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  boxShadow: '0 10px 30px rgba(100, 181, 246, 0.3)',
                }}
              >
                👨‍💻
              </div>
              
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Arda Aras
                </h1>
                <h2 style={{ fontSize: '1.3rem', color: '#64b5f6', marginBottom: '1rem', fontWeight: '400' }}>
                  Graduate in Computer Programming
                </h2>
                <p style={{ color: '#b0bec5', lineHeight: '1.6', fontSize: '1rem' }}>
                  I am a responsible, adaptable, and eager-to-learn individual. Through my experiences in 
                  various sectors, I have developed strong skills in communication, teamwork, customer 
                  relations, and problem-solving. I value continuous learning and personal development.
                </p>
                <div style={{ marginTop: '1rem', color: '#64b5f6', fontSize: '0.9rem' }}>
                  <strong>Born:</strong> 02/08/2004 • <strong>Website:</strong> ardaras.com
                </div>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '📧', label: 'Email', value: 'aardarass35@gmail.com' },
                { icon: '📧', label: 'Alt Email', value: 'prx.arda@gmail.com' },
                { icon: '📱', label: 'Telefon', value: '0530 890 17 50' },
                { icon: '🌍', label: 'Konum', value: 'İzmir, Türkiye' },
                { icon: '💼', label: 'LinkedIn', value: '/Arda Aras' },
                { icon: '🐙', label: 'GitHub', value: '/ardaras35' },
              ].map((contact, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{contact.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64b5f6', fontWeight: '600' }}>
                      {contact.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#fff' }}>{contact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CV Content */}
          <div style={{ padding: '2.5rem 3rem' }}>
            {/* Deneyim */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a2e',
                  marginBottom: '1.5rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '3px solid #64b5f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                💼 Work Experience
              </h3>
              
              {[
                {
                  title: 'Software Developer Intern',
                  company: '35Inch Software Solutions',
                  period: 'July 2025 – August 2025',
                  location: 'İzmir',
                  description: 'Developed mobile applications using React Native, focusing on UI/UX and navigation architecture.',
                  achievements: [
                    'Developed a mobile application using React Native, focusing on UI/UX and navigation architecture',
                    'Collaborated with the development team to integrate frontend with backend APIs',
                    'Participated in code reviews and applied feedback to improve code quality and project structure',
                    'Gained hands-on experience with state management and cross-platform mobile development practices'
                  ]
                },
                {
                  title: 'Service Advisor',
                  company: 'LANDMER Auto Service',
                  period: 'June 2024 – Sept 2024',
                  location: 'İzmir',
                  description: 'Acted as the main point of contact between customers and the service team.',
                  achievements: [
                    'Assessed and advised clients on vehicle maintenance and repair needs',
                    'Scheduled service appointments and followed up on repairs to ensure customer satisfaction',
                    'Coordinated with technicians to communicate client requirements effectively'
                  ]
                },
                {
                  title: 'Founder',
                  company: 'LNX Software',
                  period: '2019 – 2022',
                  location: 'Istanbul',
                  description: 'Built and managed a Discord-based software service under the name LNX Software.',
                  achievements: [
                    'Developed and sold 500+ custom Discord bots using JavaScript',
                    'Handled customer support, licensing, and secure delivery of software',
                    'Designed automated systems for order management and user access'
                  ]
                }
              ].map((job, i) => (
                <div key={i} style={{ marginBottom: '2rem', paddingLeft: '1rem', borderLeft: '3px solid #64b5f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.2rem' }}>
                        {job.title}
                      </h4>
                      <div style={{ color: '#64b5f6', fontWeight: '600', fontSize: '1rem' }}>
                        {job.company} • {job.location}
                      </div>
                    </div>
                    <span style={{ color: '#666', fontSize: '0.9rem', backgroundColor: '#f5f5f5', padding: '0.3rem 0.8rem', borderRadius: '15px' }}>
                      {job.period}
                    </span>
                  </div>
                  <p style={{ color: '#555', marginBottom: '1rem', lineHeight: '1.6' }}>{job.description}</p>
                  <ul style={{ color: '#666', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
                    {job.achievements.map((achievement, j) => (
                      <li key={j} style={{ marginBottom: '0.3rem' }}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Eğitim */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a2e',
                  marginBottom: '1.5rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '3px solid #64b5f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🎓 Education
              </h3>
              
              <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #64b5f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.2rem' }}>
                      Computer Programming
                    </h4>
                    <div style={{ color: '#64b5f6', fontWeight: '600', fontSize: '1rem' }}>Ege University</div>
                  </div>
                  <span style={{ color: '#666', fontSize: '0.9rem', backgroundColor: '#f5f5f5', padding: '0.3rem 0.8rem', borderRadius: '15px' }}>
                    2023 – 2025
                  </span>
                </div>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Graduate in Computer Programming with focus on modern web technologies, 
                  database management, and software development principles.
                </p>
              </div>
            </section>

            {/* Teknik Yetenekler */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a2e',
                  marginBottom: '1.5rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '3px solid #64b5f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🛠️ Tech Stack
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {[
                  {
                    category: 'Programming Languages',
                    skills: [
                      { name: 'SQL', level: 'Mid' },
                      { name: 'TypeScript', level: 'Mid' },
                      { name: 'JavaScript', level: 'Mid' },
                      { name: 'C#', level: 'Basic' }
                    ]
                  },
                  {
                    category: 'Frontend Development',
                    skills: [
                      { name: 'React Native', level: 'Mid' },
                      { name: 'React', level: 'Mid' },
                      { name: 'Next.js', level: 'Mid' },
                      { name: 'HTML/CSS', level: 'Mid' }
                    ]
                  }
                ].map((group, i) => (
                  <div key={i}>
                    <h4 style={{ color: '#64b5f6', fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                      {group.category}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {group.skills.map((skill, j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              background: '#f8f9fa',
                              color: '#1a1a2e',
                              padding: '0.3rem 0.8rem',
                              borderRadius: '12px',
                              fontSize: '0.85rem',
                              border: '1px solid #e9ecef',
                              flex: 1,
                              marginRight: '0.5rem'
                            }}
                          >
                            {skill.name}
                          </span>
                          <span
                            style={{
                              fontSize: '0.8rem',
                              color: '#64b5f6',
                              fontWeight: '600'
                            }}
                          >
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Diller */}
            <section>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a2e',
                  marginBottom: '1.5rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '3px solid #64b5f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🌍 Languages
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { language: 'Turkish', level: 'Native', percentage: 100 },
                  { language: 'English', level: 'B2', percentage: 80 }
                ].map((lang, i) => (
                  <div key={i} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>{lang.language}</span>
                      <span style={{ color: '#64b5f6', fontSize: '0.9rem' }}>{lang.level}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${lang.percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #64b5f6, #42a5f5)',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          header {
            display: none !important;
          }
          
          main {
            background: white !important;
          }
          
          div[style*="padding: 2rem"] {
            padding: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}