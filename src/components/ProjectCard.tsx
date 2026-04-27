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
      className="group relative flex flex-col overflow-hidden h-full min-h-[380px] w-full border-2 border-white/20 shadow-2xl transition-transform duration-500 hover:-translate-y-1"
    >
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale group-hover:blur-md"
        />
        {/* Gradient Overlay for Contrast - Ensures text readability even without the blur card, but adds depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full justify-between p-4 sm:p-6">

        {/* Top Area: Title and Description */}
        <div className="flex flex-col gap-3 w-full">
          <div className="inline-block self-start max-w-full">
            <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight truncate w-full bg-white px-3 py-1 rounded-sm">
              {project.title}
            </h3>
          </div>
          <div className="transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
            <p className="text-base text-white leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] shadow-black">
              {project.description}
            </p>
          </div>
        </div>

        {/* Bottom Area: Actions */}
        <div className="mt-auto flex justify-end w-full">
          {project.stars && githubPath && (
            <div className="shrink-0 hidden sm:block overflow-hidden opacity-90 hover:opacity-100 transition-opacity shadow-lg">
              <img
                src={`https://img.shields.io/github/stars/${githubPath}?style=social`}
                alt="GitHub Stars"
                loading="lazy"
                className="h-6 block"
              />
            </div>
          )}
        </div>
      </div>
    </a>
  );
};
