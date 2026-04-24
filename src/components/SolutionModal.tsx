import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ExternalLink,
  Info,
  Share2,
  Target,
  User,
  X,
  Zap,
} from 'lucide-react';
import { STATUS_BADGE_CLASSES } from '../lib/statusStyles';
import { getSolutionCta } from '../lib/solutionCta';
import type { Solution } from '../types/solution';

type SolutionModalProps = {
  solution: Solution;
  onClose: () => void;
};

export function SolutionModal({ solution, onClose }: SolutionModalProps) {
  const cta = getSolutionCta(solution);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-surface-container rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 flex flex-col md:flex-row max-h-[90vh]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-2/5 h-48 md:h-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary-dim/40 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,191,250,0.35),transparent_45%)]" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <div
              className={`w-12 h-12 rounded-xl ${solution.iconBg} flex items-center justify-center ${solution.iconColor} mb-3 backdrop-blur-md`}
            >
              {React.cloneElement(solution.icon as React.ReactElement, { size: 28 })}
            </div>
            <h2 className="text-3xl font-bold text-white">{solution.title}</h2>
            <p className="text-white/80 text-sm">{solution.category}</p>
          </div>
        </div>

        <div className="flex-grow p-6 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-label uppercase tracking-widest ${STATUS_BADGE_CLASSES[solution.status]}`}
            >
              {solution.status}
            </span>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <User size={16} />
              <span className="text-sm font-medium">Responsável: {solution.responsible}</span>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <Info size={14} /> Sobre a Solução
              </h4>
              <p className="text-on-surface leading-relaxed">{solution.description}</p>
            </section>

            {solution.problemSolved && (
              <section>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  Problema resolvido
                </h4>
                <p className="text-on-surface leading-relaxed">{solution.problemSolved}</p>
              </section>
            )}

            {(solution.problemTypes.length > 0 || solution.impactTypes.length > 0 || solution.tags.length > 0) && (
              <section className="space-y-4">
                {solution.problemTypes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                      Tipo de problema
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {solution.problemTypes.map((item) => (
                        <span
                          key={`problem-${item}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-container-low border border-outline-variant/10 text-on-surface-variant"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {solution.impactTypes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                      Tipo de impacto
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {solution.impactTypes.map((item) => (
                        <span
                          key={`impact-${item}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {solution.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {solution.tags.map((item) => (
                        <span
                          key={`tag-${item}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                  <Target size={14} /> Impacto Gerado
                </h4>
                <p className="text-sm text-on-surface leading-relaxed italic">
                  {`"${solution.impact}"`}
                </p>
              </div>

              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-tertiary mb-4 flex items-center gap-2">
                  <Zap size={14} /> Funcionalidades
                </h4>
                <ul className="space-y-2">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="text-sm text-on-surface flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-tertiary mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {(solution.link || solution.demoLink || solution.documentationLink) && (
              <section>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  Links disponíveis
                </h4>
                <div className="space-y-2 text-sm">
                  {solution.link && (
                    <a
                      href={solution.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors"
                    >
                      <ExternalLink size={14} /> Ferramenta/Solução
                    </a>
                  )}
                  {solution.demoLink && (
                    <a
                      href={solution.demoLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors"
                    >
                      <Share2 size={14} /> Demo
                    </a>
                  )}
                  {solution.documentationLink && (
                    <a
                      href={solution.documentationLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors"
                    >
                      <ExternalLink size={14} /> Documentação
                    </a>
                  )}
                </div>
              </section>
            )}

            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-grow bg-primary text-on-primary font-bold py-4 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] shadow-xl shadow-primary/20"
              >
                Fechar
              </button>
              {cta ? (
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                    cta.kind === 'demo'
                      ? 'bg-surface-container-high border border-outline-variant/45 text-on-surface shadow-sm hover:border-primary/50 hover:bg-primary/10'
                      : 'bg-surface-container-highest text-on-surface hover:bg-outline-variant/30'
                  }`}
                >
                  {cta.kind === 'demo' ? <Share2 size={18} /> : <ExternalLink size={18} />}
                  {cta.label}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
