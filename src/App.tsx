import React, { useState, useEffect } from 'react';
import { getAssetUrl } from './lib/utils';
import { Mail, MapPin, Zap, BookOpen, Database, GitBranch, Box } from 'lucide-react';
import { PythonIcon, JSIcon, ReactIcon, NodeIcon, GithubIcon, LinkedinIcon } from './Icons';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ManifestoSection from './components/ManifestoSection';
import ProjectsSection from './components/ProjectsSection';
import NavigationHUD from './components/NavigationHUD';
import Preloader from './components/Preloader';
import ContactSection from './components/ContactSection';
import DotField from './components/DotField';
import { Typewriter } from './components/Typewriter';
import { AIChatBot } from './components/AIChatBot';

const SYMBOLS = "!<>-_\\/[]{}—=+*^?#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*()";

const ScrambleText = ({ text, delay = 0, className = "", trigger = true }: { text: string, delay?: number, className?: string, trigger?: boolean }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!trigger) {
      setDisplayText("");
      return;
    }

    let iteration = 0;
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    const startAnimation = () => {
      interval = setInterval(() => {
        const scrambled = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < Math.floor(iteration)) {
              return text[index];
            }
            return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          })
          .join("");

        setDisplayText(scrambled);

        if (iteration >= text.length) {
          setDisplayText(text);
          clearInterval(interval);
        }

        iteration += 0.35; 
      }, 30);
    };

    timeout = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, trigger]);

  return <span className={className}>{displayText}</span>;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [windowHeight, setWindowHeight] = useState(800);
  const [isMobile, setIsMobile] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [hasMouse, setHasMouse] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Inner follow dot: snaps quickly and responsively
  const innerSpringConfig = { damping: 28, stiffness: 450, mass: 0.2 };
  const cursorXSpringInner = useSpring(cursorX, innerSpringConfig);
  const cursorYSpringInner = useSpring(cursorY, innerSpringConfig);

  // Outer follow ring: has a beautiful slightly delayed drag effect
  const outerSpringConfig = { damping: 22, stiffness: 180, mass: 0.8 };
  const cursorXSpringOuter = useSpring(cursorX, outerSpringConfig);
  const cursorYSpringOuter = useSpring(cursorY, outerSpringConfig);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(hover: hover)');
      setHasMouse(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setHasMouse(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const techStack = [
    { name: 'Python', icon: <PythonIcon className="w-4 h-4" /> },
    { name: 'JavaScript', icon: <JSIcon className="w-4 h-4" /> },
    { name: 'React', icon: <ReactIcon className="w-4 h-4" /> },
    { name: 'Node.js', icon: <NodeIcon className="w-4 h-4" /> },
    { name: 'SQL', icon: <Database className="w-4 h-4" /> },
    { name: 'Git', icon: <GitBranch className="w-4 h-4" /> },
  ];

  // Monitor screen dimensions dynamically to keep scroll animations robust
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 1024);
      const handleResize = () => {
        setWindowHeight(window.innerHeight);
        setIsMobile(window.innerWidth < 1024);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 90, damping: 24, restDelta: 0.001 });

  // Scroll translations, scaling, and alignments
  const nameScale = useTransform(smoothScrollY, [0, 320], [isMobile ? 1.4 : 2.5, 1]);
  const nameY = useTransform(smoothScrollY, [0, 320], [isMobile ? windowHeight * 0.34 : windowHeight * 0.25, 0]);
  const nameX = useTransform(smoothScrollY, [0, 320], [isMobile ? 0 : 20, 0]);

  const subtitleOpacity = useTransform(smoothScrollY, [0, 150], [1, 0]);
  const subtitleHeight = useTransform(smoothScrollY, [0, 150], [45, 0]);

  // Fixed top bar background glassmorphism reveal
  const headerBgOpacity = useTransform(smoothScrollY, [150, 300], [0, 1]);

  // Main Hero content fades and slides up smoothly
  const heroContentOpacity = useTransform(smoothScrollY, [0, 200], [1, 0]);
  const heroContentY = useTransform(smoothScrollY, [0, 300], [0, -60]);

  // Prevent scroll during loading state
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect if element or parent is a link, button, text entry, custom interactive tag/class
      const interactiveElement = target.closest(
        'a, button, [role="button"], input, select, textarea, .cursor-pointer, .group, [onclick]'
      );

      if (interactiveElement) {
        setCursorVariant('hover');
      } else {
        setCursorVariant('default');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader key="loader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-[#0c0204] text-slate-300 relative font-sans flex flex-col font-medium ${hasMouse && isVisible && !loading ? 'cursor-none' : ''}`}>
      
      {/* Interactive mouse ambient spotlight glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-70"
        style={{
          background: 'radial-gradient(700px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(225, 29, 72, 0.06), transparent 80%)'
        }}
      />

      {/* Dynamic interactive DotField background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <DotField
          dotRadius={1.2}
          dotSpacing={18}
          cursorRadius={280}
          bulgeStrength={55}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(225, 29, 72, 0.16)"
          gradientTo="rgba(159, 18, 57, 0.06)"
          glowColor="#0c0204"
        />
      </div>

      {/* Dynamic Follow Cursor (only visible on devices with hover/pointer capability) */}
      {hasMouse && isVisible && !loading && (
        <>
          {/* Inner follow dot (fast, responsive) */}
          <motion.div
            style={{
              x: cursorXSpringInner,
              y: cursorYSpringInner,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={cursorVariant}
            variants={{
              default: {
                width: 6,
                height: 6,
                backgroundColor: "rgba(225, 29, 72, 1)", // brand Crimson / Rose-600
                boxShadow: "0 0 8px rgba(225, 29, 72, 0.8)",
              },
              hover: {
                width: 10,
                height: 10,
                backgroundColor: "rgba(255, 255, 255, 1)",
                boxShadow: "0 0 12px rgba(255, 255, 255, 1)",
              }
            }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="fixed top-0 left-0 pointer-events-none z-[100] rounded-full"
          />

          {/* Outer delayed ring (beautiful lag/follow effect) */}
          <motion.div
            style={{
              x: cursorXSpringOuter,
              y: cursorYSpringOuter,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={cursorVariant}
            variants={{
              default: {
                width: 28,
                height: 28,
                backgroundColor: "rgba(159, 18, 57, 0.02)", // Deep Rose
                borderColor: "rgba(159, 18, 57, 0.3)",
                borderWidth: "1.5px",
                scale: 1,
              },
              hover: {
                width: 48,
                height: 48,
                backgroundColor: "rgba(225, 29, 72, 0.08)",
                borderColor: "rgba(225, 29, 72, 0.7)",
                borderWidth: "1.5px",
                scale: 1.25,
                boxShadow: "0 0 16px rgba(225, 29, 72, 0.2)",
              }
            }}
            transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.8 }}
            className="fixed top-0 left-0 pointer-events-none z-[100] rounded-full"
          />
        </>
      )}      {/* Fixed Navigation Bar at the top of the viewport */}
      {!loading && (
        <header className="fixed top-0 left-0 w-full z-40 pointer-events-none">
          {/* Glassmorphic Background - scroll bound */}
          <motion.div 
            className="absolute inset-0 bg-[#0c0204]/80 backdrop-blur-md border-b border-white/[0.05]"
            style={{ opacity: headerBgOpacity }}
          />
          
          <div className="relative z-20 flex justify-between items-center px-8 md:px-12 py-5 max-w-[1600px] mx-auto w-full">
            {/* Left Slot: Animated Name & Title */}
            <motion.div 
              style={{ x: nameX, y: nameY, scale: nameScale, transformOrigin: "left center" }}
              className="flex flex-col items-start pointer-events-auto flex-1"
            >
              <h2 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight leading-none uppercase select-none">
                <ScrambleText text="ARYAN BHARAT KUMAR" delay={200} trigger={!loading} />
              </h2>
              <motion.div 
                style={{ opacity: subtitleOpacity, height: subtitleHeight }}
                className="overflow-hidden flex flex-col items-start"
              >
                <p className="text-rose-400/80 tracking-[0.3em] text-[10px] md:text-xs uppercase font-bold mt-1 whitespace-nowrap">
                  <Typewriter words={["SOFTWARE ENGINEER", "AI/ML ENGINEER"]} typingSpeed={80} deletingSpeed={40} delayBetweenWords={2000} />
                </p>
                <div className="w-16 h-[3px] bg-gradient-to-r from-rose-600 to-rose-950 mt-2.5 rounded-full" />
              </motion.div>
            </motion.div>
 
            {/* Middle Slot: Tech Stack / Centered Badge Bar */}
            <div className="hidden md:flex justify-center flex-1 pointer-events-auto">
              <div className="flex items-center gap-6 px-5 py-2.5 rounded-2xl border border-white/5 bg-[#1a050a]/60 backdrop-blur-md text-xs lg:text-sm text-slate-400 font-medium shadow-xl">
                {techStack.map((tech) => (
                  <motion.div 
                    key={tech.name} 
                    className="flex items-center gap-2 hover:text-white transition-colors cursor-default"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {tech.icon}
                    <span>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
 
            {/* Right Slot: Brand Info */}
            <div className="hidden lg:flex justify-end flex-1 pointer-events-auto">
              <div className="flex items-start gap-3 text-xs text-rose-400/70 font-mono leading-relaxed text-left">
                <span className="font-bold text-sm mt-0.5">&lt;/&gt;</span>
                <p>
                  Building scalable<br />
                  solutions, one line<br />
                  of code at a time.
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section Container (100vh) */}
      <div id="hero" className="h-screen w-full flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Background Grids & Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#5c0c1735_0%,transparent_100%)]"></div>

        {/* Scroll-Bound Hero Content Wrapper */}
        <motion.div 
          style={{ opacity: heroContentOpacity, y: heroContentY }}
          className="flex-1 flex flex-col justify-between w-full relative z-10 pt-[80px]"
        >
          {/* Main Hero Content */}
          <main className="relative z-10 flex-grow flex flex-col items-center justify-center w-full max-w-[1600px] mx-auto px-8 md:px-12 mt-[5vh] lg:mt-0">
            
            {/* Massive Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden mt-[-8vh]">
              <h1 className="text-[17vw] font-black tracking-tight select-none leading-none bg-gradient-to-b from-[#631122] via-[#28040b] to-transparent bg-clip-text text-transparent opacity-95" style={{ transform: 'scaleY(1.1)' }}>
                DEVELOPER
              </h1>
            </div>

            {/* Central Portrait */}
            <div className="relative z-10 w-full max-w-[850px] aspect-[4/5] flex items-end justify-center pointer-events-none mb-10 md:mb-0 mt-[-20%]">
              <img
                src={getAssetUrl('portrait.png')}
                alt="Aryan Bharat Kumar"
                className="w-full h-full object-contain object-bottom mask-image-bottom-fade scale-[1.35] translate-y-[-8%]"
              />
            </div>

            {/* Bottom Left Col: Contact Info */}
            <div className="lg:absolute left-12 bottom-[25%] z-20 flex flex-col gap-5 mt-8 lg:mt-0 w-full lg:w-auto text-slate-400 pl-6 border-l-2 border-rose-800/40">
              {/* Styled Social Tooltips (Uiverse fast-chipmunk-67) */}
              <ul className="example-2 mb-2">
                <li className="icon-content">
                  <a 
                    data-social="github" 
                    aria-label="GitHub" 
                    href="https://github.com/Aryan717317" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <div className="filled" />
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  <div className="tooltip">GitHub</div>
                </li>
                <li className="icon-content">
                  <a 
                    data-social="linkedin" 
                    aria-label="LinkedIn" 
                    href="https://www.linkedin.com/in/aryan-bharat-kumar/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <div className="filled" />
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                  <div className="tooltip">LinkedIn</div>
                </li>
              </ul>

              <a href="mailto:ar22073yan@gmail.com" className="flex items-center gap-4 hover:text-white transition-colors group">
                <Mail className="w-[22px] h-[22px] group-hover:text-white transition-colors" />
                <span className="text-sm font-mono">ar22073yan@gmail.com</span>
              </a>
              <div className="flex items-center gap-4 text-slate-400">
                <MapPin className="w-[22px] h-[22px]" />
                <span className="text-sm font-mono">India</span>
              </div>
            </div>

            {/* Bottom Right Col: Code Box */}
            <div className="lg:absolute right-12 bottom-[8%] z-0 mt-8 lg:mt-0 w-full lg:w-auto">
              <div className="bg-[#130408]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 font-mono text-[12px] leading-loose w-full lg:w-[380px] shadow-2xl">
                {/* Window Dots */}
                <div className="flex gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                
                {/* Code */}
                <div className="flex">
                  <div className="flex flex-col text-[#4b5563] select-none pr-4 text-right border-r border-white/5 mr-4 font-mono">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
                  </div>
                  <div className="text-slate-300 font-mono tracking-tight">
                    <div><span className="text-[#e11d48]">const</span> engineer <span className="text-[#f43f5e]">=</span> {'{'}</div>
                    <div className="pl-4"><span className="text-[#ff8a9f]">name:</span> <span className="text-[#ffb3c1]">"Aryan Bharat Kumar"</span>,</div>
                    <div className="pl-4"><span className="text-[#ff8a9f]">role:</span> <span className="text-[#ffb3c1]">"Software Engineer"</span>,</div>
                    <div className="pl-4">
                      <span className="text-[#ff8a9f]">passion:</span> <span className="text-[#ffb3c1]">"Building impactful</span>
                      <br/><span className="text-[#ffb3c1] pl-8">solutions"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-[#ff8a9f]">focus:</span> [<span className="text-[#ffb3c1]">"Clean Code"</span>, <span className="text-[#ffb3c1]">"Scalable</span>
                      <br/><span className="text-[#ffb3c1] pl-8">Systems"</span>, <span className="text-[#ffb3c1]">"Problem Solving"</span>],
                    </div>
                    <div className="pl-4"><span className="text-[#ff8a9f]">alwaysLearning:</span> <span className="text-[#fda4af]">true</span></div>
                    <div>{'};'}</div>
                  </div>
                </div>
              </div>
            </div>

          </main>

          {/* Bottom Features Bar */}
          <footer className="relative z-20 border border-white/5 mx-6 md:mx-12 mb-8 rounded-[2rem] bg-[#140408]/85 backdrop-blur-xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/5">
              
              <div className="flex items-center gap-6 md:px-8 first:pl-0 last:pr-0">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl shrink-0 flex items-center justify-center">
                  <span className="text-rose-400 font-bold text-xl block w-7 h-7 text-center leading-7">&lt;/&gt;</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-[15px]">Clean Code</h3>
                  <p className="text-slate-400 text-[13px] leading-relaxed">Writing maintainable<br/>and efficient code.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 md:px-8 first:pl-0 last:pr-0 pt-8 md:pt-0">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl shrink-0 flex items-center justify-center">
                  <Box className="w-7 h-7 text-rose-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-[15px]">Scalable Solutions</h3>
                  <p className="text-slate-400 text-[13px] leading-relaxed">Building systems that<br/>scale with business.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 md:px-8 first:pl-0 last:pr-0 pt-8 md:pt-0">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl shrink-0 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-rose-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-[15px]">Problem Solver</h3>
                  <p className="text-slate-400 text-[13px] leading-relaxed">Turning complex problems<br/>into simple solutions.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 md:px-8 pt-8 md:pt-0">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl shrink-0 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-rose-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-[15px]">Always Learning</h3>
                  <p className="text-slate-400 text-[13px] leading-relaxed">Exploring new technologies<br/>and improving every day.</p>
                </div>
              </div>

            </div>
          </footer>
        </motion.div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Manifesto Section */}
      <ManifestoSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Navigation HUD capsule */}
      <NavigationHUD />

      {/* Interactive AI Floating Portfolio Assistant */}
      <AIChatBot />
    </div>
    </>
  );
}
