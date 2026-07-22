import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'motion/react';
import { ChevronLeft, ChevronRight, Github, ExternalLink, ArrowRight, Layers, Shield, Cpu, Share2, BookOpen, X, Code2, Briefcase } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  tags: string[];
  github?: string;
  demo?: string;
  color: string;
  borderColor: string;
  gradient: string;
  icon: React.ReactNode;
}

interface ProjectCardProps {
  project: Project;
  idx: number;
  activeIndex: number;
  projectsLength: number;
  isActive: boolean;
  isNext: boolean;
  isPrev: boolean;
  translateX: number;
  translateZ: number;
  opacity: number;
  scale: number;
  zIndex: number;
  setSelectedProject: (project: Project) => void;
  nextProject: () => void;
  setActiveIndex: (idx: number) => void;
}

function ProjectCard({
  project,
  idx,
  activeIndex,
  projectsLength,
  isActive,
  isNext,
  isPrev,
  translateX,
  translateZ,
  opacity,
  scale,
  zIndex,
  setSelectedProject,
  nextProject,
  setActiveIndex,
}: ProjectCardProps) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  // Springs for silky smooth inertia
  const rotateX = useSpring(tiltX, { stiffness: 100, damping: 15 });
  const rotateY = useSpring(tiltY, { stiffness: 100, damping: 15 });

  const sheenX = useMotionValue(0);
  const sheenY = useMotionValue(0);

  const sheenXSpring = useSpring(sheenX, { stiffness: 120, damping: 18 });
  const sheenYSpring = useSpring(sheenY, { stiffness: 120, damping: 18 });

  // Reset/update tilt targets when position shifts
  React.useEffect(() => {
    if (!isActive) {
      tiltX.set(isNext ? 2 : isPrev ? 2 : 0);
      tiltY.set(isNext ? -15 : isPrev ? 15 : 0);
    } else {
      tiltX.set(0);
      tiltY.set(0);
    }
  }, [isActive, isNext, isPrev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXVal = e.clientX - rect.left - width / 2;
    const mouseYVal = e.clientY - rect.top - height / 2;
    
    // Smooth 3D tilt angles (up to 12 degrees)
    const rX = -(mouseYVal / (height / 2)) * 12;
    const rY = (mouseXVal / (width / 2)) * 12;
    
    tiltX.set(rX);
    tiltY.set(rY);

    sheenX.set(e.clientX - rect.left);
    sheenY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    if (!isActive) return;
    tiltX.set(0);
    tiltY.set(0);
  };

  const backgroundSpotlight = useMotionTemplate`radial-gradient(280px circle at ${sheenXSpring}px ${sheenYSpring}px, rgba(225, 29, 72, 0.12), transparent 80%)`;

  return (
    <motion.div
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
        zIndex: zIndex,
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      animate={{
        x: translateX,
        z: translateZ,
        opacity: opacity,
        scale: scale,
        zIndex: zIndex,
      }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 22,
        mass: 0.8
      }}
      onClick={() => {
        if (!isActive) {
          setActiveIndex(idx);
        } else {
          setSelectedProject(project);
        }
      }}
      className="pointer-events-none"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`w-[310px] md:w-[340px] aspect-[3.1/4] rounded-[36px] bg-[#0c0d0e] border border-[#202226] p-8 md:p-10 flex flex-col justify-between shadow-2xl cursor-pointer group transition-all duration-300 overflow-hidden pointer-events-auto ${
          isActive 
            ? "hover:border-[#e11d48]/40 shadow-[0_20px_50px_rgba(225,29,72,0.12)] cursor-zoom-in" 
            : "hover:bg-[#0c0d0e]"
        }`}
      >
        {/* Bevel sheen edge & Dot grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:16px_16px] opacity-75 pointer-events-none" />
        <div className="absolute -inset-[1px] bg-gradient-to-tr from-white/[0.04] to-transparent rounded-[36px] pointer-events-none"></div>
        <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${project.gradient} opacity-70 pointer-events-none transition-opacity duration-500`} />

        {/* Interactive cursor light sheen */}
        {isActive && (
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
            style={{
              background: backgroundSpotlight
            }}
          />
        )}

        <div 
          className="flex flex-col h-full justify-between relative z-10 transition-opacity duration-500"
          style={{ 
            opacity: isActive ? 1 : 0.45,
            transformStyle: 'preserve-3d'
          }}
        >
          <div 
            className="flex flex-col"
            style={{ transform: "translateZ(30px)", transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-16 h-16 rounded-[22px] bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#e11d48] group-hover:border-[#e11d48]/30 group-hover:text-white transition-all duration-300 shadow-inner [&_svg]:w-7 [&_svg]:h-7 [&_svg]:text-current">
                {project.icon}
              </div>
              <span className="text-[10px] font-mono text-[#565961] tracking-widest font-bold">
                [{String(idx + 1).padStart(2, '0')}/{String(projectsLength).padStart(2, '0')}]
              </span>
            </div>

            <h4 
              className="text-2xl md:text-[28px] font-bold text-white tracking-tight leading-snug mb-2 uppercase transition-transform duration-300 group-hover:translate-x-1"
              style={{ transform: "translateZ(45px)" }}
            >
              {project.title}
            </h4>
            <p 
              className="text-xs md:text-sm text-[#8a8f98] leading-relaxed font-semibold max-w-[95%] uppercase"
              style={{ transform: "translateZ(25px)" }}
            >
              {project.subtitle}
            </p>
          </div>

          <div 
            className="flex items-end justify-between gap-4 mt-6"
            style={{ transform: "translateZ(35px)", transformStyle: 'preserve-3d' }}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono tracking-widest text-[#565961] font-bold uppercase">
                TECH STACK
              </span>
              <div className="flex flex-wrap gap-x-2 text-xs font-mono text-[#8a8f98] font-medium lowercase">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="hover:text-white transition-colors duration-200">
                    #{tag.toLowerCase().replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>
            
            <div 
              onClick={(e) => {
                e.stopPropagation();
                nextProject();
              }}
              className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.06] group-hover:bg-[#e11d48]/10 group-hover:border-[#e11d48]/30 text-slate-400 group-hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 active:scale-95"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const projects: Project[] = [
    {
      id: "flow-state",
      title: "Flow State",
      subtitle: "AI-Powered Focus Monitoring Pipeline",
      description: "A real-time event pipeline assessing browser activity against stated goals with custom LLM evaluation.",
      details: [
        "Inbuilt real-time event pipeline using custom Chrome extension.",
        "Flask event server feeding into local activity processors.",
        "Provider-agnostic LLM layer supporting Ollama & AWS Bedrock.",
        "Local dashboard persisting historical metrics and analytics."
      ],
      tags: ["Python", "Flask", "Claude API", "Ollama", "Chrome Extension"],
      github: "https://github.com/Aryan717317/Flow-State",
      color: "rgba(225, 29, 72, 0.15)",
      borderColor: "border-rose-500/30",
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      icon: <Shield className="w-6 h-6 text-rose-500" />
    },
    {
      id: "doceader",
      title: "Doceader",
      subtitle: "Retrieval-Augmented Generation Pipeline",
      description: "An end-to-end document Q&A pipeline tuning ingest-to-generation pipeline stages for minimal latency.",
      details: [
        "Ingestion, chunking, and metadata extraction pipelines.",
        "Vector search engine powered by LangChain and ChromaDB.",
        "FastAPI service serving optimized Python HTTP entrypoints.",
        "Relevance-tuned retrieval stage ensuring robust answering."
      ],
      tags: ["FastAPI", "LangChain", "ChromaDB", "Python", "Docker"],
      github: "https://github.com/Aryan717317/Doceader",
      color: "rgba(225, 29, 72, 0.12)",
      borderColor: "border-rose-500/30",
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      icon: <Layers className="w-6 h-6 text-rose-500" />
    },
    {
      id: "synoptic-ai",
      title: "Synoptic AI",
      subtitle: "Multi-Agent Orchestration Platform",
      description: "A concurrent orchestrator coordinating multiple specialized agents working on shared complex tasks.",
      details: [
        "Built with Google ADK, Gemini, and FastAPI.",
        "Sophisticated inter-agent message routing and routing system.",
        "Parallelized task solving with structured evaluation filters.",
        "Responsive visual console to track live agent communications."
      ],
      tags: ["Google ADK", "Gemini API", "FastAPI", "Python", "Asyncio"],
      github: "https://github.com/Aryan717317/Synoptic-AI",
      color: "rgba(225, 29, 72, 0.15)",
      borderColor: "border-rose-500/30",
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      icon: <Cpu className="w-6 h-6 text-rose-500" />
    },
    {
      id: "job-recommender",
      title: "AI Job Recommender",
      subtitle: "Semantic Resume-to-Job Matching System",
      description: "A production-ready, locally deployed job recommendation pipeline combining sentence transformers and FAISS indexing with hybrid retrieval.",
      details: [
        "Vector search engine powered by FAISS for sub-millisecond similarity search over 10K+ jobs.",
        "Hybrid search architecture blending TF-IDF keyword matching with BERT semantic scoring.",
        "FastAPI REST service with background lifespans and Streamlit front-end for resume uploads.",
        "Built-in model evaluation pipeline scoring Precision@K, Recall@K, MRR, and latency benchmarks."
      ],
      tags: ["FastAPI", "FAISS", "SentenceTransformers", "Streamlit", "Python", "Docker"],
      github: "https://github.com/Aryan717317/AI-Powered-Job-Recommendation-System",
      color: "rgba(225, 29, 72, 0.15)",
      borderColor: "border-rose-500/30",
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      icon: <Briefcase className="w-6 h-6 text-rose-500" />
    },
    {
      id: "gestureshare",
      title: "GestureShare",
      subtitle: "P2P File Sharing with Gesture Control",
      description: "Peer-to-peer secure file sharing powered by localized camera-based hand-gesture control.",
      details: [
        "Local P2P transfer protocol built in Go.",
        "Camera state-machine trackers for smooth hand gesture detection.",
        "Tauri & SvelteKit custom client wrapper for multiplatform support.",
        "9-document protocol specification mapping error state transitions."
      ],
      tags: ["Tauri", "Go", "SvelteKit", "OpenCV", "P2P"],
      github: "https://github.com/Aryan717317/GestureShare",
      color: "rgba(225, 29, 72, 0.15)",
      borderColor: "border-rose-500/30",
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      icon: <Share2 className="w-6 h-6 text-rose-500" />
    },
    {
      id: "cogverse",
      title: "CogVerse",
      subtitle: "Living Fiction Memory & Cognitive Agent Architecture",
      description: "A platform for constructing living, breathing fiction realms with deep, persistent cognitive agent architectures and contextual memory recall.",
      details: [
        "Autonomous narrative agent loop utilizing deep custom memory structures.",
        "Vector-based cognitive memory indexing and dynamic recollection protocols.",
        "Interactive world state tracking with multi-character alignment evaluations.",
        "Generative text mechanics that adapt storylines in real-time to user decisions."
      ],
      tags: ["LLM Agents", "Vector DB", "Cognitive Architecture", "Storytelling", "Python"],
      github: "https://github.com/Aryan717317/CogRealm-Living-Fiction-Memory",
      color: "rgba(225, 29, 72, 0.12)",
      borderColor: "border-rose-700/30",
      gradient: "from-rose-700/20 via-rose-900/5 to-transparent",
      icon: <BookOpen className="w-6 h-6 text-rose-500" />
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const activeProject = projects[activeIndex];

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
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <motion.section 
      id="projects" 
      className="relative min-h-screen py-24 px-8 md:px-12 w-full max-w-[1600px] mx-auto z-20 flex flex-col justify-center bg-transparent"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      
      {/* Divider */}
      <div className="absolute top-0 left-8 right-8 md:left-12 md:right-12 h-[1px] bg-[#23252a]/60" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Col: Info panel */}
        <div className="lg:col-span-5 flex flex-col justify-center relative z-10">
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 px-3 py-1 rounded bg-[#0f1011] border border-[#23252a] text-xs font-mono text-[#e11d48] mb-4 w-fit"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>[ WORKS ]</span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-[#f7f8f8] tracking-tight mb-4"
          >
            SELECTED PROJECTS
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-[#8a8f98] text-base leading-relaxed mb-8 max-w-[90%]"
          >
            A collection of production-ready pipelines, real-time engines, and AI orchestration platforms showcasing architectural engineering and deterministic designs.
          </motion.p>

          {/* Active project highlight card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="p-6 rounded bg-[#0f1011] border border-[#23252a] hover:border-[#e11d48]/40 mb-8 relative overflow-hidden group transition-all duration-300 shadow-xl"
            >
              <h3 className="text-xl font-bold text-[#f7f8f8] tracking-tight mb-1 uppercase">{activeProject.title}</h3>
              <p className="text-xs text-[#e11d48] font-mono tracking-wider mb-4 uppercase">{activeProject.subtitle}</p>
              <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed mb-6 font-mono">{activeProject.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2.5 py-1 rounded bg-[#010102] border border-[#23252a] text-[10px] font-mono text-[#8a8f98]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons + Controls */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-[#23252a]">
            <div className="flex items-center gap-4">
              {activeProject.github && (
                <motion.a 
                  href={activeProject.github}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-[#23252a] text-white text-xs font-mono uppercase tracking-wider transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>Repository</span>
                </motion.a>
              )}
              
              <motion.button 
                onClick={() => setSelectedProject(activeProject)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-3 rounded bg-[#e11d48]/10 hover:bg-[#e11d48]/20 border border-[#e11d48]/30 text-[#e11d48] text-xs font-mono tracking-wider uppercase transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Details</span>
              </motion.button>
            </div>

            {/* Slider Navigation Dots & Arrows */}
            <div className="flex items-center gap-4">
              <button 
                onClick={prevProject}
                className="p-2.5 rounded bg-[#0f1011] border border-[#23252a] hover:border-[#34343a] text-[#8a8f98] hover:text-[#f7f8f8] transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex gap-2">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1 rounded transition-all duration-300 ${
                      idx === activeIndex ? "w-6 bg-[#e11d48]" : "w-1 bg-[#23252a]"
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextProject}
                className="p-2.5 rounded bg-[#0f1011] border border-[#23252a] hover:border-[#34343a] text-[#8a8f98] hover:text-[#f7f8f8] transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: 3D Rotating Stack Carousel */}
        <div className="lg:col-span-7 flex justify-center items-center relative h-[500px] select-none">
          <div className="relative w-full max-w-[440px] aspect-[4/5] flex items-center justify-center perspective-[1500px] transform-style-3d">
            
            {/* Displaying Projects as tilted 3D offset card sliders stack */}
            {projects.map((project, idx) => {
              let offset = idx - activeIndex;
              if (offset < 0) offset += projects.length;
              
              const isVisible = offset === 0 || offset === 1 || offset === projects.length - 1;
              if (!isVisible) return null;

              const isActive = offset === 0;
              const isNext = offset === 1;
              const isPrev = offset === projects.length - 1;

              let translateZ = 0;
              let rotateY = -12;
              let rotateX = 8;
              let translateX = 0;
              let opacity = 0;
              let scale = 1;
              let zIndex = 10;

              if (isActive) {
                translateZ = 80;
                rotateY = 0;
                rotateX = 0;
                translateX = 0;
                opacity = 1;
                scale = 1.05;
                zIndex = 30;
              } else if (isNext) {
                translateZ = -60;
                rotateY = -15;
                rotateX = 2;
                translateX = 120;
                opacity = 0.5;
                scale = 0.9;
                zIndex = 20;
              } else if (isPrev) {
                translateZ = -60;
                rotateY = 15;
                rotateX = 2;
                translateX = -120;
                opacity = 0.5;
                scale = 0.9;
                zIndex = 20;
              }

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  idx={idx}
                  activeIndex={activeIndex}
                  projectsLength={projects.length}
                  isActive={isActive}
                  isNext={isNext}
                  isPrev={isPrev}
                  translateX={translateX}
                  translateZ={translateZ}
                  opacity={opacity}
                  scale={scale}
                  zIndex={zIndex}
                  setSelectedProject={setSelectedProject}
                  nextProject={nextProject}
                  setActiveIndex={setActiveIndex}
                />
              );
            })}

          </div>
        </div>

      </div>

      {/* Editorial Minimal Details Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f1011] border border-[#23252a] rounded shadow-2xl p-6 md:p-10 text-white scrollbar-thin scrollbar-thumb-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-[#23252a] text-slate-400 hover:text-white transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Main Content Layout */}
              <div className="flex flex-col gap-8 relative z-10">
                
                {/* Header Section */}
                <div className="flex items-center gap-4 border-b border-white/[0.05] pb-6">
                  <div className="p-3 bg-[#010102] border border-[#23252a] text-[#e11d48]">
                    {selectedProject.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f7f8f8]">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-[#e11d48]">
                      {selectedProject.subtitle}
                    </p>
                  </div>
                </div>

                {/* Structured Split Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left Column: Tech Stack & Repository Links */}
                  <div className="md:col-span-5 flex flex-col gap-6">
                    <div>
                      <h5 className="text-[10px] font-mono tracking-widest text-[#8a8f98] uppercase mb-3">// TECH ENGINE</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-2.5 py-1 text-[11px] font-mono bg-[#010102] border border-[#23252a] text-[#d0d6e0]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-white/[0.03]">
                      {selectedProject.github && (
                        <motion.a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noreferrer"
                          whileHover={{ y: -1 }}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-[#010102] hover:bg-[#e11d48]/10 border border-[#e11d48]/30 hover:border-[#e11d48] text-white text-xs font-mono tracking-widest uppercase transition-all"
                        >
                          <Github className="w-3.5 h-3.5 text-[#e11d48]" />
                          <span>Repository</span>
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Overview and highlights with custom timeline indices */}
                  <div className="md:col-span-7 flex flex-col gap-6 md:border-l border-white/[0.05] pl-0 md:pl-8">
                    <div>
                      <h5 className="text-[10px] font-mono tracking-widest text-[#8a8f98] uppercase mb-2">// OVERVIEW</h5>
                      <p className="text-sm text-[#d0d6e0] leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-mono tracking-widest text-[#8a8f98] uppercase mb-4">// ARCHITECTURE</h5>
                      <div className="flex flex-col gap-4">
                        {selectedProject.details.map((detail, idx) => (
                          <div key={idx} className="flex gap-4 items-start group">
                            <span className="text-xs font-mono text-[#e11d48] mt-0.5 select-none font-bold">
                              {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed font-mono">
                              {detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.section>
  );
}
