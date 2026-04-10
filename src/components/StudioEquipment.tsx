"use client";

import { useTranslations } from "next-intl";
import { FiMic, FiSliders, FiMonitor, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

export default function StudioEquipment() {
  const t = useTranslations("Equipment");
  const sectionRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const equipmentList = [
    {
      id: "mic",
      icon: <FiMic className="w-8 h-8 md:w-10 md:h-10 text-foreground" />,
      title: t("mic"),
      desc: t("micDesc"),
    },
    {
      id: "interface",
      icon: <FiSliders className="w-8 h-8 md:w-10 md:h-10 text-foreground" />,
      title: t("interface"),
      desc: t("interfaceDesc"),
    },
    {
      id: "daw",
      icon: <FiMonitor className="w-8 h-8 md:w-10 md:h-10 text-foreground" />,
      title: t("daw"),
      desc: t("dawDesc"),
    },
    {
      id: "cabin",
      icon: <MdOutlineAirlineSeatReclineExtra className="w-8 h-8 md:w-10 md:h-10 text-foreground" />,
      title: t("cabin"),
      desc: t("cabinDesc"),
    }
  ];

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = 296; 
    let index = Math.round(el.scrollLeft / cardWidth);
    index = Math.max(0, Math.min(index, equipmentList.length - 1));
    setActiveIndex(index);
    if (el.scrollLeft > 10 && showHint) setShowHint(false);
  }, [equipmentList.length, showHint]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollDesktop = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.scrollWidth / equipmentList.length;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section id="about" ref={sectionRef} className="w-full py-16 md:py-24 px-4 sm:px-6 md:px-12 text-foreground relative z-20">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12 md:mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* ─── Mobile / Tablet: Swipeable Carousel ─── */}
        <div className="lg:hidden">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4 text-accent/80 text-xs font-medium"
            initial={{ opacity: 0 }}
            animate={isInView && showHint ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <motion.svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="text-accent"
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <span>{t("scrollHint")}</span>
          </motion.div>

          <div
            className="relative"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            }}
          >
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-4 pb-8 px-[50vw] -mx-[50vw] scrollbar-hide"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="w-[calc(50vw-140px)] shrink-0" aria-hidden="true" />
              {equipmentList.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 80, damping: 18, delay: i * 0.1 }}
                  className="snap-center shrink-0 w-[280px] group relative p-6 rounded-2xl glass-panel"
                >
                  <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                    <div className="p-4 rounded-full bg-accent/10 border border-accent/20 text-accent group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="w-[calc(50vw-140px)] shrink-0" aria-hidden="true" />
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {equipmentList.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full bg-accent"
                animate={{
                  width: activeIndex === i ? 20 : 6,
                  opacity: activeIndex === i ? 1 : 0.2,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ height: 6 }}
              />
            ))}
          </div>
        </div>

        {/* ─── Desktop: Grid with hover-visible arrows ─── */}
        <div className="hidden lg:block relative group/section">
          <button
            onClick={() => scrollDesktop("left")}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 opacity-0 group-hover/section:opacity-100 transition-all duration-300"
            aria-label="Previous equipment"
            data-cursor-hover
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-4 gap-6 md:gap-8">
            {equipmentList.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 80, damping: 18, delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative p-8 rounded-3xl glass-panel hover:border-accent/40 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                  <div className="p-5 rounded-full bg-white/5 border border-white/10 group-hover:bg-accent/20 group-hover:border-accent/50 group-hover:text-accent transition-all duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium group-hover:text-foreground/80 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
                
                {/* Ambient glow on hover */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 rounded-b-3xl transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scrollDesktop("right")}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 opacity-0 group-hover/section:opacity-100 transition-all duration-300"
            aria-label="Next equipment"
            data-cursor-hover
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
