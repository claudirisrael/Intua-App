import OpenAI from "openai";
import { TarotResponse, YesNoResponse, RelationshipResponse, CareerResponse } from "../types";

const openai = new OpenAI({
  apiKey: (import.meta as any).env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true // Required for client-side usage
});

// Using gpt-4o-mini as the "nano" equivalent for OpenAI
const MODEL = "gpt-4o-mini";

export async function getTopic(question: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Analise a seguinte pergunta de um usuário de um app de Tarô e categorize-a em uma única palavra (ex: Amor, Carreira, Saúde, Dinheiro, Espiritualidade, Família, Outros). Responda apenas com a categoria: "${question}"`
      }
    ],
    temperature: 0.3,
  });
  return response.choices[0].message.content?.trim() || "Outros";
}

export async function getTarotGuidance(question: string): Promise<TarotResponse> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `Você é uma assistente de orientação simbólica para tomada de decisão.
Sua tarefa é ajudar a usuária a refletir sobre sua pergunta.

REGRAS CRÍTICAS DE RELEVÂNCIA:
- Primeiro, verifique se a pergunta é relevante para orientação, decisões ou reflexão pessoal profunda. 
- Se a entrada for apenas uma saudação, uma única palavra sem contexto, algo ofensivo, sem sentido ou totalmente fora do contexto de busca por sabedoria/orientação, você DEVE definir "is_relevant" como false.
- A entrada DEVE ser uma dúvida, um dilema ou um pedido de conselho estruturado para ser considerada relevante.
- Use somente os 22 arcanos maiores do tarô para as leituras.
- Escolha uma carta de tarô coerente com a pergunta.
- Explique a energia da carta em linguagem simples.
- Ofereça dois caminhos possíveis e contrastantes.
- Para cada caminho, crie um rótulo de uma única palavra que resuma a essência desse caminho.
- Mostre o possível resultado de cada caminho.
- Crie uma orientação detalhada para cada caminho que será revelada apenas se a usuária escolher esse caminho específico.
- Encerre com uma frase breve de acolhimento.
- Responda sempre em português do Brasil.`
      },
      {
        role: "user",
        content: question
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function getYesNoGuidance(question: string): Promise<YesNoResponse> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `Você é uma assistente de orientação rápida para perguntas de Sim ou Não.
Sua tarefa é responder à pergunta.

REGRAS CRÍTICAS DE RELEVÂNCIA:
- Verifique se a pergunta é relevante. Rejeite saudações simples ou palavras soltas.
- Use um dos 22 arcanos maiores do tarô para fundamentar a resposta.
- Dê uma resposta direta: "Sim", "Não" ou "Talvez".
- Explique brevemente o porquê baseado na carta escolhida.
- Ofereça uma pequena orientação prática.
- Responda sempre em português do Brasil.`
      },
      {
        role: "user",
        content: question
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function getRelationshipGuidance(question: string): Promise<RelationshipResponse> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `Você é uma assistente de orientação para relacionamentos.
Sua tarefa é analisar a conexão entre duas pessoas através do Tarô.
Verifique se a pergunta é sobre relacionamentos ou sentimentos. Se não for, is_relevant = false.
Use os 22 arcanos maiores. Responda em português do Brasil.`
      },
      {
        role: "user",
        content: question
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function getCareerGuidance(question: string): Promise<CareerResponse> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `Você é uma assistente de orientação para carreira e finanças.
Sua tarefa é analisar a situação profissional ou financeira através do Tarô.
Verifique se a pergunta é sobre trabalho ou finanças. Se não for, is_relevant = false.
Use os 22 arcanos maiores. Responda em português do Brasil.`
      },
      {
        role: "user",
        content: question
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}
