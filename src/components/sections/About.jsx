import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { KnowledgeTree } from '../ui/KnowledgeTree';
import { Section } from '../layout/Section';
import { containerVariants, itemVariants, TRANSITION_EASE } from '../../utils/motion';

export const About = () => {
  return (
    <Section id="about" variant="secondary">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start w-full mb-20">
        {/* Left: Lead + Bio */}
        <motion.div
          className="lg:col-span-7"
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
            className="border-l-2 border-l-accent-primary pl-6 mb-12"
            variants={itemVariants}
          >
            <p className="text-body-lg text-text-secondary leading-relaxed">
              I build developer tools and performant web apps with a focus on clarity, reliability, and speed. My work emphasizes strong architecture, measurable impact, and superb developer experience.
            </p>
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
          className="lg:col-span-5"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.6,
            ease: TRANSITION_EASE,
            delay: 0.3,
          }}
        >
          <div className="flex items-center gap-6 mb-10">
            <Avatar initials="A" />
            <div>
              <div className="text-h3 font-bold text-text-primary">Andrew</div>
              <div className="text-body text-text-secondary">Full‑Stack Developer</div>
            </div>
          </div>

          <div className="pl-2 border-l border-border-secondary">
             <ul className="text-body text-text-secondary space-y-6">
              <li className="flex flex-col">
                <span className="text-accent-primary font-bold text-sm uppercase tracking-wider mb-1">Focus</span>
                <span className="text-text-primary">Web performance, DX, open source</span>
              </li>
              <li className="flex flex-col">
                <span className="text-accent-primary font-bold text-sm uppercase tracking-wider mb-1">Stack</span>
                <span className="text-text-primary">React, Node.js, FastAPI, Tailwind</span>
              </li>
              <li className="flex flex-col">
                <span className="text-accent-primary font-bold text-sm uppercase tracking-wider mb-1">Approach</span>
                <span className="text-text-primary">Pragmatic, measurable, maintainable</span>
              </li>
            </ul>
          </div>
        </motion.aside>
      </div>

      {/* Full Width Knowledge Tree */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-h3 font-bold text-text-primary">Technical Domain</h3>
          <div className="h-px flex-grow bg-border-secondary"></div>
        </div>
        <KnowledgeTree />
      </motion.div>
    </Section>
  );
};
