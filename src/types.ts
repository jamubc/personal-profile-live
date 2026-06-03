export interface ProjectDetailSection {
  heading?: string;
  text?: string;
  image?: string;
  imageCaption?: string;
  /** Max-height in px for the section image */
  imageMaxHeight?: number;
  /** object-fit mode for the section image */
  imageFit?: 'cover' | 'contain';
  /** CSS width value for the section image (e.g. '80%', '100%') */
  imageWidth?: string;
  /** Render as a list of bullet points instead of a paragraph */
  bullets?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  /** Square icon/thumbnail shown on list cards */
  icon?: string;
  engineeringImageWidthPct?: number;
  engineeringImageFit?: 'cover' | 'contain';
  techStack: string[];
  category: string;
  assetsDir?: string;
  demoUrl?: string;
  repoUrl?: string;
  /** Identifier for the markdown content file to lazy-load (e.g. 'apple-classifier') */
  contentFile?: string;
  /** Rich detail content shown in the focus-mode overlay */
  detailSections?: ProjectDetailSection[];
}

export interface Skill {
  category: string;
  items: string[];
}
