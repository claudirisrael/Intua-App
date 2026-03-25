import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, RotateCcw, ArrowRight, Loader2, Sparkles, Sun, Moon, HelpCircle, MessageSquare, Menu, X, History, Clock, Trash2, ChevronDown, Monitor, Calendar, Lock, Crown, Heart, Briefcase, User, TrendingUp, BarChart3, PieChart as PieChartIcon, Mail, Phone, LogOut } from "lucide-react";
import { TarotCard } from "./components/TarotCard";
import { HomeContent } from "./components/HomeContent";
import { getTarotGuidance, getYesNoGuidance, getTopic } from "./services/ai";
import { TarotResponse, YesNoResponse, HistoryEntry, ThemeMode, Lead, AppMode } from "./types";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<AppMode>('menu');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TarotResponse | null>(null);
  const [yesNoResult, setYesNoResult] = useState<YesNoResponse | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedPath, setSelectedPath] = useState<'A' | 'B' | null>(null);
  const [leadInfo, setLeadInfo] = useState<Lead | null>(null);
  const [leadFormData, setLeadFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('intua-theme');
    return (saved as ThemeMode) || 'system';
  });
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [lockedMessage, setLockedMessage] = useState<{ title: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoginPage = location.pathname === '/pt/login' || location.pathname === '/pt' || location.pathname === '/';

  // Fetch history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchHistory();

    // Check for lead info
    const savedLead = localStorage.getItem('intua-user-info');
    if (savedLead) {
      setLeadInfo(JSON.parse(savedLead));
      if (isLoginPage) {
        navigate('/pt/home');
      }
    } else {
      if (!isLoginPage) {
        navigate('/pt/login');
      }
    }
  }, [isLoginPage, navigate]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      ...leadFormData,
      timestamp: Date.now()
    };
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
      if (response.ok) {
        localStorage.setItem('intua-user-info', JSON.stringify(newLead));
        setLeadInfo(newLead);
        navigate('/pt/home');
      } else {
        // Fallback navigation if API fails
        localStorage.setItem('intua-user-info', JSON.stringify(newLead));
        setLeadInfo(newLead);
        navigate('/pt/home');
      }
    } catch (error) {
      console.error("Failed to save lead:", error);
      localStorage.setItem('intua-user-info', JSON.stringify(newLead));
      setLeadInfo(newLead);
      navigate('/pt/home');
    }
  };

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
  const saveToHistory = async (type: 'tarot' | 'yesno', q: string, topic: string, res: TarotResponse | YesNoResponse) => {
    const newEntry = {
      timestamp: Date.now(),
      type,
      question: q,
      topic,
      result: res
    };
    
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      if (response.ok) {
        const savedEntry = await response.json();
        setHistory(prev => [savedEntry, ...prev]);
      }
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const deleteHistoryEntry = (id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const clearHistory = async () => {
    if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
      try {
        const response = await fetch('/api/history', { method: 'DELETE' });
        if (response.ok) {
          setHistory([]);
        }
      } catch (error) {
        console.error("Failed to clear history:", error);
      }
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
      const topic = await getTopic(question);
      if (mode === 'tarot') {
        const data = await getTarotGuidance(question);
        if (data.is_relevant) {
          setResult(data);
          saveToHistory('tarot', question, topic, data);
        } else {
          setError("A Maga não encontrou uma pergunta clara para orientar. Por favor, compartilhe uma dúvida ou dilema real.");
        }
      } else {
        const data = await getYesNoGuidance(question);
        if (data.is_relevant) {
          setYesNoResult(data);
          saveToHistory('yesno', question, topic, data);
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
    navigate('/pt/home');
  };

  const logout = () => {
    localStorage.removeItem('intua-user-info');
    setLeadInfo(null);
    setIsMenuOpen(false);
    navigate('/pt/login');
  };

  const currentTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const themeClasses = currentTheme === 'dark'
    ? 'bg-slate-950 text-white' 
    : 'bg-slate-50 text-slate-900';

  return (
    <div className={`min-h-screen flex flex-col items-center transition-all duration-700 ${themeClasses} selection:bg-accent/30 overflow-x-hidden`}>
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/pt/login" replace />} />
        <Route path="/pt" element={<Navigate to="/pt/login" replace />} />
        <Route path="/pt/login" element={
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020205] overflow-hidden">
            {/* Mystic Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="p-2 glass-dark rounded-2xl border-accent/30">
                      <img 
                        src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                        alt="INTUA Logo" 
                        className="w-16 h-16 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-accent">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Maga das Escolhas</span>
                      </div>
                      <h1 className="text-5xl font-bold serif text-white tracking-tight">INTUA</h1>
                    </div>
                  </div>
                  
                  <p className="text-xl font-light leading-relaxed max-w-md text-white/70">
                    A sabedoria milenar do Tarô traduzida para o seu momento presente. Encontre clareza em suas escolhas através de uma experiência envolvente e intuitiva.
                  </p>
                </div>
                
                <div className="hidden lg:block w-32 h-px bg-accent/30" />
                
                <div className="hidden lg:grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h4 className="text-accent text-[10px] font-black uppercase tracking-widest">Clareza</h4>
                    <p className="text-sm text-white/40">Respostas diretas para as suas dúvidas mais profundas.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-accent text-[10px] font-black uppercase tracking-widest">Intuição</h4>
                    <p className="text-sm text-white/40">Conecte-se com o seu eu interior através dos arcanos.</p>
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-12 glass-dark border-accent/20 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold serif text-white">Começar Jornada</h2>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Identifique-se para o oráculo</p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Nome</label>
                      <input 
                        required
                        type="text"
                        placeholder="Como deseja ser chamado?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none transition-all focus:border-accent/50 focus:bg-white/10 text-white font-medium placeholder:text-white/10"
                        value={leadFormData.name}
                        onChange={e => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30">E-mail</label>
                      <input 
                        required
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none transition-all focus:border-accent/50 focus:bg-white/10 text-white font-medium placeholder:text-white/10"
                        value={leadFormData.email}
                        onChange={e => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30">WhatsApp</label>
                      <input 
                        required
                        type="tel"
                        placeholder="(00) 00000-0000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none transition-all focus:border-accent/50 focus:bg-white/10 text-white font-medium placeholder:text-white/10"
                        value={leadFormData.whatsapp}
                        onChange={e => setLeadFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-accent/80 transition-all shadow-2xl shadow-accent/20 relative group overflow-hidden"
                  >
                    <span className="relative z-10">Entrar no Oráculo</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        } />
        <Route path="/pt/home" element={
          <HomeContent 
            mode={mode}
            setMode={setMode}
            question={question}
            setQuestion={setQuestion}
            loading={loading}
            result={result}
            setResult={setResult}
            yesNoResult={yesNoResult}
            setYesNoResult={setYesNoResult}
            isRevealed={isRevealed}
            setIsRevealed={setIsRevealed}
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            error={error}
            setError={setError}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            history={history}
            theme={theme}
            setTheme={setTheme}
            isThemeDropdownOpen={isThemeDropdownOpen}
            setIsThemeDropdownOpen={setIsThemeDropdownOpen}
            lockedMessage={lockedMessage}
            setLockedMessage={setLockedMessage}
            textareaRef={textareaRef}
            handleDraw={handleDraw}
            handleKeyDown={handleKeyDown}
            reset={reset}
            logout={logout}
            clearHistory={clearHistory}
            deleteHistoryEntry={deleteHistoryEntry}
            currentTheme={currentTheme}
          />
        } />
        <Route path="/pt/home/:type" element={
          <HomeContent 
            mode={mode}
            setMode={setMode}
            question={question}
            setQuestion={setQuestion}
            loading={loading}
            result={result}
            setResult={setResult}
            yesNoResult={yesNoResult}
            setYesNoResult={setYesNoResult}
            isRevealed={isRevealed}
            setIsRevealed={setIsRevealed}
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            error={error}
            setError={setError}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            history={history}
            theme={theme}
            setTheme={setTheme}
            isThemeDropdownOpen={isThemeDropdownOpen}
            setIsThemeDropdownOpen={setIsThemeDropdownOpen}
            lockedMessage={lockedMessage}
            setLockedMessage={setLockedMessage}
            textareaRef={textareaRef}
            handleDraw={handleDraw}
            handleKeyDown={handleKeyDown}
            reset={reset}
            logout={logout}
            clearHistory={clearHistory}
            deleteHistoryEntry={deleteHistoryEntry}
            currentTheme={currentTheme}
          />
        } />
        <Route path="*" element={<Navigate to="/pt/home" replace />} />
      </Routes>
    </div>
  );
}

