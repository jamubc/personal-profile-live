import { motion } from 'framer-motion';
import { Link } from '../ui/Link';
import { projects } from '../../data/projects';
import { ShieldBadge } from '../ui/ShieldBadge';
import GlassCard from '../ui/GlassCard';

// Colorful tech tag component
const TechTag = ({ tech, index }) => {
  // Cycle through gradient colors for visual interest
  const gradients = [
    'from-purple-500/20 to-cyan-500/20 border-purple-500/40',
    'from-cyan-500/20 to-blue-500/20 border-cyan-500/40',
    'from-purple-600/20 to-pink-500/20 border-purple-500/40',
    'from-blue-500/20 to-cyan-400/20 border-blue-500/40',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <span className={`
      px-3 py-1.5 rounded-lg text-xs font-medium
      bg-gradient-to-r ${gradient}
      border backdrop-blur-sm
      text-text-primary
      transition-all duration-300
      hover:scale-105 hover:shadow-glow
    `}>
      {tech}
    </span>
  );
};

// Modern project card with glassmorphism
const ProjectCard = ({ project, featured = false }) => {
  return (
    <motion.div
      className={`
        group relative overflow-hidden rounded-2xl
        ${featured ? 'md:col-span-2' : ''}
      `}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* GlassCard with custom styling to match project card design */}
      <GlassCard
        variant="default"
        hoverEffect="none"
        className={`
          h-full
          bg-gradient-to-br from-bg-card/80 via-bg-card/60 to-bg-card/80
          backdrop-blur-xl
          border-2 border-transparent
          rounded-2xl
          shadow-brutal-lg
          transition-all duration-500
          group-hover:shadow-brutal-xl
          group-hover:border-purple-500/30
          overflow-hidden
          !p-0
        `}
      >
        {/* Card content wrapper with padding */}
        <div className={`
          relative h-full flex flex-col
          ${featured ? 'p-8 md:p-10' : 'p-6 md:p-8'}
        `}>
          {/* Animated gradient overlay on hover */}
          <div className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5
            transition-opacity duration-500
            pointer-events-none
            rounded-2xl
          " />

          {/* Decorative gradient header */}
          <div className={`
            relative -mx-6 -mt-6 mb-6 overflow-hidden
            ${featured ? 'md:-mx-10 md:-mt-10 h-48 md:h-64' : 'md:-mx-8 md:-mt-8 h-32 md:h-40'}
            ${featured ? 'md:-mx-10' : 'md:-mx-8'}
            rounded-t-2xl
          `}>
            {/* Animated gradient background */}
            <div className="
              absolute inset-0
              bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-500
              opacity-60 group-hover:opacity-80
              transition-opacity duration-500
            " />

            {/* Mesh pattern overlay */}
            <div className="
              absolute inset-0
              bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]
              opacity-20
            " />

            {/* Glow effect on hover */}
            <div className="
              absolute inset-0
              bg-gradient-to-t from-bg-card/90 via-bg-card/20 to-transparent
            " />

            {/* Featured badge */}
            {featured && (
              <div className="absolute top-4 right-4">
                <span className="
                  px-4 py-2 rounded-full
                  bg-white/10 backdrop-blur-md
                  border border-white/20
                  text-white text-xs font-bold tracking-wider
                  shadow-glow
                ">
                  FEATURED
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col">
            {/* Title */}
            <h3 className={`
              font-bold text-text-primary mb-4
              bg-gradient-to-r from-text-primary to-text-primary/80 bg-clip-text
              ${featured ? 'text-h2 md:text-h1' : 'text-h3 md:text-h2'}
            `}>
              {project.title}
            </h3>

            {/* Description */}
            <p className={`
              text-text-secondary leading-relaxed mb-6
              ${featured ? 'text-body-lg md:text-body-xl' : 'text-body'}
            `}>
              {project.description}
            </p>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map((tech, index) => (
                <TechTag key={tech} tech={tech} index={index} />
              ))}
            </div>

            {/* Metrics */}
            {project.metrics && (
              <div className={`
                mb-6 p-4 rounded-xl
                bg-gradient-to-br from-purple-500/5 to-cyan-500/5
                border border-purple-500/10
                backdrop-blur-sm
              `}>
                <ul className="space-y-2 text-body-sm text-text-secondary">
                  {project.metrics.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">▹</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shield Badges */}
            {project.badges && (
              <div className="flex flex-wrap gap-4 mb-6">
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

            {/* Action Links */}
            <div className="flex flex-wrap gap-3 pt-4 mt-auto border-t border-border-subtle/50">
              {project.links.github && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={project.links.github}
                    external
                    className="
                      inline-flex items-center gap-2 px-4 py-2.5
                      bg-gradient-to-r from-purple-500/10 to-purple-600/10
                      hover:from-purple-500/20 hover:to-purple-600/20
                      border border-purple-500/30
                      rounded-lg font-medium
                      transition-all duration-300
                      hover:shadow-glow
                    "
                  >
                    View on GitHub
                  </Link>
                </motion.div>
              )}
              {project.links.demo && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={project.links.demo}
                    external
                    className="
                      inline-flex items-center gap-2 px-4 py-2.5
                      bg-gradient-to-r from-cyan-500/10 to-blue-500/10
                      hover:from-cyan-500/20 hover:to-blue-500/20
                      border border-cyan-500/30
                      rounded-lg font-medium
                      transition-all duration-300
                      hover:shadow-glow
                    "
                  >
                    Live Demo
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          {/* Corner accent */}
          <div className="
            absolute -bottom-20 -right-20 w-40 h-40
            bg-gradient-to-br from-purple-500/20 to-cyan-500/20
            rounded-full blur-3xl
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            pointer-events-none
          " />
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Loading skeleton component
const ProjectSkeleton = ({ featured = false }) => (
  <div className={`
    rounded-2xl overflow-hidden
    ${featured ? 'md:col-span-2' : ''}
  `}>
    <div className={`
      bg-bg-card/50 backdrop-blur-sm
      border-2 border-border-primary/20
      rounded-2xl
      animate-pulse
      ${featured ? 'p-8 md:p-10' : 'p-6 md:p-8'}
    `}>
      <div className={`
        bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl mb-6
        ${featured ? 'h-48 md:h-64' : 'h-32 md:h-40'}
      `} />
      <div className="h-8 bg-bg-card-inline/50 rounded-lg w-3/4 mb-6" />
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-bg-card-inline/50 rounded" />
        <div className="h-4 bg-bg-card-inline/50 rounded w-5/6" />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-7 w-16 bg-bg-card-inline/50 rounded-md" />
        ))}
      </div>
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
  const isLoading = false;
  const isEmpty = projects.length === 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Separate featured and regular projects
  const featuredProject = projects[0];
  const regularProjects = projects.slice(1);

  return (
    <section id="projects" className="page-gutter section-divider py-32 md:py-48">
      {/* Section Header */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="
          text-display-sm md:text-display-md font-bold
          bg-gradient-to-r from-text-primary via-purple-400 to-cyan-400
          bg-clip-text text-transparent
          mb-4
        ">
          Featured Projects
        </h2>
        <p className="text-body-lg text-text-secondary max-w-2xl">
          A showcase of my best work, from open-source libraries to full-stack applications
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <ProjectSkeleton featured />
          <ProjectSkeleton />
          <ProjectSkeleton />
        </div>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Featured project - full width */}
          {featuredProject && (
            <motion.div variants={cardVariants} className="mb-6 md:mb-8">
              <ProjectCard project={featuredProject} featured />
            </motion.div>
          )}

          {/* Regular projects - grid layout */}
          {regularProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {regularProjects.map((project) => (
                <motion.div key={project.id} variants={cardVariants}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
};
