import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const getGitHubPath = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('github.com')) {
        return urlObj.pathname.replace(/^\/|\/$/g, '');
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const githubPath = project.repoUrl ? getGitHubPath(project.repoUrl) : null;

  return (
    <a
      href={project.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden h-full min-h-[380px] w-full border border-white/10 shadow-2xl transition-transform duration-500 hover:-translate-y-1"
    >
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay for Contrast - Ensures text readability even without the blur card, but adds depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full justify-between p-4 sm:p-6">

        {/* Top Bar: Actions */}
        <div className="flex justify-end items-center gap-3">
          {project.stars && githubPath && (
            <div className="hidden sm:block overflow-hidden opacity-90 hover:opacity-100 transition-opacity shadow-lg">
              <img
                src={`https://img.shields.io/github/stars/${githubPath}?style=social`}
                alt="GitHub Stars"
                loading="lazy"
                className="h-6 block"
              />
            </div>
          )}
          <div className="p-2.5 bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Bottom Text Content with Glassmorphism Blur */}
        <div className="mt-auto">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 shadow-2xl hover:bg-black/50 transition-colors">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight shadow-black drop-shadow-lg">
              {project.title}
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 mb-4 font-medium drop-shadow-md">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map(tech => (
                <span key={tech} className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};
