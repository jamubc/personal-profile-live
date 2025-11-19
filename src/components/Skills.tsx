import { skills } from '../data/skills';

export const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-dark/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
          <p className="text-gray-400">Technologies I use to build digital products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skillGroup) => (
            <div key={skillGroup.category} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-xl font-bold mb-6 text-primary">{skillGroup.category}</h3>
              <div className="flex flex-wrap gap-3">
                {skillGroup.items.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1.5 text-sm bg-black/40 text-gray-300 rounded-lg border border-white/5"
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