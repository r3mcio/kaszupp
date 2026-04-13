"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

function SoundWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    let animationFrameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      time += 0.015; // Animation speed
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Clear the canvas on every frame
      ctx.clearRect(0, 0, width, height);
      
      const centerY = height / 2;

      // Enable screen blending for a glowing effect
      ctx.globalCompositeOperation = "screen";

      const waves = 5; // Number of overlapping wave lines
      for (let i = 0; i < waves; i++) {
        ctx.beginPath();
        
        const isMain = i === 0;
        ctx.lineWidth = isMain ? 2 : 1;
        
        // Base color: Emerald
        // 16, 185, 129
        const opacity = isMain ? 0.35 : 0.15;
        // Different shades for depth: mix in a bit of cyan/teal for background waves
        if (i % 2 === 0) {
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
        } else {
          ctx.strokeStyle = `rgba(45, 212, 191, ${opacity * 0.8})`; // Teal-400
        }
        
        const freqOffset = i * 1.5;
        
        for (let x = 0; x <= width; x += 4) {
          // Normalize x from -1 to 1
          const nx = (x / width) * 2 - 1;
          
          // 1. The macro curve: S-shape from top-left to bottom-right
          // Adding time to phase makes the macro curve slowly undulate too
          const macroCurve = Math.sin(nx * 1.5 - time * 0.2) * (height * 0.3); 
          
          // 2. The micro waves: Sound wave effect
          // It tapers off at the extreme edges using a bell curve factor
          const bell = Math.exp(-Math.pow(nx * 1.5, 2)); // Spread out the wave a bit
          
          const speed = time * (1 + i * 0.15);
          const noise = 
            Math.sin(nx * 25 + speed + freqOffset) * 0.5 + 
            Math.sin(nx * 40 - speed * 1.2) * 0.3 +
            Math.sin(nx * 15 + speed * 0.8) * 0.2;
            
          const amplitude = (height * 0.12) * bell; // Audio wave amplitude
          
          // Combine all Y components
          const y = centerY + macroCurve + (noise * amplitude);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80" />;
}

interface Particle {
  width: string;
  height: string;
  top: string;
  left: string;
  animateY: number;
  opacityMax: number;
  duration: number;
  delay: number;
}

export default function AnimatedBackground() {
  const { scrollY } = useScroll();
  const [bgState, setBgState] = useState<{
    isMounted: boolean;
    particles: Particle[];
  }>({
    isMounted: false,
    particles: []
  });

  useEffect(() => {
    const generatedParticles = [...Array(15)].map(() => ({
      width: Math.random() * 4 + 1 + "px",
      height: Math.random() * 4 + 1 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      animateY: -Math.random() * 100 - 50,
      opacityMax: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
    
    requestAnimationFrame(() => {
      setBgState({
        isMounted: true,
        particles: generatedParticles
      });
    });
  }, []);

  const { isMounted, particles } = bgState;

  // Blobs move gently with scroll
  const blob1Y = useTransform(scrollY, [0, 3000], [0, -400]);
  const blob2Y = useTransform(scrollY, [0, 3000], [0, -250]);
  const blob3Y = useTransform(scrollY, [0, 3000], [0, -600]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Dynamic Sound Waves Background */}
      {isMounted && <SoundWaves />}

      {/* Blob 1 — Top-left, deep emerald */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute -top-[20%] -left-[15%] w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full opacity-30 mix-blend-screen"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-radial from-emerald-900/50 via-emerald-950/20 to-transparent blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(6,95,70,0.4) 0%, rgba(6,78,59,0.15) 40%, transparent 70%)" }}
        />
      </motion.div>

      {/* Blob 2 — Center-right, purple tint */}
      <motion.div
        style={{ y: blob2Y }}
        className="absolute top-[30%] -right-[10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-25 mix-blend-screen"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      >
        <div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(88,28,135,0.35) 0%, rgba(88,28,135,0.1) 40%, transparent 70%)" }}
        />
      </motion.div>

      {/* Blob 3 — Bottom, deep green */}
      <motion.div
        style={{ y: blob3Y }}
        className="absolute top-[70%] left-[20%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-20 mix-blend-screen"
        animate={{
          scale: [1, 1.1, 1],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10,
        }}
      >
        <div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,95,70,0.3) 0%, rgba(6,78,59,0.1) 40%, transparent 70%)" }}
        />
      </motion.div>

      {/* Scattered Dust Particles (using simple absolute divs) */}
      {isMounted && particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden mix-blend-screen">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/20 blur-[1px]"
              style={{
                width: p.width,
                height: p.height,
                top: p.top,
                left: p.left,
              }}
              animate={{
                y: [0, p.animateY],
                opacity: [0, p.opacityMax, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "linear",
                delay: p.delay,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
