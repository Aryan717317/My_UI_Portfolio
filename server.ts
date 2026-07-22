import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = 3000;

// Helper to retrieve local context using keyword matching (Local RAG fallback)
function retrieveLocalContext(query: string, markdown: string): string {
  if (!query) return markdown.substring(0, 1500);
  
  // Split markdown by sections (e.g. "## ")
  const sections = markdown.split('\n## ');
  const scored = sections.map(section => {
    const lines = section.split('\n');
    const title = lines[0] || '';
    const text = section.toLowerCase();
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    let score = 0;
    // Score based on word matches
    queryWords.forEach(word => {
      if (text.includes(word)) {
        score += 1;
        // Higher weight if it matches in the section title
        if (title.toLowerCase().includes(word)) {
          score += 3;
        }
      }
    });
    return { section, score };
  });
  
  // Sort sections by overlap score desc
  const topSections = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.section);
    
  if (topSections.length === 0) {
    // Return first couple of sections as default overview of Aryan
    return (sections[0] || "") + "\n\n" + (sections[1] || "");
  }
  return topSections.map(s => '## ' + s).join('\n\n');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route: Secure Server-Side Gemini Chat Stream (RAG Enabled)
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    const userQuery = messages[messages.length - 1]?.content || "";

    // Establish Server-Sent Events headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in the server secrets.");
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // 1. Retrieve the context (using local RAG system on the portfolio dataset)
      let retrievedContext = "";
      const markdownPath = path.join(process.cwd(), 'data', 'aryan_portfolio.md');
      if (fs.existsSync(markdownPath)) {
        const markdown = fs.readFileSync(markdownPath, 'utf-8');
        retrievedContext = retrieveLocalContext(userQuery, markdown);
      } else {
        retrievedContext = "Aryan Bharat Kumar is a software engineer specializing in Go, Python, React, and Agentic AI.";
      }

      // Enforce the custom system instruction exactly as requested
      const systemPrompt = `You are the AI version of Aryan Bharat Kumar, acting as a virtual assistant on his personal portfolio website. Your purpose is to converse with visitors and accurately answer questions about Aryan's technical skills, software engineering experience, academic background, and projects.

CRITICAL DIRECTIVES:
1. ALWAYS talk in the first person ("I developed...", "My core stack includes...").
2. Answer questions relying EXCLUSIVELY on the verified details found in the [Context] section below.
3. If a question cannot be truthfully and directly answered using the [Context], politely deflect the topic. (e.g., "I don't have details regarding that specific topic in my portfolio data, but feel free to ask me about my engineering projects, my experience with Go and React, or my technical background!")
4. NEVER hallucinate credentials, make up links, or act as a general-purpose assistant. Do not provide general coding help, write essays, or answer off-topic history/math queries. Stay completely focused on Aryan.

[Context]
${retrievedContext}`;

      // Convert conversation history into Gemini roles ('user' or 'model')
      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      // Generate the response stream
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6,
        }
      });

      for await (const chunk of responseStream) {
        const text = chunk.text || "";
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (err: any) {
      console.error("Gemini stream error:", err);
      res.write(`data: ${JSON.stringify({ error: err.message || "Internal server error" })}\n\n`);
      res.end();
    }
  });

  // Vite development or production asset serving
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
