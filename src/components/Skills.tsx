import { skills } from '../data/skills';

export const Skills = () => {
  return (
    <section id="skills" className="relative py-28">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">Technical Proficiency</p>
          <h2 className="mt-2 text-4xl font-semibold">A versatile toolkit bridging hardware and software.</h2>
          <p className="mt-4 text-gray-400">
            From high-voltage power systems to full-stack web applications, I leverage a diverse set of tools to solve complex engineering challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map(skillGroup => (
            <div
              key={skillGroup.category}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl transition hover:border-white/30"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{skillGroup.category}</h3>
                <span className="text-xs uppercase tracking-[0.35em] text-gray-500">Focus</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map(skill => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-wide text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
