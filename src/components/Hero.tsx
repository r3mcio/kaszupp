"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

function SplitText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotateX: -80 }}
            animate={{ y: "0%", rotateX: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.15 + wordIndex * 0.08,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="w-full flex flex-col items-center justify-center gap-6 text-center px-4 min-h-[90vh] relative z-10 pt-20 pb-16 overflow-hidden">

      {/* Ambient background glow for neon/emerald feel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] -z-10 pointer-events-none" 
      />

      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.95]">
        <SplitText text={t("title")} />
      </h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.6 }}
        className="max-w-2xl mx-auto mt-4 text-lg md:text-2xl text-muted-foreground font-medium"
      >
        {t("subtitle")}
      </motion.p>
      
      <motion.button
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.8 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="mt-8 px-10 py-5 bg-accent text-accent-foreground font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_0_30px_hsla(var(--accent),0.4)] hover:shadow-[0_0_50px_hsla(var(--accent),0.7)] hover:bg-emerald-400"
        data-cursor-hover
      >
        {t("cta")}
      </motion.button>
      
    </section>
  );
}
