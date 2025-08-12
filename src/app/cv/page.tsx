'use client';

import { useState, useEffect } from 'react';

export default function CVPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [cvImages, setCvImages] = useState<string[]>([]);
  const [pdfExists, setPdfExists] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // CV resimlerini kontrol et
  useEffect(() => {
    const checkCvAssets = async () => {
      const imagePromises = [];
      const foundImages = [];
      
      // PNG dosyalarını kontrol et (cv-1.png, cv-2.png, cv-3.png şeklinde)
      for (let i = 1; i <= 5; i++) {
        try {
          const response = await fetch(`/cv-${i}.png`, { method: 'HEAD' });
          if (response.ok) {
            foundImages.push(`/cv-${i}.png`);
          }
        } catch (error) {
          // Bu sayfa bulunamadı, devam et
        }
      }
      
      // Eğer sayfalı PNG yoksa, tek PNG dosyasını kontrol et
      if (foundImages.length === 0) {
        try {
          const response = await fetch('/cv.png', { method: 'HEAD' });
          if (response.ok) {
            foundImages.push('/cv.png');
          }
        } catch (error) {
          console.error('PNG kontrolü başarısız:', error);
        }
      }
      
      // PDF'i de kontrol et
      try {
        const pdfResponse = await fetch('/cv.pdf', { method: 'HEAD' });
        setPdfExists(pdfResponse.ok);
      } catch (error) {
        setPdfExists(false);
      }
      
      setCvImages(foundImages);
      setImagesLoaded(true);
    };
    
    checkCvAssets();
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    
    if (pdfExists) {
      // PDF varsa onu indir
      const link = document.createElement('a');
      link.href = '/cv.pdf';
      link.download = 'Arda_Aras_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // PNG'leri zip olarak indirebiliriz (basit implementasyon için sadece ilk resmi indir)
      const link = document.createElement('a');
      link.href = cvImages[0];
      link.download = 'Arda_Aras_CV.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  const handlePrint = () => {
    if (pdfExists) {
      window.open('/cv.pdf', '_blank');
    } else {
      // Resimleri yazdırma için yeni pencerede aç
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Arda Aras CV</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                img { max-width: 100%; height: auto; margin-bottom: 20px; page-break-after: always; }
                @media print { img { page-break-after: always; } }
              </style>
            </head>
            <body>
              ${cvImages.map(img => `<img src="${img}" alt="CV Sayfası" />`).join('')}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const renderCvContent = () => {
    if (!imagesLoaded) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '500px',
          color: '#666'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>📄</div>
          <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>CV Yükleniyor...</h3>
          <p>Lütfen bekleyiniz...</p>
        </div>
      );
    }

    if (cvImages.length === 0) {
      return (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          background: '#f8f9fa',
          borderRadius: '10px',
          border: '2px dashed #ddd',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>CV Dosyaları Bulunamadı</h2>
          <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
            CV görüntüleri bulunamadı. Aşağıdaki dosya formatlarından birini <code>/public/</code> klasörüne ekleyin:
          </p>
          
          <div style={{ 
            background: '#f1f3f4', 
            padding: '1.5rem', 
            borderRadius: '10px', 
            marginBottom: '2rem',
            textAlign: 'left',
            maxWidth: '500px',
            margin: '0 auto 2rem auto'
          }}>
            <h4 style={{ color: '#1a1a2e', marginBottom: '1rem' }}>💡 Desteklenen Formatlar:</h4>
            <ul style={{ color: '#555', paddingLeft: '1.5rem' }}>
              <li><strong>Çoklu Sayfa:</strong> <code>cv-1.png, cv-2.png, cv-3.png</code></li>
              <li><strong>Tek Dosya:</strong> <code>cv.png</code></li>
              <li><strong>PDF (Yedek):</strong> <code>cv.pdf</code></li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              🔄 Yeniden Kontrol Et
            </button>
            
            {pdfExists && (
              <a
                href="/cv.pdf"
                target="_blank"
                style={{
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  color: 'white',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                }}
              >
                📄 PDF Olarak Görüntüle
              </a>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{ 
        background: 'white',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        {/* CV Başlığı */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            Arda Aras - Özgeçmiş
          </h2>
          <p style={{ color: '#b0bec5', margin: '0.5rem 0 0 0' }}>
            {cvImages.length > 1 ? `${cvImages.length} Sayfa` : '1 Sayfa'} • PNG Format
          </p>
        </div>

        {/* CV Resimleri */}
        <div style={{ 
          padding: '2rem',
          maxHeight: '1200px',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa'
        }}>
          {cvImages.map((imageSrc, index) => (
            <div 
              key={index}
              style={{ 
                marginBottom: index < cvImages.length - 1 ? '2rem' : '0',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Sayfa Numarası */}
              {cvImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(100, 181, 246, 0.9)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  zIndex: 10,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                  Sayfa {index + 1}
                </div>
              )}
              
              <img
                src={imageSrc}
                alt={`CV Sayfası ${index + 1}`}
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  height: 'auto',
                  borderRadius: '10px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e9ecef',
                  transition: 'transform 0.3s ease',
                  cursor: 'zoom-in'
                }}
                onClick={() => {
                  // Resmi yeni sekmede tam boyut aç
                  window.open(imageSrc, '_blank');
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLImageElement).style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLImageElement).style.transform = 'scale(1)';
                }}
                loading="lazy"
              />
              
              {/* Yakınlaştırma ipucu */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '0.3rem 0.8rem',
                borderRadius: '15px',
                fontSize: '0.8rem',
                opacity: 0.8
              }}>
                🔍 Yakınlaştırmak için tıklayın
              </div>
            </div>
          ))}
        </div>

        {/* Alt Bilgi */}
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem 2rem',
          borderTop: '1px solid #e9ecef',
          textAlign: 'center',
          color: '#666'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            💡 <strong>İpucu:</strong> Resimleri tam boyutta görmek için üzerine tıklayın. 
            PDF formatında indirmek için yukarıdaki "PDF İndir" butonunu kullanın.
          </p>
        </div>
      </div>
    );
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
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
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

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
            }}
          >
           CV Görüntüle
          </h1>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
             Yazdır/Aç
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
              {isDownloading ? 'İndiriliyor...' : 'İndir'}
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {renderCvContent()}
      </div>

      {/* Animasyon */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          header > div {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}