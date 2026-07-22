import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
  key?: string;
}

const WORDS = [
  "INITIALIZING PORTFOLIO",
  "LOADING SYSTEMS",
  "PRAGMA ENGAGED",
  "COMPILING INTERFACES",
  "ESTABLISHING PROTOCOLS",
  "ARYAN BHARAT KUMAR",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  // Smoothly increment the loader progress
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Add random small increments to make the load feel organic and premium
      const increment = Math.floor(Math.random() * 8) + 2;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Wait a small moment at 100% for impact, then trigger complete
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Stagger cycle through greetings/loading phrases
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 350);

    return () => clearInterval(wordInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 z-50 bg-[#0c0204] flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden"
    >
      {/* Decorative top-left branding / system info */}
      <div className="flex justify-between items-start w-full font-mono text-[10px] text-[#A1A1AA]/40 tracking-widest uppercase">
        <div>
          <span>SYSTEM: ACTIVE</span>
          <br />
          <span>LOC: SECURE_CONTAINER</span>
        </div>
        <div className="text-right">
          <span>ABK_V2.0</span>
          <br />
          <span>©2026</span>
        </div>
      </div>

      {/* Center Counter and Word Showcase */}
      <div className="flex flex-col items-center justify-center relative my-auto gap-4">
        {/* Style block for the hamster animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          .wheel-and-hamster {
            --dur: 1.2s;
            position: relative;
            width: 12em;
            height: 12em;
            font-size: 14px;
          }

          .wheel,
          .hamster,
          .hamster div,
          .spoke {
            position: absolute;
          }

          .wheel,
          .spoke {
            border-radius: 50%;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .wheel {
            background: radial-gradient(100% 100% at center, hsla(0,0%,60%,0) 47.8%, hsl(0,0%,50%) 48%);
            border: 2px solid rgba(255, 255, 255, 0.05);
            z-index: 2;
          }

          .hamster {
            animation: hamster var(--dur) ease-in-out infinite;
            top: 50%;
            left: calc(50% - 3.5em);
            width: 7em;
            height: 3.75em;
            transform: rotate(4deg) translate(-0.8em, 1.85em);
            transform-origin: 50% 0;
            z-index: 1;
          }

          .hamster__head {
            animation: hamsterHead var(--dur) ease-in-out infinite;
            background: hsl(30, 90%, 55%);
            border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
            box-shadow: 0 -0.25em 0 hsl(30, 90%, 80%) inset,
                        0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
            top: 0;
            left: -2em;
            width: 2.75em;
            height: 2.5em;
            transform-origin: 100% 50%;
          }

          .hamster__ear {
            animation: hamsterEar var(--dur) ease-in-out infinite;
            background: hsl(0, 90%, 85%);
            border-radius: 50%;
            box-shadow: -0.25em 0 hsl(30, 90%, 55%) inset;
            top: -0.25em;
            right: -0.25em;
            width: 0.75em;
            height: 0.75em;
            transform-origin: 50% 75%;
          }

          .hamster__eye {
            animation: hamsterEye var(--dur) linear infinite;
            background-color: hsl(0, 0%, 0%);
            border-radius: 50%;
            top: 0.375em;
            left: 1.25em;
            width: 0.5em;
            height: 0.5em;
          }

          .hamster__nose {
            background: hsl(0, 90%, 75%);
            border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
            top: 0.75em;
            left: 0;
            width: 0.2em;
            height: 0.25em;
          }

          .hamster__body {
            animation: hamsterBody var(--dur) ease-in-out infinite;
            background: hsl(30, 90%, 90%);
            border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
            box-shadow: 0.1em 0.75em 0 hsl(30, 90%, 55%) inset,
                        0.15em -0.5em 0 hsl(30, 90%, 80%) inset;
            top: 0.25em;
            left: 2em;
            width: 4.5em;
            height: 3em;
            transform-origin: 17% 50%;
            transform-style: preserve-3d;
          }

          .hamster__limb--fr,
          .hamster__limb--fl {
            clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
            top: 2em;
            left: 0.5em;
            width: 1em;
            height: 1.5em;
            transform-origin: 50% 0;
          }

          .hamster__limb--fr {
            animation: hamsterFRLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30, 90%, 80%) 80%, hsl(0, 90%, 75%) 80%);
            transform: rotate(15deg) translateZ(-1px);
          }

          .hamster__limb--fl {
            animation: hamsterFLLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30, 90%, 90%) 80%, hsl(0, 90%, 85%) 80%);
            transform: rotate(15deg);
          }

          .hamster__limb--br,
          .hamster__limb--bl {
            border-radius: 0.75em 0.75em 0 0;
            clip-path: polygon(0 0, 100% 0, 100% 30%, 70% 90%, 70% 100%, 30% 100%, 40% 90%, 0% 30%);
            top: 1em;
            left: 2.8em;
            width: 1.5em;
            height: 2.5em;
            transform-origin: 50% 30%;
          }

          .hamster__limb--br {
            animation: hamsterBRLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30, 90%, 80%) 90%, hsl(0, 90%, 75%) 90%);
            transform: rotate(-25deg) translateZ(-1px);
          }

          .hamster__limb--bl {
            animation: hamsterBLLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30, 90%, 90%) 90%, hsl(0, 90%, 85%) 90%);
            transform: rotate(-25deg);
          }

          .hamster__tail {
            animation: hamsterTail var(--dur) linear infinite;
            background: hsl(0, 90%, 85%);
            border-radius: 0.25em 50% 50% 0.25em;
            box-shadow: 0 -0.2em 0 hsl(0, 90%, 75%) inset;
            top: 1.5em;
            right: -0.5em;
            width: 1em;
            height: 0.5em;
            transform: rotate(30deg) translateZ(-1px);
            transform-origin: 0.25em 0.25em;
          }

          .spoke {
            animation: spoke var(--dur) linear infinite;
            background: radial-gradient(100% 100% at center, hsl(0,0%,50%) 4.8%, hsla(0,0%,50%,0) 5%),
                        linear-gradient(hsla(0,0%,45%,0) 46.9%, hsl(0,0%,55%) 47% 52.9%, hsla(0,0%,55%,0) 53%) 50% 50% / 99% 99% no-repeat;
          }

          /* Animations */
          @keyframes hamster {
            from, to {
              transform: rotate(4deg) translate(-0.8em, 1.85em);
            }
            50% {
              transform: rotate(0) translate(-0.8em, 1.85em);
            }
          }

          @keyframes hamsterHead {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }
            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(8deg);
            }
          }

          @keyframes hamsterEye {
            from, 90%, to {
              transform: scaleY(1);
            }
            95% {
              transform: scaleY(0);
            }
          }

          @keyframes hamsterEar {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }
            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(12deg);
            }
          }

          @keyframes hamsterBody {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }
            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-2deg);
            }
          }

          @keyframes hamsterFRLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(50deg) translateZ(-1px);
            }
            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-30deg) translateZ(-1px);
            }
          }

          @keyframes hamsterFLLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(-30deg);
            }
            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(50deg);
            }
          }

          @keyframes hamsterBRLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(-60deg) translateZ(-1px);
            }
            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(20deg) translateZ(-1px);
            }
          }

          @keyframes hamsterBLLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(20deg);
            }
            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-60deg);
            }
          }

          @keyframes hamsterTail {
            from, 25%, 50%, 75%, to {
              transform: rotate(30deg) translateZ(-1px);
            }
            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(10deg) translateZ(-1px);
            }
          }

          @keyframes spoke {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(-1turn);
            }
          }
        ` }} />

        {/* Subtle background glow */}
        <div className="absolute w-[350px] h-[350px] bg-[#be123c]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Dynamic Hamster Runner */}
        <div className="flex items-center justify-center scale-[0.85] md:scale-100 mb-4">
          <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
            <div className="wheel" />
            <div className="hamster">
              <div className="hamster__body">
                <div className="hamster__head">
                  <div className="hamster__ear" />
                  <div className="hamster__eye" />
                  <div className="hamster__nose" />
                </div>
                <div className="hamster__limb hamster__limb--fr" />
                <div className="hamster__limb hamster__limb--fl" />
                <div className="hamster__limb hamster__limb--br" />
                <div className="hamster__limb hamster__limb--bl" />
                <div className="hamster__tail" />
              </div>
            </div>
            <div className="spoke" />
          </div>
        </div>

        {/* Big Premium Monospace Number */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-black text-white font-mono tracking-tighter mb-2 relative"
        >
          {progress}
          <span className="text-2xl md:text-3xl text-[#e11d48] font-bold select-none ml-1">%</span>
        </motion.div>

        {/* Changing Developer/Pragma phrases */}
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={WORDS[wordIndex]}
              initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="text-xs md:text-sm font-mono tracking-[0.4em] text-[#A1A1AA] uppercase text-center font-bold"
            >
              {WORDS[wordIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom glowing loading indicator layout */}
      <div className="w-full flex flex-col gap-4 max-w-xl mx-auto items-center">
        {/* Progress bar tracks */}
        <div className="w-full h-[3px] bg-white/[0.04] rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#be123c] via-[#e11d48] to-[#9f1239]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
          {/* Subtle trail spotlight cursor */}
          <motion.div 
            className="absolute top-0 h-full w-20 bg-white/40 blur-sm"
            style={{ left: `calc(${progress}% - 40px)` }}
          />
        </div>

        <div className="flex justify-between w-full font-mono text-[10px] text-[#A1A1AA]/30 tracking-widest">
          <span>SHIPPING CODE</span>
          <span>COMPLETING BOOT_SEQUENCE</span>
        </div>
      </div>

    </motion.div>
  );
}
