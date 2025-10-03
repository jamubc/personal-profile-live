import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import '../../styles/chromaGradient.css';

export const Hero = () => {
  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <section className="container mx-auto page-gutter min-h-screen flex flex-col justify-center">
      <motion.div
        className="max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-display-md md:text-display-xl font-bold text-text-primary mb-6"
          variants={itemVariants}
        >
          Andrew
        </motion.h1>
        <motion.p
          className="text-h3 md:text-h2 mb-8 chroma-gradient-text"
          variants={itemVariants}
        >
          Full-Stack Developer & Open Source Contributor
        </motion.p>
        <motion.p
          className="text-body-lg text-text-secondary mb-12 max-w-2xl"
          variants={itemVariants}
        >
          Building impactful software that solves real problems. Specializing in modern web technologies and developer tools with a focus on performance and user experience.
        </motion.p>
        <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
          <Button variant="primary" onClick={scrollToProjects}>
            View My Work
          </Button>
          <Button variant="secondary" onClick={() => {
            const el = document.querySelector('#about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            About Me
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
