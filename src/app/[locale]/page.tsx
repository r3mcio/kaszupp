import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import VideoDemosSection from "@/components/VideoDemosSection";
import InfiniteLogoTicker from "@/components/InfiniteLogoTicker";
import PortfolioGrid from "@/components/PortfolioGrid";
import StudioEquipment from "@/components/StudioEquipment";
import DirectContact from "@/components/DirectContact";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import FilmGrain from "@/components/FilmGrain";
import CustomCursor from "@/components/CustomCursor";
import ScrollReveal from "@/components/ScrollReveal";
import AboutMe from "@/components/AboutMe";

export default function Home() {
  return (
    <div id="home" className="flex min-h-screen flex-col bg-black font-sans text-zinc-100 overflow-hidden relative">
      {/* Atmospheric layers */}
      <AnimatedBackground />
      <FilmGrain />
      <CustomCursor />

      {/* Content (z-10 to sit above background) */}
      <Navigation />
      <main className="flex w-full flex-col items-center justify-start pt-0 lg:pt-8 relative z-10">
        
        {/* Hero — full-screen on mobile */}
        <div className="w-full max-w-screen-2xl mx-auto">
          <Hero />
        </div>



        {/* Ticker — full-viewport-width */}
        <InfiniteLogoTicker />

        {/* Content sections */}
        <div className="w-full max-w-screen-2xl mx-auto">
          <ScrollReveal delay={0.05}>
            <AboutMe />
          </ScrollReveal>

          {/* Video Demos Section */}
          <ScrollReveal delay={0.1}>
            <VideoDemosSection />
          </ScrollReveal>

          <PortfolioGrid />
          
          <ScrollReveal delay={0.05}>
            <StudioEquipment />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <DirectContact />
          </ScrollReveal>
        </div>
      </main>
      
      <ScrollReveal className="relative z-10">
        <Footer />
      </ScrollReveal>
    </div>
  );
}
