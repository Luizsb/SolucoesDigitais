import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket } from 'lucide-react';
import brandIcon from '../assets/brand-icon.svg';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

/** Lista fictícia de contas usada na tela antiga de e-mail/senha — removida do navegador se ainda existir. */
const LEGACY_TEMP_USERS_KEY = 'temp-users-list';

/** Até integrar o SSO real do JumpCloud, o botão apenas libera o portfólio (sem autenticação). */
const PLACEHOLDER_SSO_EMAIL = 'jumpcloud.sso@placeholder.local';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_TEMP_USERS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const handleJumpCloudGo = () => {
    onLogin(PLACEHOLDER_SSO_EMAIL);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface p-4 sm:p-6 font-sans selection:bg-primary/30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-6 sm:mb-8 w-full max-w-[360px]"
      >
        <div className="bg-surface-container p-2.5 sm:p-3 rounded-xl border border-outline-variant/20 mb-3 sm:mb-4 shadow-xl">
          <img src={brandIcon} alt="Portfólio de Soluções Digitais" className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-on-surface text-center px-4">
          Portfólio de Soluções Digitais
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant/60 text-center">
          Bem-vindo ao hub de inovação interna
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-[360px] bg-surface-container rounded-2xl border border-outline-variant/10 p-5 sm:p-8 shadow-2xl"
      >
        <p className="text-center text-[11px] text-on-surface-variant/90 leading-snug mb-3.5">
          Acesso corporativo via JumpCloud — SSO em preparação; o botão abre o portfólio.
        </p>
        <button
          type="button"
          onClick={handleJumpCloudGo}
          className="w-full font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md text-[#0d1717] bg-[#36C5BA] hover:bg-[#2eb0a6] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#36C5BA] focus-visible:ring-offset-surface-container"
        >
          <Rocket size={20} className="shrink-0" strokeWidth={2} aria-hidden />
          <span className="text-sm sm:text-[15px]">Entrar com JumpCloud Go</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex flex-col items-center gap-1.5 text-center text-xs max-w-[320px] mx-auto"
      >
        <span className="font-bold uppercase tracking-widest text-on-surface-variant/60">Precisa de ajuda?</span>
        <span className="font-bold uppercase tracking-widest text-on-surface leading-snug">
          Contate o time de interações digitais
        </span>
      </motion.div>
    </div>
  );
};
