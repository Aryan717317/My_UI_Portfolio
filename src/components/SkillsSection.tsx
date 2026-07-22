import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Database, 
  Cpu, 
  Globe, 
  Terminal, 
  Workflow, 
  Layers, 
  CpuIcon, 
  Server, 
  Binary 
} from 'lucide-react';

export default function SkillsSection() {
  const categories = [
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      icon: <Cpu className="w-5 h-5" />,
      skills: [
        { name: "LLM & Agentic Systems", level: "Expert", desc: "Designing multi-agent autonomous loops, planning reasoning structures, tool usage, and deterministic decision boundaries." },
        { name: "LLM Orchestration", level: "Expert", desc: "Orchestrating LangChain workflows, advanced RAG pipelines, Prompt Engineering, Intent Classification, SSE Streaming, Multi-turn Agents, and QLoRA fine-tuning." },
        { name: "ML & Embeddings", level: "Expert", desc: "Vector similarity search, neural semantic representation, custom classification models, indexing, and fine-tuning pipelines." },
        { name: "Gemini API & Google SDK", level: "Expert", desc: "Full-stack multimodal integration, real-time function calling, system instructions, and structured JSON schema outputs." },
        { name: "PyTorch & Deep Learning", level: "Advanced", desc: "Neural network model architectures, training cycles, loss function optimization, and custom transformer layers." },
        { name: "Claude & Open LLMs", level: "Expert", desc: "Orchestrating Claude, GPT, and custom open-source models with swappable model fallbacks, guardrails, and semantic caching." }
      ]
    },
    {
      id: "backend-infra",
      name: "Backend & Infra",
      icon: <Server className="w-5 h-5" />,
      skills: [
        { name: "FastAPI", level: "Expert", desc: "High-performance async Python APIs" },
        { name: "Flask", level: "Advanced", desc: "Microservices and rapid backends" },
        { name: "Docker", level: "Advanced", desc: "Containerization and reproducible microservices" },
        { name: "AWS (Bedrock, EC2)", level: "Advanced", desc: "Server deployment, storage solutions, Bedrock LLM endpoints" },
        { name: "Redis", level: "Advanced", desc: "Fast caching, pub-sub architectures, queue backends" },
        { name: "PostgreSQL", level: "Expert", desc: "Relational database schema design and optimized query execution" },
        { name: "MongoDB", level: "Advanced", desc: "Flexible NoSQL document structures and aggregations" },
        { name: "Git", level: "Expert", desc: "Advanced branching workflows, code reviews, CI/CD integrations" }
      ]
    },
    {
      id: "frontend",
      name: "Frontend Development",
      icon: <Globe className="w-5 h-5" />,
      skills: [
        { name: "React", level: "Expert", desc: "Dynamic, scalable SPA state management and premium layouts" },
        { name: "Next.js", level: "Expert", desc: "SSR/SSG frameworks, file-based routing, server actions" },
        { name: "Tailwind CSS", level: "Expert", desc: "Responsive utility styling and bespoke modern designs" },
        { name: "SvelteKit", level: "Advanced", desc: "Svelte application orchestration and lightweight bundles" }
      ]
    },
    {
      id: "languages",
      name: "Languages & Core",
      icon: <Binary className="w-5 h-5" />,
      skills: [
        { name: "Python", level: "Expert", desc: "Algorithmic engineering, automation, data science" },
        { name: "JavaScript/TypeScript", level: "Expert", desc: "Type-safe robust frontend and backend script development" },
        { name: "SQL", level: "Advanced", desc: "Complex joins, indexing, and performant transaction queries" },
        { name: "Solidity", level: "Intermediate", desc: "Smart contracts and decentralized state models" },
        { name: "Data Structures & Algorithms", level: "Expert", desc: "Dynamic programming, sliding windows, and optimal execution" },
        { name: "REST API Design", level: "Expert", desc: "Robust endpoints, swappable schemas, and self-documenting code" },
        { name: "Distributed Systems", level: "Advanced", desc: "Event-driven systems, fault-tolerant message queues" }
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(categories[0].id);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.section
      id="skills"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative min-h-screen py-24 px-8 md:px-12 w-full max-w-[1600px] mx-auto z-20 flex flex-col justify-center bg-transparent"
    >
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#be123c]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div 
        variants={itemVariants}
        className="flex flex-col items-start mb-16 relative z-10"
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-[#e11d48] mb-4"
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>CAPABILITIES</span>
        </div>
        
        <h2 
          className="text-5xl md:text-6xl font-black text-white tracking-tight"
        >
          My Skillset<span className="text-[#e11d48]">.</span>
        </h2>
        <p
          className="text-[#A1A1AA] text-lg max-w-[600px] mt-4 font-medium"
        >
          A curated ecosystem of modern frameworks, specialized AI APIs, and systems engineering concepts that I use daily.
        </p>
      </motion.div>

      {/* Tabs list */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-12 w-fit relative z-10"
      >
        {categories.map((category) => {
          const isActive = activeTab === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                isActive ? "text-white" : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#0f1011] border border-[#23252a] rounded -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={isActive ? "text-[#e11d48]" : "text-slate-400"}>
                {category.icon}
              </span>
              {category.name}
            </button>
          );
        })}
      </motion.div>

      {/* Interactive Active Content */}
      <motion.div 
        variants={itemVariants}
        className="relative min-h-[400px]"
      >
        <AnimatePresence mode="wait">
          {categories.map((category) => {
            if (category.id !== activeTab) return null;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {category.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -2, borderColor: "rgba(225, 29, 72, 0.4)" }}
                    className="p-6 rounded bg-[#0f1011]/80 backdrop-blur-md border border-[#23252a] hover:bg-[#0f1011] transition-all group duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-bold text-white tracking-tight">{skill.name}</h4>
                        <span className="text-[11px] font-mono font-bold tracking-wider px-2.5 py-1 rounded bg-[#be123c]/10 text-[#e11d48] border border-[#be123c]/20">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-sm text-[#A1A1AA] leading-relaxed font-medium">
                        {skill.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.04] flex justify-end">
                      <span className="text-xs font-mono text-white/20 group-hover:text-[#e11d48]/50 transition-colors">
                        // verified mastery
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

    </motion.section>
  );
}
