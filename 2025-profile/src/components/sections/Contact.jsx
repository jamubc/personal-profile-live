import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const Contact = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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
    <section
      ref={sectionRef}
      id="contact"
      className="page-gutter section-divider py-32 md:py-48 min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Parallax background decoration */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y }}
      >
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-border-primary/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="max-w-3xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ opacity, scale }}
      >
        <motion.h2
          className="text-display-sm md:text-display-md font-bold text-text-primary mb-8"
          variants={itemVariants}
        >
          Get In Touch
        </motion.h2>

        <motion.p
          className="text-body-lg text-text-secondary max-w-2xl"
          variants={itemVariants}
        >
          Interested in working together or have a question? Feel free to reach out via email or connect with me on social platforms.
        </motion.p>

        {/* Decorative animated line */}
        <motion.div
          className="mt-12 h-1 bg-gradient-to-r from-border-primary via-primary to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.4,
          }}
        />
      </motion.div>
    </section>
  );
};
