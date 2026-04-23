import type { ReactNode } from 'react';

export type Status = 'Em uso' | 'Piloto' | 'Em desenvolvimento';
export type ViewMode = 'grid' | 'list';
export type Theme = 'light' | 'dark';
export type Tab = 'dashboard' | 'solutions';

export interface Solution {
  id: string;
  title: string;
  category: string;
  status: Status;
  responsible: string;
  problemSolved?: string;
  problemTypes: string[];
  impact: string;
  impactTypes: string[];
  description: string;
  tags: string[];
  link?: string;
  demoLink?: string;
  documentationLink?: string;
  features: string[];
  imageUrl: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}
