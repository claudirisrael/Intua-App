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
      className="relative w-48 h-72 cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Back of the card */}
        <div className="absolute inset-0 backface-hidden bg-slate-950 rounded-2xl border-2 border-accent/40 shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent" />
          
          {/* Decorative pattern */}
          <div className="absolute inset-2 border border-accent/20 rounded-xl" />
          <div className="absolute inset-4 border-[0.5px] border-accent/10 rounded-lg" />
          
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-accent/40 rounded-tl-sm" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-accent/40 rounded-tr-sm" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-accent/40 rounded-bl-sm" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-accent/40 rounded-br-sm" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 p-1 rounded-2xl glass border border-accent/30 shadow-2xl overflow-hidden flex items-center justify-center">
              <img 
                src="https://www.dropbox.com/scl/fi/iu82vvshon6xpl6hh90o1/intua-logo.png?rlkey=gs7opxoa2b9pe2l7fsgcsiiyh&st=i6ri4bvm&raw=1" 
                alt="INTUA Logo" 
                className="w-full h-full object-cover rounded-xl opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col items-center">
              <Sparkles size={16} className="text-accent/60 animate-pulse mb-1" />
              <span className="serif text-xl font-bold tracking-[0.3em] text-mystic">INTUA</span>
            </div>
          </div>
        </div>

        {/* Front of the card */}
        <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-2xl border-2 border-accent/40 shadow-2xl overflow-hidden rotate-y-180">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
            <span className="serif text-lg font-bold text-white tracking-widest drop-shadow-lg">{name}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
