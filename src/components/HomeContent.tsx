import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, RotateCcw, ArrowRight, Loader2, Sparkles, Sun, Moon, 
  HelpCircle, MessageSquare, Menu, X, History, Clock, Trash2, 
  ChevronDown, Monitor, Heart, Briefcase, User, TrendingUp, LogOut 
} from "lucide-react";
import { TarotCard } from "./TarotCard";
import { TarotResponse, YesNoResponse, HistoryEntry, ThemeMode, AppMode } from "../types";

interface HomeContentProps {
  mode: AppMode;
  setMode: React.Dispatch<React.SetStateAction<AppMode>>;
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  result: TarotResponse | null;
  setResult: React.Dispatch<React.SetStateAction<TarotResponse | null>>;
  yesNoResult: YesNoResponse | null;
  setYesNoResult: React.Dispatch<React.SetStateAction<YesNoResponse | null>>;
  isRevealed: boolean;
  setIsRevealed: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPath: 'A' | 'B' | null;
  setSelectedPath: React.Dispatch<React.SetStateAction<'A' | 'B' | null>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  history: HistoryEntry[];
  theme: ThemeMode;
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>;
  isThemeDropdownOpen: boolean;
  setIsThemeDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lockedMessage: { title: string } | null;
  setLockedMessage: React.Dispatch<React.SetStateAction<{ title: string } | null>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleDraw: (e?: React.FormEvent) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  reset: () => void;
  logout: () => void;
  clearHistory: () => Promise<void>;
  deleteHistoryEntry: (id: string) => void;
  currentTheme: 'light' | 'dark';
}

export function HomeContent({
  mode, setMode, question, setQuestion, loading, result, setResult,
  yesNoResult, setYesNoResult, isRevealed, setIsRevealed, selectedPath,
  setSelectedPath, error, setError, isMenuOpen, setIsMenuOpen, history,
  theme, setTheme, isThemeDropdownOpen, setIsThemeDropdownOpen,
  lockedMessage, setLockedMessage, textareaRef, handleDraw, handleKeyDown,
  reset, logout, clearHistory, deleteHistoryEntry, currentTheme
}: HomeContentProps) {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (type === 'tarot') setMode('tarot');
    else if (type === 'yesno') setMode('yesno');
    else setMode('menu');
  }, [type, setMode]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Locked Feature Modal */}
      <AnimatePresence>
        {lockedMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md"
            onClick={() => setLockedMessage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-md w-full p-10 rounded-[3rem] glass shadow-2xl text-center space-y-6 mystic-glow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto text-accent">
                <Clock size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black serif tracking-tight">{lockedMessage.title}</h3>
                <p className="text-sm uppercase tracking-[0.3em] font-black opacity-40">
                  Em Breve
                </p>
              </div>
              <p className={`text-lg font-medium leading-relaxed opacity-80 ${currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Esta tiragem especializada está sendo preparada pela Maga e estará disponível em breve para todos os usuários.
              </p>
              <button 
                onClick={() => setLockedMessage(null)}
                className="w-full py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest hover:bg-accent/90 transition-all shadow-xl shadow-accent/20"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Left Logo */}
      <div className="fixed top-8 left-8 z-[60]">
        <button 
          onClick={reset}
          className="group flex items-center gap-4 transition-all"
          title="Início"
        >
          <div className="p-1 border-2 border-accent/30 rounded-2xl overflow-hidden bg-accent/5 backdrop-blur-md">
            <img 
              src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
              alt="INTUA" 
              className="w-12 h-12 object-cover rounded-xl group-hover:scale-110 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden sm:block text-left">
            <span className={`block text-sm font-black uppercase tracking-[0.3em] ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>INTUA</span>
            <span className="block text-[10px] uppercase tracking-widest text-accent font-bold">Maga das Escolhas</span>
          </div>
        </button>
      </div>

      {/* Fixed Hamburger Menu */}
      <div className="fixed top-8 right-8 z-[60]">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-4 rounded-full border-2 transition-all backdrop-blur-md shadow-xl ${currentTheme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-black/10 bg-black/5 text-ink hover:bg-black/10'}`}
          title="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`fixed top-0 right-0 h-full w-80 z-50 shadow-2xl p-12 pt-32 border-l flex flex-col ${currentTheme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
          >
            <div className="flex flex-col gap-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {/* Theme Selector */}
              <div className="space-y-4">
                <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black ${currentTheme === 'dark' ? 'text-white/40' : 'text-ink/40'}`}>Aparência</h3>
                <div className="relative">
                  <button 
                    onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${currentTheme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'}`}
                  >
                    <div className="flex items-center gap-3 font-bold">
                      {theme === 'dark' && <Moon size={18} />}
                      {theme === 'light' && <Sun size={18} />}
                      {theme === 'system' && <Monitor size={18} />}
                      <span className="capitalize">{theme === 'system' ? 'Sistema' : theme === 'dark' ? 'Escuro' : 'Claro'}</span>
                    </div>
                    <ChevronDown size={18} className={`transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isThemeDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute top-full left-0 w-full mt-2 rounded-2xl border-2 shadow-2xl z-10 overflow-hidden ${currentTheme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
                      >
                        {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setTheme(m);
                              setIsThemeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-4 hover:bg-accent hover:text-white transition-colors text-left font-bold ${theme === m ? 'text-accent' : ''}`}
                          >
                            {m === 'light' && <Sun size={18} />}
                            {m === 'dark' && <Moon size={18} />}
                            {m === 'system' && <Monitor size={18} />}
                            <span className="capitalize">{m === 'system' ? 'Corresponder ao sistema' : m === 'dark' ? 'Escuro' : 'Claro'}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* History Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black ${currentTheme === 'dark' ? 'text-white/40' : 'text-ink/40'}`}>Histórico</h3>
                  <div className="flex items-center gap-3">
                    {history.length > 0 && (
                      <button onClick={clearHistory} className="text-rose-500 hover:text-rose-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {history.length === 0 ? (
                    <div className="py-8 text-center opacity-30">
                      <History size={32} className="mx-auto mb-2" />
                      <p className="text-xs font-bold">Nenhuma consulta salva</p>
                    </div>
                  ) : (
                    history.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => {
                          if (entry.type === 'tarot') {
                            navigate('/pt/home/tarot');
                            setResult(entry.result as TarotResponse);
                            setYesNoResult(null);
                          } else {
                            navigate('/pt/home/yesno');
                            setYesNoResult(entry.result as YesNoResponse);
                            setResult(null);
                          }
                          setQuestion(entry.question);
                          setIsRevealed(true);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left group relative ${currentTheme === 'dark' ? 'bg-white/5 border-white/5 hover:border-accent/40' : 'bg-black/5 border-black/5 hover:border-accent/40'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] uppercase tracking-widest font-black text-accent">
                            {entry.type === 'tarot' ? 'Tarô' : 'Sim/Não'}
                          </span>
                          <span className="text-[8px] opacity-40 font-bold">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs font-bold line-clamp-2 leading-relaxed opacity-80">{entry.question}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryEntry(entry.id);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:scale-110 transition-all p-1"
                        >
                          <X size={12} />
                        </button>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="h-px bg-accent/20 my-2" />

              <button 
                onClick={() => {
                  reset();
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-4 text-lg font-bold hover:text-accent transition-colors mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}
              >
                <RotateCcw size={20} />
                Reiniciar App
              </button>

              <button 
                onClick={logout}
                className={`flex items-center gap-4 text-lg font-bold hover:text-rose-500 transition-colors mb-8 ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full blur-[160px] transition-all duration-1000 ${currentTheme === 'dark' ? 'bg-accent/20' : 'bg-accent/10'}`} />
        <div className={`absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full blur-[160px] transition-all duration-1000 ${currentTheme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-500/10'}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] transition-all duration-1000 ${currentTheme === 'dark' ? 'bg-purple-900/10' : 'bg-purple-100/20'}`} />
      </div>

      <div className="w-full max-w-4xl px-4 py-8 md:py-24 flex-grow flex flex-col items-center relative z-10">
        <header className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-6 md:gap-8 mb-8 md:mb-10"
          >
            <div className={`p-1 md:p-1.5 rounded-[1.5rem] md:rounded-[2rem] border-4 transition-all shadow-[0_0_50px_rgba(var(--accent-rgb),0.2)] overflow-hidden ${currentTheme === 'dark' ? 'bg-white/5 border-accent/40' : 'bg-white border-accent/30'}`} style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }}>
              <img 
                src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                alt="INTUA Logo" 
                className="w-full h-full object-cover rounded-[1rem] md:rounded-[1.5rem] scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-accent">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] font-black">Maga das Escolhas</span>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="title-xl text-mystic mb-4"
          >
            INTUA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`max-w-lg mx-auto leading-relaxed font-light text-base md:text-xl px-4 opacity-50 ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}
          >
            A sabedoria milenar do Tarô traduzida para o seu momento presente. 
            Encontre clareza em suas escolhas.
          </motion.p>
        </header>

        <main className="w-full flex flex-col items-center">
          {mode === 'menu' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl"
            >
              <button
                onClick={() => navigate('/pt/home/tarot')}
                className="p-8 rounded-[2.5rem] glass transition-all text-left flex flex-col gap-6 group relative overflow-hidden hover:border-accent hover:shadow-2xl mystic-glow"
              >
                <div className="p-4 rounded-2xl bg-accent/20 text-accent w-fit group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-2xl font-bold serif ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>Tarô das Escolhas</h3>
                  <p className={`text-xs opacity-60 font-bold uppercase tracking-widest leading-relaxed ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>
                    Uma tiragem profunda para analisar dois caminhos e suas consequências.
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate('/pt/home/yesno')}
                className="p-8 rounded-[2.5rem] glass transition-all text-left flex flex-col gap-6 group relative overflow-hidden hover:border-accent hover:shadow-2xl mystic-glow"
              >
                <div className="p-4 rounded-2xl bg-accent/20 text-accent w-fit group-hover:scale-110 transition-transform">
                  <HelpCircle size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-2xl font-bold serif ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>Sim ou Não</h3>
                  <p className={`text-xs opacity-60 font-bold uppercase tracking-widest leading-relaxed ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>
                    Uma resposta direta e objetiva para questões imediatas.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Tiragem de Relacionamento' })}
                className={`p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] border-2 transition-all text-left flex flex-col gap-2 md:gap-4 group relative overflow-hidden opacity-70 hover:opacity-100 ${currentTheme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent/40' : 'bg-white border-slate-200 hover:border-accent/40 shadow-md'}`}
              >
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-slate-400/10 text-slate-400 w-fit group-hover:scale-110 transition-transform">
                  <Heart size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-base md:text-lg font-black ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>Relacionamento</h3>
                    <Clock size={10} className="text-slate-400 md:w-3 md:h-3" />
                  </div>
                  <p className={`text-[10px] md:text-xs font-medium leading-relaxed ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Analise a conexão e o futuro entre duas pessoas.</p>
                </div>
                <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 text-[6px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">Em Breve</div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Tiragem de Carreira' })}
                className={`p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] border-2 transition-all text-left flex flex-col gap-2 md:gap-4 group relative overflow-hidden opacity-70 hover:opacity-100 ${currentTheme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent/40' : 'bg-white border-slate-200 hover:border-accent/40 shadow-md'}`}
              >
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-slate-400/10 text-slate-400 w-fit group-hover:scale-110 transition-transform">
                  <Briefcase size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-base md:text-lg font-black ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>Carreira & Finanças</h3>
                    <Clock size={10} className="text-slate-400 md:w-3 md:h-3" />
                  </div>
                  <p className={`text-[10px] md:text-xs font-medium leading-relaxed ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Orientações estratégicas para sua vida profissional.</p>
                </div>
                <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 text-[6px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">Em Breve</div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Autoconhecimento' })}
                className={`p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] border-2 transition-all text-left flex flex-col gap-2 md:gap-4 group relative overflow-hidden opacity-70 hover:opacity-100 ${currentTheme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent/40' : 'bg-white border-slate-200 hover:border-accent/40 shadow-md'}`}
              >
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-slate-400/10 text-slate-400 w-fit group-hover:scale-110 transition-transform">
                  <User size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-base md:text-lg font-black ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>Autoconhecimento</h3>
                    <Clock size={10} className="text-slate-400 md:w-3 md:h-3" />
                  </div>
                  <p className={`text-[10px] md:text-xs font-medium leading-relaxed ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Mergulhe em sua essência e descubra seu propósito.</p>
                </div>
                <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 text-[6px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">Em Breve</div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Tendências do Ano' })}
                className={`p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] border-2 transition-all text-left flex flex-col gap-2 md:gap-4 group relative overflow-hidden opacity-70 hover:opacity-100 ${currentTheme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent/40' : 'bg-white border-slate-200 hover:border-accent/40 shadow-md'}`}
              >
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-slate-400/10 text-slate-400 w-fit group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-base md:text-lg font-black ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>Tendências do Ano</h3>
                    <Clock size={10} className="text-slate-400 md:w-3 md:h-3" />
                  </div>
                  <p className={`text-[10px] md:text-xs font-medium leading-relaxed ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Uma visão panorâmica dos seus próximos 12 meses.</p>
                </div>
                <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 text-[6px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">Em Breve</div>
              </button>
            </motion.div>
          )}

          {(mode === 'tarot' || mode === 'yesno') && !result && !yesNoResult && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl space-y-8"
            >
              <button 
                onClick={() => navigate('/pt/home')}
                className="text-accent hover:underline text-sm font-black mb-4 flex items-center gap-2 uppercase tracking-widest"
              >
                ← Voltar ao menu
              </button>
              <form onSubmit={handleDraw} className="space-y-8">
                <div className="relative group">
                    <textarea
                      ref={textareaRef}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={mode === 'tarot' ? "Sobre qual decisão você precisa de clareza hoje?" : "Faça uma pergunta de Sim ou Não..."}
                      className={`w-full h-48 px-8 py-8 rounded-[3rem] glass border-2 outline-none transition-all resize-none text-2xl leading-relaxed placeholder:opacity-40 font-medium focus:border-accent/40 focus:bg-accent/5 ${currentTheme === 'dark' ? 'border-white/10 text-white' : 'border-black/10 text-ink'}`}
                      required
                    />
                  <div className="absolute bottom-8 right-10 flex items-center gap-4 text-accent/40 group-focus-within:text-accent transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">CTRL + ENTER para enviar</span>
                    <Search size={32} />
                  </div>
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-rose-500 text-sm text-center font-bold bg-rose-500/10 p-6 rounded-3xl border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <HelpCircle size={16} />
                      <span className="uppercase tracking-widest text-[10px]">A Maga diz:</span>
                    </div>
                    {error}
                  </motion.div>
                )}
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="w-full py-5 bg-accent text-white rounded-full font-black tracking-[0.1em] uppercase hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-accent/30 flex items-center justify-center gap-3 text-xl"
                >
                  {mode === 'tarot' ? 'Tirar uma Carta' : 'Obter Resposta'}
                  <ArrowRight size={22} />
                </button>
              </form>
            </motion.div>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-8 py-16">
              <div className="relative">
                <Loader2 className="animate-spin text-accent" size={80} />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent/40 animate-pulse" size={32} />
              </div>
              <p className="serif italic text-3xl text-accent font-bold animate-pulse tracking-tight">Sintonizando sua intuição...</p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center gap-16"
              >
                <div className="flex flex-col items-center gap-6">
                  <TarotCard 
                    name={result.card_name} 
                    isRevealed={isRevealed} 
                    onClick={() => setIsRevealed(true)} 
                  />
                  {!isRevealed && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm uppercase tracking-[0.3em] text-accent font-black animate-bounce"
                    >
                      Clique para revelar
                    </motion.p>
                  )}
                </div>

                {isRevealed && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full"
                  >
                    <section className="md:col-span-2 text-center space-y-6 max-w-2xl mx-auto mb-12">
                      <h2 className="serif text-4xl md:text-5xl font-light text-accent tracking-tighter uppercase">{result.card_name}</h2>
                      <p className={`text-xl leading-relaxed italic font-light opacity-60 ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>{result.card_meaning}</p>
                      <div className="h-px w-24 bg-accent/20 mx-auto" />
                      <p className="text-xl font-light leading-relaxed">{result.guidance}</p>
                    </section>

                    <div className="md:col-span-2 text-center mb-4">
                      <p className="serif text-2xl text-accent font-bold italic tracking-tight">
                        "Escolha o caminho que mais ressoa agora."
                      </p>
                    </div>

                      <div 
                        onClick={() => !selectedPath && setSelectedPath('A')}
                        className={`transition-all duration-700 p-8 md:p-12 border-thin shadow-2xl space-y-6 flex flex-col ${!selectedPath ? 'cursor-pointer hover:bg-accent/5' : ''} ${selectedPath === 'A' ? 'border-accent bg-accent/5' : 'opacity-95 hover:opacity-100'} ${selectedPath === 'B' ? 'hidden md:flex opacity-10 grayscale pointer-events-none' : ''}`}
                      >
                        <h4 className="text-[9px] uppercase tracking-[0.3em] font-black text-accent">{result.path_a_label}</h4>
                        <p className="font-light text-2xl serif leading-tight">{result.path_a}</p>
                        <div className={`pt-6 border-t ${currentTheme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                          <p className="text-[8px] uppercase tracking-widest mb-3 font-black text-accent/40">O QUE PODE ACONTECER</p>
                          <p className={`text-lg font-light leading-relaxed opacity-80 ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>{result.outcome_a}</p>
                        </div>
                      {selectedPath === 'A' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-6 mt-6 border-t border-accent/20 text-accent font-light serif italic leading-relaxed text-xl"
                        >
                          {result.detailed_guidance_a}
                        </motion.div>
                      )}
                      {!selectedPath && (
                        <button 
                          onClick={() => setSelectedPath('A')}
                          className="mt-auto w-full py-5 border-thin text-accent hover:bg-accent hover:text-white transition-all font-black uppercase text-[9px] tracking-[0.2em]"
                        >
                          Escolher este caminho
                        </button>
                      )}
                    </div>

                      <div 
                        onClick={() => !selectedPath && setSelectedPath('B')}
                        className={`transition-all duration-700 p-8 md:p-12 border-thin shadow-2xl space-y-6 flex flex-col ${!selectedPath ? 'cursor-pointer hover:bg-accent/5' : ''} ${selectedPath === 'B' ? 'border-accent bg-accent/5' : 'opacity-95 hover:opacity-100'} ${selectedPath === 'A' ? 'hidden md:flex opacity-10 grayscale pointer-events-none' : ''}`}>
                        <h4 className="text-[9px] uppercase tracking-[0.3em] font-black text-accent">{result.path_b_label}</h4>
                        <p className="font-light text-2xl serif leading-tight">{result.path_b}</p>
                        <div className={`pt-6 border-t ${currentTheme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                          <p className="text-[8px] uppercase tracking-widest mb-3 font-black text-accent/40">O QUE PODE ACONTECER</p>
                          <p className={`text-lg font-light leading-relaxed opacity-80 ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>{result.outcome_b}</p>
                        </div>
                      {selectedPath === 'B' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-6 mt-6 border-t border-accent/20 text-accent font-light serif italic leading-relaxed text-xl"
                        >
                          {result.detailed_guidance_b}
                        </motion.div>
                      )}
                      {!selectedPath && (
                        <button 
                          onClick={() => setSelectedPath('B')}
                          className="mt-auto w-full py-5 border-thin text-accent hover:bg-accent hover:text-white transition-all font-black uppercase text-[9px] tracking-[0.2em]"
                        >
                          Escolher este caminho
                        </button>
                      )}
                    </div>

                    <footer className="md:col-span-2 text-center pt-8 space-y-8">
                      <p className="serif italic text-2xl text-accent font-bold tracking-tight">{result.closing_message}</p>
                      <div className="flex flex-col items-center gap-6">
                        <button
                          onClick={reset}
                          className="inline-flex items-center gap-3 text-accent hover:scale-105 transition-all text-sm uppercase tracking-[0.3em] font-black border-b-2 border-accent pb-1"
                        >
                          <RotateCcw size={20} />
                          Nova Consulta
                        </button>
                      </div>
                    </footer>
                  </motion.div>
                )}
                </motion.div>
              )}

                {yesNoResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col items-center gap-12 max-w-2xl"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <TarotCard 
                        name={yesNoResult.card_name} 
                        isRevealed={isRevealed} 
                        onClick={() => setIsRevealed(true)} 
                      />
                      {!isRevealed && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm uppercase tracking-[0.3em] text-accent font-black animate-bounce"
                        >
                          Clique para revelar
                        </motion.p>
                      )}
                    </div>

                    {isRevealed && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`w-full p-12 md:p-16 border-thin shadow-2xl text-center space-y-10 ${currentTheme === 'dark' ? 'bg-black' : 'bg-white'}`}
                      >
                        <div className="space-y-4">
                          <h4 className="text-[9px] uppercase tracking-[0.4em] font-black text-accent">A RESPOSTA É</h4>
                          <div className={`text-7xl md:text-9xl font-light serif tracking-tighter ${yesNoResult.answer === 'Sim' ? (currentTheme === 'dark' ? 'text-white' : 'text-ink') : 'text-accent'}`}>
                            {yesNoResult.answer}
                          </div>
                        </div>

                        <div className="space-y-8">
                          <h3 className="text-3xl md:text-4xl font-light text-accent tracking-widest uppercase serif">{yesNoResult.card_name}</h3>
                          <p className="text-xl md:text-2xl leading-relaxed font-light opacity-60">{yesNoResult.reasoning}</p>
                          <div className="h-px w-24 bg-accent/20 mx-auto" />
                          <p className={`text-xl italic font-light serif ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>{yesNoResult.guidance}</p>
                        </div>

                        <div className="pt-8 border-t-2 border-accent/10">
                          <p className="serif italic text-2xl text-accent font-bold mb-8 tracking-tight">{yesNoResult.closing_message}</p>
                          <button
                            onClick={reset}
                            className="inline-flex items-center gap-3 text-accent hover:scale-105 transition-all text-sm uppercase tracking-[0.3em] font-black border-b-2 border-accent pb-1"
                          >
                            <RotateCcw size={20} />
                            Nova Consulta
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

          <footer className="w-full max-w-4xl px-4 py-12 md:py-20 text-center relative z-10">
            <div className="w-12 h-px bg-accent/30 mx-auto mb-8" />
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-accent/50 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                <Sparkles size={12} />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black">Maga das Escolhas</span>
              </div>
              <p className={`text-[10px] uppercase tracking-widest opacity-20 font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-ink'}`}>
                © 2026 INTUA • Todos os direitos reservados
              </p>
            </div>
          </footer>
          </div>
        </div>
      );
}
