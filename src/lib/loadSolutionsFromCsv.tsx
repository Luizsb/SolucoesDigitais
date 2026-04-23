import {
  BarChart3,
  BrainCircuit,
  FolderKanban,
  Network,
  Scale,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import coverAcervo from '../assets/covers/acervo.svg';
import coverBrieflab from '../assets/covers/brieflab.svg';
import coverContract from '../assets/covers/contract.svg';
import coverDash from '../assets/covers/dash.svg';
import coverGenius from '../assets/covers/genius.svg';
import coverPdf from '../assets/covers/pdf.svg';
import type { Solution, Status } from '../types/solution';

const DEFAULT_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTxF9erQcxDy42u8AuIjCjVZdnVrph0rni9egi1q_9l15iZQJHJjoimAmCnN10YPKWf9UrBIUMrtfKh/pub?gid=0&single=true&output=csv';

type CsvRow = Record<string, string>;

type CategoryPresentation = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  imageUrl: string;
};

const CATEGORY_PRESENTATION: Array<{ keywords: string[]; visual: CategoryPresentation }> = [
  {
    keywords: ['ia', 'estrateg', 'atendimento', 'genius'],
    visual: {
      icon: BrainCircuit,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      imageUrl: coverBrieflab,
    },
  },
  {
    keywords: ['acervo', 'ativo', 'document'],
    visual: {
      icon: FolderKanban,
      iconBg: 'bg-tertiary/10',
      iconColor: 'text-tertiary',
      imageUrl: coverAcervo,
    },
  },
  {
    keywords: ['analytics', 'kpi', 'dash'],
    visual: {
      icon: BarChart3,
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
      imageUrl: coverDash,
    },
  },
  {
    keywords: ['automa', 'workflow', 'pdf'],
    visual: {
      icon: Workflow,
      iconBg: 'bg-on-surface/5',
      iconColor: 'text-on-surface',
      imageUrl: coverPdf,
    },
  },
  {
    keywords: ['jurid', 'contrat'],
    visual: {
      icon: Scale,
      iconBg: 'bg-tertiary/10',
      iconColor: 'text-tertiary',
      imageUrl: coverContract,
    },
  },
  {
    keywords: ['compliance', 'risco', 'seguran'],
    visual: {
      icon: ShieldCheck,
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
      imageUrl: coverGenius,
    },
  },
];

const DEFAULT_VISUAL: CategoryPresentation = {
  icon: Network,
  iconBg: 'bg-primary/10',
  iconColor: 'text-primary',
  imageUrl: coverGenius,
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseCsv(csvText: string): CsvRow[] {
  const rows: string[][] = [];
  let currentCell = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ',') {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentCell = '';
      currentRow = [];
      continue;
    }

    currentCell += char;
  }

  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  const [headerRow, ...dataRows] = rows;
  if (!headerRow) return [];

  const headers = headerRow.map((h) => h.trim().replace(/^\uFEFF/, ''));
  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ''))
    .map((row) => {
      const entry: CsvRow = {};
      headers.forEach((header, index) => {
        entry[header] = (row[index] ?? '').trim();
      });
      return entry;
    });
}

function splitMultiValue(value: string): string[] {
  return value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapStatus(value: string): Status {
  const raw = normalizeText(value);
  if (raw.includes('uso') || raw.includes('produc')) return 'Em uso';
  if (raw.includes('pilot')) return 'Piloto';
  return 'Em desenvolvimento';
}

function getVisualByCategory(category: string): CategoryPresentation {
  const normalized = normalizeText(category);
  const found = CATEGORY_PRESENTATION.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );
  return found?.visual ?? DEFAULT_VISUAL;
}

function hasSolutionName(row: CsvRow): boolean {
  return Boolean(row.nome_solucao?.trim());
}

function mapRowToSolution(row: CsvRow, index: number): Solution {
  const id = row.id?.trim() || `csv-${index + 1}`;
  const title = row.nome_solucao.trim();
  const category = row.categoria?.trim() || 'Geral';
  const status = mapStatus(row.status ?? '');
  const responsible = row.responsavel?.trim() || row.area_responsavel?.trim() || 'Não definido';
  const problemSolved = row.problema_resolvido?.trim() || undefined;
  const problemTypes = splitMultiValue(row.tipo_problema ?? '');
  const impact = row.impacto_principal?.trim() || 'Impacto não informado';
  const impactTypes = splitMultiValue(row.tipo_impacto ?? '');
  const tags = splitMultiValue(row.tags ?? '');
  const description =
    row.observacoes?.trim() || row.problema_resolvido?.trim() || 'Descrição não informada.';
  const link = row.link_acesso?.trim() || undefined;
  const demoLink = row.link_demo?.trim() || undefined;
  const documentationLink = row.link_documentacao?.trim() || undefined;
  const features = [...tags, ...impactTypes];
  const normalizedFeatures = Array.from(new Set(features));

  const visual = getVisualByCategory(category);
  const Icon = visual.icon;

  const fallbackFeatures = splitMultiValue(row.tipo_problema ?? '');

  return {
    id,
    title,
    category,
    status,
    responsible,
    problemSolved,
    problemTypes,
    impact,
    impactTypes,
    description,
    tags,
    link,
    demoLink,
    documentationLink,
    features: normalizedFeatures.length > 0 ? normalizedFeatures : fallbackFeatures.length > 0 ? fallbackFeatures : ['Sem tags'],
    imageUrl: visual.imageUrl,
    icon: <Icon size={24} />,
    iconBg: visual.iconBg,
    iconColor: visual.iconColor,
  };
}

export async function loadSolutionsFromCsv(csvUrl: string = DEFAULT_CSV_URL): Promise<Solution[]> {
  const response = await fetch(csvUrl, {
    method: 'GET',
    headers: { Accept: 'text/csv' },
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar CSV (${response.status})`);
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);
  return rows.filter(hasSolutionName).map(mapRowToSolution);
}
