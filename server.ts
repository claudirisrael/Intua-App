import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_FILE = path.join(__dirname, "history.json");

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
