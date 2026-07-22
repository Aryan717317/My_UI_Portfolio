import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, User, Cpu, FolderGit2, Scroll, Mail } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function NavigationHUD() {
  const items: NavItem[] = [
    { id: 'hero', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Cpu className="w-4 h-4" /> },
    { id: 'projects', label: 'Works', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'manifesto', label: 'Manifesto', icon: <Scroll className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }

      // Check which section is in view
      const sectionElements = items.map(item => document.getElementById(item.id));
      let currentSection = 'hero';

      sectionElements.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // If the top of the section is in the top 40% of the screen
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
          currentSection = el.id;
        }
      });

      // Special check for bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        currentSection = 'contact';
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initially
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[90vw]">
      
      {/* Tiny progress line indicator above the main HUD */}
      <div className="w-40 h-1 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#be123c] to-[#e11d48]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Main Glassmorphic HUD */}
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#0c0e15]/80 border border-white/[0.08] backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
      >
        {items.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative group ${
                isActive 
                   ? 'text-white' 
                   : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              {/* Animated background chip indicator */}
              {isActive && (
                <motion.div
                  layoutId="hudActiveIndicator"
                  className="absolute inset-0 bg-white/[0.04] border border-white/[0.06] rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover highlight dot */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#be123c] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <span className={`transition-transform duration-300 ${isActive ? 'text-[#e11d48] scale-110' : 'text-[#A1A1AA]'}`}>
                {item.icon}
              </span>
              <span className="hidden sm:inline font-mono">
                {item.label}
              </span>

              {/* Tooltip on mobile / small screen hover */}
              <span className="sm:hidden absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 border border-white/10 rounded-md text-[10px] font-mono tracking-widest text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
