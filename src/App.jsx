import { Layout } from './components/layout/Layout';
import { Hero } from './components/sections/Hero';
import { Projects } from './components/sections/Projects';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Contact } from './components/sections/Contact';
import { BackgroundField } from './components/effects/BackgroundField';
import { SmoothScroll } from './components/effects/SmoothScroll';
import { FieldRepulsionProvider } from './hooks/useFieldRepulsion';

function App() {
  return (
    <FieldRepulsionProvider>
      {/* SVG Filter Definitions for Glass Distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Subtle glass distortion filter */}
          <filter id="glass-distortion" x="-50%" y="-50%" width="200%" height="200%">
            {/* Create turbulence for organic glass texture */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              seed="2"
              result="turbulence"
            />
            {/* Displacement map for subtle warping */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacement"
            />
            {/* Slight blur to smooth the distortion */}
            <feGaussianBlur in="displacement" stdDeviation="0.5" result="blur" />
            {/* Composite to preserve original content with subtle distortion */}
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      <SmoothScroll />
      <BackgroundField />
      <Layout>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </Layout>
    </FieldRepulsionProvider>
  );
}

export default App;
