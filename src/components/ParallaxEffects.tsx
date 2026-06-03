import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface TypewriterScrollTextProps {
  text: string;
  className?: string;
  delay?: number;
  highlightWords?: string[];
  once?: boolean;
}

/**
 * Letter-by-letter organic typewriter animation on entering viewport.
 */
export function TypewriterScrollText({ 
  text, 
  className = "", 
  delay = 0,
  highlightWords = [],
  once = true
}: TypewriterScrollTextProps) {
  const words = text.split(" ");
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
        delayChildren: delay,
      }
    }
  };
  
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 3,
      filter: 'blur(1px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: once, amount: 0.15 }}
      className={`inline-block ${className}`}
    >
      {words.map((word, wordIdx) => {
        // Stripe out common trailing puncts for clean word highlight matching
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
        const isHighlighted = highlightWords.some(hw => hw.toLowerCase() === cleanWord);
        
        return (
          <React.Fragment key={wordIdx}>
            <span 
              className={`inline-block whitespace-nowrap ${
                isHighlighted ? 'text-[#801b1b] font-bold dark:text-red-400' : ''
              }`}
            >
              {Array.from(word).map((char, charIdx) => (
                <motion.span
                  key={charIdx}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {wordIdx < words.length - 1 && (
              <span className="inline-block select-none" style={{ width: '0.25em' }}>
                &nbsp;
              </span>
            )}
          </React.Fragment>
        );
      })}
    </motion.span>
  );
}

interface ParallaxFloatProps {
  children: React.ReactNode;
  speed?: number; // positive for moving up faster, negative for drifting down
  className?: string;
  zIndex?: number;
}

/**
 * Creates scroll-linked offset adjustments to produce subtle parallax depth.
 */
export function ParallaxFloat({ 
  children, 
  speed = 0.4, 
  className = "",
  zIndex = 0 
}: ParallaxFloatProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate pixel displacement range based on speed factor
  const transformY = useTransform(scrollYProgress, [0, 1], [-80 * speed, 80 * speed]);
  
  // Use a physics-based spring smoothing to prevent scroll judder!
  const smoothedY = useSpring(transformY, {
    stiffness: 120,
    damping: 24,
    mass: 0.4
  });

  return (
    <div 
      ref={ref} 
      className={`pointer-events-none ${className}`}
      style={{ zIndex }}
    >
      <motion.div style={{ y: smoothedY }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

interface ScrollRevealBoxProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

/**
 * Container box that glides in beautifully as the user scrolls down to it.
 */
export function ScrollRevealBox({
  children,
  className = "",
  delay = 0,
  yOffset = 30
}: ScrollRevealBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.61,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // Custom ultra-smooth cubic bezier ease, matching high-end design
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Decorative floating SVG elements representing biology (cells, molecules, leaves) that follow parallax scrolling.
 */
export function FloatingCellBiology({ speed = 0.5, className = "" }: { speed?: number, className?: string }) {
  return (
    <ParallaxFloat speed={speed} className={`absolute opacity-15 dark:opacity-10 pointer-events-none select-none ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-stone-400 dark:text-stone-600">
        {/* Cell Wall Outline */}
        <path d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10ZM60 102C36.8 102 18 83.2 18 60C18 36.8 36.8 18 60 18C83.2 18 102 36.8 102 60C102 83.2 83.2 102 60 102Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        {/* Nucleus and Nucleolus */}
        <circle cx="60" cy="55" r="16" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="56" cy="51" r="6" fill="currentColor" />
        {/* Mitochondria */}
        <path d="M32 75Q36 78 42 74Q44 68 39 65Q35 68 32 75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M34 72L40 68" stroke="currentColor" strokeWidth="1" />
        {/* Chloroplast representation for biology / botany emphasis */}
        <path d="M84 45Q88 48 92 42Q89 36 83 40Q81 44 84 45Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="86" cy="41" r="2" fill="currentColor" />
        {/* Microtubules and floating granules */}
        <line x1="28" y1="42" x2="38" y2="48" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="85" y1="80" x2="95" y2="72" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="22" cy="58" r="1.5" fill="currentColor" />
        <circle cx="98" cy="58" r="1.5" fill="currentColor" />
        <circle cx="48" cy="28" r="2" fill="currentColor" />
        <circle cx="72" cy="88" r="2.2" fill="currentColor" />
      </svg>
    </ParallaxFloat>
  );
}

export function FloatingDnaStrand({ speed = -0.3, className = "" }: { speed?: number, className?: string }) {
  return (
    <ParallaxFloat speed={speed} className={`absolute opacity-15 dark:opacity-10 pointer-events-none select-none ${className}`}>
      <svg width="80" height="200" viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-stone-400 dark:text-stone-600">
        <path d="M15 10 C35 30, 45 40, 65 60 C45 80, 35 90, 15 110 C35 130, 45 140, 65 160 C45 180, 35 190, 15 210" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 10 C45 30, 35 40, 15 60 C35 80, 45 90, 65 110 C45 130, 35 140, 15 160 C35 180, 45 190, 65 210" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" />
        
        {/* Base Pairs joining */}
        <line x1="23" y1="23" x2="57" y2="23" stroke="currentColor" strokeWidth="1.5" />
        <line x1="33" y1="38" x2="47" y2="38" stroke="currentColor" strokeWidth="1.5" />
        <line x1="23" y1="73" x2="57" y2="73" stroke="currentColor" strokeWidth="1.5" />
        <line x1="33" y1="88" x2="47" y2="88" stroke="currentColor" strokeWidth="1.5" />
        <line x1="23" y1="123" x2="57" y2="123" stroke="currentColor" strokeWidth="1.5" />
        <line x1="33" y1="138" x2="47" y2="138" stroke="currentColor" strokeWidth="1.5" />
        <line x1="23" y1="173" x2="57" y2="173" stroke="currentColor" strokeWidth="1.5" />
        <line x1="33" y1="188" x2="47" y2="188" stroke="currentColor" strokeWidth="1.5" />

        {/* Nodes */}
        <circle cx="15" cy="10" r="3" fill="currentColor" />
        <circle cx="65" cy="10" r="3" fill="currentColor" />
        <circle cx="65" cy="60" r="3" fill="currentColor" />
        <circle cx="15" cy="60" r="3" fill="currentColor" />
        <circle cx="15" cy="110" r="3" fill="currentColor" />
        <circle cx="65" cy="110" r="3" fill="currentColor" />
        <circle cx="65" cy="160" r="3" fill="currentColor" />
        <circle cx="15" cy="160" r="3" fill="currentColor" />
      </svg>
    </ParallaxFloat>
  );
}

export function FloatingHanddrawnLeaf({ speed = 0.6, className = "" }: { speed?: number, className?: string }) {
  return (
    <ParallaxFloat speed={speed} className={`absolute opacity-20 dark:opacity-10 pointer-events-none select-none ${className}`}>
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-stone-400 dark:text-stone-600">
        <path d="M10 90C40 70, 60 50, 90 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaf blade leaf outline */}
        <path d="M10 90C15 65, 45 45, 90 10C65 15, 45 45, 10 90Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        {/* Veins */}
        <path d="M30 70Q45 61 50 63" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M30 70Q31 60 21 58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 50Q62 42 67 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 50Q51 40 43 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70 30Q80 25 82 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70 30Q72 21 66 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </ParallaxFloat>
  );
}
