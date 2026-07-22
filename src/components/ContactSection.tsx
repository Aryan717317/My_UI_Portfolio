import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Mail, CheckCircle2, ArrowUpRight, Send, ArrowLeft, ArrowRight } from 'lucide-react';

interface SphereProps {
  initialX: number;
  initialY: number;
  size: number;
  gradient: string;
  delay?: number;
  duration?: number;
}

// 3D-like Spheres with organic floating and mouse parallax
function ParallaxSphere({ initialX, initialY, size, gradient, delay = 0, duration = 15 }: SphereProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform mouse coordinates into subtle 3D translation
  const moveX = useTransform(springX, [-500, 500], [-30, 30]);
  const moveY = useTransform(springY, [-500, 500], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX - innerWidth / 2;
      const y = e.clientY - innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: moveX,
        y: moveY,
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
      }}
      animate={{
        y: [0, -25, 0],
        x: [0, 15, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: duration,
        delay: delay,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full pointer-events-none select-none z-0 shadow-[inset_-12px_-12px_35px_rgba(0,0,0,0.85),20px_20px_60px_rgba(0,0,0,0.7)] ${gradient}`}
    />
  );
}

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [activeStep, setActiveStep] = useState<null | 'name' | 'email' | 'message'>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus reference for inputs in deep modal
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Focus the input when activeStep changes
  useEffect(() => {
    if (activeStep && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400); // Sync with screen transition reveal
    }
  }, [activeStep]);

  const handleStepOpen = (step: 'name' | 'email' | 'message') => {
    setTransitioning(true);
    // Play transition wipe, then open active step
    setTimeout(() => {
      setActiveStep(step);
      setTransitioning(false);
    }, 450);
  };

  const handleStepClose = () => {
    setTransitioning(true);
    setTimeout(() => {
      setActiveStep(null);
      setTransitioning(false);
    }, 450);
  };

  const handleNextStep = () => {
    if (activeStep === 'name') {
      handleStepOpen('email');
    } else if (activeStep === 'email') {
      handleStepOpen('message');
    } else {
      handleStepClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setActiveStep(null);
    }, 1500);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <section id="contact" className="relative min-h-screen py-24 px-6 md:px-12 w-full max-w-[1600px] mx-auto z-20 flex flex-col justify-center overflow-hidden bg-transparent">
      
      {/* Liquid Screen Transition Curtain Wipe (Inspired by Leeroy.ca) */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
            animate={{ 
              clipPath: [
                'polygon(0 0, 0 0, 0 100%, 0% 100%)',
                'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
              ]
            }}
            exit={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-gradient-to-r from-[#be123c] via-[#e11d48] to-[#F59E0B] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 3D-Shaded Spheres from Image 1 Mockup floating in space */}
      <ParallaxSphere 
        initialX={8} 
        initialY={15} 
        size={180} 
        gradient="bg-gradient-to-br from-[#2D2E32] via-[#1F2023] to-[#0D0D0E]" 
        delay={0}
        duration={18}
      />
      <ParallaxSphere 
        initialX={82} 
        initialY={68} 
        size={240} 
        gradient="bg-gradient-to-br from-[#3E2B25] via-[#241713] to-[#0A0605]" 
        delay={1.5}
        duration={22}
      />
      <ParallaxSphere 
        initialX={45} 
        initialY={80} 
        size={110} 
        gradient="bg-gradient-to-br from-[#1C1F26] to-[#08090B]" 
        delay={0.5}
        duration={15}
      />

      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Step-by-Step Focus View (Transitioned State) */}
        <AnimatePresence mode="wait">
          {activeStep && (
            <motion.div
              key="step-view"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-4xl bg-[#0c0e15]/60 border border-white/[0.08] backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 flex flex-col justify-between min-h-[500px] shadow-[0_50px_100px_rgba(0,0,0,0.85)] relative overflow-hidden"
            >
              {/* Backlight glow */}
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#be123c]/15 rounded-full blur-[120px] pointer-events-none" />
              
              {/* Header inside Focus view */}
              <div className="flex justify-between items-center w-full mb-8 relative z-10">
                <button
                  type="button"
                  onClick={handleStepClose}
                  className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-slate-400 hover:text-white uppercase transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to overview</span>
                </button>
                <span className="text-xs font-mono text-[#e11d48] tracking-[0.2em] uppercase font-bold">
                  {activeStep === 'name' ? 'Step 1/3' : activeStep === 'email' ? 'Step 2/3' : 'Step 3/3'}
                </span>
              </div>

              {/* Main Content Form Field */}
              <div className="my-auto relative z-10 flex flex-col items-center text-center">
                <motion.label 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-8"
                >
                  {activeStep === 'name' && "WHAT IS YOUR NAME?"}
                  {activeStep === 'email' && "WHAT IS YOUR EMAIL?"}
                  {activeStep === 'message' && "TELL US ABOUT YOUR PROJECT"}
                </motion.label>

                {activeStep === 'message' ? (
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full max-w-2xl bg-transparent border-b-2 border-white/10 focus:border-[#e11d48] py-4 text-center text-xl md:text-2xl text-white outline-none placeholder-white/15 transition-colors duration-300 resize-none min-h-[120px]"
                  />
                ) : (
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type={activeStep === 'email' ? 'email' : 'text'}
                    value={activeStep === 'name' ? name : email}
                    onChange={(e) => activeStep === 'name' ? setName(e.target.value) : setEmail(e.target.value)}
                    placeholder={activeStep === 'name' ? "John Doe" : "john@example.com"}
                    className="w-full max-w-xl bg-transparent border-b-2 border-white/10 focus:border-[#e11d48] py-4 text-center text-xl md:text-2xl text-white outline-none placeholder-white/15 transition-colors duration-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (activeStep === 'name' ? name : email)) {
                        handleNextStep();
                      }
                    }}
                  />
                )}
              </div>

              {/* Footer Controls inside Focus View */}
              <div className="flex justify-between items-center w-full mt-8 relative z-10">
                <div className="text-xs font-mono text-slate-500">
                  {activeStep === 'name' && (name ? 'Press Enter to continue' : 'Please fill name')}
                  {activeStep === 'email' && (email ? 'Press Enter to continue' : 'Please fill email')}
                  {activeStep === 'message' && (message ? 'Ready to send!' : 'Please write details')}
                </div>

                <div className="flex items-center gap-4">
                  {activeStep !== 'message' ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={activeStep === 'name' ? !name : !email}
                      className="px-6 py-3 rounded-full bg-white text-black font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#be123c] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black flex items-center gap-2 shadow-lg"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !name || !email || !message}
                      className="px-8 py-3.5 rounded-full bg-[#F59E0B] text-black font-sans font-black text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-xl"
                    >
                      {loading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <span>SUBMIT FORM</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Landing State (Image 2 style with concentric circle buttons) */}
          {!activeStep && !submitted && (
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Intro Text */}
              <div className="text-center mb-16 max-w-2xl">
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 0.8, y: 0 }}
                  viewport={{ once: true }}
                  className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase mb-4 text-[#e11d48] block font-bold"
                >
                  [ LET'S CONNECT ]
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-4"
                >
                  CONNECT TO BUILD SOMETHING BIG
                </motion.h2>
                <p className="text-sm font-mono text-slate-400 tracking-wider">
                  Let's unlock potential together. Interaction is key.
                </p>
              </div>

              {/* Glassmorphic Shell hosting the 3 concentric circles */}
              <div className="w-full max-w-5xl bg-[#0c0e15]/40 border border-white/[0.08] backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 flex flex-col items-center shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden mb-8">
                {/* Backlight reflection */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#be123c]/10 rounded-full blur-[120px] pointer-events-none" />

                {/* 3 Concentric sectors layout exactly like leeroy.ca */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full justify-items-center relative z-10">
                  
                  {/* Circle 1: Name */}
                  <motion.div
                    onClick={() => handleStepOpen('name')}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-500 overflow-hidden select-none ${
                      name 
                        ? 'bg-white/[0.04] border-[#be123c]/40 shadow-[0_0_30px_rgba(190,24,74,0.1)]' 
                        : 'bg-white/[0.01] border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#A1A1AA] mb-2">
                      NAME
                    </span>
                    {name ? (
                      <span className="text-sm text-white font-semibold truncate max-w-[80%]">
                        {name}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#e11d48]/60 uppercase tracking-widest mt-1">
                        [ Click to fill ]
                      </span>
                    )}
                    {/* Inner custom subtle radar rings */}
                    <div className="absolute inset-4 border border-white/[0.02] rounded-full pointer-events-none" />
                    <div className="absolute inset-8 border border-white/[0.01] rounded-full pointer-events-none" />
                  </motion.div>

                  {/* Circle 2: Email */}
                  <motion.div
                    onClick={() => handleStepOpen('email')}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-500 overflow-hidden select-none ${
                      email 
                        ? 'bg-white/[0.04] border-[#be123c]/40 shadow-[0_0_30px_rgba(190,24,74,0.1)]' 
                        : 'bg-white/[0.01] border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#A1A1AA] mb-2">
                      EMAIL
                    </span>
                    {email ? (
                      <span className="text-sm text-white font-semibold truncate max-w-[80%]">
                        {email}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#e11d48]/60 uppercase tracking-widest mt-1">
                        [ Click to fill ]
                      </span>
                    )}
                    <div className="absolute inset-4 border border-white/[0.02] rounded-full pointer-events-none" />
                    <div className="absolute inset-8 border border-white/[0.01] rounded-full pointer-events-none" />
                  </motion.div>

                  {/* Circle 3: Message */}
                  <motion.div
                    onClick={() => handleStepOpen('message')}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-500 overflow-hidden select-none ${
                      message 
                        ? 'bg-white/[0.04] border-[#be123c]/40 shadow-[0_0_30px_rgba(190,24,74,0.1)]' 
                        : 'bg-white/[0.01] border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#A1A1AA] mb-2">
                      MESSAGE
                    </span>
                    {message ? (
                      <span className="text-sm text-white font-semibold truncate max-w-[80%]">
                        {message}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#e11d48]/60 uppercase tracking-widest mt-1">
                        [ Click to fill ]
                      </span>
                    )}
                    <div className="absolute inset-4 border border-white/[0.02] rounded-full pointer-events-none" />
                    <div className="absolute inset-8 border border-white/[0.01] rounded-full pointer-events-none" />
                  </motion.div>

                </div>

                {/* Combined 2nd Image Bottom bar style: Premium, solid yellow container */}
                <div className="w-full max-w-3xl rounded-full bg-[#F59E0B] p-2.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_20px_50px_rgba(245,158,11,0.25)] border border-yellow-400/30 relative z-10">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !name || !email || !message}
                    className={`w-full sm:w-auto px-8 py-4 rounded-full font-sans font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 select-none ${
                      loading || !name || !email || !message
                        ? 'bg-[#D97706]/40 text-black/40 cursor-not-allowed'
                        : 'bg-black text-[#F59E0B] hover:bg-neutral-900 active:scale-95 shadow-md'
                    }`}
                  >
                    {loading ? (
                      <span className="w-5 h-5 rounded-full border-2 border-[#F59E0B] border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>LET'S DO THIS</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <a
                    href="mailto:ar22073yan@gmail.com?subject=Inquiry from Portfolio"
                    className="w-full sm:w-auto text-center px-8 py-4 rounded-full font-mono font-bold text-xs sm:text-sm text-black tracking-widest hover:bg-black/5 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>OR SEND EMAIL</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </motion.div>
          )}

          {/* Success View */}
          {submitted && (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl rounded-[3rem] p-12 text-center flex flex-col items-center justify-center shadow-2xl relative"
            >
              <div className="w-20 h-20 rounded-full bg-[#be123c]/10 border border-[#be123c]/30 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#e11d48]" />
              </div>

              <h3 className="text-3xl font-black text-white tracking-tight uppercase mb-4">
                TRANSMISSION SENT
              </h3>
              <p className="text-slate-400 font-mono text-sm leading-relaxed mb-8">
                Your message has been safely received. I will follow up with you shortly.
              </p>

              <button
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/[0.02] text-xs font-mono font-bold text-slate-300 transition-all active:scale-95 tracking-widest uppercase"
              >
                Send another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
