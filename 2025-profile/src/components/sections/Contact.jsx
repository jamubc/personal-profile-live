import { motion } from 'framer-motion';

export const Contact = () => {
  return (
    <section id="contact" className="page-gutter section-divider py-32 md:py-48 min-h-screen flex items-center">
      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-display-sm md:text-display-md font-bold text-text-primary mb-8">Get In Touch</h2>
        <p className="text-body-lg text-text-secondary max-w-2xl">
          Interested in working together or have a question? Feel free to reach out via email or connect with me on social platforms.
        </p>
      </motion.div>
    </section>
  );
};
