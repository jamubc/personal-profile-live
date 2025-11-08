import { Layout } from './components/layout/Layout';
import { Hero } from './components/sections/Hero';
import { Projects } from './components/sections/Projects';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Contact } from './components/sections/Contact';
import { BackgroundField } from './components/effects/BackgroundField';

function App() {
  return (
    <>
      <BackgroundField />
      <Layout>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </Layout>
    </>
  );
}

export default App;
