export interface PortfolioSection {
  title: string;
  content: string;
  keywords: string[];
}

export const PORTFOLIO_DATA: PortfolioSection[] = [
  {
    title: "About Aryan Bharat Kumar",
    content: "Aryan Bharat Kumar is an expert Full-Stack Software Engineer and AI/ML Developer specializing in high-performance web applications, robust agentic workflows, and microservice architectures. He thrives at the intersection of design and engineering, combining pristine user interfaces with reliable, scalable backend infrastructure.",
    keywords: ["about", "profile", "who are you", "aryan", "bharat", "kumar", "bio", "overview"]
  },
  {
    title: "Technical Stack & Skills",
    content: "My core engineering languages include Go, Python, TypeScript, and JavaScript. My technical stack is centered around Go, FastAPI, React, Flutter, and Supabase. In AI and Machine Learning, I specialize in LLMs, multi-agent autonomous loops, LangChain orchestration, advanced RAG pipelines, Prompt Engineering, SSE Streaming, PyTorch, Gemini API, and vector similarity search. In the backend, I have expert knowledge of FastAPI, Go, Docker, Redis, PostgreSQL, and MongoDB. In the frontend, I am an expert in React, Next.js, and Tailwind CSS.",
    keywords: ["skills", "stack", "languages", "go", "python", "typescript", "react", "fastapi", "supabase", "postgres", "ai", "machine learning", "ml", "docker"]
  },
  {
    title: "Education & Contact",
    content: "I major in Software Engineering, Artificial Intelligence, Machine Learning, and Cloud Systems. My email is aryanbkumar777@gmail.com and my GitHub profile is https://github.com/Aryan717317.",
    keywords: ["education", "contact", "email", "github", "university", "academic", "major", "college"]
  },
  {
    title: "Project: Flow State",
    content: "Flow State is an AI-powered focus monitoring pipeline. I served as the Lead Full-Stack Developer. It features a real-time event pipeline (using a Chrome extension) that assesses browser activity against stated goals with custom LLM evaluation, feeding into a local Flask event server and supporting Ollama and AWS Bedrock.",
    keywords: ["flow state", "focus", "chrome extension", "flask", "ollama", "productivity", "real-time", "projects"]
  },
  {
    title: "Project: Doceader",
    content: "Doceader is a high-efficiency retrieval-augmented generation (RAG) pipeline designed for sub-second document Q&A, context delivery, and semantic search. It is built using FastAPI, LangChain, ChromaDB, Python, and Docker.",
    keywords: ["doceader", "doc", "document", "rag", "retrieval", "fastapi", "langchain", "chromadb", "vector search", "projects"]
  },
  {
    title: "Project: Synoptic AI",
    content: "Synoptic AI is a concurrent multi-agent orchestration platform built on top of Google ADK, Gemini, and FastAPI. It coordinates multiple specialized agents working on shared tasks with feedback routing and visual console tracking.",
    keywords: ["synoptic", "multi-agent", "agent", "orchestration", "gemini", "adk", "asyncio", "projects"]
  },
  {
    title: "Project: AI Job Recommender",
    content: "The AI Job Recommender is a semantic resume-to-job matching system combining sentence transformers and FAISS indexing. It achieves sub-millisecond similarity search over 10K+ jobs with a FastAPI endpoint and a Streamlit front-end.",
    keywords: ["job recommender", "recommendation", "faiss", "bert", "sentence transformers", "resume", "projects"]
  },
  {
    title: "Project: GestureShare",
    content: "GestureShare is a peer-to-peer secure file sharing application powered by localized camera-based hand-gesture control. Built using Go, Tauri, SvelteKit, and OpenCV.",
    keywords: ["gestureshare", "gesture", "p2p", "file share", "tauri", "sveltekit", "opencv", "go", "projects"]
  },
  {
    title: "Project: CogVerse",
    content: "CogVerse is a living fiction memory & cognitive agent architecture utilizing deep vector-based cognitive memory structures, dynamic recollection protocols, and generative text mechanics that adapt storyline to user decisions.",
    keywords: ["cogverse", "cogrealm", "fiction", "memory", "cognitive", "storytelling", "agents", "projects"]
  }
];

export function localQuerySearch(query: string): string {
  const lowercaseQuery = query.toLowerCase();
  
  // Find sections where query matches keywords or content
  const matches = PORTFOLIO_DATA.filter(section => {
    const hasKeyword = section.keywords.some(keyword => lowercaseQuery.includes(keyword));
    const hasContent = section.content.toLowerCase().includes(lowercaseQuery);
    return hasKeyword || hasContent;
  });

  if (matches.length > 0) {
    return matches.map(m => `### ${m.title}\n${m.content}`).join("\n\n");
  }

  // Fallback default response
  return "I don't have details regarding that specific topic in my portfolio data, but feel free to ask me about my engineering projects, my experience with Go and React, or my technical background!";
}
