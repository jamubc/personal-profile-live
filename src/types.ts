export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  engineeringImageWidthPct?: number;
  engineeringImageFit?: 'cover' | 'contain';
  techStack: string[];
  category: string;
  assetsDir?: string;
  demoUrl?: string;
  repoUrl?: string;
  stars?: string;
}

export interface Skill {
  category: string;
  items: string[];
}
