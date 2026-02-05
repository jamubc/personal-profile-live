import { Mail, MessageSquare } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="relative py-28 font-mono">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Communications</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-light uppercase tracking-wide text-white/90">
            Open inbox
          </h2>
        </div>

        {/* Schematic Container */}
        <div className="border border-white/20 bg-black">
          {/* Top bar with label */}
          <div className="border-b border-white/20 px-6 py-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/40">Contact Interface</span>
            <span className="text-xs uppercase tracking-wider text-secondary">Status: Active</span>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-light text-white/90 tracking-wide">
              Let&apos;s make something that doesn&apos;t look like AI sludge.
            </h3>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-2xl">
              Tell me about the problem, timeline, and what &ldquo;great&rdquo; looks like. I reply within 48 hours from Vancouver, BC.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:hello@2025.dev"
                className="inline-flex items-center justify-center gap-3 border border-white/50 bg-white/5 px-6 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 hover:border-white/70 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Send an Email
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-white/20 px-6 py-3 text-sm uppercase tracking-wider text-white/50 hover:text-white/80 hover:border-white/40 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Message on LinkedIn
              </a>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="border-t border-white/20 px-6 py-3 flex flex-col gap-2 sm:flex-row sm:justify-between text-[10px] uppercase tracking-[0.3em] text-white/30">
            <span>Booking Q2 2025</span>
            <span>Pacific Time — Vancouver, BC</span>
            <span>Zero boilerplate</span>
          </div>
        </div>
      </div>
    </section>
  );
};
