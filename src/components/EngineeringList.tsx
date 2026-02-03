import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cpu } from 'lucide-react';
import { Project } from '../types';

interface EngineeringListProps {
  projects: Project[];
}

export const EngineeringList = ({ projects }: EngineeringListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => {
        const isExpanded = expandedId === project.id;
        
        return (
          <div 
            key={project.id}
            className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden
              ${isExpanded 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
              }`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : project.id)}
              className="w-full flex items-center justify-between p-6 text-left outline-none focus:outline-none"
            >
              <div className="flex items-center gap-6">
                <div className={`p-3 rounded-xl transition-colors ${isExpanded ? 'bg-primary text-dark' : 'bg-white/10 text-gray-400 group-hover:text-white'}`}>
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors mt-1">
                    Engineering & Research
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium uppercase tracking-wider transition-opacity duration-300 ${isExpanded ? 'opacity-0 hidden md:block' : 'opacity-0 group-hover:opacity-100 text-secondary hidden md:block'}`}>
                  View Details
                </span>
                <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-white text-dark rotate-180' : 'bg-transparent text-gray-500 group-hover:text-white'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="border-t border-white/10 p-6 md:p-8 bg-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      
                      {/* Image Section */}
                      <div className="md:col-span-4 lg:col-span-3">
                        <div className="rounded-xl overflow-hidden border border-white/10 h-48 md:h-full relative">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm uppercase tracking-widest text-secondary font-semibold mb-3">
                            Project Overview
                          </h4>
                          <p className="text-gray-300 leading-relaxed text-lg mb-6">
                            {project.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm uppercase tracking-widest text-secondary font-semibold mb-3">
                            Technologies & Methods
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <span 
                                key={tech} 
                                className="px-3 py-1.5 text-sm rounded-md bg-white/10 text-gray-200 border border-white/5"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
