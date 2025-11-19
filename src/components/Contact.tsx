import { Mail, MessageSquare } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Connect</h2>
        <p className="text-xl text-gray-400 mb-12 leading-relaxed">
          I'm currently open to new opportunities and collaborations. 
          Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        <div className="inline-flex flex-col sm:flex-row gap-4">
          <a 
            href="mailto:hello@2025.dev" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-dark font-bold rounded-full hover:bg-white transition-colors shadow-lg shadow-primary/25"
          >
            <Mail className="w-5 h-5" />
            Send an Email
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Message on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
};