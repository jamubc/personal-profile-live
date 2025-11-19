import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Section } from '../layout/Section';
import '../../styles/chromaGradient.css';
import { TRANSITION_EASE } from '../../utils/motion';

export const Hero = () => {
  const roles = [
    'Full-Stack Developer',
    'Electrical Engineer',
    'Hardware Designer',
    'IoT Architect',
    'Open Source Contributor',
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: TRANSITION_EASE,
      },
    },
  };

  const roleVariants = {
    initial: { opacity: 0, y: 10 },
    deposited: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: TRANSITION_EASE,
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.3, ease: TRANSITION_EASE }
    }
  };

  return (
    <Section
      id="hero"
      noDivider
      className="min-h-screen" // Removed flex/justify-center to let Section control layout
      centered={true} // Explicitly ask Section to center the content
    >
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full" // Ensure grid takes full width of Container
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text Content */}
        <div className="lg:col-span-8 text-center lg:text-left z-10">
          <div className="backdrop-blur-md bg-bg-card/30 p-8 md:p-12 rounded-3xl border border-border-primary shadow-glow-sm">
            <motion.h1
              className="text-display-md md:text-display-xl font-bold text-text-primary mb-6 tracking-tight"
              variants={heroItemVariants}
            >
              Andrew
            </motion.h1>

            <div className="h-20 md:h-24 mb-6 overflow-hidden relative">
              <motion.p
                id="role-anchor"
                className="text-h3 md:text-h2 chroma-gradient-text absolute top-0 left-0 right-0 lg:left-auto lg:right-auto"
                variants={roleVariants}
                initial="initial"
                animate="deposited"
                key={roles[currentRoleIndex]}
              >
                {roles[currentRoleIndex]}
              </motion.p>
            </div>

            <motion.p
              className="text-body-lg text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              variants={heroItemVariants}
            >
              Building impactful software that solves real problems. Specializing in modern web technologies and developer tools with a focus on performance and user experience.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              variants={heroItemVariants}
            >
              <Button variant="primary" onClick={scrollToProjects} className="shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                View My Work
              </Button>
              <Button variant="secondary" onClick={() => {
                const el = document.querySelector('#about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                About Me
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Optional: Right side visual or spacer (can be used for 3D element later) */}
        <div className="hidden lg:block lg:col-span-4">
          {/* Placeholder for 3D interaction zone */}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-text-tertiary flex flex-col items-center gap-2 cursor-pointer hover:text-text-primary transition-colors"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={scrollToProjects}
      >
        <span className="text-sm uppercase tracking-widest opacity-70 font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </motion.div>
    </Section>
  );
};
