import type { FC } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { STATUS_BADGE_CLASSES } from '../lib/statusStyles';
import { getSolutionCta } from '../lib/solutionCta';
import type { Solution } from '../types/solution';
import type { ResponsibleLinksMap } from '../lib/loadSolutionsFromCsv';
import { ResponsibleNames } from './ResponsibleNames';

type SolutionListRowProps = {
  solution: Solution;
  onLearnMore: (s: Solution) => void;
  responsibleLinks: ResponsibleLinksMap;
  isTourTarget?: boolean;
};

export const SolutionListRow: FC<SolutionListRowProps> = ({
  solution,
  onLearnMore,
  responsibleLinks,
  isTourTarget = false,
}) => {
  const cta = getSolutionCta(solution);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-6 bg-surface-container-low p-4 rounded-xl hover:bg-surface-container-high transition-all group border border-transparent hover:border-outline-variant/10"
    >
      <div
        className={`w-10 h-10 rounded-lg ${solution.iconBg} flex items-center justify-center ${solution.iconColor} shrink-0`}
      >
        {React.cloneElement(solution.icon as React.ReactElement, { size: 20 })}
      </div>

      <div className="flex-grow min-w-0">
        <div className="min-w-0">
          <h3 className="font-bold text-on-surface truncate">{solution.title}</h3>
          <p className="text-xs text-on-surface-variant truncate">{solution.category}</p>
        </div>
      </div>

      <div className="hidden lg:flex lg:items-center lg:gap-3 lg:min-w-0">
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold font-label uppercase tracking-wider ${STATUS_BADGE_CLASSES[solution.status]}`}
        >
          {solution.status}
        </span>
        <div className="flex items-center gap-2">
          <User size={12} className="text-on-surface-variant" />
          <ResponsibleNames
            responsible={solution.responsible}
            responsibleLinks={responsibleLinks}
            className="text-xs text-on-surface-variant truncate max-w-[220px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 lg:ml-auto">
        <button
          type="button"
          onClick={() => onLearnMore(solution)}
          data-tour={isTourTarget ? 'saiba-mais' : undefined}
          className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/10"
        >
          Saiba mais
        </button>
        {cta ? (
          <a
            href={cta.href}
            target="_blank"
            rel="noreferrer noopener"
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              cta.kind === 'demo'
                ? 'bg-surface-container-high border border-outline-variant/45 text-on-surface shadow-sm hover:border-primary/50 hover:bg-primary/10'
                : 'bg-surface-container-highest text-on-surface hover:bg-outline-variant/30'
            }`}
          >
            {cta.label}
          </a>
        ) : null}
      </div>
    </motion.div>
  );
};
