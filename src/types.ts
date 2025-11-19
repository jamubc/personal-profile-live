export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon?: string;
}