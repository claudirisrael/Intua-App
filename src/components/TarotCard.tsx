import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface TarotCardProps {
  name: string;
  isRevealed: boolean;
  onClick?: () => void;
}

const ARCANA_IMAGES: Record<string, string> = {
  "O Louco": "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  "O Mago": "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  "A Sacerdotisa": "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  "A Imperatriz": "https://upload.wikimedia.org/wikipedia/commons/a/af/RWS_Tarot_03_Empress.jpg",
  "O Imperador": "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  "O Hierofante": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  "Os Enamorados": "https://content-media.astrologialuzesombra.com.br/wp-content/uploads/2025/08/enamorados-tarot-arcano-6-rsw.png",
  "O Carro": "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
  "A Força": "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
  "O Eremita": "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
  "A Roda da Fortuna": "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
  "A Justiça": "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
  "O Enforcado": "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
  "A Morte": "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
  "A Temperança": "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
  "O Diabo": "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
  "A Torre": "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
  "A Estrela": "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
  "A Lua": "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
  "O Sol": "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
  "O Julgamento": "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
  "O Mundo": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",
};

export function TarotCard({ name, isRevealed, onClick }: TarotCardProps) {
  const imageUrl = ARCANA_IMAGES[name] || `https://picsum.photos/seed/${name}/400/600?grayscale`;

  return (
    <div 
      className="relative w-56 h-80 cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Back of the card */}
        <div className="absolute inset-0 backface-hidden bg-black rounded-[2.5rem] border-2 border-accent/30 shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-2 border border-accent/10 rounded-[2rem]" />
          <div className="absolute inset-4 border-[0.5px] border-accent/5 rounded-[1.5rem]" />
          
          {/* Corner accents */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-xl" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-xl" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-xl" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-xl" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 p-2 border-2 border-accent/20 rounded-2xl overflow-hidden flex items-center justify-center bg-white/5 backdrop-blur-sm">
              <img 
                src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                alt="INTUA Logo" 
                className="w-full h-full object-cover rounded-xl opacity-40"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="serif text-2xl font-bold tracking-[0.4em] text-accent">INTUA</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Maga das Escolhas</span>
            </div>
          </div>
        </div>

        {/* Front of the card */}
        <div className="absolute inset-0 backface-hidden bg-black rounded-[2.5rem] border-2 border-accent/40 shadow-2xl overflow-hidden rotate-y-180">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 z-10" />
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-8 left-0 right-0 z-20 text-center px-6">
            <span className="serif text-xl font-bold text-white tracking-[0.2em] uppercase">{name}</span>
            <div className="w-12 h-1 bg-accent mx-auto mt-3 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
