import { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Project, ProjectDetailSection } from '../types';
import { loadProjectContent } from '../data/projects';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

/** kebab-case slug from a heading string */
const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Convert inline markdown (bold, italic) to React nodes */
const renderInlineMarkdown = (text: string): React.ReactNode[] => {
  // Match **bold** and *italic* patterns
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      // **bold**
      parts.push(<strong key={match.index} className="font-semibold text-white">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={match.index}>{match[4]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }

  // Push remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

export const ProjectDetail = ({ project, onClose }: ProjectDetailProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loadedSections, setLoadedSections] = useState<ProjectDetailSection[] | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  /* Lazy-load markdown content when a project with contentFile is opened */
  useEffect(() => {
    if (!project) {
      setLoadedSections(null);
      return;
    }
    if (project.detailSections) {
      setLoadedSections(project.detailSections);
      return;
    }
    if (project.contentFile) {
      setIsLoadingContent(true);
      loadProjectContent(project.contentFile).then((sections) => {
        setLoadedSections(sections);
        setIsLoadingContent(false);
      });
    } else {
      setLoadedSections(null);
    }
  }, [project]);

  const detailSections = loadedSections ?? project?.detailSections ?? null;

  const tocEntries = useMemo(() => {
    if (!detailSections) return [];
    return detailSections
      .filter((s) => s.heading)
      .map((s) => ({ label: s.heading!, id: toSlug(s.heading!) }));
  }, [detailSections]);

  /* lock body scroll while open */
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      setActiveSection(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  /* close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* track which section is in view for active TOC highlight */
  useEffect(() => {
    if (!project || tocEntries.length === 0) return;
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const offset = container.scrollTop + 120;
      let current: string | null = null;
      for (const entry of tocEntries) {
        const el = document.getElementById(entry.id);
        if (el && el.offsetTop <= offset) {
          current = entry.id;
        }
      }
      setActiveSection(current);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [project, tocEntries]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && scrollRef.current) {
      const container = scrollRef.current;
      const top = el.offsetTop - container.offsetTop - 32;
      container.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const hasToc = tocEntries.length > 1;

  /* ── Shared TOC markup ── */
  const tocContent = hasToc && (
    <div className="relative pl-5">
      {/* Vertical rail */}
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-white/10" />

      <ol className="space-y-0">
        {tocEntries.map((entry, i) => {
          const isActive = activeSection === entry.id;
          return (
            <li key={entry.id} className="relative">
              <button
                onClick={() => scrollToSection(entry.id)}
                className="group flex items-center gap-4 py-2 text-left w-full"
              >
                {/* Node dot */}
                <span
                  className={`absolute left-[-16px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full border transition-all z-10 ${isActive
                      ? 'border-white/70 bg-white/20'
                      : 'border-white/40 bg-[#050507] group-hover:border-white/60 group-hover:bg-white/10'
                    }`}
                />

                {/* Step number */}
                <span
                  className={`text-[10px] tabular-nums font-mono w-4 text-right flex-none transition-colors ${isActive ? 'text-white/70' : 'text-white/40 group-hover:text-white/60'
                    }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Label */}
                <span
                  className={`text-[13px] font-mono tracking-wide transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                    }`}
                >
                  {entry.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          key="project-detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-[#050507] overflow-hidden flex flex-col"
        >
          {/* ── Minimal top bar ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex-none flex items-center justify-between px-6 lg:px-10 py-5"
          >
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-mono"
              >
                Source <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>

          {/* ── Body: sidebar TOC (lg+) + scrollable content ── */}
          <div className="flex-1 flex overflow-hidden">

            {/* Desktop TOC sidebar — fixed left column, only on lg+ */}
            {hasToc && (
              <motion.aside
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="hidden lg:flex flex-col flex-none w-60 xl:w-64 border-r border-white/[0.06] px-6 pt-12 pb-8 overflow-y-auto custom-scrollbar"
              >
                <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-mono mb-6">
                  Contents
                </p>
                {tocContent}

                {/* Back link at bottom of TOC sidebar */}
                <div className="mt-auto pt-10">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em] font-mono"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Projects
                  </button>
                </div>
              </motion.aside>
            )}

            {/* Scrollable reading area — fills remaining width */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
              <article className="mx-auto px-6 md:px-10 lg:px-14 xl:px-20 pb-24" style={{ maxWidth: '52rem' }}>

                {/* Title */}
                <motion.header
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="pt-8 md:pt-16 pb-10 md:pb-14"
                >
                  <p className="text-[11px] text-white/60 uppercase tracking-[0.3em] font-mono mb-4">
                    Engineering & Research
                  </p>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-6">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] uppercase tracking-[0.15em] text-white/60 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.header>

                {/* Hero image — only render if the image is not a generic unsplash placeholder */}
                {project.image && !project.image.includes('unsplash.com') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="mb-12 md:mb-16"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className={`w-full rounded-sm ${project.engineeringImageFit === 'contain'
                          ? 'object-contain bg-white/[0.02] max-h-[420px]'
                          : 'object-cover max-h-[480px]'
                        }`}
                    />
                  </motion.div>
                )}

                {/* Lead paragraph */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-lg md:text-xl text-white/85 leading-relaxed mb-16"
                >
                  {project.description}
                </motion.p>

                {/* ── Inline TOC for mobile/tablet (below lg) ── */}
                {hasToc && (
                  <motion.nav
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42, duration: 0.5 }}
                    aria-label="Table of contents"
                    className="mb-16 md:mb-20 lg:hidden"
                  >
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-mono mb-5">
                      Contents
                    </p>
                    {tocContent}
                  </motion.nav>
                )}

                {/* Loading skeleton for lazy content */}
                {isLoadingContent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 py-8"
                  >
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="space-y-3 animate-pulse">
                        <div className="h-5 w-40 bg-white/10 rounded" />
                        <div className="h-3 w-full bg-white/[0.06] rounded" />
                        <div className="h-3 w-5/6 bg-white/[0.06] rounded" />
                        <div className="h-3 w-4/6 bg-white/[0.06] rounded" />
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Detail sections */}
                {detailSections?.map((section, i) => {
                  const sectionId = section.heading ? toSlug(section.heading) : undefined;
                  return (
                    <motion.section
                      key={i}
                      id={sectionId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + i * 0.1, duration: 0.5 }}
                      className="mb-14 md:mb-16 scroll-mt-8"
                    >
                      {section.heading && (
                        <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-5">
                          {section.heading}
                        </h2>
                      )}

                      {section.text && section.text.split('\n\n').map((para, pi) => (
                        <p key={pi} className="text-base md:text-[17px] text-white/85 leading-[1.85] mb-4 last:mb-0">
                          {renderInlineMarkdown(para)}
                        </p>
                      ))}

                      {section.bullets && (
                        <ul className="mt-5 space-y-3">
                          {section.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-4 text-white/80 text-[15px] leading-relaxed">
                              <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-white/50 flex-none" />
                              <span>{renderInlineMarkdown(b)}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.image && (
                        <figure className="mt-8">
                          <img
                            src={section.image}
                            alt={section.imageCaption ?? ''}
                            loading="lazy"
                            className={`rounded-sm ${section.imageFit === 'cover' ? 'object-cover' : 'object-contain'
                              }`}
                            style={{
                              width: section.imageWidth || '100%',
                              maxHeight: section.imageMaxHeight ? `${section.imageMaxHeight}px` : '400px',
                            }}
                          />
                          {section.imageCaption && (
                            <figcaption className="text-[11px] text-white/60 mt-3 tracking-wide font-mono">
                              {section.imageCaption}
                            </figcaption>
                          )}
                        </figure>
                      )}
                    </motion.section>
                  );
                })}

                {/* Fallback */}
                {!isLoadingContent && (!detailSections || detailSections.length === 0) && (
                  <div className="py-24 text-center">
                    <p className="text-white/60 text-sm uppercase tracking-[0.2em] font-mono">
                      Detailed write-up coming soon
                    </p>
                  </div>
                )}

                {/* Bottom back link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="pt-12 pb-8 border-t border-white/[0.06]"
                >
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-mono"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to projects
                  </button>
                </motion.div>
              </article>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
