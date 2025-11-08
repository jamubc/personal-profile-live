import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { KnowledgeTree } from '../ui/KnowledgeTree';
import GlassCard from '../ui/GlassCard';

export const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const stats = [
    { label: 'Focus', value: 'Web Performance & DX', icon: '⚡' },
    { label: 'Experience', value: 'Full-Stack Development', icon: '🚀' },
    { label: 'Approach', value: 'Pragmatic & Measurable', icon: '📊' },
  ];

  return (
    <section id="about" className="relative section-divider py-32 md:py-48 min-h-screen flex items-center overflow-hidden">
      {/* Dramatic gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-600/15 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="page-gutter relative z-10">
        {/* Header with gradient underline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24"
        >
          <h2 className="text-display-sm md:text-display-md font-bold text-text-primary mb-4">
            About Me
          </h2>
          <motion.div
            className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-transparent rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: '200px' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Avatar + Stats */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Avatar with dramatic glow effect */}
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Gradient glow background */}
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-500 via-cyan-500 to-purple-500 rounded-full blur-2xl opacity-50" />
              <div className="absolute -inset-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full animate-pulse" />

              {/* Avatar container with GlassCard */}
              <GlassCard
                variant="default"
                hoverEffect="none"
                padding="p-2"
                className="relative !rounded-full !border-2 !border-purple-500/50 !bg-bg-card-inline !backdrop-blur-xl"
              >
                <Avatar initials="A" />
              </GlassCard>

              {/* Animated ring */}
              <motion.div
                className="absolute -inset-3 border-2 border-cyan-500/30 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-h2 font-bold text-text-primary">Name</h3>
              <p className="text-body-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold">
                Full-Stack Developer
              </p>
            </div>

            {/* Glassmorphism Stats Cards */}
            <div className="space-y-4 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="relative group"
                >
                  {/* Stats card with GlassCard */}
                  <GlassCard
                    variant="default"
                    hoverEffect="none"
                    padding="p-6"
                    className="rounded-2xl !border-purple-500/30 !backdrop-blur-xl overflow-hidden shadow-xl"
                  >
                    {/* Gradient background on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="text-4xl">{stat.icon}</div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                          {stat.label}
                        </div>
                        <div className="text-body font-bold text-text-primary">
                          {stat.value}
                        </div>
                      </div>
                    </div>

                    {/* Accent border on hover */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            className="lg:col-span-7 space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Bio Card with GlassCard */}
            <motion.div
              variants={itemVariants}
              className="relative group"
            >
              <GlassCard
                variant="default"
                hoverEffect="none"
                padding="p-8 md:p-12"
                className="rounded-3xl !border-cyan-500/30 overflow-hidden shadow-2xl"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Decorative corner accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-full" />

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full mb-6"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  >
                    <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      My Story
                    </span>
                  </motion.div>

                  <p className="text-body-lg md:text-xl text-text-primary leading-relaxed mb-6">
                    I build developer tools and performant web apps with a focus on{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold">
                      clarity, reliability, and speed
                    </span>.
                  </p>

                  <p className="text-body text-text-secondary leading-relaxed">
                    My work emphasizes strong architecture, measurable impact, and superb developer experience.
                    I believe in building software that not only works well but also brings joy to both users and developers.
                  </p>
                </div>

                {/* Animated border accent */}
                <motion.div
                  className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.4), rgba(168, 85, 247, 0.4))',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </GlassCard>
            </motion.div>

            {/* Tech Stack Card with GlassCard */}
            <motion.div variants={itemVariants}>
              <GlassCard
                variant="default"
                hoverEffect="none"
                padding="p-8 md:p-10"
                className="rounded-3xl !border-purple-500/30 overflow-hidden shadow-2xl"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
                    <h3 className="text-h3 font-bold text-text-primary">Tech Stack</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {['React', 'Node.js', 'FastAPI', 'Tailwind', 'TypeScript', 'PostgreSQL'].map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.05, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4 text-center font-semibold text-text-primary hover:border-cyan-500/50 transition-colors cursor-default"
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Knowledge Tree with enhanced styling */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" />
                <h3 className="text-h3 font-bold text-text-primary">Knowledge Tree</h3>
              </div>

              {/* Gradient divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-8" />

              <KnowledgeTree />
            </motion.div>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              className="pt-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="secondary"
                  onClick={() => {
                    const el = document.querySelector('#projects');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10">View Featured Work</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
