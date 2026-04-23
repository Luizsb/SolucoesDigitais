import type { Status } from '../types/solution';

export const STATUS_BADGE_CLASSES: Record<Status, string> = {
  'Em uso': 'bg-secondary/10 text-secondary',
  Piloto: 'bg-tertiary/10 text-tertiary',
  'Em desenvolvimento': 'bg-primary/10 text-primary',
};
