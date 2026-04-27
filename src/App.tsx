import { useState, useCallback, lazy, Suspense } from 'react';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Engineering } from './components/Engineering';
import { Contact } from './components/Contact';
import { Works } from './components/Works';
import { Project } from './types';

const ProjectDetail = lazy(() =>
  import('./components/ProjectDetail').then((m) => ({ default: m.ProjectDetail }))
);

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  if (window.location.pathname === '/works' || window.location.hash === '#works') {
    return <Works />;
  }

  const openProjectDetail = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  const closeProjectDetail = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <div className="relative min-h-screen bg-dark text-white selection:bg-primary selection:text-dark overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content — offset by sidebar width on desktop */}
      <div className="relative z-10 bg-dark shadow-2xl md:ml-60">
        {/* Background Effects */}
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

        {/* Content */}
        <main className="relative">
          <Hero />
          <Projects onOpenDetail={openProjectDetail} />
          <Engineering onOpenDetail={openProjectDetail} />
          <Contact />
        </main>
      </div>

      {/* Project Detail Overlay — lazy loaded */}
      <Suspense fallback={null}>
        <ProjectDetail project={activeProject} onClose={closeProjectDetail} />
      </Suspense>
    </div>
  );
}

export default App;
