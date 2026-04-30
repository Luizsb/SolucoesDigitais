import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, CircleHelp, LogOut, Moon, Plus, Search, Sun, User, X } from 'lucide-react';
import brandIcon from '../assets/brand-icon.svg';
import type { Solution, Tab, Theme } from '../types/solution';

type TopNavBarProps = {
  theme: Theme;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  unreadNotifications: Solution[];
  onMarkNotificationsViewed: () => void;
  onStartOnboarding: () => void;
  onOpenSubmission: () => void;
  onLogout: () => void;
  userEmail?: string;
};

export function TopNavBar({
  theme,
  toggleTheme,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  unreadNotifications,
  onMarkNotificationsViewed,
  onStartOnboarding,
  onOpenSubmission,
  onLogout,
  userEmail,
}: TopNavBarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleToggleNotifications = () => {
    if (!isNotificationOpen && unreadNotifications.length > 0) {
      onMarkNotificationsViewed();
    }
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/15 shadow-2xl shadow-black/20">
      <div className="flex justify-between items-center w-full px-4 sm:px-8 py-3 sm:py-4 mx-auto max-w-[1600px] gap-4">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 sm:gap-3 min-w-0 text-left rounded-xl -m-1 p-1 pr-2 transition-colors hover:bg-surface-container-high/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            title="Ir para o início (Dashboard)"
          >
            <img
              src={brandIcon}
              width={28}
              height={28}
              alt=""
              className="sm:w-8 sm:h-8 rounded-lg shadow-sm shadow-primary/10 shrink-0"
              aria-hidden
            />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-on-surface truncate">
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

        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <div className="relative group hidden xl:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              size={16}
            />
            <input
              data-tour="busca"
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

          <div className="flex items-center gap-1 sm:gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              data-tour="tema"
              className="p-1.5 sm:p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95"
              title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {theme === 'dark' ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
            </button>
            <button
              type="button"
              onClick={onStartOnboarding}
              data-tour="tour"
              className="p-1.5 sm:p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95"
              title="Iniciar tour guiado"
            >
              <CircleHelp size={18} className="sm:w-5 sm:h-5" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={handleToggleNotifications}
                data-tour="notificacoes"
                className="p-1.5 sm:p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95 relative"
                title="Notificações"
              >
                <Bell size={18} className="sm:w-5 sm:h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 sm:-top-1 sm:-right-1 min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 rounded-full bg-primary text-on-primary text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-xl border border-outline-variant/20 bg-surface-container shadow-xl p-3 z-50">
                  <h4 className="text-sm font-semibold text-on-surface mb-2">Novos cadastros</h4>
                  {unreadNotifications.length === 0 ? (
                    <p className="text-xs text-on-surface-variant">Nenhuma novidade no momento.</p>
                  ) : (
                    <div className="space-y-2">
                      {unreadNotifications.map((solution) => (
                        <button
                          key={solution.id}
                          type="button"
                          onClick={() => {
                            setActiveTab('dashboard');
                            setIsNotificationOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left rounded-lg p-2 hover:bg-surface-container-high transition-colors"
                        >
                          <p className="text-sm font-semibold text-on-surface truncate">{solution.title}</p>
                          <p className="text-xs text-on-surface-variant truncate">
                            {solution.category} - {solution.status}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onOpenSubmission}
              data-tour="nova-solucao"
              className="bg-gradient-to-br from-primary to-primary-dim text-on-primary p-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm active:scale-95 transition-all shadow-lg shadow-primary/10 flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova solução</span>
            </button>

            <div className="h-6 sm:h-8 w-px bg-outline-variant/20 mx-0.5 sm:mx-1" />

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-on-surface-variant hover:bg-tertiary/10 hover:text-tertiary rounded-lg transition-all active:scale-95"
              title="Sair da conta"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
