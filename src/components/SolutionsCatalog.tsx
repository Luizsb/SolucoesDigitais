import React from 'react';
import { ExternalLink, Share2 } from 'lucide-react';
import { Network, User } from 'lucide-react';
import { STATUS_BADGE_CLASSES } from '../lib/statusStyles';
import { getSolutionCta } from '../lib/solutionCta';
import type { Solution } from '../types/solution';

type SolutionsCatalogProps = {
  solutions: Solution[];
  filtersSlot?: React.ReactNode;
};

export function SolutionsCatalog({ solutions, filtersSlot }: SolutionsCatalogProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-2">Catálogo Completo</h2>
          <p className="text-on-surface-variant">
            Explore todas as iniciativas e ferramentas disponíveis em nossa plataforma.
          </p>
        </div>
      </div>

      {filtersSlot}

      <div className="grid grid-cols-1 gap-4">
        {solutions.map((s) => (
          <div
            key={s.id}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div
                className={`w-16 h-16 rounded-2xl ${s.iconBg} ${s.iconColor} flex items-center justify-center shrink-0 shadow-inner`}
              >
                {React.cloneElement(s.icon as React.ReactElement, { size: 32 })}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-on-surface">{s.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_BADGE_CLASSES[s.status]}`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4 max-w-3xl">
                  {s.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {s.tags.slice(0, 3).map((tag) => (
                    <span
                      key={`${s.id}-tag-${tag}`}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-lg">
                    <User size={14} />
                    <span>
                      Responsável: <span className="text-on-surface font-medium">{s.responsible}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-lg">
                    <Network size={14} />
                    <span>
                      Categoria: <span className="text-on-surface font-medium">{s.category}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex lg:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  className="flex-grow lg:w-32 bg-primary text-on-primary font-bold py-2.5 rounded-xl text-xs hover:opacity-90 transition-all"
                >
                  Ver Detalhes
                </button>
                {(() => {
                  const cta = getSolutionCta(s);
                  if (!cta) return null;
                  return (
                    <a
                      href={cta.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`flex-grow lg:w-40 text-center font-bold py-2.5 rounded-xl text-xs transition-all inline-flex items-center justify-center gap-2 ${
                        cta.kind === 'demo'
                          ? 'bg-surface-container-high border border-outline-variant/45 text-on-surface shadow-sm hover:border-primary/50 hover:bg-primary/10'
                          : 'bg-surface-container-highest text-on-surface hover:bg-outline-variant/30'
                      }`}
                    >
                      {cta.kind === 'demo' ? <Share2 size={14} /> : <ExternalLink size={14} />}
                      {cta.label}
                    </a>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
