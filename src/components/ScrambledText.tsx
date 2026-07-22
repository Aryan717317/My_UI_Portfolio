import React, { useEffect, useRef, useState } from 'react';
import './ScrambledText.css';

interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: string; // The text content to be scrambled
}

export default function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  
  // Convert children string to array of characters
  const characters = children.split('');

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Track animation states for each character
    const animationStates = characters.map((char) => ({
      original: char,
      current: char,
      isScrambling: false,
      startTime: 0,
      scrambleDuration: 0,
    }));

    const handlePointerMove = (e: PointerEvent) => {
      const parentRect = el.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Loop through each rendered character span to calculate proximity
      charsRef.current.forEach((span, index) => {
        if (!span) return;
        const state = animationStates[index];
        // Don't scramble spaces
        if (state.original.trim() === '') return;

        const rect = span.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const dx = mouseX - charX;
        const dy = mouseY - charY;
        const dist = Math.hypot(dx, dy);

        // If mouse is within the active radius
        if (dist < radius) {
          // Calculate custom speed-proportional duration (closer = longer scramble or standard duration scale)
          const proportionalDuration = duration * (1 - dist / radius) * 1000; // in milliseconds
          
          if (!state.isScrambling) {
            state.isScrambling = true;
            state.startTime = performance.now();
            state.scrambleDuration = proportionalDuration;
            
            // Trigger animation loop for this character
            const scrambleLoop = (time: number) => {
              const elapsed = time - state.startTime;
              if (elapsed >= state.scrambleDuration) {
                // Restore original character
                state.current = state.original;
                span.textContent = state.original;
                state.isScrambling = false;
              } else {
                // Randomly alternate between scrambled chars and original based on progress
                const progress = elapsed / state.scrambleDuration;
                if (Math.random() > progress * speed * 2) {
                  // Pick a random scramble char
                  const randChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                  span.textContent = randChar;
                } else {
                  span.textContent = state.original;
                }
                
                if (state.isScrambling) {
                  requestAnimationFrame(scrambleLoop);
                }
              }
            };
            requestAnimationFrame(scrambleLoop);
          } else {
            // Keep refreshing duration and start time while hover continues inside the radius
            state.startTime = performance.now();
            state.scrambleDuration = Math.max(state.scrambleDuration, proportionalDuration);
          }
        }
      });
    };

    el.addEventListener('pointermove', handlePointerMove);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      // Ensure all characters are restored on unmount/re-render
      charsRef.current.forEach((span, index) => {
        if (span) {
          span.textContent = characters[index];
        }
      });
    };
  }, [radius, duration, speed, scrambleChars, children, characters]);

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p className="inline">
        {characters.map((char, index) => (
          <span
            key={index}
            ref={(node) => {
              charsRef.current[index] = node;
            }}
            className="char inline-block whitespace-pre select-none pointer-events-auto"
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}
