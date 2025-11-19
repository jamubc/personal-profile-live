import { Project } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Gemini MCP Tool',
    description: 'An MCP server enabling AI assistants to interact directly with the Google Gemini CLI. This tool leverages Gemini\'s massive token window for deep codebase understanding and large file analysis.',
    image: 'https://jamubc.github.io/gemini-mcp-tool/icon.png',
    techStack: ['TypeScript', 'Node.js', 'Gemini CLI', 'AI Agents'],
    category: 'Software Development',
    repoUrl: 'https://github.com/jamubc/gemini-mcp-tool',
    stars: '1.6k'
  },
  {
    id: '2',
    title: 'Automated Apple Grade Classification',
    description: 'Senior Capstone Project: Designed a robotics solution for JA Orchard. Developed a machine vision system using automation principles to grade apples based on color and defect detection, solving a real-world agricultural challenge.',
    image: 'https://images.unsplash.com/photo-1589820296153-17d40996e538?auto=format&fit=crop&w=800&q=80',
    techStack: ['Robotics', 'Machine Vision', 'Automation', 'Control Systems'],
    category: 'Engineering & Research'
  },
  {
    id: '3',
    title: 'Okanagan Hydrail Feasibility Study',
    description: 'Conducted a comprehensive economic analysis for a $1.5-2.9B hydrogen fuel cell tram-train network. Performed NPV, BCR, and IRR calculations for a 342km system, including Monte Carlo simulations for cost risks and technology maturity assessments.',
    image: 'https://images.unsplash.com/photo-1442570468985-f62ed5fe4535?auto=format&fit=crop&w=800&q=80',
    techStack: ['Economic Analysis', 'Hydrogen Fuel Cells', 'Monte Carlo Sim', 'Infrastructure'],
    category: 'Engineering & Research'
  },
  {
    id: '4',
    title: 'Photonics & Optical Systems',
    description: 'Advanced optical design and analysis including fiber optic coupling, index-matching, and reflectivity calculations. Characterized photodetectors and analyzed semiconductor physics, specifically energy bandgaps and optoelectronic responses.',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80',
    techStack: ['Fiber Optics', 'Semiconductors', 'Photodetectors', 'Optical Analysis'],
    category: 'Engineering & Research'
  }
];