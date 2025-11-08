import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { Link } from '../ui/Link';
import { projects } from '../../data/projects';
import { ShieldBadge } from '../ui/ShieldBadge';

// Loading skeleton component
const ProjectSkeleton = () => (
  <div className="bg-bg-card/50 backdrop-blur-sm border-border-primary/20 border-2 shadow-brutal-xl p-card-lg rounded-xl animate-pulse">
    <div className="h-8 bg-bg-card-inline/50 rounded-lg w-3/4 mb-6"></div>
    <div className="space-y-3 mb-8">
      <div className="h-4 bg-bg-card-inline/50 rounded"></div>
      <div className="h-4 bg-bg-card-inline/50 rounded w-5/6"></div>
    </div>
    <div className="flex flex-wrap gap-2 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-7 w-16 bg-bg-card-inline/50 rounded-md"></div>
      ))}
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <motion.div
    className="text-center py-24"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-6xl mb-4">📦</div>
    <h3 className="text-h3 font-bold text-text-primary mb-4">No Projects Yet</h3>
    <p className="text-body text-text-secondary max-w-md mx-auto">
      Check back soon for exciting projects and updates!
    </p>
  </motion.div>
);

export const Projects = () => {
  const isLoading = false; // This would come from your data fetching logic
  const isEmpty = projects.length === 0;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <section id="projects" className="page-gutter section-divider py-32 md:py-48">
      <motion.h2
        className="text-display-sm md:text-display-md font-bold text-text-primary mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        Featured Projects
      </motion.h2>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-12 md:gap-16">
          {[1, 2, 3].map(i => <ProjectSkeleton key={i} />)}
        </div>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-12 md:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects.map((project, index) => (
          <motion.div key={project.id} variants={cardVariants}>
            <Card variant="featured">
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
            <div className="flex gap-4 pt-4 border-t border-border-subtle">
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
          </motion.div>
        ))}
        </motion.div>
      )}
    </section>
  );
};
