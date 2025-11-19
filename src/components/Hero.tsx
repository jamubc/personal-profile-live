import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-primary font-semibold tracking-wider uppercase mb-4">
            Full-Stack Developer & Architect
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Digital Future</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            I craft high-performance web applications and developer tools. 
            Explore my premium services, assets, and code audits below.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#products" 
              className="px-8 py-3 bg-primary text-dark font-bold rounded-full hover:bg-white transition-colors"
            >
              View Services
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 border border-white/20 hover:bg-white/5 rounded-full transition-colors"
            >
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};