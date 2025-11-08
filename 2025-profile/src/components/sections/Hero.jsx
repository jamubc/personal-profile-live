import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import GlassCard from '../ui/GlassCard';
import '../../styles/chromaGradient.css';

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

  const roleVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    deposited: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      }
    },
  };

  const glassCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <section id="hero" className="page-gutter min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {/* Dramatic Gradient Background */}
      <div className="absolute inset-0 z-0">
        {/* Purple Gradient Orb - Top Left */}
        <motion.div
          className="absolute -top-48 -left-48 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgb(168, 85, 247) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Cyan Gradient Orb - Bottom Right */}
        <motion.div
          className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgb(34, 211, 238) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Center Purple-Cyan Gradient */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(34, 211, 238) 100%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        className="max-w-5xl relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Dramatic Headline with Gradient Text */}
        <motion.div variants={itemVariants} className="mb-16">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-text-primary mb-6 leading-none tracking-tight">
            Name
          </h1>

          {/* Accent Line with Gradient */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent-purple to-accent-purple rounded-full" />
            <div className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
            <div className="h-1 w-24 bg-gradient-to-l from-transparent via-accent-cyan to-accent-cyan rounded-full" />
          </div>
        </motion.div>

        {/* Glassmorphism Role Card */}
        <motion.div
          variants={glassCardVariants}
          className="mb-16 inline-block"
        >
          <GlassCard
            variant="gradient-border"
            glowColor="purple"
            hoverEffect="glow"
            className="px-12 py-8"
          >
            <motion.p
              id="role-anchor"
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% auto',
              }}
              variants={roleVariants}
              initial="initial"
              animate="deposited"
              key={roles[currentRoleIndex]}
            >
              {roles[currentRoleIndex]}
            </motion.p>
          </GlassCard>
        </motion.div>

        {/* Description with dramatic spacing */}
        <motion.p
          className="text-2xl md:text-3xl text-text-secondary mb-20 max-w-3xl mx-auto leading-relaxed font-light"
          variants={itemVariants}
        >
          Building impactful software that solves real problems. Specializing in modern web technologies and developer tools with a focus on{' '}
          <span className="text-accent-purple font-semibold">performance</span>
          {' '}and{' '}
          <span className="text-accent-cyan font-semibold">user experience</span>.
        </motion.p>

        {/* CTA Buttons with Glow Effects */}
        <motion.div
          className="flex flex-wrap gap-6 justify-center items-center"
          variants={itemVariants}
        >
          {/* Primary Button with Glow */}
          <div className="relative group">
            {/* Glow effect */}
            <div
              className="absolute -inset-1 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-xl opacity-70 group-hover:opacity-100 blur transition-opacity duration-300"
            />
            <Button
              variant="primary"
              onClick={scrollToProjects}
              className="relative text-lg px-8 py-4"
            >
              View My Work
            </Button>
          </div>

          {/* Secondary Button with Border Glow */}
          <div className="relative group">
            <Button
              variant="secondary"
              onClick={() => {
                const el = document.querySelector('#about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative text-lg px-8 py-4 border-2 border-accent-cyan/30 hover:border-accent-cyan/60 transition-colors duration-300"
            >
              About Me
            </Button>
          </div>
        </motion.div>

        {/* Bottom Accent Cards */}
        <motion.div
          variants={itemVariants}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {/* Stat Card 1 - Years Experience */}
          <GlassCard
            variant="gradient-border"
            glowColor="purple"
            hoverEffect="lift"
            className="text-center px-6 py-8"
          >
            <div className="text-3xl font-bold text-accent-purple mb-2">5+</div>
            <div className="text-text-secondary text-sm uppercase tracking-wider">Years Experience</div>
          </GlassCard>

          {/* Stat Card 2 - Projects Built */}
          <GlassCard
            variant="gradient-border"
            glowColor="cyan"
            hoverEffect="lift"
            className="text-center px-6 py-8"
          >
            <div className="text-3xl font-bold text-accent-cyan mb-2">50+</div>
            <div className="text-text-secondary text-sm uppercase tracking-wider">Projects Built</div>
          </GlassCard>

          {/* Stat Card 3 - Ideas to Code */}
          <GlassCard
            variant="gradient-border"
            glowColor="purple"
            hoverEffect="lift"
            className="text-center px-6 py-8"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent mb-2">∞</div>
            <div className="text-text-secondary text-sm uppercase tracking-wider">Ideas to Code</div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
};
