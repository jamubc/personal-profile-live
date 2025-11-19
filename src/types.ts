export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  category: string;
  demoUrl?: string;
  repoUrl?: string;
  stars?: string;
}

export interface Skill {
  category: string;
  items: string[];
}
