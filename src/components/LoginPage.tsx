import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Key, ArrowRight, HelpCircle } from 'lucide-react';
import brandIcon from '../assets/brand-icon.svg';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const USERS_STORAGE_KEY = 'temp-users-list';

  const getStoredUsers = () => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [{ email: '123@123.com', password: '123' }];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const users = getStoredUsers();

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      if (users.some((u: any) => u.email === email)) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      const newUsers = [...users, { email, password }];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
      setSuccess('Conta criada com sucesso! Agora você pode entrar.');
      setIsRegistering(false);
      setPassword('');
      setConfirmPassword('');
    } else {
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        onLogin(email);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface p-4 sm:p-6 font-sans selection:bg-primary/30">
      {/* Header / Logo */}
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
          {isRegistering ? 'Crie sua conta para acessar o hub' : 'Bem-vindo ao hub de inovação interna'}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-[360px] bg-surface-container rounded-2xl border border-outline-variant/10 p-5 sm:p-6 shadow-2xl"
      >
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-tertiary/10 border border-tertiary/20 text-tertiary text-[11px] font-bold text-center"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-bold text-center"
          >
            {success}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
              E-MAIL CORPORATIVO
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full bg-background border border-outline-variant/20 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/40 text-on-surface"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
              SENHA
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-outline-variant/20 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/40 text-on-surface"
                required
              />
            </div>
          </div>

          {/* Confirm Password field (only for registration) */}
          {isRegistering && (
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                CONFIRMAR SENHA
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-outline-variant/20 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/40 text-on-surface"
                  required
                />
              </div>
            </div>
          )}

          {/* Remember Me & Forgot Password (only for login) */}
          {!isRegistering && (
            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer group text-on-surface-variant hover:text-on-surface transition-colors">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-outline-variant/30 bg-background text-primary focus:ring-0 focus:ring-offset-0 transition-all" 
                />
                <span>Lembrar de mim</span>
              </label>
              <button type="button" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Esqueci minha senha
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dim text-on-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 group active:scale-[0.98]"
          >
            <span className="text-sm">{isRegistering ? 'Criar Conta' : 'Entrar'}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/10"></div>
          </div>
          <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.2em]">
            <span className="bg-surface-container px-3 text-on-surface-variant/40">OU ENTRE COM</span>
          </div>
        </div>

        {/* SSO Button */}
        <button
          type="button"
          className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-medium py-2.5 rounded-xl border border-outline-variant/10 flex items-center justify-center gap-3 transition-all active:scale-[0.98] mb-5"
        >
          <Key size={16} className="text-primary" />
          <span className="text-sm">SSO Corporativo</span>
        </button>

        {/* Sign Up / Sign In Link */}
        <div className="text-center">
          <p className="text-xs text-on-surface-variant">
            {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button 
              type="button" 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccess(null);
              }}
              className="text-primary hover:text-primary/80 font-bold transition-colors"
            >
              {isRegistering ? 'Fazer login' : 'Criar conta agora'}
            </button>
          </p>
        </div>
      </motion.div>

      {/* Footer Support */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60"
      >
        <span>PRECISA DE AJUDA?</span>
        <button className="text-on-surface hover:text-primary transition-colors flex items-center gap-1">
          CONTATE O SUPORTE
        </button>
      </motion.div>
    </div>
  );
};
