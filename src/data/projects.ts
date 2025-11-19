import { Project } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Neo-Brutalist Portfolio',
    description: 'A high-performance developer portfolio built with Astro and Tailwind CSS, featuring distinct brutalist design aesthetics.',
    image: 'https://placehold.co/600x400/1e293b/41D1FF?text=Portfolio',
    techStack: ['Astro', 'Tailwind', 'TypeScript'],
    demoUrl: '#',
    repoUrl: '#'
  },
  {
    id: '2',
    title: 'SaaS Analytics Dashboard',
    description: 'Real-time analytics platform for SaaS businesses. Visualizes MRR, Churn, and User retention with D3.js.',
    image: 'https://placehold.co/600x400/1e293b/BD34FE?text=Analytics',
    techStack: ['React', 'D3.js', 'Next.js'],
    demoUrl: '#',
    repoUrl: '#'
  },
  {
    id: '3',
    title: 'AI Content Generator',
    description: 'Full-stack application using OpenAI API to generate marketing copy and social media posts.',
    image: 'https://placehold.co/600x400/1e293b/ffffff?text=AI+Gen',
    techStack: ['OpenAI', 'Node.js', 'PostgreSQL'],
    demoUrl: '#',
    repoUrl: '#'
  }
];