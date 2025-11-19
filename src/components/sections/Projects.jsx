import { motion } from 'framer-motion';
import { Section } from '../layout/Section';
import { Card } from '../ui/Card';
import { Link } from '../ui/Link';
import { ShieldBadge } from '../ui/ShieldBadge';
import { projects } from '../../data/projects';

// Optional: A helper for the "Magazine" style tag
const EditorialTag = ({ children }) => (
  <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary border border-border-subtle px-2 py-1 rounded-sm">
    {children}
  </span>
);

export const Projects = () => {
  return (
    <Section id="projects" variant="secondary">
      <motion.div
        className="flex flex-col items-start mb-32"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-sm font-mono text-accent mb-6 tracking-widest uppercase">
          Selected Works
        </span>
        <h2 className="text-display-sm md:text-display-md font-bold text-text-primary tracking-tight mb-2">
          Featured Projects
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {projects.map((project) => (
          <Card
            key={project.id}
            variant="featured"
            withPadding={false}
            className="h-full flex flex-col group hover:border-accent/50 transition-colors duration-300"
          >
            {/* 1. HEADER & META: Title paired with Tech Stack for immediate context */}
            <div className="p-8 md:p-10 pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-h3 font-bold text-text-primary leading-tight group-hover:text-accent transition-colors">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-2 opacity-80">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <EditorialTag key={tech}>{tech}</EditorialTag>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. NARRATIVE: Editorial style description */}
            <div className="border-t border-border-subtle flex-grow">
              <div className="px-8 py-6 md:px-10 md:py-7 bg-bg-card-inline">
                <p className="text-sm text-text-secondary font-mono tracking-tight leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* 4. FOOTER: Actions & Social Proof separated cleanly */}
            <div className="border-t border-border-subtle p-6 md:p-8 bg-bg-card-inline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              {/* Badges - Treated as "Stamps" */}
              <div className="flex gap-3 opacity-90 grayscale hover:grayscale-0 transition-all duration-300">
                {project.badges?.github && (
                  <ShieldBadge
                    href={`https://github.com/${project.badges.github}`}
                    src={`https://img.shields.io/github/stars/${project.badges.github}?style=flat-square&color=black&labelColor=gray`}
                    alt="Stars"
                  />
                )}
                {project.badges?.npm && (
                  <ShieldBadge
                    href={`https://www.npmjs.com/package/${project.badges.npm}`}
                    src={`https://img.shields.io/npm/dt/${project.badges.npm}?style=flat-square&color=black&labelColor=gray`}
                    alt="Downloads"
                  />
                )}
              </div>

              {/* Links - High contrast text links */}
              <div className="flex gap-6 font-medium text-sm">
                {project.links.github && (
                  <Link href={project.links.github} external className="hover:translate-x-1 transition-transform">
                    GitHub &rarr;
                  </Link>
                )}
                {project.links.demo && (
                  <Link href={project.links.demo} external className="hover:translate-x-1 transition-transform">
                    Live Demo &rarr;
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};
