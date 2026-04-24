import type { Status } from '../types/solution';

export const STATUS_BADGE_CLASSES: Record<Status, string> = {
  'Em uso':
    'bg-secondary/20 text-secondary border border-secondary/35 shadow-sm shadow-secondary/20',
  Piloto: 'bg-tertiary/20 text-tertiary border border-tertiary/35 shadow-sm shadow-tertiary/20',
  'Em desenvolvimento':
    'bg-primary/20 text-primary border border-primary/35 shadow-sm shadow-primary/20',
};
