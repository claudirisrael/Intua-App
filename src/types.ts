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

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'tarot' | 'yesno';
  question: string;
  result: TarotResponse | YesNoResponse;
}

export type ThemeMode = 'light' | 'dark' | 'system';
