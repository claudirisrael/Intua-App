import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, RotateCcw, ArrowRight, Loader2, Sparkles, Sun, Moon, HelpCircle, MessageSquare, Menu, X, History, Clock, Trash2, ChevronDown, Monitor, Calendar, Lock, Crown, Heart, Briefcase, User, TrendingUp } from "lucide-react";
import { TarotCard } from "./components/TarotCard";
import { getTarotGuidance, getYesNoGuidance } from "./services/gemini";
import { TarotResponse, YesNoResponse, HistoryEntry, ThemeMode } from "./types";

type AppMode = 'menu' | 'tarot' | 'yesno';

export default function App() {
  const [mode, setMode] = useState<AppMode>('menu');
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TarotResponse | null>(null);
  const [yesNoResult, setYesNoResult] = useState<YesNoResponse | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedPath, setSelectedPath] = useState<'A' | 'B' | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('intua-theme');
    return (saved as ThemeMode) || 'dark';
  });
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('intua-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [historyDuration, setHistoryDuration] = useState<number>(() => {
    const saved = localStorage.getItem('intua-history-duration');
    return saved ? parseInt(saved) : 7;
  });
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [lockedMessage, setLockedMessage] = useState<{ title: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Theme logic
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (mode: 'light' | 'dark') => {
      root.classList.toggle('dark', mode === 'dark');
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }
    localStorage.setItem('intua-theme', theme);
  }, [theme]);

  // History persistence and cleanup
  useEffect(() => {
    localStorage.setItem('intua-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('intua-history-duration', historyDuration.toString());
    
    // Cleanup old history
    const now = Date.now();
    const limit = historyDuration * 24 * 60 * 60 * 1000;
    setHistory(prev => prev.filter(entry => now - entry.timestamp < limit));
  }, [historyDuration]);

  const saveToHistory = (type: 'tarot' | 'yesno', q: string, res: TarotResponse | YesNoResponse) => {
    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      type,
      question: q,
      result: res
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
  };

  const deleteHistoryEntry = (id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
      setHistory([]);
    }
  };

  const handleDraw = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResult(null);
    setYesNoResult(null);
    setIsRevealed(false);
    setSelectedPath(null);
    setError(null);

    try {
      if (mode === 'tarot') {
        const data = await getTarotGuidance(question);
        if (data.is_relevant) {
          setResult(data);
          saveToHistory('tarot', question, data);
        } else {
          setError("A Maga não encontrou uma pergunta clara para orientar. Por favor, compartilhe uma dúvida ou dilema real.");
        }
      } else {
        const data = await getYesNoGuidance(question);
        if (data.is_relevant) {
          setYesNoResult(data);
          saveToHistory('yesno', question, data);
        } else {
          setError("A Maga não encontrou uma pergunta clara para orientar. Por favor, compartilhe uma dúvida ou dilema real.");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar orientação:", error);
      setError("As energias estão instáveis no momento. Tente novamente em alguns instantes.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleDraw();
    }
  };

  const reset = () => {
    setQuestion("");
    setResult(null);
    setYesNoResult(null);
    setIsRevealed(false);
    setSelectedPath(null);
    setError(null);
    setMode('menu');
  };

  const themeClasses = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'bg-[#020617] text-white' 
    : 'bg-[#f8fafc] text-slate-900';

  const currentTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return (
    <div className={`min-h-screen flex flex-col items-center transition-all duration-700 ${themeClasses} selection:bg-accent/30`}>
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
              className={`max-w-md w-full p-10 rounded-[3rem] border-2 shadow-2xl text-center space-y-6 ${currentTheme === 'dark' ? 'bg-slate-900 border-accent/30' : 'bg-white border-accent/20'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto text-accent">
                <Clock size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black serif tracking-tight">{lockedMessage.title}</h3>
                <p className="text-sm uppercase tracking-[0.3em] font-black text-slate-400">
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
      <div className="fixed top-6 left-6 z-[60]">
        <button 
          onClick={reset}
          className={`group p-1 rounded-xl transition-all border-2 shadow-2xl overflow-hidden ${currentTheme === 'dark' ? 'bg-white/5 border-accent/40 hover:border-accent' : 'bg-white border-accent/30 hover:border-accent'}`}
          title="Início"
        >
          <img 
            src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
            alt="INTUA" 
            className="w-10 h-10 object-cover rounded-lg group-hover:scale-110 transition-transform"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>

      {/* Fixed Hamburger Menu */}
      <div className="fixed top-6 right-6 z-[60]">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-3 rounded-full transition-all border-2 backdrop-blur-md ${currentTheme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-black/5 border-black/10 hover:bg-black/10 text-black'}`}
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
            className={`fixed top-0 right-0 h-full w-80 z-50 shadow-2xl border-l p-8 pt-24 backdrop-blur-xl flex flex-col ${currentTheme === 'dark' ? 'bg-slate-950/90 border-white/10' : 'bg-white/90 border-slate-200'}`}
          >
            <div className="flex flex-col gap-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {/* Theme Selector */}
              <div className="space-y-4">
                <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black ${currentTheme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}`}>Aparência</h3>
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
                  <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black ${currentTheme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}`}>Histórico</h3>
                  {history.length > 0 && (
                    <button onClick={clearHistory} className="text-rose-500 hover:text-rose-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* History Duration Setting */}
                <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${currentTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                  <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                    <Clock size={14} />
                    <span>Manter por:</span>
                  </div>
                  <select 
                    value={historyDuration}
                    onChange={(e) => setHistoryDuration(parseInt(e.target.value))}
                    className="bg-transparent font-black text-xs outline-none cursor-pointer text-accent"
                  >
                    <option value={1}>1 dia</option>
                    <option value={3}>3 dias</option>
                    <option value={7}>7 dias</option>
                    <option value={30}>30 dias</option>
                  </select>
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
                            setMode('tarot');
                            setResult(entry.result as TarotResponse);
                            setYesNoResult(null);
                          } else {
                            setMode('yesno');
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
                className={`flex items-center gap-4 text-lg font-bold hover:text-accent transition-colors mb-8 ${currentTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              >
                <RotateCcw size={20} />
                Reiniciar App
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

      <div className="w-full max-w-4xl px-4 py-12 md:py-24 flex-grow flex flex-col items-center relative z-10">
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-8 mb-10"
          >
            <div className={`p-2 rounded-[2.5rem] border-4 transition-all shadow-[0_0_50px_rgba(var(--accent-rgb),0.2)] overflow-hidden ${currentTheme === 'dark' ? 'bg-white/5 border-accent/40' : 'bg-white border-accent/30'}`} style={{ width: '160px', height: '160px' }}>
              <img 
                src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                alt="INTUA Logo" 
                className="w-full h-full object-cover rounded-[2rem] scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-3 text-accent">
              <Sparkles size={20} className="animate-pulse" />
              <span className="text-xs uppercase tracking-[0.4em] font-black">Maga das Escolhas</span>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`serif text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b ${currentTheme === 'dark' ? 'from-white to-white/40' : 'from-slate-950 to-slate-600'}`}
          >
            INTUA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`max-w-lg mx-auto leading-relaxed font-medium text-xl ${currentTheme === 'dark' ? 'text-slate-200 opacity-90' : 'text-slate-800'}`}
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
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl"
            >
              <button
                onClick={() => setMode('tarot')}
                className={`p-10 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent hover:bg-white/10' : 'bg-white border-slate-200 hover:border-accent hover:shadow-xl shadow-md'}`}
              >
                <div className="p-4 rounded-2xl bg-accent/20 text-accent w-fit group-hover:scale-110 transition-transform">
                  <MessageSquare size={36} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3">Orientação Completa</h3>
                  <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Uma leitura profunda com dois caminhos para sua decisão.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageSquare size={120} />
                </div>
              </button>

              <button
                onClick={() => setMode('yesno')}
                className={`p-10 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent hover:bg-white/10' : 'bg-white border-slate-200 hover:border-accent hover:shadow-xl shadow-md'}`}
              >
                <div className="p-4 rounded-2xl bg-accent/20 text-accent w-fit group-hover:scale-110 transition-transform">
                  <HelpCircle size={36} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3">Sim ou Não</h3>
                  <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Uma resposta rápida e direta para perguntas pontuais.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <HelpCircle size={120} />
                </div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Tiragem de Relacionamento' })}
                className={`p-10 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden opacity-70 hover:opacity-100 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent/40' : 'bg-white border-slate-200 hover:border-accent/40 shadow-md'}`}
              >
                <div className="p-4 rounded-2xl bg-slate-400/10 text-slate-400 w-fit group-hover:scale-110 transition-transform">
                  <Heart size={36} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-black">Relacionamento</h3>
                    <Clock size={16} className="text-slate-400" />
                  </div>
                  <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Analise a conexão e o futuro entre duas pessoas.</p>
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-3 py-1 rounded-full">Em Breve</div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Tiragem de Carreira' })}
                className={`p-10 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden opacity-70 hover:opacity-100 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent/40' : 'bg-white border-slate-200 hover:border-accent/40 shadow-md'}`}
              >
                <div className="p-4 rounded-2xl bg-slate-400/10 text-slate-400 w-fit group-hover:scale-110 transition-transform">
                  <Briefcase size={36} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-black">Carreira & Finanças</h3>
                    <Clock size={16} className="text-slate-400" />
                  </div>
                  <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Orientações estratégicas para sua vida profissional.</p>
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-3 py-1 rounded-full">Em Breve</div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Autoconhecimento' })}
                className={`p-10 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden opacity-70 hover:opacity-100 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent/40' : 'bg-white border-slate-200 hover:border-accent/40 shadow-md'}`}
              >
                <div className="p-4 rounded-2xl bg-slate-400/10 text-slate-400 w-fit group-hover:scale-110 transition-transform">
                  <User size={36} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-black">Autoconhecimento</h3>
                    <Clock size={16} className="text-slate-400" />
                  </div>
                  <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Mergulhe em sua essência e descubra seu propósito.</p>
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-3 py-1 rounded-full">Em Breve</div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Tendências do Ano' })}
                className={`p-10 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden opacity-70 hover:opacity-100 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-accent/40' : 'bg-white border-slate-200 hover:border-accent/40 shadow-md'}`}
              >
                <div className="p-4 rounded-2xl bg-slate-400/10 text-slate-400 w-fit group-hover:scale-110 transition-transform">
                  <TrendingUp size={36} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-black">Tendências do Ano</h3>
                    <Clock size={16} className="text-slate-400" />
                  </div>
                  <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Uma visão panorâmica dos seus próximos 12 meses.</p>
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-3 py-1 rounded-full">Em Breve</div>
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
                onClick={() => setMode('menu')}
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
                      className={`w-full h-40 px-8 py-6 rounded-3xl border-2 shadow-xl outline-none transition-all resize-none text-xl leading-relaxed placeholder:opacity-60 font-medium ${currentTheme === 'dark' ? 'bg-white/5 border-white/20 focus:ring-accent/40 focus:border-accent text-white' : 'bg-white border-slate-300 focus:ring-accent/20 focus:border-accent text-black'}`}
                      required
                    />
                  <div className="absolute bottom-6 right-8 flex items-center gap-3 text-accent/40 group-focus-within:text-accent transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">CTRL + ENTER para enviar</span>
                    <Search size={28} />
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
                    className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full"
                  >
                    <section className="md:col-span-2 text-center space-y-6 max-w-3xl mx-auto mb-12">
                      <h2 className="serif text-5xl md:text-6xl font-bold text-accent tracking-tighter">{result.card_name}</h2>
                      <p className={`text-2xl leading-relaxed italic font-medium opacity-90 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{result.card_meaning}</p>
                      <div className="h-1.5 w-40 bg-accent/30 mx-auto rounded-full" />
                      <p className="text-2xl leading-relaxed font-medium">{result.guidance}</p>
                    </section>

                    <div className="md:col-span-2 text-center mb-6">
                      <p className="serif text-4xl text-accent font-bold italic tracking-tight">
                        "Escolha o caminho que mais ressoa agora."
                      </p>
                    </div>

                      <div 
                        onClick={() => !selectedPath && setSelectedPath('A')}
                        className={`transition-all duration-700 p-10 rounded-[3rem] border-2 shadow-2xl space-y-6 flex flex-col ${!selectedPath ? 'cursor-pointer' : ''} ${currentTheme === 'dark' ? 'bg-white/5' : 'bg-white'} ${selectedPath === 'A' ? 'border-accent ring-8 ring-accent/10' : 'border-accent/20 opacity-95 hover:opacity-100'} ${selectedPath === 'B' ? 'hidden md:flex opacity-10 grayscale pointer-events-none' : ''}`}
                      >
                        <h4 className="text-sm uppercase tracking-[0.3em] font-black text-accent">{result.path_a_label}</h4>
                        <p className="font-bold text-2xl leading-tight">{result.path_a}</p>
                        <div className="pt-6 border-t-2 border-accent/20">
                          <p className={`text-xs uppercase tracking-[0.2em] mb-3 font-black ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>O QUE PODE ACONTECER</p>
                          <p className={`text-lg font-medium leading-relaxed ${currentTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{result.outcome_a}</p>
                        </div>
                      {selectedPath === 'A' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-6 mt-6 border-t-2 border-accent/30 text-accent font-bold italic leading-relaxed text-xl"
                        >
                          {result.detailed_guidance_a}
                        </motion.div>
                      )}
                      {!selectedPath && (
                        <button 
                          onClick={() => setSelectedPath('A')}
                          className="mt-auto w-full py-5 bg-accent text-white rounded-2xl shadow-xl hover:bg-accent/90 transition-all font-black uppercase text-sm tracking-[0.2em]"
                        >
                          Escolher este caminho
                        </button>
                      )}
                    </div>

                      <div 
                        onClick={() => !selectedPath && setSelectedPath('B')}
                        className={`transition-all duration-700 p-10 rounded-[3rem] border-2 shadow-2xl space-y-6 flex flex-col ${!selectedPath ? 'cursor-pointer' : ''} ${currentTheme === 'dark' ? 'bg-white/5' : 'bg-white'} ${selectedPath === 'B' ? 'border-accent ring-8 ring-accent/10' : 'border-accent/20 opacity-95 hover:opacity-100'} ${selectedPath === 'A' ? 'hidden md:flex opacity-10 grayscale pointer-events-none' : ''}`}>
                        <h4 className="text-sm uppercase tracking-[0.3em] font-black text-accent">{result.path_b_label}</h4>
                        <p className="font-bold text-2xl leading-tight">{result.path_b}</p>
                        <div className="pt-6 border-t-2 border-accent/20">
                          <p className={`text-xs uppercase tracking-[0.2em] mb-3 font-black ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>O QUE PODE ACONTECER</p>
                          <p className={`text-lg font-medium leading-relaxed ${currentTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{result.outcome_b}</p>
                        </div>
                      {selectedPath === 'B' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-6 mt-6 border-t-2 border-accent/30 text-accent font-bold italic leading-relaxed text-xl"
                        >
                          {result.detailed_guidance_b}
                        </motion.div>
                      )}
                      {!selectedPath && (
                        <button 
                          onClick={() => setSelectedPath('B')}
                          className="mt-auto w-full py-5 bg-accent text-white rounded-2xl shadow-xl hover:bg-accent/90 transition-all font-black uppercase text-sm tracking-[0.2em]"
                        >
                          Escolher este caminho
                        </button>
                      )}
                    </div>

                    <footer className="md:col-span-2 text-center pt-12 space-y-10">
                      <p className="serif italic text-4xl text-accent font-bold tracking-tight">{result.closing_message}</p>
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
                    className={`w-full p-12 rounded-[3rem] border-2 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] text-center space-y-10 ${currentTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
                  >
                    <div className="space-y-6">
                      <h4 className="text-sm uppercase tracking-[0.4em] font-black text-accent">A RESPOSTA É</h4>
                      <div className={`text-8xl font-black serif tracking-tighter ${yesNoResult.answer === 'Sim' ? 'text-emerald-500' : yesNoResult.answer === 'Não' ? 'text-rose-500' : 'text-accent'}`}>
                        {yesNoResult.answer}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h3 className="text-4xl font-bold text-accent tracking-tight">{yesNoResult.card_name}</h3>
                      <p className="text-2xl leading-relaxed font-medium opacity-90">{yesNoResult.reasoning}</p>
                      <div className="h-1.5 w-40 bg-accent/30 mx-auto rounded-full" />
                      <p className={`text-2xl italic font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{yesNoResult.guidance}</p>
                    </div>

                    <div className="pt-10 border-t-2 border-accent/10">
                      <p className="serif italic text-3xl text-accent font-bold mb-10 tracking-tight">{yesNoResult.closing_message}</p>
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
      </div>

      <footer className={`w-full py-8 text-center transition-opacity duration-700 ${currentTheme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
        <p className="text-[9px] font-black tracking-[0.5em] uppercase">
          © Maga Das Escolhas. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
