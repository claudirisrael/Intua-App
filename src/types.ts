export interface TarotResponse {
  is_relevant: boolean;
  card_name: string;
  card_meaning: string;
  guidance: string;
  path_a_label: string;
  path_a: string;
  outcome_a: string;
  detailed_guidance_a: string;
  path_b_label: string;
  path_b: string;
  outcome_b: string;
  detailed_guidance_b: string;
  closing_message: string;
}

export interface YesNoResponse {
  is_relevant: boolean;
  answer: 'Sim' | 'Não' | 'Talvez';
  card_name: string;
  reasoning: string;
  guidance: string;
  closing_message: string;
}

export interface RelationshipResponse {
  is_relevant: boolean;
  card_name: string;
  card_meaning: string;
  guidance: string;
  connection_energy: string;
  advice_for_you: string;
  advice_for_partner: string;
  future_outlook: string;
  closing_message: string;
}

export interface CareerResponse {
  is_relevant: boolean;
  card_name: string;
  card_meaning: string;
  guidance: string;
  professional_situation: string;
  financial_outlook: string;
  strategic_advice: string;
  closing_message: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'tarot' | 'yesno' | 'relationship' | 'career';
  question: string;
  topic: string;
  result: TarotResponse | YesNoResponse | RelationshipResponse | CareerResponse;
}

export interface Lead {
  name: string;
  email: string;
  whatsapp: string;
  timestamp: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppMode = 'menu' | 'tarot' | 'yesno' | 'relationship' | 'career';
