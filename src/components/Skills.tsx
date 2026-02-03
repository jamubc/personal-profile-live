import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skills } from '../data/skills';

export const Skills = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="skills" className="relative py-28 font-mono">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Technical Proficiency</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-light uppercase tracking-wide text-white/90">
            Core competencies across electrical and software engineering.
          </h2>
        </div>

        {/* Tabbed Container */}
        <div className="border border-white/20 bg-black">
          {/* Tabs */}
          <div className="border-b border-white/20 flex overflow-x-auto">
            {skills.map((skillGroup, index) => (
              <button
                key={skillGroup.category}
                onClick={() => setActiveTab(index)}
                className={`
                  relative px-6 py-3 text-xs uppercase tracking-wider transition-colors
                  border-r border-white/20 whitespace-nowrap
                  ${activeTab === index
                    ? 'bg-white/5 text-white'
                    : 'text-white/40 hover:text-white/70'
                  }
                `}
              >
                {skillGroup.category}
                {activeTab === index && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/50"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {skills[activeTab].items.map((skill) => (
                  <div
                    key={skill}
                    className="border border-white/20 bg-black px-4 py-3 hover:border-white/40 transition-colors"
                  >
                    <div className="text-sm uppercase tracking-wide text-white/90">
                      {skill}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
