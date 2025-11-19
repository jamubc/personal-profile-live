import { projects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { EngineeringList } from './EngineeringList';

export const Projects = () => {
  const softwareProjects = projects.filter(p => p.category === 'Software Development');
  const engineeringProjects = projects.filter(p => p.category === 'Engineering & Research');

  return (
    <section id="projects" className="relative py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-20">
          <h2 className="text-4xl font-semibold mt-2 text-white">Portfolio</h2>
          <p className="text-gray-400 max-w-2xl mt-4 text-lg">
            Selected works spanning software development, robotics, and electrical systems analysis.
          </p>
        </div>

        {/* Software Projects */}
        <div className="mb-24">
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
          <EngineeringList projects={engineeringProjects} />
        </div>
        
      </div>
    </section>
  );
};
