import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Info,
  Rocket,
  Share2,
  User,
  X,
} from 'lucide-react';
import { STATUS_BADGE_CLASSES } from '../lib/statusStyles';
import type { Solution } from '../types/solution';
import type { ResponsibleLinksMap } from '../lib/loadSolutionsFromCsv';
import { ResponsibleNames } from './ResponsibleNames';

type SolutionModalProps = {
  solution: Solution;
  onClose: () => void;
  responsibleLinks: ResponsibleLinksMap;
};

export function SolutionModal({ solution, onClose, responsibleLinks }: SolutionModalProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const responsibleList = solution.responsible
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
  const resultadoItems = solution.resultadoEsperado
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto">
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
        className="relative w-full md:w-[94vw] max-w-[1400px] bg-surface-container rounded-3xl shadow-2xl border border-outline-variant/10 grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)] max-h-none md:h-[90vh] overflow-visible md:overflow-hidden mx-auto my-3 md:my-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="w-full h-48 md:h-auto relative md:min-h-[620px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary-dim/40 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,191,250,0.35),transparent_45%)]" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-center items-center md:items-start text-center md:text-left p-6 gap-4">
            <div
              className={`w-12 h-12 rounded-xl ${solution.iconBg} flex items-center justify-center ${solution.iconColor} mb-3 backdrop-blur-md`}
            >
              {React.cloneElement(solution.icon as React.ReactElement, { size: 28 })}
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">{solution.title}</h2>
            <div className="w-full max-w-[280px] md:max-w-none rounded-xl border border-white/15 bg-black/25 backdrop-blur-sm p-3 space-y-3">
              <div className="space-y-2">
                <p className="text-[10px] font-label uppercase tracking-wider text-white/70">Tipo e status</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/25">
                    {solution.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_BADGE_CLASSES[solution.status]}`}
                  >
                    {solution.status}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-label uppercase tracking-wider text-white/70">
                  {responsibleList.length > 1 ? 'Responsáveis' : 'Responsável'}
                </p>
                <div className="space-y-1 text-center md:text-left">
                  {responsibleList.map((name) => (
                    <p key={`left-resp-${name}`} className="text-xs text-white/90">
                      <ResponsibleNames responsible={name} responsibleLinks={responsibleLinks} />
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 min-h-0 p-5 md:p-8 lg:p-10 pb-10 md:pb-14 overflow-visible md:overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <Info size={14} /> Entenda rápido
              </h4>
              <div className="space-y-4">
                <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-4">
                  <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-2">O que é</p>
                  <p className="text-sm text-on-surface leading-relaxed">{solution.oQueE}</p>
                </div>
                <div className="rounded-xl border border-primary/25 bg-primary/10 p-4">
                  <p className="text-xs font-label uppercase tracking-wider text-primary mb-2">Quando usar</p>
                  {solution.quandoUsar.length > 0 ? (
                    <ul className="space-y-1.5">
                      {solution.quandoUsar.map((item) => (
                        <li key={item} className="text-sm text-on-surface flex gap-2">
                          <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-on-surface-variant">Não informado.</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Contexto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-tertiary/35 bg-tertiary/10 p-4">
                  <p className="text-sm font-bold uppercase tracking-wider text-tertiary mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    Problema que resolve
                  </p>
                  <p className="text-sm text-on-surface leading-relaxed font-medium">
                    {solution.problemSolved || 'Não informado.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-secondary/35 bg-secondary/10 p-4">
                  <p className="text-sm font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
                    <Rocket size={14} />
                    Impacto / Resultado
                  </p>
                  <ul className="space-y-2">
                    {(resultadoItems.length > 0 ? resultadoItems : [solution.resultadoEsperado]).map((item) => (
                      <li key={`resultado-${item}`} className="text-sm text-on-surface flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-secondary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                <Share2 size={14} /> Como acessar / usar
              </h4>
              <p className="text-base text-on-surface-variant leading-relaxed mb-4">
                {solution.comoUsar || 'Use os links disponíveis para acessar, testar ou consultar documentação.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {solution.link && (
                  <a
                    href={solution.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-3 rounded-xl text-base font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} /> Acessar solução
                  </a>
                )}
                {solution.demoLink && (
                  <a
                    href={solution.demoLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-3 rounded-xl text-base font-semibold bg-surface-container-high border border-outline-variant/30 text-on-surface hover:border-primary/50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Share2 size={16} /> Acessar demo
                  </a>
                )}
                {solution.documentationLink && (
                  <a
                    href={solution.documentationLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-3 rounded-xl text-base font-semibold bg-surface-container-high border border-outline-variant/30 text-on-surface hover:border-primary/50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} /> Ver documentação
                  </a>
                )}
              </div>
            </section>

            {(solution.problemTypes.length > 0 ||
              solution.impactTypes.length > 0 ||
              solution.tags.length > 0 ||
              solution.observacoes) && (
              <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen((prev) => !prev)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-surface-container-low/60 transition-colors"
                >
                  <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface">Detalhes técnicos</h4>
                  <ChevronDown
                    size={18}
                    className={`text-on-surface-variant transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDetailsOpen && (
                  <div className="border-t border-outline-variant/15 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {solution.problemTypes.length > 0 && (
                        <div>
                          <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-2">
                            Tipo de problema
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {solution.problemTypes.map((item) => (
                              <span
                                key={`problem-${item}`}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-container-high border border-outline-variant/15 text-on-surface-variant"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {solution.impactTypes.length > 0 && (
                        <div>
                          <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-2">
                            Tipo de impacto
                          </p>
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
                          <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-2">Tags</p>
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
                    </div>

                    {solution.observacoes && (
                      <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-4">
                        <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-2">
                          Observações
                        </p>
                        <p className="text-sm text-on-surface leading-relaxed">{solution.observacoes}</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            <div className="pt-2 mb-6 md:mb-10">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
