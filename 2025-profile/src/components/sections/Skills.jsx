import { motion } from 'framer-motion';
import { skills } from '../../data/skills';

// Skill proficiency levels (adjust as needed)
const skillLevels = {
  languages: {
    'JavaScript': 95,
    'TypeScript': 90,
    'Python': 85,
    'Go': 75,
    'SQL': 80,
  },
  frameworks: {
    'React': 95,
    'Next.js': 90,
    'Node.js': 88,
    'FastAPI': 82,
    'Tailwind CSS': 92,
  },
  tools: {
    'Git': 90,
    'Docker': 85,
    'PostgreSQL': 88,
    'Vite': 85,
    'VS Code': 95,
  },
  practices: {
    'Test-Driven Development': 88,
    'CI/CD': 85,
    'Code Review': 92,
    'Agile': 90,
  },
};

const categoryConfig = {
  languages: {
    title: 'Languages',
    gradient: 'from-purple-500/20 via-purple-600/20 to-pink-500/20',
    glowColor: 'shadow-purple-500/50',
    borderGlow: 'group-hover:shadow-purple-500/50',
    accentColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-purple-400',
    icon: '{ }',
  },
  frameworks: {
    title: 'Frameworks',
    gradient: 'from-cyan-500/20 via-blue-600/20 to-cyan-500/20',
    glowColor: 'shadow-cyan-500/50',
    borderGlow: 'group-hover:shadow-cyan-500/50',
    accentColor: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    textColor: 'text-cyan-400',
    icon: '⚡',
  },
  tools: {
    title: 'Tools',
    gradient: 'from-emerald-500/20 via-green-600/20 to-teal-500/20',
    glowColor: 'shadow-emerald-500/50',
    borderGlow: 'group-hover:shadow-emerald-500/50',
    accentColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    textColor: 'text-emerald-400',
    icon: '⚙️',
  },
  practices: {
    title: 'Practices',
    gradient: 'from-orange-500/20 via-amber-600/20 to-yellow-500/20',
    glowColor: 'shadow-orange-500/50',
    borderGlow: 'group-hover:shadow-orange-500/50',
    accentColor: 'bg-gradient-to-r from-orange-500 to-amber-500',
    textColor: 'text-orange-400',
    icon: '✨',
  },
};

const SkillCard = ({ category, skills, config, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Background gradient blob */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${config.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Main card */}
      <div className="relative h-full bg-surface-raised/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:-translate-y-2 group-hover:shadow-2xl">
        {/* Top gradient bar */}
        <div className={`h-1 ${config.accentColor}`} />

        {/* Card content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`text-4xl w-14 h-14 flex items-center justify-center rounded-xl ${config.accentColor} shadow-lg`}>
              <span className="text-2xl">{config.icon}</span>
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${config.textColor} mb-1`}>
                {config.title}
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-current to-transparent opacity-50" />
                <span className="text-xs text-text-secondary uppercase tracking-wider">
                  {skills.length} Skills
                </span>
              </div>
            </div>
          </div>

          {/* Skills list */}
          <div className="space-y-4">
            {skills.map((skill, skillIndex) => {
              const level = skillLevels[category][skill] || 80;

              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: skillIndex * 0.05 }}
                  className="group/skill"
                >
                  {/* Skill name and level */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary font-medium group-hover/skill:text-white transition-colors">
                      {skill}
                    </span>
                    <span className={`text-sm font-bold ${config.textColor} opacity-0 group-hover/skill:opacity-100 transition-opacity`}>
                      {level}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2 bg-bg-tertiary/50 rounded-full overflow-hidden">
                    {/* Background glow */}
                    <motion.div
                      className={`absolute inset-0 ${config.accentColor} blur-md opacity-0 group-hover/skill:opacity-50 transition-opacity`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: level / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: skillIndex * 0.05 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left' }}
                    />

                    {/* Actual progress bar */}
                    <motion.div
                      className={`relative h-full ${config.accentColor} shadow-lg`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: level / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: skillIndex * 0.05 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left' }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </motion.div>
  );
};

export const Skills = () => {
  return (
    <section id="skills" className="relative page-gutter section-divider py-32 md:py-48 min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left gradient blob */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />

        {/* Top right gradient blob */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        {/* Bottom left gradient blob */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Bottom right gradient blob */}
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse" />
              <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                Technical Expertise
              </span>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse" />
            </div>
          </motion.div>

          <motion.h2
            className="text-display-sm md:text-display-md font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </motion.h2>

          <motion.p
            className="text-text-secondary text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            A comprehensive toolkit built through years of hands-on experience and continuous learning
          </motion.p>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {Object.entries(categoryConfig).map(([category, config], index) => (
            <SkillCard
              key={category}
              category={category}
              skills={skills[category]}
              config={config}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
