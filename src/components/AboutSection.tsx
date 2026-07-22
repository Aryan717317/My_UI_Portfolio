import React from 'react';
import { motion } from 'motion/react';
import { Download, ArrowRight, Code2, BrainCircuit, Layers, LineChart, Lightbulb } from 'lucide-react';
import Lanyard from './Lanyard/Lanyard';
import lanyardCardImg from './Lanyard/lanyard.png';
import { CursorDrivenParticleTypography } from './CursorDrivenParticleTypography';
import { MusicPlayer } from './MusicPlayer';

export default function AboutSection() {
  const skills = [
    { name: "Software Engineering", icon: <Code2 className="w-4 h-4" /> },
    { name: "AI & Machine Learning", icon: <BrainCircuit className="w-4 h-4" /> },
    { name: "Full Stack Development", icon: <Layers className="w-4 h-4" /> },
    { name: "Data Analytics", icon: <LineChart className="w-4 h-4" /> },
    { name: "Problem Solving", icon: <Lightbulb className="w-4 h-4" /> }
  ];

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
      id="about"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative min-h-screen py-24 px-8 md:px-12 w-full max-w-[1600px] mx-auto z-20 flex flex-col justify-center"
    >
      
      {/* Background Effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#be123c]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#9f1239]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Thin Animated Divider */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-0 left-8 right-8 md:left-12 md:right-12 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent origin-left"
      ></motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mt-12 lg:mt-0">
        
        {/* Left Side: Content */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-start"
        >
          <div className="w-full h-20 md:h-24 mb-8 text-white relative z-30 select-none">
            <CursorDrivenParticleTypography 
              text="About Me." 
              fontSize={72} 
              textAlign="left"
              particleSize={2.2}
              particleDensity={3}
              dispersionStrength={24}
              returnSpeed={0.06}
              color="#ffffff"
            />
          </div>
          
          <p className="text-lg md:text-xl text-[#A1A1AA] leading-relaxed mb-10 font-medium">
            I am a passionate Software Engineer who enjoys solving real-world problems through software development, AI/ML, data analytics, and scalable systems. I thrive at the intersection of design and engineering, crafting experiences that are both robust and beautifully intuitive.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.05, borderColor: "rgba(190, 24, 74, 0.4)", backgroundColor: "rgba(255,255,255,0.06)" }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm font-medium text-slate-200 transition-colors"
              >
                <span className="text-[#e11d48]">{skill.icon}</span>
                {skill.name}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <motion.a 
              href="/resume.pdf"
              download
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl text-white font-semibold transition-all backdrop-blur-md relative overflow-hidden group shadow-[0_0_40px_rgba(190,24,74,0.05)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#be123c]/10 to-[#9f1239]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <Download className="w-5 h-5 relative z-10" />
              <span className="relative z-10 tracking-wide">Download Resume</span>
            </motion.a>

            <motion.a 
              href="#"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.02)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 border border-transparent rounded-2xl text-[#A1A1AA] hover:text-white font-semibold transition-colors"
            >
              <span className="tracking-wide">Let's Connect</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Side: Dedicated 3D Lanyard Integration */}
        <motion.div 
          variants={itemVariants}
          className="w-full h-[550px] lg:h-[650px] flex items-center justify-center relative select-none pointer-events-auto"
        >
          <div className="absolute inset-0 bg-[#111217]/40 backdrop-blur-md border border-white/[0.08] rounded-[2.5rem] overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#be123c]/10 via-[#9f1239]/5 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#9f1239]/5 to-transparent rounded-tr-full pointer-events-none"></div>
            
            <Lanyard
              position={[0, -1.2, 15]}
              gravity={[0, -40, 0]}
              frontImage={lanyardCardImg}
              backImage={lanyardCardImg}
              imageFit="cover"
              lanyardWidth={1}
              pinOffset={[0, 4.8, 0]}
            />
          </div>
        </motion.div>

      </div>

      {/* Dynamic Music Station Bento Card */}
      <motion.div
        variants={itemVariants}
        className="mt-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#111217]/40 border border-white/[0.08] backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden pointer-events-auto"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#be123c]/10 to-transparent rounded-bl-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#9f1239]/5 to-transparent rounded-tr-full pointer-events-none"></div>
        
        {/* Left column: Music Player Component */}
        <div className="lg:col-span-5 flex justify-center items-center z-10">
          <MusicPlayer 
            className="w-full max-w-xs scale-90 sm:scale-100"
          />
        </div>

        {/* Right column: Station details */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start text-left z-10 lg:pl-4">
          <span className="text-xs font-mono tracking-[0.3em] text-[#e11d48] uppercase mb-4 font-bold block">
            [ SOUNDTRACK & FOCUS ]
          </span>
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase mb-6 leading-tight">
            Developer's Choice Beats
          </h3>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-8 font-medium">
            Listening to rhythmic low-fidelity and chill synth beats while coding keeps my flow state uninterrupted. Click on the spinning vinyl record on the left to toggle high-focus background tracks. The record player arm will swing on and off the platter organically as you control the play state!
          </p>
          <div className="flex flex-wrap gap-3 font-mono text-xs text-slate-300">
            <span className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] font-bold">
              LOFI GIRL RADIO
            </span>
            <span className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] font-bold">
              TONEARM INTERACTION
            </span>
            <span className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] font-bold">
              FLOW STATE ENHANCED
            </span>
          </div>
        </div>
      </motion.div>

    </motion.section>
  );
}
