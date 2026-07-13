var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var PORT = 3e3;
function retrieveLocalContext(query, markdown) {
  if (!query) return markdown.substring(0, 1500);
  const sections = markdown.split("\n## ");
  const scored = sections.map((section) => {
    const lines = section.split("\n");
    const title = lines[0] || "";
    const text = section.toLowerCase();
    const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    let score = 0;
    queryWords.forEach((word) => {
      if (text.includes(word)) {
        score += 1;
        if (title.toLowerCase().includes(word)) {
          score += 3;
        }
      }
    });
    return { section, score };
  });
  const topSections = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((item) => item.section);
  if (topSections.length === 0) {
    return (sections[0] || "") + "\n\n" + (sections[1] || "");
  }
  return topSections.map((s) => "## " + s).join("\n\n");
}
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }
    const userQuery = messages[messages.length - 1]?.content || "";
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in the server secrets.");
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      let retrievedContext = "";
      const markdownPath = import_path.default.join(process.cwd(), "data", "aryan_portfolio.md");
      if (import_fs.default.existsSync(markdownPath)) {
        const markdown = import_fs.default.readFileSync(markdownPath, "utf-8");
        retrievedContext = retrieveLocalContext(userQuery, markdown);
      } else {
        retrievedContext = "Aryan Bharat Kumar is a software engineer specializing in Go, Python, React, and Agentic AI.";
      }
      const systemPrompt = `You are the AI version of Aryan Bharat Kumar, acting as a virtual assistant on his personal portfolio website. Your purpose is to converse with visitors and accurately answer questions about Aryan's technical skills, software engineering experience, academic background, and projects.

CRITICAL DIRECTIVES:
1. ALWAYS talk in the first person ("I developed...", "My core stack includes...").
2. Answer questions relying EXCLUSIVELY on the verified details found in the [Context] section below.
3. If a question cannot be truthfully and directly answered using the [Context], politely deflect the topic. (e.g., "I don't have details regarding that specific topic in my portfolio data, but feel free to ask me about my engineering projects, my experience with Go and React, or my technical background!")
4. NEVER hallucinate credentials, make up links, or act as a general-purpose assistant. Do not provide general coding help, write essays, or answer off-topic history/math queries. Stay completely focused on Aryan.

[Context]
${retrievedContext}`;
      const contents = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6
        }
      });
      for await (const chunk of responseStream) {
        const text = chunk.text || "";
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}

`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (err) {
      console.error("Gemini stream error:", err);
      res.write(`data: ${JSON.stringify({ error: err.message || "Internal server error" })}

`);
      res.end();
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
