import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, RotateCcw, ArrowRight, Loader2, Sparkles, Sun, Moon, 
  HelpCircle, MessageSquare, Menu, X, History, Clock, Trash2, 
  ChevronDown, Monitor, Heart, Briefcase, User, TrendingUp, LogOut 
} from "lucide-react";
import { TarotCard } from "./TarotCard";
import { TarotResponse, YesNoResponse, RelationshipResponse, CareerResponse, HistoryEntry, ThemeMode, AppMode } from "../types";

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
  relationshipResult: RelationshipResponse | null;
  setRelationshipResult: React.Dispatch<React.SetStateAction<RelationshipResponse | null>>;
  careerResult: CareerResponse | null;
  setCareerResult: React.Dispatch<React.SetStateAction<CareerResponse | null>>;
  isRevealed: boolean;
  setIsRevealed: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPath: 'A' | 'B' | null;
  setSelectedPath: React.Dispatch<React.SetStateAction<'A' | 'B' | null>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLockedMessage: React.Dispatch<React.SetStateAction<{ title: string } | null>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleDraw: (e?: React.FormEvent) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  reset: () => void;
  currentTheme: 'light' | 'dark';
}

export function HomeContent({
  mode, setMode, question, setQuestion, loading, result, setResult,
  yesNoResult, setYesNoResult, relationshipResult, setRelationshipResult,
  careerResult, setCareerResult,
  isRevealed, setIsRevealed, selectedPath,
  setSelectedPath, error, setError, setLockedMessage, textareaRef, handleDraw, handleKeyDown,
  reset, currentTheme
}: HomeContentProps) {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (type === 'tarot') setMode('tarot');
    else if (type === 'yesno') setMode('yesno');
    else if (type === 'relationship') setMode('relationship');
    else if (type === 'career') setMode('career');
    else setMode('menu');
  }, [type, setMode]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Locked Feature Modal */}

      {/* Top Left Logo */}

      {/* Background Glows */}
      <div className="atmosphere" />

      <div className="w-full max-w-5xl px-4 sm:px-6 py-8 md:py-32 flex-grow flex flex-col items-center relative z-10">
        <header className="text-center mb-12 md:mb-32 space-y-8 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-border flex items-center justify-center overflow-hidden bg-paper/50 backdrop-blur-md">
              <img 
                src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                alt="INTUA Logo" 
                className="w-16 h-16 md:w-20 md:h-20 object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-border" />
              <span className="small-caps">Maga das Escolhas</span>
              <div className="h-px w-8 bg-border" />
            </div>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="title-xl text-ink"
            >
              INTUA
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-2xl font-light leading-relaxed opacity-60 text-ink"
            >
              A sabedoria milenar do Tarô traduzida para o seu momento presente. 
              Encontre clareza em suas escolhas.
            </motion.p>
          </div>
        </header>

        <main className="w-full flex flex-col items-center">
          {mode === 'menu' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
            >
              <button
                onClick={() => navigate('/pt/home/tarot')}
                className="p-8 md:p-12 glass transition-all text-left flex flex-col gap-6 md:gap-8 group relative overflow-hidden hover:bg-ink hover:text-paper hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-colors">
                  <MessageSquare size={20} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif font-light">Tarô das Escolhas</h3>
                  <p className="text-sm opacity-60 group-hover:opacity-100 font-light leading-relaxed">
                    Uma tiragem profunda para analisar dois caminhos e suas consequências.
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate('/pt/home/yesno')}
                className="p-8 md:p-12 glass transition-all text-left flex flex-col gap-6 md:gap-8 group relative overflow-hidden hover:bg-ink hover:text-paper hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-colors">
                  <HelpCircle size={20} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif font-light">Sim ou Não</h3>
                  <p className="text-sm opacity-60 group-hover:opacity-100 font-light leading-relaxed">
                    Uma resposta direta e objetiva para questões imediatas.
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate('/pt/home/relationship')}
                className="p-8 md:p-12 glass transition-all text-left flex flex-col gap-6 md:gap-8 group relative overflow-hidden hover:bg-ink hover:text-paper hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-colors">
                  <Heart size={20} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif font-light">Relacionamento</h3>
                  <p className="text-sm opacity-60 group-hover:opacity-100 font-light leading-relaxed">
                    Analise a conexão e o futuro entre duas pessoas.
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate('/pt/home/career')}
                className="p-8 md:p-12 glass transition-all text-left flex flex-col gap-6 md:gap-8 group relative overflow-hidden hover:bg-ink hover:text-paper hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-colors">
                  <Briefcase size={20} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif font-light">Carreira & Finanças</h3>
                  <p className="text-sm opacity-60 group-hover:opacity-100 font-light leading-relaxed">
                    Orientações estratégicas para sua vida profissional e financeira.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Autoconhecimento' })}
                className="p-8 md:p-12 glass transition-all text-left flex flex-col gap-6 md:gap-8 group relative overflow-hidden opacity-40 hover:opacity-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                  <User size={20} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-serif font-light">Autoconhecimento</h3>
                    <div className="small-caps !text-[8px] border border-border px-2 py-0.5 rounded-full">Em Breve</div>
                  </div>
                  <p className="text-sm font-light leading-relaxed">Mergulhe em sua essência e descubra seu propósito.</p>
                </div>
              </button>

              <button
                onClick={() => setLockedMessage({ title: 'Tendências do Ano' })}
                className="p-8 md:p-12 glass transition-all text-left flex flex-col gap-6 md:gap-8 group relative overflow-hidden opacity-40 hover:opacity-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-serif font-light">Tendências do Ano</h3>
                    <div className="small-caps !text-[8px] border border-border px-2 py-0.5 rounded-full">Em Breve</div>
                  </div>
                  <p className="text-sm font-light leading-relaxed">Uma visão panorâmica dos seus próximos 12 meses.</p>
                </div>
              </button>
            </motion.div>
          )}

          {(mode === 'tarot' || mode === 'yesno' || mode === 'relationship' || mode === 'career') && !result && !yesNoResult && !relationshipResult && !careerResult && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl space-y-8"
            >
              <button 
                onClick={() => navigate('/pt/home')}
                className="nav-pill w-fit mb-8 cursor-pointer"
              >
                ← Voltar ao menu
              </button>
              <form onSubmit={handleDraw} className="space-y-12">
                <div className="relative group">
                    <textarea
                      ref={textareaRef}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        mode === 'tarot' ? "Sobre qual decisão você precisa de clareza hoje?" : 
                        mode === 'yesno' ? "Faça uma pergunta de Sim ou Não..." :
                        mode === 'relationship' ? "Qual a sua dúvida sobre o relacionamento?" :
                        "Qual a sua dúvida sobre carreira ou finanças?"
                      }
                      className="w-full h-48 md:h-64 bg-transparent border-b border-border py-4 md:py-8 outline-none transition-all resize-none text-xl md:text-3xl leading-relaxed placeholder:opacity-10 font-light focus:border-ink text-ink"
                      required
                    />
                  <div className="absolute bottom-8 right-0 flex items-center gap-6 text-muted group-focus-within:text-ink transition-colors">
                    <span className="small-caps hidden sm:block">CTRL + ENTER</span>
                    <Search size={24} />
                  </div>
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 text-sm font-light tracking-wide border-l-2 border-rose-500 pl-6 py-2"
                  >
                    {error}
                  </motion.div>
                )}
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="w-full py-6 bg-white text-black rounded-full font-bold tracking-[0.2em] uppercase text-xs hover:bg-white/90 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 cursor-pointer"
                >
                  {mode === 'tarot' ? 'Tirar uma Carta' : 'Obter Resposta'}
                  <ArrowRight size={18} />
                </button>
              </form>
            </motion.div>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-12 py-32">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border border-border border-t-ink animate-spin" />
              </div>
              <p className="serif italic text-4xl text-ink font-light animate-pulse tracking-tight">Sintonizando sua intuição...</p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center gap-20"
              >
                <div className="flex flex-col items-center gap-8">
                  <TarotCard 
                    name={result.card_name} 
                    isRevealed={isRevealed} 
                    onClick={() => setIsRevealed(true)} 
                  />
                  {!isRevealed && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="small-caps animate-pulse"
                    >
                      Clique para revelar
                    </motion.p>
                  )}
                </div>

                {isRevealed && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-24"
                  >
                    <section className="text-center space-y-6 md:space-y-8 max-w-3xl mx-auto">
                      <div className="space-y-4">
                        <p className="small-caps">A Carta</p>
                        <h2 className="title-xl !text-4xl sm:!text-6xl md:!text-8xl">{result.card_name}</h2>
                      </div>
                      <p className="text-lg md:text-2xl leading-relaxed italic font-light opacity-60">{result.card_meaning}</p>
                      <div className="h-px w-24 bg-border mx-auto" />
                      <p className="text-lg md:text-2xl font-light leading-relaxed">{result.guidance}</p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div 
                        onClick={() => !selectedPath && setSelectedPath('A')}
                        className={`p-8 md:p-12 glass transition-all duration-700 space-y-6 md:space-y-8 flex flex-col ${!selectedPath ? 'cursor-pointer hover:bg-white/5' : ''} ${selectedPath === 'A' ? 'border-ink bg-white/5' : ''} ${selectedPath === 'B' ? 'opacity-10 grayscale pointer-events-none' : ''}`}
                      >
                        <div className="space-y-2">
                          <p className="small-caps">Caminho A</p>
                          <h4 className="text-2xl font-serif font-light">{result.path_a_label}</h4>
                        </div>
                        <p className="font-light text-xl leading-relaxed opacity-80">{result.path_a}</p>
                        <div className="pt-8 border-t border-border">
                          <p className="small-caps mb-4">Potencial</p>
                          <p className="text-lg font-light leading-relaxed">{result.outcome_a}</p>
                        </div>
                        {selectedPath === 'A' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-8 mt-8 border-t border-border text-xl font-light serif italic leading-relaxed"
                          >
                            {result.detailed_guidance_a}
                          </motion.div>
                        )}
                        {!selectedPath && (
                          <button 
                            onClick={() => setSelectedPath('A')}
                            className="nav-pill mt-auto"
                          >
                            Seguir este caminho
                          </button>
                        )}
                      </div>

                      <div 
                        onClick={() => !selectedPath && setSelectedPath('B')}
                        className={`p-8 md:p-12 glass transition-all duration-700 space-y-6 md:space-y-8 flex flex-col ${!selectedPath ? 'cursor-pointer hover:bg-white/5' : ''} ${selectedPath === 'B' ? 'border-ink bg-white/5' : ''} ${selectedPath === 'A' ? 'opacity-10 grayscale pointer-events-none' : ''}`}
                      >
                        <div className="space-y-2">
                          <p className="small-caps">Caminho B</p>
                          <h4 className="text-2xl font-serif font-light">{result.path_b_label}</h4>
                        </div>
                        <p className="font-light text-xl leading-relaxed opacity-80">{result.path_b}</p>
                        <div className="pt-8 border-t border-border">
                          <p className="small-caps mb-4">Potencial</p>
                          <p className="text-lg font-light leading-relaxed">{result.outcome_b}</p>
                        </div>
                        {selectedPath === 'B' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-8 mt-8 border-t border-border text-xl font-light serif italic leading-relaxed"
                          >
                            {result.detailed_guidance_b}
                          </motion.div>
                        )}
                        {!selectedPath && (
                          <button 
                            onClick={() => setSelectedPath('B')}
                            className="nav-pill mt-auto"
                          >
                            Seguir este caminho
                          </button>
                        )}
                      </div>
                    </div>

                    <footer className="text-center pt-12 space-y-12">
                      <p className="serif italic text-3xl font-light opacity-80">{result.closing_message}</p>
                      <button
                        onClick={reset}
                        className="nav-pill"
                      >
                        Nova Consulta
                      </button>
                    </footer>
                  </motion.div>
                )}
              </motion.div>
            )}

                {yesNoResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col items-center gap-16 max-w-3xl"
                  >
                    <div className="flex flex-col items-center gap-8">
                      <TarotCard 
                        name={yesNoResult.card_name} 
                        isRevealed={isRevealed} 
                        onClick={() => setIsRevealed(true)} 
                      />
                      {!isRevealed && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="small-caps animate-pulse"
                        >
                          Clique para revelar
                        </motion.p>
                      )}
                    </div>

                    {isRevealed && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full p-8 md:p-16 glass space-y-12 md:space-y-16 text-center"
                      >
                        <div className="space-y-4">
                          <p className="small-caps">A Resposta é</p>
                          <div className="text-6xl sm:text-8xl md:text-9xl font-serif font-light tracking-tighter">
                            {yesNoResult.answer}
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className="space-y-2">
                            <p className="small-caps">A Carta</p>
                            <h3 className="text-4xl font-serif font-light">{yesNoResult.card_name}</h3>
                          </div>
                          <p className="text-2xl leading-relaxed font-light opacity-60">{yesNoResult.reasoning}</p>
                          <div className="h-px w-24 bg-border mx-auto" />
                          <p className="text-2xl italic font-light serif">{yesNoResult.guidance}</p>
                        </div>

                        <div className="pt-12 border-t border-border space-y-12">
                          <p className="serif italic text-3xl font-light opacity-80">{yesNoResult.closing_message}</p>
                          <button
                            onClick={reset}
                            className="nav-pill"
                          >
                            Nova Consulta
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {relationshipResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col items-center gap-16 max-w-4xl"
                  >
                    <div className="flex flex-col items-center gap-8">
                      <TarotCard 
                        name={relationshipResult.card_name} 
                        isRevealed={isRevealed} 
                        onClick={() => setIsRevealed(true)} 
                      />
                      {!isRevealed && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="small-caps animate-pulse"
                        >
                          Clique para revelar
                        </motion.p>
                      )}
                    </div>

                    {isRevealed && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full space-y-12"
                      >
                        <div className="p-8 md:p-16 glass text-center space-y-6 md:space-y-8">
                          <div className="space-y-4">
                            <p className="small-caps">A Carta</p>
                            <h3 className="text-3xl md:text-5xl font-serif font-light">{relationshipResult.card_name}</h3>
                          </div>
                          <p className="text-lg md:text-2xl leading-relaxed font-light opacity-40 italic serif">{relationshipResult.card_meaning}</p>
                          <div className="h-px w-24 bg-border mx-auto" />
                          <p className="text-lg md:text-2xl font-light leading-relaxed">{relationshipResult.guidance}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                          <div className="p-8 md:p-12 glass space-y-4 md:space-y-6">
                            <p className="small-caps">Energia da Conexão</p>
                            <p className="text-lg md:text-xl font-light leading-relaxed">{relationshipResult.connection_energy}</p>
                          </div>
                          <div className="p-8 md:p-12 glass space-y-4 md:space-y-6">
                            <p className="small-caps">Perspectiva Futura</p>
                            <p className="text-lg md:text-xl font-light leading-relaxed">{relationshipResult.future_outlook}</p>
                          </div>
                          <div className="p-8 md:p-12 glass space-y-4 md:space-y-6">
                            <p className="small-caps">Conselho para Você</p>
                            <p className="text-lg md:text-xl font-light leading-relaxed">{relationshipResult.advice_for_you}</p>
                          </div>
                          <div className="p-8 md:p-12 glass space-y-4 md:space-y-6">
                            <p className="small-caps">Conselho para o Outro</p>
                            <p className="text-lg md:text-xl font-light leading-relaxed">{relationshipResult.advice_for_partner}</p>
                          </div>
                        </div>

                        <div className="pt-12 border-t border-border text-center space-y-12">
                          <p className="serif italic text-3xl font-light opacity-60">{relationshipResult.closing_message}</p>
                          <button
                            onClick={reset}
                            className="nav-pill"
                          >
                            Nova Consulta
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {careerResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col items-center gap-16 max-w-4xl"
                  >
                    <div className="flex flex-col items-center gap-8">
                      <TarotCard 
                        name={careerResult.card_name} 
                        isRevealed={isRevealed} 
                        onClick={() => setIsRevealed(true)} 
                      />
                      {!isRevealed && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="small-caps animate-pulse"
                        >
                          Clique para revelar
                        </motion.p>
                      )}
                    </div>

                    {isRevealed && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full space-y-12"
                      >
                        <div className="p-8 md:p-16 glass text-center space-y-6 md:space-y-8">
                          <div className="space-y-4">
                            <p className="small-caps">A Carta</p>
                            <h3 className="text-3xl md:text-5xl font-serif font-light">{careerResult.card_name}</h3>
                          </div>
                          <p className="text-lg md:text-2xl leading-relaxed font-light opacity-40 italic serif">{careerResult.card_meaning}</p>
                          <div className="h-px w-24 bg-border mx-auto" />
                          <p className="text-lg md:text-2xl font-light leading-relaxed">{careerResult.guidance}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                          <div className="p-8 md:p-12 glass space-y-4 md:space-y-6">
                            <p className="small-caps">Situação Profissional</p>
                            <p className="text-lg md:text-xl font-light leading-relaxed">{careerResult.professional_situation}</p>
                          </div>
                          <div className="p-8 md:p-12 glass space-y-4 md:space-y-6">
                            <p className="small-caps">Perspectiva Financeira</p>
                            <p className="text-lg md:text-xl font-light leading-relaxed">{careerResult.financial_outlook}</p>
                          </div>
                          <div className="md:col-span-2 p-8 md:p-12 glass space-y-4 md:space-y-6">
                            <p className="small-caps">Conselho Estratégico</p>
                            <p className="text-lg md:text-xl font-light leading-relaxed">{careerResult.strategic_advice}</p>
                          </div>
                        </div>

                        <div className="pt-12 border-t border-border text-center space-y-12">
                          <p className="serif italic text-3xl font-light opacity-60">{careerResult.closing_message}</p>
                          <button
                            onClick={reset}
                            className="nav-pill"
                          >
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
