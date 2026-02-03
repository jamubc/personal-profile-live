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
    title: 'Logic Pro MCP Server',
    description: 'Model Context Protocol (MCP) server for Logic Pro integration, enabling AI-assisted music production workflows and automation.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    techStack: ['Python', 'AppleScript', 'MCP Protocol', 'Music Theory', 'UV Package Manager'],
    category: 'Software Development',
    repoUrl: 'https://github.com/andrewmanson/logic-pro-mcp',
    demoUrl: 'https://logic-pro-mcp.andrewmanson.com'
  },
  {
    id: '3',
    title: 'Environment Manager TUI',
    description: 'Secure terminal-based environment variable manager with AES-256-GCM encryption for storing and organizing sensitive configuration.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    techStack: ['Python', 'Textual', 'Cryptography', 'Shell Scripting'],
    category: 'Software Development',
    repoUrl: 'https://github.com/andrewmanson/env-manager'
  },
  {
    id: '4',
    title: 'Autonomous Wildfire Reconnaissance Robot',
    description: 'Autonomous robot designed for wildfire reconnaissance and surveillance, with real-time monitoring, sensor integration, and rugged all-terrain mobility.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    techStack: ['SolidWorks', 'MATLAB', 'C++', 'Arduino', 'Computer Vision', 'Sensor Fusion'],
    category: 'Engineering & Research',
    repoUrl: 'https://github.com/andrewmanson/wildfire-robot'
  },
  {
    id: '5',
    title: 'Automated Apple Grade Classification',
    description: 'Senior Capstone Project: Built a multi-camera computer vision + ML grading system to classify apples by defects and quality metrics (color, defect detection, and sugar/starch testing), paired with an automated sorting workflow.',
    image: 'https://images.unsplash.com/photo-1589820296153-17d40996e538?auto=format&fit=crop&w=800&q=80',
    techStack: ['Python', 'TensorFlow', 'OpenCV', 'Machine Vision', 'Robotics', 'Automation', 'Control Systems', 'Sensor Integration'],
    category: 'Engineering & Research',
    repoUrl: 'https://github.com/andrewmanson/apple-classifier'
  },
  {
    id: '6',
    title: 'PPG Heart Rate Monitor',
    description: 'Photoplethysmography (PPG)-based heart rate monitor with real-time signal acquisition, filtering, and peak detection for reliable BPM estimation.',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80',
    techStack: ['Embedded C', 'Signal Processing', 'MATLAB', 'Arduino', 'Sensor Design'],
    category: 'Engineering & Research'
  },
  {
    id: '7',
    title: 'Okanagan Hydrail Feasibility Study',
    description: 'Conducted a comprehensive economic analysis for a $1.5-2.9B hydrogen fuel cell tram-train network. Performed NPV, BCR, and IRR calculations for a 342km system, including Monte Carlo simulations for cost risks and technology maturity assessments.',
    image: 'https://images.unsplash.com/photo-1442570468985-f62ed5fe4535?auto=format&fit=crop&w=800&q=80',
    techStack: ['Economic Analysis', 'Hydrogen Fuel Cells', 'Monte Carlo Sim', 'Infrastructure'],
    category: 'Engineering & Research'
  },
  {
    id: '8',
    title: 'Photonics & Optical Systems',
    description: 'Advanced optical design and analysis including fiber optic coupling, index-matching, and reflectivity calculations. Characterized photodetectors and analyzed semiconductor physics, specifically energy bandgaps and optoelectronic responses.',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80',
    techStack: ['Fiber Optics', 'Semiconductors', 'Photodetectors', 'Optical Analysis'],
    category: 'Engineering & Research'
  }
];
