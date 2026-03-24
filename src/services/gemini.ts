import { GoogleGenAI, Type } from "@google/genai";
import { TarotResponse, YesNoResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getTarotGuidance(question: string): Promise<TarotResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Você é uma assistente de orientação simbólica para tomada de decisão.
Sua tarefa é ajudar a usuária a refletir sobre sua pergunta: "${question}"

REGRAS CRÍTICAS DE RELEVÂNCIA:
- Primeiro, verifique se a pergunta é relevante para orientação, decisões ou reflexão pessoal profunda. 
- Se a entrada for apenas uma saudação (ex: "Oi", "Olá", "Tudo bem?"), uma única palavra sem contexto (ex: "Amor", "Trabalho", "Dinheiro"), algo ofensivo, sem sentido ou totalmente fora do contexto de busca por sabedoria/orientação, você DEVE definir "is_relevant" como false.
- A entrada DEVE ser uma dúvida, um dilema ou um pedido de conselho estruturado para ser considerada relevante. Se não houver uma intenção clara de busca por orientação, rejeite.
- Use somente os 22 arcanos maiores do tarô para as leituras.
- Escolha uma carta de tarô coerente com a pergunta.
- Explique a energia da carta em linguagem simples.
- Ofereça dois caminhos possíveis e contrastantes.
- Para cada caminho, crie um rótulo de uma única palavra que resuma a essência desse caminho (ex: "Ação", "Paciência", "Diálogo", "Recuo").
- Mostre o possível resultado de cada caminho.
- Crie uma orientação detalhada para cada caminho que será revelada apenas se a usuária escolher esse caminho específico.
- Encerre com uma frase breve de acolhimento.
- Responda sempre em português do Brasil.
- Escrita para leitura rápida, sem jargões esotéricos ou termos pesados.
- Não use previsões absolutas ou fatalistas.

FORMATO OBRIGATÓRIO (JSON):
{
  "is_relevant": boolean,
  "card_name": "string",
  "card_meaning": "string",
  "guidance": "string",
  "path_a_label": "string",
  "path_a": "string",
  "outcome_a": "string",
  "detailed_guidance_a": "string",
  "path_b_label": "string",
  "path_b": "string",
  "outcome_b": "string",
  "detailed_guidance_b": "string",
  "closing_message": "string"
}
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          is_relevant: { type: Type.BOOLEAN },
          card_name: { type: Type.STRING },
          card_meaning: { type: Type.STRING },
          guidance: { type: Type.STRING },
          path_a_label: { type: Type.STRING },
          path_a: { type: Type.STRING },
          outcome_a: { type: Type.STRING },
          detailed_guidance_a: { type: Type.STRING },
          path_b_label: { type: Type.STRING },
          path_b: { type: Type.STRING },
          outcome_b: { type: Type.STRING },
          detailed_guidance_b: { type: Type.STRING },
          closing_message: { type: Type.STRING },
        },
        required: ["is_relevant", "card_name", "card_meaning", "guidance", "path_a_label", "path_a", "outcome_a", "detailed_guidance_a", "path_b_label", "path_b", "outcome_b", "detailed_guidance_b", "closing_message"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function getYesNoGuidance(question: string): Promise<YesNoResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Você é uma assistente de orientação rápida para perguntas de Sim ou Não.
Sua tarefa é responder à pergunta: "${question}"

REGRAS CRÍTICAS DE RELEVÂNCIA:
- Primeiro, verifique se a pergunta é relevante. 
- Se a entrada for apenas uma saudação (ex: "Oi", "Olá", "E aí?"), uma única palavra sem contexto (ex: "Sim", "Não", "Talvez"), algo ofensivo, sem sentido ou totalmente fora do contexto de busca por sabedoria/orientação, você DEVE definir "is_relevant" como false.
- A entrada DEVE ser uma pergunta direta e clara para ser considerada relevante. Se for apenas conversa fiada ou palavras soltas, rejeite.
- Use um dos 22 arcanos maiores do tarô para fundamentar a resposta.
- Dê uma resposta direta: "Sim", "Não" ou "Talvez".
- Explique brevemente o porquê baseado na carta escolhida.
- Ofereça uma pequena orientação prática.
- Responda sempre em português do Brasil.

FORMATO OBRIGATÓRIO (JSON):
{
  "is_relevant": boolean,
  "answer": "Sim" | "Não" | "Talvez",
  "card_name": "string",
  "reasoning": "string",
  "guidance": "string",
  "closing_message": "string"
}
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          is_relevant: { type: Type.BOOLEAN },
          answer: { type: Type.STRING, enum: ["Sim", "Não", "Talvez"] },
          card_name: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          guidance: { type: Type.STRING },
          closing_message: { type: Type.STRING },
        },
        required: ["is_relevant", "answer", "card_name", "reasoning", "guidance", "closing_message"],
      },
    },
  });

  return JSON.parse(response.text);
}
