import { motion } from 'motion/react';
import { Bell, Moon, Plus, Search, Sun, X } from 'lucide-react';
import brandIcon from '../assets/brand-icon.svg';
import avatarPlaceholder from '../assets/covers/avatar-placeholder.svg';
import type { Tab, Theme } from '../types/solution';

type TopNavBarProps = {
  theme: Theme;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
};

export function TopNavBar({
  theme,
  toggleTheme,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}: TopNavBarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/15 shadow-2xl shadow-black/20">
      <div className="flex justify-between items-center w-full px-8 py-4 mx-auto max-w-[1600px]">
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 min-w-0 text-left rounded-xl -m-1 p-1 pr-2 transition-colors hover:bg-surface-container-high/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            title="Ir para o início (Dashboard)"
          >
            <img
              src={brandIcon}
              width={32}
              height={32}
              alt=""
              className="rounded-lg shadow-sm shadow-primary/10 shrink-0"
              aria-hidden
            />
            <span className="text-xl font-bold tracking-tight text-on-surface truncate">
              Portfólio de Soluções Digitais
            </span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'solutions', label: 'Soluções' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`font-semibold transition-all relative py-1 ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group hidden lg:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar soluções..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/20 rounded-lg pl-10 pr-10 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95"
              title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              type="button"
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95"
            >
              <Bell size={20} />
            </button>
            <button
              type="button"
              onClick={() => window.open('https://forms.gle/crhfQ6vRp3pUCghDA', '_blank', 'noopener,noreferrer')}
              className="bg-gradient-to-br from-primary to-primary-dim text-on-primary-container px-4 py-2 rounded-lg font-semibold text-sm active:scale-95 transition-all shadow-lg shadow-primary/10 flex items-center gap-2"
            >
              <Plus size={18} />
              Nova solução
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 ml-2">
              <img
                src={avatarPlaceholder}
                alt="Perfil do usuário"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
