import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  HiMail,
  HiLocationMarker
} from 'react-icons/hi';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaArrowRight
} from 'react-icons/fa';

export const Contact = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);

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

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0.4, 0.6, 0.4],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const contactMethods = [
    {
      icon: HiMail,
      label: 'Email',
      value: 'hello@example.com',
      href: 'mailto:hello@example.com',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FaGithub,
      label: 'GitHub',
      value: 'github.com/yourhandle',
      href: 'https://github.com',
      color: 'from-gray-600 to-gray-800',
    },
    {
      icon: FaLinkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/yourprofile',
      href: 'https://linkedin.com',
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: FaTwitter,
      label: 'Twitter',
      value: '@yourhandle',
      href: 'https://twitter.com',
      color: 'from-cyan-400 to-blue-500',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 md:py-48 min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Bold Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple via-background-primary to-accent-cyan opacity-90" />

      {/* Animated Gradient Blobs */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-accent-purple to-purple-600 rounded-full blur-3xl opacity-30"
        style={{ y }}
        variants={glowVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent-cyan to-blue-500 rounded-full blur-3xl opacity-20"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
        variants={glowVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-accent-primary to-accent-cyan rounded-full blur-3xl opacity-20"
        style={{ rotate }}
      />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />

      {/* Main Content */}
      <div className="page-gutter relative z-10 w-full max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ scale }}
          className="text-center space-y-12"
        >
          {/* Headline with Gradient Text */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              <span className="inline-block px-6 py-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-accent-primary font-semibold text-sm tracking-wide backdrop-blur-sm">
                LET&apos;S CONNECT
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-accent-cyan to-accent-purple bg-clip-text text-transparent animate-gradient">
                Ready to Build
              </span>
              <br />
              <span className="text-white">
                Something Amazing?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Let&apos;s collaborate on your next project. Whether it&apos;s a groundbreaking idea or a challenging problem, I&apos;m here to help bring your vision to life.
            </p>
          </motion.div>

          {/* Primary CTA Button */}
          <motion.div variants={itemVariants}>
            <motion.a
              href="mailto:hello@example.com"
              className="group inline-flex items-center gap-4 px-10 py-6 bg-gradient-to-r from-accent-primary to-accent-cyan text-white text-lg font-bold rounded-2xl shadow-2xl shadow-accent-primary/50 hover:shadow-accent-primary/70 transition-all duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />

              <HiMail className="text-2xl relative z-10" />
              <span className="relative z-10">Get In Touch</span>
              <FaArrowRight className="text-xl group-hover:translate-x-2 transition-transform relative z-10" />
            </motion.a>
          </motion.div>

          {/* Glassmorphism Contact Card */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto mt-20"
          >
            <div className="relative group">
              {/* Card Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple via-accent-primary to-accent-cyan rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

              {/* Glass Card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                {/* Decorative Corner Accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent-cyan rounded-tl-3xl" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent-purple rounded-br-3xl" />

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                  Connect With Me
                </h3>

                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactMethods.map((method, index) => (
                    <motion.a
                      key={method.label}
                      href={method.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/item relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-accent-primary/50 rounded-2xl p-6 transition-all duration-300 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      {/* Hover Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-0 group-hover/item:opacity-10 transition-opacity duration-300`} />

                      <div className="relative flex items-center gap-4">
                        {/* Icon with Gradient Background */}
                        <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <method.icon className="text-2xl text-white" />
                        </div>

                        {/* Contact Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-text-tertiary font-medium mb-1">
                            {method.label}
                          </div>
                          <div className="text-white font-semibold truncate group-hover/item:text-accent-primary transition-colors">
                            {method.value}
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <FaArrowRight className="text-accent-primary opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-300" />
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-8 border-t border-white/10 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-text-secondary">
                    <HiLocationMarker className="text-accent-primary text-xl" />
                    <span className="text-sm md:text-base">
                      Based in Your City, Available Worldwide
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            variants={itemVariants}
            className="text-text-tertiary text-sm max-w-2xl mx-auto pt-8"
          >
            Open to freelance opportunities, collaborations, and exciting projects.
            <br className="hidden md:block" />
            Average response time: <span className="text-accent-primary font-semibold">24 hours</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-primary to-transparent pointer-events-none" />
    </section>
  );
};
