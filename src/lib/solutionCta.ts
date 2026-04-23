import type { Solution } from '../types/solution';

export type SolutionCta = {
  href: string;
  label: string;
  kind: 'demo' | 'access' | 'docs';
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getAccessLabel(solution: Solution): string {
  const category = normalizeText(solution.category);
  if (category.includes('ferramenta')) return 'Acessar ferramenta';
  if (category.includes('demo')) return 'Acessar demo';
  return 'Acessar solução';
}

export function getSolutionCta(solution: Solution): SolutionCta | null {
  if (solution.demoLink) {
    return {
      href: solution.demoLink,
      label: 'Acessar demo',
      kind: 'demo',
    };
  }

  if (solution.link) {
    return {
      href: solution.link,
      label: getAccessLabel(solution),
      kind: 'access',
    };
  }

  if (solution.documentationLink) {
    return {
      href: solution.documentationLink,
      label: 'Abrir documentação',
      kind: 'docs',
    };
  }

  return null;
}
