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
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl">
            Building systems that
            <span className="block text-white/50">solve real problems.</span>
          </h2>

          <p className="mt-8 text-sm md:text-base text-white/60 leading-relaxed max-w-lg">
            I'm an Electrical Engineering student working with embedded systems, power electronics, and robotics. This is where I share what I'm building.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
