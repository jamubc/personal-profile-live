import { projects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { EngineeringList } from './EngineeringList';
import { Project } from '../types';

interface ProjectsProps {
  onOpenDetail: (project: Project) => void;
}

export const Projects = ({ onOpenDetail }: ProjectsProps) => {
  const softwareProjects = projects.filter(p => p.category === 'Software Development');
  const engineeringProjects = projects.filter(p => p.category === 'Engineering & Research');

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
             <span className="text-secondary text-sm uppercase tracking-widest font-medium">Software Development</span>
             <div className="h-px bg-white/10 flex-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center sm:place-items-start">
            {softwareProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Engineering Projects */}
        <div>
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px bg-white/10 flex-1" />
             <span className="text-secondary text-sm uppercase tracking-widest font-medium">Engineering & Research</span>
             <div className="h-px bg-white/10 flex-1" />
          </div>
          {/* Stacked List View for Engineering Projects */}
          <EngineeringList projects={engineeringProjects} onOpenDetail={onOpenDetail} />
        </div>
        
      </div>
    </section>
  );
};
