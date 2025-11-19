import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-12 md:pt-0 md:pb-0">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center h-full text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 text-white">
            Andrew<span className="text-primary">.</span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-light text-secondary tracking-wide mb-8">
            Electrical Engineer
          </h2>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mx-auto">
            Im studying Electrican Engineering and mechatronics, I also write code.
          </p>
        </motion.div>
      </div>
    </section>
  );
};