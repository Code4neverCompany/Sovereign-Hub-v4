// app/layout.tsx
import './globals.css';
import SystemHealth from '../components/SystemHealth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-obsidian text-[#FFFFF0] antialiased">
        <header className="fixed top-0 w-full z-50 flex justify-between items-center px-12 py-8 bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-2xl font-cinzel tracking-widest text-[#D4AF37]">
            SOVEREIGN <span className="font-light opacity-60">HUB</span>
          </div>
          <nav className="hidden md:flex gap-8 text-xs tracking-[0.3em] font-poppins uppercase opacity-70">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Matrix</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Trace</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Logic</a>
          </nav>
          <div className="w-10 h-[1px] bg-[#D4AF37]/40"></div>
        </header>
        <SystemHealth />
        <main className="pt-32 px-12">
          {children}
        </main>
      </body>
    </html>
  );
}
