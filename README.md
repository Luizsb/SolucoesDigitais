# Portfólio de Soluções Digitais

Plataforma interna para organizar, divulgar e consultar soluções digitais do time em um catálogo único, com foco em reutilização, visibilidade e impacto operacional.

## Resumo da plataforma

O portfólio centraliza soluções em uso, em piloto e em desenvolvimento, permitindo:

- busca rápida por nome, impacto, descrição, responsável, categoria, tags e tipos;
- filtros por status, categoria e responsável;
- visualização em grade e lista;
- abertura de detalhes com contexto funcional, links e metadados importantes;
- incentivo ao cadastro de novas soluções para manter a base viva.

A fonte de dados atual é uma planilha Google Sheets publicada em CSV, consumida diretamente pelo front-end.

## Tecnologias usadas

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Motion (animações)
- Lucide React (ícones)

## Arquitetura (visão geral)

- `src/App.tsx`: composição da tela principal, estados globais, filtros e fluxo de navegação.
- `src/components/`: componentes visuais da interface (cards, lista, modal, navegação).
- `src/lib/loadSolutionsFromCsv.tsx`: leitura, parsing e mapeamento do CSV para o modelo interno.
- `src/lib/solutionCta.ts`: regras de CTA para botões de acesso (solução, demo, documentação).
- `src/types/solution.ts`: tipagem central das soluções.
- `src/assets/`: ícones, capas e recursos visuais.

## Fonte de dados (CSV público)

O catálogo carrega os dados a partir de uma planilha Google Sheets publicada em CSV, com endpoint configurado internamente no projeto.

### Observações do carregamento

- linhas sem `nome_solucao` são descartadas;
- campos multi-valor com `;` são tratados como listas (tags, tipos etc.);
- status é normalizado para `Em uso`, `Piloto` ou `Em desenvolvimento`;
- há fallbacks visuais por categoria (ícone, cores e capa).

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm

### Comandos

```bash
npm install
npm run dev
```

Aplicação local: `http://localhost:3000`

## Build e validação

```bash
npm run lint
npm run build
```

## Missão do produto

Transformar conhecimento interno em soluções digitais reutilizáveis, conectando pessoas, processos e tecnologia para elevar a qualidade, acelerar entregas e gerar impacto real no dia a dia da operação.
