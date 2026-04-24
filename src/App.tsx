/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  Grid,
  List as ListIcon,
  LoaderCircle,
  Plus,
  User,
  Zap,
} from 'lucide-react';
import mascoteOficial from './assets/MascoteID.png';
import { loadResponsibleLinksFromSheet, loadSolutionsFromCsv } from './lib/loadSolutionsFromCsv';
import type { ResponsibleLinksMap } from './lib/loadSolutionsFromCsv';
import type { Solution, Tab, Theme, ViewMode } from './types/solution';
import { KPICard } from './components/KPICard';
import { SolutionCard } from './components/SolutionCard';
import { SolutionListRow } from './components/SolutionListRow';
import { SolutionModal } from './components/SolutionModal';
import { SolutionsCatalog } from './components/SolutionsCatalog';
import { TopNavBar } from './components/TopNavBar';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoadingSolutions, setIsLoadingSolutions] = useState<boolean>(true);
  const [solutionsError, setSolutionsError] = useState<string | null>(null);
  const [responsibleLinks, setResponsibleLinks] = useState<ResponsibleLinksMap>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [responsibleFilter, setResponsibleFilter] = useState<string>('Todos');
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoadingSolutions(true);
      setSolutionsError(null);
      try {
        const csvSolutions = await loadSolutionsFromCsv();
        if (!isMounted) return;

        try {
          const linksByResponsible = await loadResponsibleLinksFromSheet();
          if (isMounted) {
            setResponsibleLinks(linksByResponsible);
          }
        } catch {
          // Não bloqueia o carregamento principal de soluções.
          if (isMounted) {
            setResponsibleLinks({});
          }
        }

        if (csvSolutions.length === 0) {
          setSolutions([]);
          setSolutionsError('A planilha foi carregada, mas não há soluções cadastradas.');
        } else {
          setSolutions(csvSolutions);
        }
      } catch {
        if (!isMounted) return;
        setSolutions([]);
        setSolutionsError('Não foi possível carregar as soluções da planilha agora.');
      } finally {
        if (isMounted) {
          setIsLoadingSolutions(false);
        }
      }
    };

    void loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const normalizeSearch = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const splitResponsibles = (value: string): string[] =>
    value
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean);

  const categories = ['Todas', ...new Set(solutions.map((s) => s.category))];
  const responsibles = [
    'Todos',
    ...new Set(solutions.flatMap((s) => splitResponsibles(s.responsible))),
  ];
  const hasActiveFilters =
    activeFilter !== 'Todos' ||
    categoryFilter !== 'Todas' ||
    responsibleFilter !== 'Todos' ||
    searchQuery.trim() !== '';

  const filteredSolutions = solutions.filter((s) => {
    const matchesStatus = activeFilter === 'Todos' || s.status === activeFilter;
    const normalizedQuery = normalizeSearch(searchQuery.trim());
    const searchableText = normalizeSearch(
      [
        s.title,
        s.impact,
        s.description,
        s.responsible,
        s.category,
        s.tags.join(' '),
        s.problemTypes.join(' '),
        s.impactTypes.join(' '),
      ]
        .filter(Boolean)
        .join(' '),
    );
    const matchesSearch = normalizedQuery === '' || searchableText.includes(normalizedQuery);
    const matchesCategory = categoryFilter === 'Todas' || s.category === categoryFilter;
    const matchesResponsible =
      responsibleFilter === 'Todos' || splitResponsibles(s.responsible).includes(responsibleFilter);

    return matchesStatus && matchesSearch && matchesCategory && matchesResponsible;
  });
  const totalSolutions = solutions.length;
  const emUsoCount = solutions.filter((s) => s.status === 'Em uso').length;
  const emDesenvolvimentoCount = solutions.filter((s) => s.status === 'Em desenvolvimento').length;
  const pilotoCount = solutions.filter((s) => s.status === 'Piloto').length;
  const withDemoCount = solutions.filter((s) => Boolean(s.demoLink)).length;
  const withoutLinksCount = solutions.filter(
    (s) => !s.link && !s.demoLink && !s.documentationLink,
  ).length;
  const clearFilters = () => {
    setActiveFilter('Todos');
    setCategoryFilter('Todas');
    setResponsibleFilter('Todos');
    setSearchQuery('');
  };

  const renderFilters = (showViewModeToggle: boolean) => (
    <div className="flex flex-wrap items-center gap-4 bg-surface-container/50 p-2 rounded-2xl">
      <div className="flex items-center p-1 bg-surface-container-low rounded-xl">
        {[
          { id: 'Todos', label: 'Todos' },
          { id: 'Em uso', label: 'Em uso' },
          { id: 'Em desenvolvimento', label: 'Em desenvolvimento' },
          { id: 'Piloto', label: 'Piloto' },
        ].map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
              activeFilter === filter.id
                ? 'font-semibold bg-primary text-on-primary shadow-lg'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group min-w-[140px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg px-4 py-2 pr-10 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'Todas' ? 'Todas Categorias' : cat}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
            size={16}
          />
        </div>

        <div className="relative group min-w-[140px]">
          <select
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
            className="w-full appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg px-4 py-2 pr-10 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {responsibles.map((resp) => (
              <option key={resp} value={resp}>
                {resp === 'Todos' ? 'Todos Responsáveis' : resp}
              </option>
            ))}
          </select>
          <User
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
            size={16}
          />
        </div>

        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
            hasActiveFilters
              ? 'border-outline-variant/30 text-on-surface hover:border-primary/50 hover:text-primary'
              : 'border-outline-variant/10 text-on-surface-variant/60 cursor-not-allowed'
          }`}
          title="Limpar filtros aplicados"
        >
          Limpar filtros
        </button>
      </div>

      {showViewModeToggle && (
        <div className="flex items-center gap-3 ml-auto">
          <div className="h-8 w-px bg-outline-variant/20 mx-1" />

          <div className="flex items-center bg-surface-container-high rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-surface-container-highest text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-surface-container-highest text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ListIcon size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="mt-24 px-8 max-w-[1600px] mx-auto w-full flex-grow">
        {isLoadingSolutions && solutions.length > 0 && (
          <div className="mb-4 rounded-xl border border-outline-variant/20 bg-surface-container p-3 text-sm text-on-surface-variant">
            Carregando soluções da planilha...
          </div>
        )}
        {solutionsError && (
          <div className="mb-4 rounded-xl border border-tertiary/20 bg-tertiary/10 p-3 text-sm text-on-surface">
            {solutionsError}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <section className="mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12">
                  <div className="max-w-2xl">
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs font-label uppercase tracking-widest text-primary font-bold mb-3"
                    >
                      Dashboard
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      className="text-5xl font-bold tracking-tight mb-4 text-on-surface"
                    >
                      Visão geral
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-on-surface-variant text-lg leading-relaxed"
                    >
                      Nossa missão é transformar conhecimento interno em soluções digitais reutilizáveis,
                      conectando pessoas, processos e tecnologia para elevar a qualidade, acelerar entregas e
                      gerar impacto real no dia a dia da operação.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto"
                  >
                    <KPICard label="Total Iniciativas" value={String(totalSolutions).padStart(2, '0')} />
                    <KPICard
                      label="Em uso"
                      value={String(emUsoCount).padStart(2, '0')}
                      colorClass="text-secondary"
                      showPulse={emUsoCount > 0}
                    />
                    <KPICard
                      label="Desenvolvimento"
                      value={String(emDesenvolvimentoCount).padStart(2, '0')}
                      colorClass="text-primary"
                    />
                    <KPICard
                      label="Piloto"
                      value={String(pilotoCount).padStart(2, '0')}
                      colorClass="text-tertiary"
                    />
                  </motion.div>
                </div>
              </section>

              <div className="flex flex-col xl:flex-row gap-8">
                <div className="flex-grow space-y-8">
                  {!isLoadingSolutions && solutions.length === 0 && (
                    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5 text-sm text-on-surface-variant">
                      Nenhuma solução disponível na planilha no momento.
                    </div>
                  )}
                  {renderFilters(true)}

                  {isLoadingSolutions && solutions.length === 0 ? (
                    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/60 p-8 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <LoaderCircle className="animate-spin" size={28} />
                      </div>
                      <h2 className="text-xl font-semibold text-on-surface">Carregando cadastros...</h2>
                      <p className="mt-2 text-sm text-on-surface-variant">
                        Estamos buscando os dados da planilha. Isso pode levar alguns segundos.
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {viewMode === 'grid' ? (
                        <motion.div
                          key="grid"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          {filteredSolutions.map((solution) => (
                            <SolutionCard
                              key={solution.id}
                              solution={solution}
                              onLearnMore={setSelectedSolution}
                            responsibleLinks={responsibleLinks}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col gap-3"
                        >
                          {filteredSolutions.map((solution) => (
                            <SolutionListRow
                              key={solution.id}
                              solution={solution}
                              onLearnMore={setSelectedSolution}
                              responsibleLinks={responsibleLinks}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>

                <aside className="w-full xl:w-80 space-y-6">
                  <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10">
                    <h4 className="text-sm font-bold text-on-surface mb-4">Destaques úteis</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">Resultados com filtros atuais</span>
                        <span className="font-bold text-on-surface">{filteredSolutions.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">Soluções com demo</span>
                        <span className="font-bold text-secondary">{withDemoCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">Sem links de acesso</span>
                        <span className="font-bold text-tertiary">{withoutLinksCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/5 via-background to-background p-5 rounded-2xl border border-primary/25">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-20 h-20 relative shrink-0 group">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500" />
                        <img
                          src={mascoteOficial}
                          alt="Quack, personagem da plataforma"
                          title="Quá-quá"
                          className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                        />
                      </div>
                      <div className="w-full">
                        <div className="relative bg-surface-container-high rounded-xl border border-primary/20 shadow-lg shadow-black/20 px-4 py-3 text-left">
                          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-surface-container-high border-l border-t border-primary/20" />
                          <h4 className="text-sm font-bold text-primary mb-1">Sua solução ainda não está aqui?</h4>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            Se você já usa uma solução no dia a dia e ela não aparece no catálogo, clique em{' '}
                            <strong>Nova solução</strong> para cadastrar. O time analisa e publica na base oficial.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === 'solutions' && (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <SolutionsCatalog
                solutions={filteredSolutions}
                viewMode={viewMode}
                onLearnMore={setSelectedSolution}
                responsibleLinks={responsibleLinks}
                filtersSlot={renderFilters(true)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="w-full py-12 mt-20 border-t border-outline-variant/10 bg-background">
        <div className="flex justify-center items-center px-12 max-w-[1600px] mx-auto gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-on-surface font-semibold">Portfólio de Soluções Digitais</span>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              © 2026. INTERAÇÕES DIGITAIS.
            </span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedSolution && (
          <SolutionModal
            solution={selectedSolution}
            onClose={() => setSelectedSolution(null)}
            responsibleLinks={responsibleLinks}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
