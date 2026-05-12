import type { Status } from '../types/solution';

/** Ordem sugerida no select: evolução → experimentação → adoção. */
export const SOLUTION_STATUS_ORDER: readonly Status[] = ['Em desenvolvimento', 'Piloto', 'Em uso'];

/** Conteúdo do tooltip (?) — textos curtos; nomes com cor para leitura em linha. */
export const SOLUTION_STATUS_TOOLTIP: readonly {
  key: Status;
  short: string;
  body: string;
  emphasisClass: string;
}[] = [
  {
    key: 'Em desenvolvimento',
    short: 'Em desenvolvimento',
    body: 'em construção ou evolução; ainda sem uso rotineiro amplo.',
    emphasisClass: 'text-sky-600 dark:text-sky-400',
  },
  {
    key: 'Piloto',
    short: 'Piloto',
    body: 'teste com grupo reduzido antes de ampliar.',
    emphasisClass: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'Em uso',
    short: 'Em uso',
    body: 'já no dia a dia da operação.',
    emphasisClass: 'text-emerald-600 dark:text-emerald-400',
  },
];

/** Tooltip nativo de cada opção na lista suspensa. */
export const SOLUTION_STATUS_OPTION_TITLE: Record<Status, string> = {
  'Em desenvolvimento': 'Em construção ou evolução; ainda não no dia a dia amplo.',
  Piloto: 'Teste controlado com grupo reduzido antes de expandir o uso.',
  'Em uso': 'Uso recorrente no dia a dia da operação.',
};
