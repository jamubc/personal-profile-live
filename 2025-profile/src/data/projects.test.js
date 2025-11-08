import { describe, it, expect } from 'vitest';
import { projects } from './projects.js';

describe('projects data', () => {
  describe('structure', () => {
    it('exports a projects array', () => {
      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
    });

    it('contains at least one project', () => {
      expect(projects.length).toBeGreaterThan(0);
    });

    it('has exactly 2 projects', () => {
      expect(projects).toHaveLength(2);
    });
  });

  describe('project schema', () => {
    it('all projects have required fields', () => {
      projects.forEach((project, index) => {
        expect(project, `Project ${index} missing id`).toHaveProperty('id');
        expect(project, `Project ${index} missing title`).toHaveProperty('title');
        expect(project, `Project ${index} missing description`).toHaveProperty('description');
        expect(project, `Project ${index} missing techStack`).toHaveProperty('techStack');
        expect(project, `Project ${index} missing metrics`).toHaveProperty('metrics');
        expect(project, `Project ${index} missing links`).toHaveProperty('links');
        expect(project, `Project ${index} missing badges`).toHaveProperty('badges');
        expect(project, `Project ${index} missing featured`).toHaveProperty('featured');
      });
    });

    it('all projects have unique IDs', () => {
      const ids = projects.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all project IDs are positive numbers', () => {
      projects.forEach(project => {
        expect(typeof project.id).toBe('number');
        expect(project.id).toBeGreaterThan(0);
      });
    });
  });

  describe('project titles', () => {
    it('all titles are non-empty strings', () => {
      projects.forEach(project => {
        expect(typeof project.title).toBe('string');
        expect(project.title.length).toBeGreaterThan(0);
      });
    });

    it('titles are properly capitalized', () => {
      projects.forEach(project => {
        expect(project.title[0]).toBe(project.title[0].toUpperCase());
      });
    });
  });

  describe('project descriptions', () => {
    it('all descriptions are non-empty strings', () => {
      projects.forEach(project => {
        expect(typeof project.description).toBe('string');
        expect(project.description.length).toBeGreaterThan(0);
      });
    });

    it('descriptions are meaningful (at least 20 characters)', () => {
      projects.forEach(project => {
        expect(project.description.length).toBeGreaterThanOrEqual(20);
      });
    });
  });

  describe('techStack', () => {
    it('all techStacks are arrays', () => {
      projects.forEach(project => {
        expect(Array.isArray(project.techStack)).toBe(true);
      });
    });

    it('all techStacks contain at least one technology', () => {
      projects.forEach(project => {
        expect(project.techStack.length).toBeGreaterThan(0);
      });
    });

    it('all techStack entries are non-empty strings', () => {
      projects.forEach(project => {
        project.techStack.forEach(tech => {
          expect(typeof tech).toBe('string');
          expect(tech.length).toBeGreaterThan(0);
        });
      });
    });

    it('techStacks have no duplicate technologies', () => {
      projects.forEach(project => {
        const uniqueTech = new Set(project.techStack);
        expect(uniqueTech.size).toBe(project.techStack.length);
      });
    });
  });

  describe('metrics', () => {
    it('all metrics are arrays', () => {
      projects.forEach(project => {
        expect(Array.isArray(project.metrics)).toBe(true);
      });
    });

    it('all metrics arrays contain at least one metric', () => {
      projects.forEach(project => {
        expect(project.metrics.length).toBeGreaterThan(0);
      });
    });

    it('all metric entries are non-empty strings', () => {
      projects.forEach(project => {
        project.metrics.forEach(metric => {
          expect(typeof metric).toBe('string');
          expect(metric.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('links', () => {
    it('all links are objects', () => {
      projects.forEach(project => {
        expect(typeof project.links).toBe('object');
        expect(project.links).not.toBeNull();
      });
    });

    it('all links objects have github and demo properties', () => {
      projects.forEach(project => {
        expect(project.links).toHaveProperty('github');
        expect(project.links).toHaveProperty('demo');
      });
    });

    it('all github links are valid URLs', () => {
      projects.forEach(project => {
        expect(project.links.github).toMatch(/^https:\/\//);
        expect(project.links.github).toContain('github.com');
      });
    });

    it('all demo links are valid URLs', () => {
      projects.forEach(project => {
        expect(project.links.demo).toMatch(/^https:\/\//);
      });
    });

    it('github links follow correct format', () => {
      projects.forEach(project => {
        expect(project.links.github).toMatch(/^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/);
      });
    });
  });

  describe('badges', () => {
    it('all badges are objects', () => {
      projects.forEach(project => {
        expect(typeof project.badges).toBe('object');
        expect(project.badges).not.toBeNull();
      });
    });

    it('all badges objects have npm and github properties', () => {
      projects.forEach(project => {
        expect(project.badges).toHaveProperty('npm');
        expect(project.badges).toHaveProperty('github');
      });
    });

    it('all badge values are non-empty strings', () => {
      projects.forEach(project => {
        expect(typeof project.badges.npm).toBe('string');
        expect(project.badges.npm.length).toBeGreaterThan(0);
        expect(typeof project.badges.github).toBe('string');
        expect(project.badges.github.length).toBeGreaterThan(0);
      });
    });

    it('github badge format matches repository path', () => {
      projects.forEach(project => {
        expect(project.badges.github).toMatch(/^[\w-]+\/[\w-]+$/);
      });
    });
  });

  describe('featured flag', () => {
    it('all featured flags are booleans', () => {
      projects.forEach(project => {
        expect(typeof project.featured).toBe('boolean');
      });
    });

    it('at least one project is featured', () => {
      const featuredCount = projects.filter(p => p.featured).length;
      expect(featuredCount).toBeGreaterThan(0);
    });
  });

  describe('specific project content', () => {
    describe('first project', () => {
      const project = projects[0];

      it('is the Gemini MCP Tool', () => {
        expect(project.title).toBe('Gemini MCP Tool');
      });

      it('has correct technologies', () => {
        expect(project.techStack).toContain('MCP');
        expect(project.techStack).toContain('TypeScript');
      });

      it('includes download metrics', () => {
        expect(project.metrics[0]).toContain('260K downloads');
      });

      it('is featured', () => {
        expect(project.featured).toBe(true);
      });
    });
  });

  describe('data consistency', () => {
    it('npm badge matches package name convention', () => {
      projects.forEach(project => {
        expect(project.badges.npm).toMatch(/^[\w-]+$/);
      });
    });

    it('links and badges reference the same repository', () => {
      projects.forEach(project => {
        const repoPath = project.links.github.replace('https://github.com/', '').replace(/\/$/, '');
        expect(project.badges.github).toBe(repoPath);
      });
    });
  });
});
