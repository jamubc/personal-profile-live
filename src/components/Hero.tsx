import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="hero" className="relative flex flex-col justify-center min-h-[55vh] px-4 sm:px-6 lg:px-8 font-mono text-white/90">
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mb-4">
            I'm a graduating electrical engineering student at UBCO. I love to solve real word problems with simple solutions to make life easier.
          </p>
          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
            I have worked extensively with AI and AI systems, trying to break them and finding what works.
            Here is where I share what I'm building.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
