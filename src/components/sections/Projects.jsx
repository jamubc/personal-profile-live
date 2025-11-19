import { motion } from 'framer-motion';
import { Section } from '../layout/Section';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { Link } from '../ui/Link';
import { projects } from '../../data/projects';
import { ShieldBadge } from '../ui/ShieldBadge';

export const Projects = () => {
  return (
    <Section id="projects" variant="secondary">
      <motion.h2
        className="text-display-sm md:text-display-md font-bold text-text-primary mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        Featured Projects
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {projects.map((project) => (
          <Card
            key={project.id}
            variant="featured"
            className="h-full"
          >
            {/* Title - Large, bold hierarchy */}
            <h3 className="text-h3 font-bold text-text-primary mb-6">
              {project.title}
            </h3>

            {/* Description - Generous spacing below */}
            <p className="text-body text-text-secondary mb-8 leading-relaxed">
              {project.description}
            </p>

            {/* Tech Stack - Grouped with breathing room */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>

            {/* Metrics - Separated section with italic styling */}
            {project.metrics && (
              <ul className="mb-8 text-body-sm text-text-secondary italic list-disc pl-6 space-y-1">
                {project.metrics.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            )}

            {/* Shield Badges - Clear visual separation */}
            {project.badges && (
              <div className="flex flex-wrap gap-4 mb-8 pt-2">
                {project.badges.github && (
                  <ShieldBadge
                    href={`https://github.com/${project.badges.github}`}
                    src={`https://img.shields.io/github/stars/${project.badges.github}?style=social`}
                    alt={`${project.badges.github} GitHub stars`}
                  />
                )}
                {project.badges.npm && (
                  <ShieldBadge
                    href={`https://www.npmjs.com/package/${project.badges.npm}`}
                    src={`https://img.shields.io/npm/dt/${project.badges.npm}`}
                    alt={`${project.badges.npm} total npm downloads`}
                  />
                )}
              </div>
            )}

            {/* Action Links - Prominent CTAs at bottom */}
            <div className="flex gap-4 pt-4 border-t border-border-subtle mt-auto">
              {project.links.github && (
                <Link href={project.links.github} external>
                  View on GitHub
                </Link>
              )}
              {project.links.demo && (
                <Link href={project.links.demo} external>
                  Live Demo
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};
