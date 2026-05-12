import type { Solution } from '../types/solution';

function block(title: string, body: string | undefined | null): string {
  const t = body?.trim();
  if (!t) return '';
  return `## ${title}\n\n${t}\n\n`;
}

function listSection(title: string, items: string[]): string {
  if (!items.length) return '';
  const lines = items.map((item) => `- ${item}`).join('\n');
  return `## ${title}\n\n${lines}\n\n`;
}

function chipsLine(title: string, items: string[]): string {
  if (!items.length) return '';
  return `**${title}:** ${items.join(', ')}\n\n`;
}

/** Ficha da solução em Markdown (e-mail, wiki, PR etc.). */
export function solutionToMarkdown(solution: Solution): string {
  const parts: string[] = [];

  parts.push(`# ${solution.title}\n`);
  parts.push(
    `**Categoria:** ${solution.category}  \n**Status:** ${solution.status}  \n**Responsável(is):** ${solution.responsible.replace(/\s*;\s*/g, ', ')}\n\n`,
  );

  parts.push(block('O que é', solution.oQueE));

  if (solution.quandoUsar.length > 0) {
    parts.push(listSection('Quando usar', solution.quandoUsar));
  }

  parts.push(block('Problema que resolve', solution.problemSolved));

  const resultados = solution.resultadoEsperado
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
  if (resultados.length > 0) {
    parts.push(listSection('Impacto / resultado esperado', resultados));
  }

  parts.push(block('Como acessar / usar', solution.comoUsar));

  const links: string[] = [];
  if (solution.link) links.push(`- Solução: ${solution.link}`);
  if (solution.demoLink) links.push(`- Demo: ${solution.demoLink}`);
  if (solution.documentationLink) links.push(`- Documentação: ${solution.documentationLink}`);
  if (links.length) {
    parts.push(`## Links\n\n${links.join('\n')}\n\n`);
  }

  parts.push(chipsLine('Tipos de problema', solution.problemTypes));
  parts.push(chipsLine('Tipos de impacto', solution.impactTypes));
  parts.push(chipsLine('Tags', solution.tags));

  parts.push(block('Observações', solution.observacoes));

  return parts.join('').trimEnd() + '\n';
}
