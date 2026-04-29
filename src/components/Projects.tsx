import { projects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { Project } from '../types';
import { Github } from 'lucide-react';

interface ProjectsProps {
  onOpenDetail: (project: Project) => void;
}

export const Projects = ({}: ProjectsProps) => {
  const softwareProjects = projects.filter(p => p.category === 'Open-Source Development');

  return (
    <section id="projects" className="relative pt-8 pb-24">
      {/* Ambient color transition from hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">Projects & Engineering</h2>
        </div>

        {/* Software Projects */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px bg-white/10 flex-1" />
             <span className="text-secondary text-sm uppercase tracking-widest font-medium">Open-Source Development</span>
             <div className="h-px bg-white/10 flex-1" />
             <a
               href="https://github.com/jamubc"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 hover:text-white border border-white/20 px-4 py-2 bg-black hover:bg-white/5 transition-colors whitespace-nowrap"
             >
               <Github className="w-4 h-4" />
               Visit my GitHub
             </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center sm:place-items-start">
            {softwareProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
