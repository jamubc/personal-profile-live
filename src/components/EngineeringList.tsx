import { Project } from '../types';

interface EngineeringListProps {
  projects: Project[];
  onOpenDetail: (project: Project) => void;
}

export const EngineeringList = ({ projects, onOpenDetail }: EngineeringListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onOpenDetail(project)}
          className="group relative w-full flex items-center gap-5 sm:gap-6 p-4 sm:p-5 text-left
            border border-white/5 bg-transparent
            hover:border-white/15 hover:bg-white/[0.07] hover:backdrop-blur-md
            hover:-translate-y-[3px] hover:shadow-[0_8px_30px_-8px_rgba(0,247,255,0.1)]
            transition-all duration-500 ease-out
            overflow-hidden outline-none focus:outline-none cursor-pointer"
        >
          {/* Animated left accent border */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00f7ff]/70 via-[#00f7ff]/30 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out origin-top" />

          {/* Subtle background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00f7ff]/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Project icon/image */}
          <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden border border-white/10 bg-white/5
            group-hover:border-white/20 group-hover:shadow-[0_0_15px_-3px_rgba(0,247,255,0.15)]
            transition-all duration-500"
          >
            {project.icon ? (
              <img
                src={project.icon}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5" />
            )}
          </div>

          {/* Text content */}
          <div className="relative flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300 truncate">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-300 transition-colors duration-500 mt-1 truncate">
              {project.techStack.slice(0, 3).join(' · ')}
            </p>
          </div>

        </button>
      ))}
    </div>
  );
};
