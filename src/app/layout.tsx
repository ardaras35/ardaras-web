import '../styles/globals.css';
import Navbar from '../components/Navbar'; 

export const metadata = {
  title: 'Arda Aras',
  description: 'Kişisel portföy sitesi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Navbar />  
        {children}    
      </body>
    </html>
  );
}
