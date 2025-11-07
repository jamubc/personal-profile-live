import { describe, it, expect } from 'vitest';
import { skills } from './skills.js';

describe('skills data', () => {
  describe('structure', () => {
    it('exports a skills object', () => {
      expect(skills).toBeDefined();
      expect(typeof skills).toBe('object');
    });

    it('contains all required categories', () => {
      expect(skills).toHaveProperty('languages');
      expect(skills).toHaveProperty('frameworks');
      expect(skills).toHaveProperty('tools');
      expect(skills).toHaveProperty('practices');
    });

    it('has exactly 4 categories', () => {
      expect(Object.keys(skills)).toHaveLength(4);
    });
  });

  describe('languages', () => {
    it('is an array', () => {
      expect(Array.isArray(skills.languages)).toBe(true);
    });

    it('contains expected programming languages', () => {
      expect(skills.languages).toContain('JavaScript');
      expect(skills.languages).toContain('TypeScript');
      expect(skills.languages).toContain('Python');
      expect(skills.languages).toContain('Go');
      expect(skills.languages).toContain('SQL');
    });

    it('has the correct count', () => {
      expect(skills.languages).toHaveLength(5);
    });

    it('contains only non-empty strings', () => {
      skills.languages.forEach(lang => {
        expect(typeof lang).toBe('string');
        expect(lang.length).toBeGreaterThan(0);
      });
    });

    it('has no duplicate entries', () => {
      const uniqueLanguages = new Set(skills.languages);
      expect(uniqueLanguages.size).toBe(skills.languages.length);
    });
  });

  describe('frameworks', () => {
    it('is an array', () => {
      expect(Array.isArray(skills.frameworks)).toBe(true);
    });

    it('contains expected frameworks', () => {
      expect(skills.frameworks).toContain('React');
      expect(skills.frameworks).toContain('Next.js');
      expect(skills.frameworks).toContain('Node.js');
      expect(skills.frameworks).toContain('FastAPI');
      expect(skills.frameworks).toContain('Tailwind CSS');
    });

    it('has the correct count', () => {
      expect(skills.frameworks).toHaveLength(5);
    });

    it('contains only non-empty strings', () => {
      skills.frameworks.forEach(framework => {
        expect(typeof framework).toBe('string');
        expect(framework.length).toBeGreaterThan(0);
      });
    });

    it('has no duplicate entries', () => {
      const uniqueFrameworks = new Set(skills.frameworks);
      expect(uniqueFrameworks.size).toBe(skills.frameworks.length);
    });
  });

  describe('tools', () => {
    it('is an array', () => {
      expect(Array.isArray(skills.tools)).toBe(true);
    });

    it('contains expected tools', () => {
      expect(skills.tools).toContain('Git');
      expect(skills.tools).toContain('Docker');
      expect(skills.tools).toContain('PostgreSQL');
      expect(skills.tools).toContain('Vite');
      expect(skills.tools).toContain('VS Code');
    });

    it('has the correct count', () => {
      expect(skills.tools).toHaveLength(5);
    });

    it('contains only non-empty strings', () => {
      skills.tools.forEach(tool => {
        expect(typeof tool).toBe('string');
        expect(tool.length).toBeGreaterThan(0);
      });
    });

    it('has no duplicate entries', () => {
      const uniqueTools = new Set(skills.tools);
      expect(uniqueTools.size).toBe(skills.tools.length);
    });
  });

  describe('practices', () => {
    it('is an array', () => {
      expect(Array.isArray(skills.practices)).toBe(true);
    });

    it('contains expected practices', () => {
      expect(skills.practices).toContain('Test-Driven Development');
      expect(skills.practices).toContain('CI/CD');
      expect(skills.practices).toContain('Code Review');
      expect(skills.practices).toContain('Agile');
    });

    it('has the correct count', () => {
      expect(skills.practices).toHaveLength(4);
    });

    it('contains only non-empty strings', () => {
      skills.practices.forEach(practice => {
        expect(typeof practice).toBe('string');
        expect(practice.length).toBeGreaterThan(0);
      });
    });

    it('has no duplicate entries', () => {
      const uniquePractices = new Set(skills.practices);
      expect(uniquePractices.size).toBe(skills.practices.length);
    });
  });

  describe('data integrity', () => {
    it('is not frozen or sealed (can be extended if needed)', () => {
      expect(Object.isFrozen(skills)).toBe(false);
      expect(Object.isSealed(skills)).toBe(false);
    });

    it('has all arrays that are not frozen', () => {
      expect(Object.isFrozen(skills.languages)).toBe(false);
      expect(Object.isFrozen(skills.frameworks)).toBe(false);
      expect(Object.isFrozen(skills.tools)).toBe(false);
      expect(Object.isFrozen(skills.practices)).toBe(false);
    });
  });
});
