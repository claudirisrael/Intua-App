import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_FILE = path.join(__dirname, "history.json");

// Lazy initialize OpenAI
let openaiClient: OpenAI | null = null;
function getOpenAI() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in the environment.");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

const MODEL = "gpt-4o-mini";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure history.json exists
  try {
    await fs.access(HISTORY_FILE);
  } catch {
    await fs.writeFile(HISTORY_FILE, JSON.stringify([]));
  }

  // API Routes
  app.get("/api/history", async (req, res) => {
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read history" });
    }
  });

  app.post("/api/history", async (req, res) => {
    try {
      const { question, topic, timestamp, type, result } = req.body;
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const history = JSON.parse(data);
      
      const newEntry = {
        id: Date.now().toString(),
        question,
        topic,
        timestamp,
        type,
        result
      };
      
      history.push(newEntry);
      await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
      res.json(newEntry);
    } catch (error) {
      res.status(500).json({ error: "Failed to save history" });
    }
  });

  app.delete("/api/history", async (req, res) => {
    try {
      await fs.writeFile(HISTORY_FILE, JSON.stringify([]));
      res.json({ message: "History cleared" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear history" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const lead = req.body;
      console.log("New lead received:", lead);
      // In a real app, we would save this to a database
      res.json({ status: "success", message: "Lead captured" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save lead" });
    }
  });

  // AI Routes
  app.post("/api/ai/topic", async (req, res) => {
    try {
      const { question } = req.body;
      const openai = getOpenAI();
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "Analise a seguinte pergunta de um usuário de um app de Tarô e categorize-a em uma única palavra (ex: Amor, Carreira, Saúde, Dinheiro, Espiritualidade, Família, Outros). Responda apenas com a categoria."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.3,
      });
      res.json({ topic: response.choices[0].message.content?.trim() || "Outros" });
    } catch (error: any) {
      console.error("AI Topic Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/tarot", async (req, res) => {
    try {
      const { question } = req.body;
      const openai = getOpenAI();
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `Você é uma assistente de orientação simbólica para tomada de decisão.
Sua tarefa é ajudar a usuária a refletir sobre sua pergunta.

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
}`
          },
          {
            role: "user",
            content: question
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });
      res.json(JSON.parse(response.choices[0].message.content || "{}"));
    } catch (error: any) {
      console.error("AI Tarot Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/yesno", async (req, res) => {
    try {
      const { question } = req.body;
      const openai = getOpenAI();
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `Você é uma assistente de orientação rápida para perguntas de Sim ou Não.
Sua tarefa é responder à pergunta.

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
}`
          },
          {
            role: "user",
            content: question
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });
      res.json(JSON.parse(response.choices[0].message.content || "{}"));
    } catch (error: any) {
      console.error("AI YesNo Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
