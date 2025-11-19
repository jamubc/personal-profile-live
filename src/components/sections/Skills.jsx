import { motion } from 'framer-motion';
import { Section } from '../layout/Section';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { skills } from '../../data/skills';

export const Skills = () => {
  return (
    <Section id="skills">
      <motion.h2
        className="text-display-sm md:text-display-md font-bold text-text-primary mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        Skills & Technologies
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="standard" className="h-full">
          <h3 className="text-h3 font-bold text-text-primary mb-6">Languages</h3>
          <motion.div
            className="flex flex-wrap gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {skills.languages.map((skill) => (
              <motion.div
                key={skill}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Tag>{skill}</Tag>
              </motion.div>
            ))}
          </motion.div>
        </Card>

        <Card variant="standard" className="h-full">
          <h3 className="text-h3 font-bold text-text-primary mb-6">Frameworks</h3>
          <motion.div
            className="flex flex-wrap gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {skills.frameworks.map((skill) => (
              <motion.div
                key={skill}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Tag>{skill}</Tag>
              </motion.div>
            ))}
          </motion.div>
        </Card>

        <Card variant="standard" className="h-full">
          <h3 className="text-h3 font-bold text-text-primary mb-6">Tools</h3>
          <motion.div
            className="flex flex-wrap gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {skills.tools.map((skill) => (
              <motion.div
                key={skill}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Tag>{skill}</Tag>
              </motion.div>
            ))}
          </motion.div>
        </Card>

        <Card variant="standard" className="h-full">
          <h3 className="text-h3 font-bold text-text-primary mb-6">Practices</h3>
          <motion.div
            className="flex flex-wrap gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {skills.practices.map((skill) => (
              <motion.div
                key={skill}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Tag>{skill}</Tag>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </div>
    </Section>
  );
};
