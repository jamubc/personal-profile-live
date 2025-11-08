import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { KnowledgeTree } from '../ui/KnowledgeTree';

export const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section id="about" className="page-gutter section-divider py-32 md:py-48 min-h-screen flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start w-full">
        {/* Left: Lead + Bio */}
        <motion.div
          className="md:col-span-7"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-display-sm md:text-display-md font-bold text-text-primary mb-12"
            variants={itemVariants}
          >
            About Me
          </motion.h2>

          <motion.div
            className="border-l-border-primary border-l-thick pl-6 mb-8 relative"
            variants={itemVariants}
          >
            {/* Animated border accent */}
            <motion.div
              className="absolute left-0 top-0 w-1 bg-primary"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.4,
              }}
            />
            <p className="text-body-lg text-text-secondary">
              I build developer tools and performant web apps with a focus on clarity, reliability, and speed. My work emphasizes strong architecture, measurable impact, and superb developer experience.
            </p>
          </motion.div>

          <motion.div className="mb-12" variants={itemVariants}>
            <h3 className="text-h3 font-bold text-text-primary mb-6">Knowledge Tree</h3>
            <KnowledgeTree />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button variant="secondary" onClick={() => {
              const el = document.querySelector('#projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              View Featured Work
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: Avatar + Quick facts */}
        <motion.aside
          className="md:col-span-5"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3,
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Avatar initials="A" />
            <div>
              <div className="text-h3 font-bold text-text-primary">Name</div>
              <div className="text-body text-text-secondary">Dev</div>
            </div>
          </div>

          <motion.div
            className="bg-bg-card-inline/80 backdrop-blur-sm border-border-secondary/50 border shadow-md p-card-md relative overflow-hidden rounded-xl group"
            whileHover={{
              y: -4,
              boxShadow: '0 0 20px rgba(115, 115, 115, 0.1), 4px 4px 0px 0px var(--color-border-secondary)',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            {/* Subtle gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <ul className="text-body text-text-secondary space-y-2 relative z-10">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <span className="text-text-primary font-bold">Focus:</span> Web performance, DX, open source
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <span className="text-text-primary font-bold">Stack:</span> React, Node.js, FastAPI, Tailwind
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <span className="text-text-primary font-bold">Approach:</span> Pragmatic, measurable, maintainable
              </motion.li>
            </ul>
          </motion.div>
        </motion.aside>
      </div>
    </section>
  );
};
