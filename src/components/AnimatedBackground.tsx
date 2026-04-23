"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// ─── Sound Waves (original) ───────────────────────────────────────────────────

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
      time += 0.015;
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;

      ctx.globalCompositeOperation = "screen";

      const waves = 5;
      for (let i = 0; i < waves; i++) {
        ctx.beginPath();

        const isMain = i === 0;
        ctx.lineWidth = isMain ? 2 : 1;

        const opacity = isMain ? 0.35 : 0.15;
        if (i % 2 === 0) {
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
        } else {
          ctx.strokeStyle = `rgba(45, 212, 191, ${opacity * 0.8})`;
        }

        const freqOffset = i * 1.5;

        for (let x = 0; x <= width; x += 4) {
          const nx = (x / width) * 2 - 1;

          const macroCurve = Math.sin(nx * 1.5 - time * 0.2) * (height * 0.3);

          const bell = Math.exp(-Math.pow(nx * 1.5, 2));

          const speed = time * (1 + i * 0.15);
          const noise =
            Math.sin(nx * 25 + speed + freqOffset) * 0.5 +
            Math.sin(nx * 40 - speed * 1.2) * 0.3 +
            Math.sin(nx * 15 + speed * 0.8) * 0.2;

          const amplitude = height * 0.12 * bell;

          const y = centerY + macroCurve + noise * amplitude;

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

// ─── Green Particles (PS3-style) ──────────────────────────────────────────────

function GreenParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = 0;
    let H = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Dot {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      maxOpacity: number;
      life: number;
      maxLife: number;
    }

    const spawn = (): Dot => ({
      x:          Math.random() * W,
      y:          Math.random() * H,
      vx:         (Math.random() - 0.5) * 0.35,
      vy:         -(Math.random() * 0.55 + 0.1),
      size:       Math.random() * 2.2 + 0.5,
      opacity:    0,
      maxOpacity: Math.random() * 0.6 + 0.2,
      life:       0,
      maxLife:    Math.random() * 320 + 180,
    });

    const dots: Dot[] = Array.from({ length: 80 }, () => {
      const d = spawn();
      d.life = Math.random() * d.maxLife; // stagger initial positions
      return d;
    });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";

      for (const d of dots) {
        d.life += 1;
        d.x   += d.vx;
        d.y   += d.vy;

        const progress = d.life / d.maxLife;
        d.opacity =
          progress < 0.15
            ? (progress / 0.15) * d.maxOpacity
            : progress > 0.75
            ? ((1 - progress) / 0.25) * d.maxOpacity
            : d.maxOpacity;

        if (d.life >= d.maxLife || d.y < -10) {
          Object.assign(d, spawn(), { life: 0 });
        }

        // Glowing radial dot — green core, teal halo
        const r = d.size * 3.5;
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
        grad.addColorStop(0,   `rgba(80, 255, 160, ${d.opacity})`);
        grad.addColorStop(0.4, `rgba(16, 220, 120, ${d.opacity * 0.6})`);
        grad.addColorStop(1,   `rgba(20, 185, 130, 0)`);

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

// ─── Static particle dots (Framer Motion, scroll-independent) ────────────────

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

// ─── Main export ──────────────────────────────────────────────────────────────

export default function AnimatedBackground() {
  const { scrollY } = useScroll();
  const [bgState, setBgState] = useState<{
    isMounted: boolean;
    particles: Particle[];
  }>({
    isMounted: false,
    particles: [],
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
      setBgState({ isMounted: true, particles: generatedParticles });
    });
  }, []);

  const { isMounted, particles } = bgState;

  const blob1Y = useTransform(scrollY, [0, 3000], [0, -400]);
  const blob2Y = useTransform(scrollY, [0, 3000], [0, -250]);
  const blob3Y = useTransform(scrollY, [0, 3000], [0, -600]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Original sound waves */}
      {isMounted && <SoundWaves />}

      {/* PS3-style green floating particles */}
      {isMounted && <GreenParticles />}

      {/* Blob 1 — Top-left, deep emerald */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute -top-[20%] -left-[15%] w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full opacity-30 mix-blend-screen"
        animate={{ scale: [1, 1.15, 1], x: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-full h-full rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(6,95,70,0.4) 0%, rgba(6,78,59,0.15) 40%, transparent 70%)" }}
        />
      </motion.div>

      {/* Blob 2 — Center-right, purple tint */}
      <motion.div
        style={{ y: blob2Y }}
        className="absolute top-[30%] -right-[10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-25 mix-blend-screen"
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(88,28,135,0.35) 0%, rgba(88,28,135,0.1) 40%, transparent 70%)" }}
        />
      </motion.div>

      {/* Blob 3 — Bottom, deep green */}
      <motion.div
        style={{ y: blob3Y }}
        className="absolute top-[70%] left-[20%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-20 mix-blend-screen"
        animate={{ scale: [1, 1.1, 1], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 10 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,95,70,0.3) 0%, rgba(6,78,59,0.1) 40%, transparent 70%)" }}
        />
      </motion.div>

      {/* Framer Motion dust particles */}
      {isMounted && particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden mix-blend-screen">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-emerald-400/30 blur-[1px]"
              style={{ width: p.width, height: p.height, top: p.top, left: p.left }}
              animate={{ y: [0, p.animateY], opacity: [0, p.opacityMax, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
