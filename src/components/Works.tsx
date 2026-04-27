export const Works = () => {
  const works = [
    {
      title: "Oli's Oils",
      url: "https://www.olisoils.ca/",
      description: "Website development & design",
      year: "2025"
    },
    {
      title: "UBC Workday to Calendar",
      url: "https://jamubc.github.io/UBC-workday-to-calendar/",
      description: "Schedule export utility",
      year: "2026"
    },
    {
      title: "Element Selector Tree Tool",
      url: "https://github.com/jamubc/Element-Selector-tree-tool",
      description: "DOM selection utility",
      year: "2025"
    }
  ];

  return (
    <div className="bg-black min-h-screen text-white font-mono selection:bg-primary/30 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-14">
          <a href="/" className="inline-block mb-8 text-white/50 hover:text-white transition-colors text-sm uppercase tracking-widest">
            ← Back to Home
          </a>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Works</h1>
          <p className="text-white/60">An isolated index of professional works and contributions.</p>
        </div>

        <div className="flex flex-col border-t border-white/10">
          {works.map((work, idx) => (
            <a 
              key={idx}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors -mx-4 px-4 sm:mx-0 sm:px-4"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-medium text-white/90 group-hover:text-primary transition-colors">{work.title}</h3>
                <p className="text-sm text-white/50">{work.description}</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/40">
                <span>{work.year}</span>
                <span className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
