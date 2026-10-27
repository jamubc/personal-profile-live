import { useState, useCallback, useRef, lazy, Suspense, ReactNode } from 'react';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Engineering } from './components/Engineering';
import { Contact } from './components/Contact';
import { Works } from './components/Works';
import { Writing } from './components/Writing';
import { Project } from './types';
import { usePointerOffset } from './lib/usePointerOffset';

const ProjectDetail = lazy(() =>
  import('./components/ProjectDetail').then((m) => ({ default: m.ProjectDetail }))
);

/** Sidebar + background effects + sidebar-offset content area. */
function Shell({ children }: { children: ReactNode }) {
  const lightsRef = useRef<HTMLDivElement>(null);
  usePointerOffset(lightsRef);
  return (
    <div className="relative min-h-screen bg-dark text-white selection:bg-primary selection:text-dark overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content — offset by sidebar width on desktop */}
      <div className="relative z-10 bg-dark shadow-2xl md:ml-60">
        {/* Background Effects */}
        <div ref={lightsRef} className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060f] via-[#020308] to-[#05060f]" />
          <div className="light-far" />
          <div className="light-near" />
          <div className="absolute inset-0 opacity-60 noise-texture mix-blend-soft-light" />
        </div>

        {/* Content */}
        <main className="relative">{children}</main>
      </div>
    </div>
  );
}

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  if (window.location.pathname === '/works' || window.location.hash === '#works') {
    return <Works />;
  }

  if (window.location.pathname === '/writing') {
    return (
      <Shell>
        <Writing />
      </Shell>
    );
  }

  const openProjectDetail = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  const closeProjectDetail = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <>
      <Shell>
        <Hero />
        <Engineering onOpenDetail={openProjectDetail} />
        <Projects onOpenDetail={openProjectDetail} />
        <Contact />
      </Shell>

      {/* Project Detail Overlay — lazy loaded */}
      <Suspense fallback={null}>
        <ProjectDetail project={activeProject} onClose={closeProjectDetail} />
      </Suspense>
    </>
  );
}

export default App;
