import type { FC } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Info, Share2, User } from 'lucide-react';
import { STATUS_BADGE_CLASSES } from '../lib/statusStyles';
import { getSolutionCta } from '../lib/solutionCta';
import type { Solution } from '../types/solution';

type SolutionCardProps = {
  solution: Solution;
  onLearnMore: (s: Solution) => void;
};

export const SolutionCard: FC<SolutionCardProps> = ({ solution, onLearnMore }) => {
  const cta = getSolutionCta(solution);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="group bg-surface-container-low p-6 rounded-2xl transition-all duration-300 hover:bg-surface-container-high glow-card flex flex-col"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl ${solution.iconBg} flex items-center justify-center ${solution.iconColor}`}
          >
            {solution.icon}
          </div>
          <div>
            <span
              className={`font-label text-xs uppercase tracking-widest font-bold ${solution.iconColor}`}
            >
              {solution.category}
            </span>
            <h3 className="text-xl font-bold text-on-surface">{solution.title}</h3>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold font-label uppercase tracking-wider ${STATUS_BADGE_CLASSES[solution.status]}`}
        >
          {solution.status}
        </span>
      </div>

      <div className="space-y-4 mb-8 flex-grow">
        <div className="flex items-center gap-2">
          <User size={14} className="text-on-surface-variant" />
          <span className="text-xs text-on-surface-variant">
            Responsável: <span className="text-on-surface">{solution.responsible}</span>
          </span>
        </div>
        <div className="bg-background/40 p-4 rounded-xl">
          <p className="text-xs font-label uppercase text-on-surface-variant tracking-wider mb-2">
            Impacto Principal
          </p>
          <p className="text-sm text-on-surface leading-snug">{solution.impact}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onLearnMore(solution)}
          className="flex-grow bg-primary text-on-primary font-semibold py-2.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Info size={16} />
          Saiba mais
        </button>

        {cta ? (
          <a
            href={cta.href}
            target="_blank"
            rel="noreferrer noopener"
            className={`flex-grow font-semibold py-2.5 rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
              cta.kind === 'demo'
                ? 'bg-surface-container-high border border-outline-variant/45 text-on-surface shadow-sm hover:border-primary/50 hover:bg-primary/10'
                : 'bg-surface-container-highest text-on-surface hover:bg-outline-variant/30'
            }`}
          >
            {cta.kind === 'demo' ? <Share2 size={14} /> : <ExternalLink size={14} />}
            {cta.label}
          </a>
        ) : null}
      </div>
    </motion.div>
  );
};
