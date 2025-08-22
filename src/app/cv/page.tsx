'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Lang = 'tr' | 'en';

export default function CVPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const initialLang = (sp.get('lang') as Lang) || (typeof window !== 'undefined'
    ? ((localStorage.getItem('cv_lang') as Lang) || 'tr')
    : 'tr');

  const [lang, setLang] = useState<Lang>(initialLang);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cvImages, setCvImages] = useState<string[]>([]);
  const [pdfExists, setPdfExists] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // URL ve localStorage'ı seçilen dile göre güncelle
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('lang', lang);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    try { localStorage.setItem('cv_lang', lang); } catch {}
  }, [lang]);

  // Dil değişince asset’leri tekrar tara
  useEffect(() => {
    const checkCvAssets = async () => {
      const foundImages: string[] = [];

      // Çok sayfalı PNG: cv-<lang>-1.png ... cv-<lang>-5.png
      for (let i = 1; i <= 5; i++) {
        try {
          const url = `/cv-${lang}-${i}.png`;
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) foundImages.push(url);
        } catch {}
      }

      // Çoklu yoksa tek PNG dene: cv-<lang>.png
      if (foundImages.length === 0) {
        try {
          const single = `/cv-${lang}.png`;
          const res = await fetch(single, { method: 'HEAD' });
          if (res.ok) foundImages.push(single);
        } catch (e) {
          console.error('PNG kontrolü başarısız:', e);
        }
      }

      // PDF kontrol: cv-<lang>.pdf
      try {
        const pdfUrl = `/cv-${lang}.pdf`;
        const pdfRes = await fetch(pdfUrl, { method: 'HEAD' });
        setPdfExists(pdfRes.ok);
      } catch {
        setPdfExists(false);
      }

      setCvImages(foundImages);
      setImagesLoaded(true);
    };

    setImagesLoaded(false);
    setCvImages([]);
    setPdfExists(false);
    checkCvAssets();
  }, [lang]);

  const pdfHref = useMemo(() => `/cv-${lang}.pdf`, [lang]);

  const handleDownload = () => {
    setIsDownloading(true);
    const a = document.createElement('a');
    if (pdfExists) {
      a.href = pdfHref;
      a.download = `Arda_Aras_CV_${lang.toUpperCase()}.pdf`;
    } else if (cvImages[0]) {
      a.href = cvImages[0];
      a.download = `Arda_Aras_CV_${lang.toUpperCase()}.png`;
    }
    if (a.href) {
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setTimeout(() => setIsDownloading(false), 800);
  };

  const handlePrint = () => {
    if (pdfExists) {
      window.open(pdfHref, '_blank');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Arda Aras CV (${lang.toUpperCase()})</title>
          <style>
            body { margin:0; padding:20px; font-family: Arial, sans-serif; }
            img { max-width:100%; height:auto; margin-bottom:20px; page-break-after: always; }
            @media print { img { page-break-after: always; } }
          </style>
        </head>
        <body>
          ${cvImages.map((src) => `<img src="${src}" alt="CV Page" />`).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const renderCvContent = () => {
    if (!imagesLoaded) {
      return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'500px',color:'#666'}}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem', animation:'pulse 2s infinite' }}>📄</div>
          <h3 style={{ color:'#1a1a2e', marginBottom:'0.5rem' }}>CV Yükleniyor...</h3>
          <p>Lütfen bekleyiniz...</p>
        </div>
      );
    }

    if (cvImages.length === 0) {
      return (
        <div style={{ padding:'3rem', textAlign:'center', background:'#f8f9fa', borderRadius:'10px', border:'2px dashed #ddd' }}>
          <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>📋</div>
          <h2 style={{ color:'#dc3545', marginBottom:'1rem' }}>CV Dosyaları Bulunamadı</h2>
          <p style={{ color:'#666', marginBottom:'2rem', lineHeight:1.6 }}>
            Aşağıdaki adlandırma ile /public klasörüne ekleyin:
          </p>
          <div style={{ background:'#f1f3f4', padding:'1.5rem', borderRadius:'10px', margin:'0 auto 2rem auto', textAlign:'left', maxWidth:500 }}>
            <h4 style={{ color:'#1a1a2e', marginBottom:'1rem' }}>💡 Desteklenen Formatlar:</h4>
            <ul style={{ color:'#555', paddingLeft:'1.5rem' }}>
              <li><strong>Çoklu Sayfa:</strong> <code>cv-{lang}-1.png, cv-{lang}-2.png, ...</code></li>
              <li><strong>Tek Dosya:</strong> <code>cv-{lang}.png</code></li>
              <li><strong>PDF (Tercih):</strong> <code>cv-{lang}.pdf</code></li>
            </ul>
          </div>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => window.location.reload()}
              style={{ background:'linear-gradient(135deg,#64b5f6,#42a5f5)', color:'white', border:'none', padding:'0.8rem 1.5rem', borderRadius:10, cursor:'pointer', fontSize:'1rem' }}>
              🔄 Yeniden Kontrol Et
            </button>
            <a href={pdfHref} target="_blank" style={{ background:'linear-gradient(135deg,#28a745,#20c997)', color:'white', padding:'0.8rem 1.5rem', borderRadius:10, textDecoration:'none', fontSize:'1rem' }}>
              📄 PDF Olarak Görüntüle
            </a>
          </div>
        </div>
      );
    }

    return (
      <div style={{ background:'white', borderRadius:15, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ background:'linear-gradient(135deg,#1a1a2e,#16213e)', color:'white', padding:'2rem', textAlign:'center' }}>
          <h2 style={{
            fontSize:'1.8rem', fontWeight:'bold',
            background:'linear-gradient(135deg,#64b5f6,#42a5f5)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', margin:0
          }}>
            Arda Aras — CV ({lang.toUpperCase()})
          </h2>
          <p style={{ color:'#b0bec5', margin:'0.5rem 0 0 0' }}>
            {cvImages.length > 1 ? `${cvImages.length} Sayfa` : '1 Sayfa'} • PNG
          </p>
        </div>

        <div style={{ padding:'2rem', maxHeight:'1200px', overflowY:'auto', background:'#f8f9fa' }}>
          {cvImages.map((src, i) => (
            <div key={i} style={{ marginBottom: i < cvImages.length - 1 ? '2rem' : 0, textAlign:'center', position:'relative' }}>
              {cvImages.length > 1 && (
                <div style={{ position:'absolute', top:'1rem', left:'1rem', background:'rgba(100,181,246,0.9)', color:'white', padding:'0.5rem 1rem', borderRadius:20, fontSize:'0.9rem', fontWeight:'bold', zIndex:10, boxShadow:'0 2px 10px rgba(0,0,0,0.2)' }}>
                  Sayfa {i + 1}
                </div>
              )}
              <img
                src={src}
                alt={`CV ${lang.toUpperCase()} - Sayfa ${i + 1}`}
                style={{ width:'100%', maxWidth:800, height:'auto', borderRadius:10, boxShadow:'0 8px 32px rgba(0,0,0,0.1)', border:'1px solid #e9ecef', transition:'transform .3s', cursor:'zoom-in' }}
                onClick={() => window.open(src, '_blank')}
                onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                loading="lazy"
              />
              <div style={{ position:'absolute', bottom:'1rem', right:'1rem', background:'rgba(0,0,0,0.7)', color:'white', padding:'0.3rem 0.8rem', borderRadius:15, fontSize:'0.8rem', opacity:0.8 }}>
                🔍 Yakınlaştırmak için tıkla
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:'#f8f9fa', padding:'1.5rem 2rem', borderTop:'1px solid #e9ecef', textAlign:'center', color:'#666' }}>
          <p style={{ margin:0, fontSize:'0.9rem' }}>
            💡 <strong>İpucu:</strong> Tam boyut için görsele tıkla — PDF indirmek için üstteki “İndir”i kullan.
          </p>
        </div>
      </div>
    );
  };

  return (
    <main style={{ minHeight:'100vh', backgroundColor:'#0a0a0a', color:'white' }}>
      <header style={{ position:'sticky', top:0, left:0, right:0, zIndex:50, backgroundColor:'rgba(10,10,10,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(100,181,246,0.2)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <Link href="/" legacyBehavior>
            <a style={{ display:'flex', alignItems:'center', gap:'0.5rem', color:'#64b5f6', textDecoration:'none', fontSize:'1rem', transition:'all .3s', padding:'0.5rem 1rem', borderRadius:10, border:'1px solid rgba(100,181,246,0.3)' }}>
              <span>←</span>
              Ana Sayfa
            </a>
          </Link>

          <h1 style={{ fontSize:'1.5rem', fontWeight:'bold', background:'linear-gradient(135deg,#64b5f6,#42a5f5)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', margin:0 }}>
            CV Görüntüle
          </h1>

          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap' }}>
            {/* Dil Butonları */}
            <div style={{ display:'inline-flex', border:'1px solid rgba(100,181,246,0.4)', borderRadius:10, overflow:'hidden' }}>
              <button
                onClick={() => setLang('tr')}
                aria-pressed={lang === 'tr'}
                style={{
                  padding:'0.45rem 0.9rem',
                  background: lang === 'tr' ? 'rgba(100,181,246,0.25)' : 'transparent',
                  color:'#64b5f6',
                  border:'none',
                  cursor:'pointer'
                }}
              >
                Türkçe
              </button>
              <button
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                style={{
                  padding:'0.45rem 0.9rem',
                  background: lang === 'en' ? 'rgba(100,181,246,0.25)' : 'transparent',
                  color:'#64b5f6',
                  borderLeft:'1px solid rgba(100,181,246,0.4)',
                  borderRight:'0',
                  borderTop:'0',
                  borderBottom:'0',
                  cursor:'pointer'
                }}
              >
                English
              </button>
            </div>

            <button
              onClick={handlePrint}
              style={{
                background:'transparent',
                color:'#64b5f6',
                border:'2px solid rgba(100,181,246,0.4)',
                padding:'0.5rem 1rem',
                borderRadius:10,
                cursor:'pointer',
                fontSize:'0.9rem',
                transition:'all .3s'
              }}
            >
              Yazdır / Aç
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              style={{
                background: isDownloading ? 'rgba(100,181,246,0.5)' : 'linear-gradient(135deg,#64b5f6,#42a5f5)',
                color:'white',
                border:'none',
                padding:'0.5rem 1rem',
                borderRadius:10,
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                fontSize:'0.9rem',
                transition:'all .3s'
              }}
            >
              {isDownloading ? 'İndiriliyor...' : `PDF / PNG indir (${lang.toUpperCase()})`}
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding:'2rem', maxWidth:'1000px', margin:'0 auto' }}>
        {renderCvContent()}
      </div>

      <style jsx>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @media (max-width: 768px) { header > div { flex-direction: column; text-align: center; } }
      `}</style>
    </main>
  );
}
