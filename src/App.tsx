import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    updateFooterHeight();
    window.addEventListener('resize', updateFooterHeight);

    return () => window.removeEventListener('resize', updateFooterHeight);
  }, []);

  return (
    <div className="relative min-h-screen bg-dark text-white selection:bg-primary selection:text-dark overflow-hidden">
      {/* Main Content Wrapper - Acts as the sliding curtain over the footer */}
      <div
        className="relative z-10 bg-dark shadow-2xl"
        style={{ marginBottom: `${footerHeight}px` }}
      >
        {/* Background Effects - Moved inside content wrapper to ensure opacity */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060f] via-[#020308] to-[#05060f]" />
          <div className="absolute inset-0 opacity-60 noise-texture mix-blend-soft-light" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute -top-32 right-0 w-[620px] h-[620px] bg-primary/20 blur-[160px]" />
          <div className="absolute top-1/2 -left-10 w-[420px] h-[420px] bg-secondary/10 blur-[160px]" />
          <div className="absolute bottom-[-10%] right-1/3 w-[380px] h-[380px] bg-accent/10 blur-[140px]" />
        </div>

        {/* Global Guide Rails (Engineering Grid) */}
        <div className="absolute inset-0 pointer-events-none max-w-5xl mx-auto px-4 z-0">
          <div className="h-full border-x border-white/10"></div>
        </div>

        {/* Content */}
        <Navbar />
        <main className="relative">
          <Hero />
          <Projects />
          <Skills />
          <Contact />
        </main>
      </div>

      {/* Fixed Footer - Reveals when content scrolls up */}
      <div
        ref={footerRef}
        className="fixed bottom-0 w-full z-0"
      >
        <Footer />
      </div>
    </div>
  );
}

export default App;
