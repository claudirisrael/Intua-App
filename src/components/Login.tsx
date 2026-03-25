import React from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { Lead, ThemeMode } from "../types";
import { signInWithGoogle } from "../firebase";

interface LoginProps {
  leadFormData: { name: string; email: string; whatsapp: string };
  setLeadFormData: React.Dispatch<React.SetStateAction<{ name: string; email: string; whatsapp: string }>>;
  handleLeadSubmit: (e: React.FormEvent) => Promise<void>;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export function Login({ leadFormData, setLeadFormData, handleLeadSubmit, theme, setTheme }: LoginProps) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        // Pre-fill form if possible
        setLeadFormData(prev => ({
          ...prev,
          name: result.user.displayName || prev.name,
          email: result.user.email || prev.email
        }));
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="min-h-screen relative z-[200] flex items-center justify-center bg-paper py-12 px-4 transition-colors duration-500 overflow-y-auto">
      <div className="atmosphere" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <div className="space-y-8 md:space-y-12 text-center lg:text-left">
          <div className="space-y-6 md:space-y-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-border flex items-center justify-center overflow-hidden bg-paper/50 backdrop-blur-md">
                <img 
                  src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                  alt="INTUA Logo" 
                  className="w-12 h-12 md:w-16 md:h-16 object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] text-ink">INTUA</h1>
                <p className="small-caps">Maga das Escolhas</p>
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-serif font-light leading-[1.1] text-ink"
            >
              A sabedoria milenar <br className="hidden md:block" />
              <span className="italic opacity-50">no seu presente.</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center lg:justify-start gap-8 md:gap-12"
          >
            <div className="space-y-2">
              <p className="small-caps">Clareza</p>
              <p className="text-sm text-muted font-light">Respostas imediatas.</p>
            </div>
            <div className="space-y-2">
              <p className="small-caps">Intuição</p>
              <p className="text-sm text-muted font-light">Caminhos revelados.</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 md:p-12 glass border-border space-y-8 md:space-y-12 relative"
        >
          <div className="space-y-2">
            <h3 className="text-2xl font-light tracking-tight text-ink">Acesse o Oráculo</h3>
            <p className="small-caps !text-muted">Escolha como deseja entrar</p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 px-6 border border-border rounded-full flex items-center justify-center gap-3 hover:bg-ink hover:text-paper transition-all group cursor-pointer"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-bold">Entrar com Google</span>
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[10px] small-caps !text-muted">ou identifique-se</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="small-caps !text-muted/60 ml-1">Nome</label>
                  <input 
                    required
                    type="text"
                    placeholder="Seu nome"
                    className="w-full bg-transparent border-b border-border px-1 py-4 outline-none transition-all focus:border-accent text-ink font-light placeholder:text-ink/20"
                    value={leadFormData.name}
                    onChange={e => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="small-caps !text-muted/60 ml-1">E-mail</label>
                  <input 
                    required
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full bg-transparent border-b border-border px-1 py-4 outline-none transition-all focus:border-accent text-ink font-light placeholder:text-ink/20"
                    value={leadFormData.email}
                    onChange={e => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="small-caps !text-muted/60 ml-1">WhatsApp</label>
                  <input 
                    required
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="w-full bg-transparent border-b border-border px-1 py-4 outline-none transition-all focus:border-accent text-ink font-light placeholder:text-ink/20"
                    value={leadFormData.whatsapp}
                    onChange={e => setLeadFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-ink text-paper rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-accent hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                Entrar no Oráculo
              </button>
            </form>
          </div>

          <div className="absolute top-4 right-4 lg:-top-6 lg:-right-6 flex gap-2">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-paper/50 backdrop-blur-md text-ink hover:bg-ink hover:text-paper transition-all"
              title="Alternar Tema"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
