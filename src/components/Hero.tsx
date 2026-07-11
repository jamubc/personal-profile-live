import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="hero" className="relative flex flex-col justify-center min-h-[55vh] px-4 sm:px-6 lg:px-8 font-mono text-white/90">
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:pl-[10%]"
        >
          <p className="text-sm md:text-base text-secondary uppercase tracking-[0.25em] mb-6">
            Electrical Engineer <span className="text-white/40">/</span> EGBC EIT
          </p>
          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mb-4">
            I'm an electrical engineering graduate from UBCO and a registered EIT with Engineers and Geoscientists BC.
            I love to solve real-world problems with simple solutions to make life easier.
          </p>
          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
            For my capstone I designed and built a machine vision system that grades apples in real time on a Raspberry Pi.
            I also work extensively with AI systems, testing and hardening them. Here is where I share what I'm building.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
