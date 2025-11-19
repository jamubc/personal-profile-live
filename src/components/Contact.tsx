import { Mail, MessageSquare } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="relative py-28 overflow-hidden">
      <div className="absolute -bottom-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-secondary/20 blur-[160px] -z-10" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-white/15 bg-white/5 p-10 text-center shadow-soft backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">Open inbox</p>
          <h2 className="mt-4 text-4xl font-semibold">Let&apos;s make something that doesn&apos;t look like AI sludge.</h2>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed">
            Tell me about the problem, timeline, and what &ldquo;great&rdquo; looks like. I reply within 48 hours from Vancouver, BC.
          </p>

          <div className="mt-10 inline-flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:hello@2025.dev"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-dark shadow-glow"
            >
              <Mail className="h-5 w-5" />
              Send an Email
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 px-8 py-4 text-base font-semibold text-white/80 hover:text-white"
            >
              <MessageSquare className="h-5 w-5" />
              Message on LinkedIn
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-4 text-sm text-gray-400 sm:flex-row sm:justify-center">
            <span>🗓 Booking Q2 2025</span>
            <span>🇨🇦 Pacific Time</span>
            <span>⚡️ Zero boilerplate</span>
          </div>
        </div>
      </div>
    </section>
  );
};
