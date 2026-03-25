import React, { useState, useEffect, useRef, ErrorInfo, ReactNode, Component } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, HelpCircle, Heart, Briefcase, Moon, Sun, LogOut, Trash2, ChevronLeft, ChevronRight, Home, Plus } from "lucide-react";
import { HomeContent } from "./components/HomeContent";
import { Login } from "./components/Login";
import { getTarotGuidance, getYesNoGuidance, getRelationshipGuidance, getCareerGuidance, getTopic } from "./services/ai";
import { TarotResponse, YesNoResponse, RelationshipResponse, CareerResponse, HistoryEntry, ThemeMode, Lead, AppMode } from "./types";
import { auth, db, onAuthStateChanged, signInWithGoogle, signOut, handleFirestoreError, OperationType } from "./firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, onSnapshot, orderBy, limit, writeBatch } from "firebase/firestore";

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class AppErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): any {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center bg-paper">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-serif text-ink">Ops! Algo deu errado.</h1>
            <p className="text-sm text-ink/60">Ocorreu um erro inesperado. Por favor, recarregue a página.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-accent text-paper rounded-full text-sm font-bold"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeMode) || 'dark';
  });
  const [mode, setMode] = useState<AppMode>('tarot');
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TarotResponse | null>(null);
  const [yesNoResult, setYesNoResult] = useState<YesNoResponse | null>(null);
  const [relationshipResult, setRelationshipResult] = useState<RelationshipResponse | null>(null);
  const [careerResult, setCareerResult] = useState<CareerResponse | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedPath, setSelectedPath] = useState<'A' | 'B' | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lockedMessage, setLockedMessage] = useState<{ title: string } | null>(null);
  const [lead, setLead] = useState<Lead | null>(() => {
    const saved = localStorage.getItem('lead');
    return saved ? JSON.parse(saved) : null;
  });
  const [leadFormData, setLeadFormData] = useState({ name: "", email: "", whatsapp: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) {
      setHistory([]);
      return;
    }

    const q = query(
      collection(db, "history"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoryEntry[];
      setHistory(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "history");
    });

    return () => unsubscribe();
  }, [isAuthReady, user]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLead = { 
      ...leadFormData, 
      timestamp: new Date().toISOString() 
    };
    
    try {
      await addDoc(collection(db, "leads"), newLead);
      setLead(newLead as any);
      localStorage.setItem('lead', JSON.stringify(newLead));
      navigate("/pt/home");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "leads");
    }
  };

  const logout = async () => {
    await signOut();
    setLead(null);
    localStorage.removeItem('lead');
    navigate("/pt/login");
  };

  const handleDraw = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setIsRevealed(false);
    setSelectedPath(null);

    try {
      let res;
      if (mode === 'tarot') res = await getTarotGuidance(question);
      else if (mode === 'yesno') res = await getYesNoGuidance(question);
      else if (mode === 'relationship') res = await getRelationshipGuidance(question);
      else res = await getCareerGuidance(question);

      if (!res.is_relevant) {
        setLockedMessage({ title: "O Oráculo não compreendeu sua intenção. Por favor, reformule sua pergunta com mais clareza e profundidade." });
        setLoading(false);
        return;
      }

      if (mode === 'tarot') setResult(res as TarotResponse);
      else if (mode === 'yesno') setYesNoResult(res as YesNoResponse);
      else if (mode === 'relationship') setRelationshipResult(res as RelationshipResponse);
      else setCareerResult(res as CareerResponse);

      const topic = await getTopic(question);
      const historyEntry = {
        uid: user?.uid || "anonymous",
        question,
        topic,
        timestamp: new Date().toISOString(),
        type: mode,
        result: res
      };

      try {
        await addDoc(collection(db, "history"), historyEntry);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "history");
      }

      setIsRevealed(true);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao consultar o Oráculo.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDraw();
    }
  };

  const clearHistory = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "history"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "history");
    }
  };

  const reset = () => {
    setResult(null);
    setYesNoResult(null);
    setRelationshipResult(null);
    setCareerResult(null);
    setQuestion("");
    setIsRevealed(false);
    setSelectedPath(null);
    setError(null);
    setLockedMessage(null);
    setMode('menu');
    setIsMenuOpen(false);
    navigate("/pt/home");
  };

  const currentTheme = theme === 'dark' ? 'dark' : 'light';

  if (!lead && location.pathname !== "/pt/login") {
    return <Navigate to="/pt/login" replace />;
  }

  return (
    <AppErrorBoundary>
      <div className={theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : ''}>
        {/* Atmospheric Background */}
        <div className="atmosphere" />

        <Routes>
          <Route path="/pt/login" element={
            <Login 
              leadFormData={leadFormData}
              setLeadFormData={setLeadFormData}
              handleLeadSubmit={handleLeadSubmit}
              theme={theme}
              setTheme={setTheme}
            />
          } />
          <Route path="*" element={
            <div className={`split-layout relative z-10 transition-all duration-500 ${isSidebarCollapsed ? 'collapsed' : ''}`}>
              {/* Mobile Header */}
              <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass z-[60] flex items-center justify-between px-6">
                <button 
                  onClick={reset}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <img 
                    src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                    alt="INTUA" 
                    className="w-6 h-6 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-lg font-light tracking-[0.2em]">INTUA</span>
                </button>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-paper/50 cursor-pointer"
                >
                  <div className="w-5 h-4 flex flex-col justify-between">
                    <span className={`h-0.5 w-full bg-ink transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <span className={`h-0.5 w-full bg-ink transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`h-0.5 w-full bg-ink transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                  </div>
                </button>
              </header>

              {/* Mobile Menu Overlay */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
                  />
                )}
              </AnimatePresence>

              {/* Left Pane: Navigation & Input */}
              <aside className={`left-pane ${isMenuOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'} ${isSidebarCollapsed ? 'w-[80px]' : 'w-[450px]'} transition-all duration-500`}>
                {/* Mobile Drag Handle */}
                <div className="lg:hidden w-12 h-1 bg-border rounded-full mx-auto mb-6 shrink-0" />
                
                <div className="flex flex-col h-full">
                  <header className={`mb-12 hidden lg:flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-8' : ''}`}>
                    <button 
                      onClick={reset}
                      className="group flex items-center gap-4 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center overflow-hidden bg-paper/50 backdrop-blur-md shrink-0">
                        <img 
                          src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                          alt="INTUA" 
                          className="w-8 h-8 object-cover opacity-80 group-hover:scale-110 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {!isSidebarCollapsed && (
                        <div className="text-left">
                          <h1 className="text-2xl font-light tracking-[0.2em] text-ink">INTUA</h1>
                          <span className="small-caps !text-[8px]">Maga das Escolhas</span>
                        </div>
                      )}
                    </button>

                    <button 
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                      className="hidden lg:flex w-8 h-8 rounded-full border border-border items-center justify-center hover:bg-ink hover:text-paper transition-all cursor-pointer"
                    >
                      {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                  </header>

                  <nav className={`flex-grow space-y-8 overflow-y-auto no-scrollbar py-4 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                    <div className="w-full">
                      <button
                        onClick={reset}
                        className={`w-full py-4 px-6 rounded-2xl transition-all flex items-center gap-4 border border-border bg-paper/50 hover:bg-ink hover:text-paper hover:border-ink group cursor-pointer shadow-sm ${isSidebarCollapsed ? 'lg:justify-center lg:px-0 lg:w-12 lg:h-12 lg:rounded-full lg:mx-auto' : ''}`}
                        title="Nova Tiragem"
                      >
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-paper/20 transition-colors shrink-0">
                          <Plus size={16} className="text-accent group-hover:text-paper" />
                        </div>
                        <span className={`text-sm font-bold tracking-tight ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Nova Tiragem</span>
                      </button>
                    </div>

                    {history.length > 0 && !isSidebarCollapsed && (
                      <div className="space-y-4 hidden lg:block">
                        <div className="flex items-center justify-between">
                          <p className="small-caps">Histórico</p>
                          <button onClick={clearHistory} className="text-rose-500 hover:text-rose-400 transition-colors cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="space-y-2">
                          {history.slice(0, 5).map((entry) => (
                            <button
                              key={entry.id}
                              onClick={() => {
                                setMode(entry.type);
                                navigate(`/pt/home/${entry.type}`);
                                setIsMenuOpen(false);
                                if (entry.type === 'tarot') setResult(entry.result as TarotResponse);
                                else if (entry.type === 'yesno') setYesNoResult(entry.result as YesNoResponse);
                                else if (entry.type === 'relationship') setRelationshipResult(entry.result as RelationshipResponse);
                                else if (entry.type === 'career') setCareerResult(entry.result as CareerResponse);
                                setQuestion(entry.question);
                                setIsRevealed(true);
                              }}
                              className="w-full p-3 rounded-xl hover:bg-ink hover:text-paper transition-all text-left border border-transparent hover:border-ink cursor-pointer"
                            >
                              <p className="text-[10px] font-bold opacity-40 mb-1">{new Date(entry.timestamp).toLocaleDateString()}</p>
                              <p className="text-xs font-medium line-clamp-1 opacity-80">{entry.question}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </nav>

                  <footer className={`mt-auto pt-8 border-t border-border flex items-center justify-between ${isSidebarCollapsed ? 'lg:flex-col lg:gap-6' : ''}`}>
                    <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'lg:flex-col' : ''}`}>
                      <button 
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-ink hover:text-paper transition-all cursor-pointer"
                        title="Alternar Tema"
                      >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                      </button>
                      <button 
                        onClick={logout}
                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        title="Sair"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                    {!isSidebarCollapsed && (
                      <div className="text-right">
                        <p className="text-[10px] font-bold opacity-40">© 2026 INTUA</p>
                        <p className="text-[8px] uppercase tracking-widest opacity-20">Maga das Escolhas</p>
                      </div>
                    )}
                  </footer>
                </div>
              </aside>

              {/* Right Pane: Content & Results */}
              <main className="right-pane">
                <Routes>
                  <Route path="/" element={<Navigate to="/pt/home" replace />} />
                  <Route path="/pt/home" element={
                    <HomeContent 
                      mode={mode} setMode={setMode} question={question} setQuestion={setQuestion}
                      loading={loading} result={result} setResult={setResult}
                      yesNoResult={yesNoResult} setYesNoResult={setYesNoResult}
                      relationshipResult={relationshipResult} setRelationshipResult={setRelationshipResult}
                      careerResult={careerResult} setCareerResult={setCareerResult}
                      isRevealed={isRevealed} setIsRevealed={setIsRevealed}
                      selectedPath={selectedPath} setSelectedPath={setSelectedPath}
                      error={error} setError={setError} setLockedMessage={setLockedMessage}
                      textareaRef={textareaRef} handleDraw={handleDraw} handleKeyDown={handleKeyDown}
                      reset={reset} currentTheme={currentTheme}
                    />
                  } />
                  <Route path="/pt/home/:type" element={
                    <HomeContent 
                      mode={mode} setMode={setMode} question={question} setQuestion={setQuestion}
                      loading={loading} result={result} setResult={setResult}
                      yesNoResult={yesNoResult} setYesNoResult={setYesNoResult}
                      relationshipResult={relationshipResult} setRelationshipResult={setRelationshipResult}
                      careerResult={careerResult} setCareerResult={setCareerResult}
                      isRevealed={isRevealed} setIsRevealed={setIsRevealed}
                      selectedPath={selectedPath} setSelectedPath={setSelectedPath}
                      error={error} setError={setError} setLockedMessage={setLockedMessage}
                      textareaRef={textareaRef} handleDraw={handleDraw} handleKeyDown={handleKeyDown}
                      reset={reset} currentTheme={currentTheme}
                    />
                  } />
                  <Route path="*" element={<Navigate to="/pt/home" replace />} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </div>
    </AppErrorBoundary>
  );
}
