import { projects } from '../data/projects';
import { EngineeringList } from './EngineeringList';
import { Project } from '../types';

interface EngineeringProps {
  onOpenDetail: (project: Project) => void;
}

export const Engineering = ({ onOpenDetail }: EngineeringProps) => {
  const engineeringProjects = projects.filter(p => p.category === 'Engineering & Research');

  return (
    <section id="engineering" className="relative pt-8 pb-24">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">Creative & Personal Projects</h2>
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
