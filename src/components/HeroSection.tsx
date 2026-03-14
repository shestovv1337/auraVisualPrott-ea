import { motion } from "framer-motion";
import { ChevronDown, Play, Sparkles, ArrowDown } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.jpg";
import screenshot1 from "@/assets/gallery/screenshot-1.jpg";

const HeroSection = () => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = false;
    video.play().then(() => {
      setPlaying(true);
    }).catch(() => {
      video.muted = true;
      video.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        video.controls = true;
        setPlaying(true);
      });
    });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 noise-bg" />
      
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/6 rounded-full blur-[200px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-glow-secondary/4 rounded-full blur-[180px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/3 rounded-full blur-[250px]" />
      
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          hsl(255 70% 65% / 0.5),
          hsl(255 70% 65% / 0.5) 1px,
          transparent 1px,
          transparent 80px
        )`
      }} />

      <div className="container mx-auto px-4 text-center relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/15 rounded-3xl blur-3xl animate-pulse-glow" />
              <img
                src={logoImage}
                alt="Infinity логотип"
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover relative z-10 ring-2 ring-primary/30 shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 40px hsl(255 70% 65% / 0.4))' }}
              />
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/8 border border-primary/20 text-primary text-sm font-medium mb-10 backdrop-blur-sm"
          >
            <Sparkles size={14} className="animate-pulse-glow" />
            <span className="font-mono text-xs tracking-wider">v1.21.4 Fabric</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            <span className="block text-foreground/60 text-2xl md:text-3xl font-mono font-normal tracking-widest uppercase mb-4">— minecraft mod —</span>
            <span className="block">Лучший мод для</span>
            <span className="block mt-1">
              <span className="relative inline-block">
                <span className="gradient-text">комфортной</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0 9C50 3 100 3 200 9" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
              {" "}игры
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed mb-12">
            Плавный геймплей, продуманный интерфейс и визуалы,
            которые не мешают — а помогают побеждать.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            to="/pricing"
            className="group relative inline-flex items-center justify-center h-14 px-10 rounded-xl bg-primary text-primary-foreground font-bold text-base transition-all hover:scale-105 glow-intense overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              Купить
              <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </span>
          </Link>
          <a
            href="https://discord.gg/rPsjGJmFu8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-14 px-10 rounded-xl glass-heavy font-medium text-base hover:bg-card/90 transition-all hover:border-primary/30"
          >
            Дискорд сервер
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-8 bg-primary/8 rounded-3xl blur-3xl" />
          <div className="absolute -inset-1 rounded-2xl animated-border" />
          
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-2xl z-20" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-2xl z-20" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-2xl z-20" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-2xl z-20" />
          
          <div className="relative rounded-2xl overflow-hidden border border-border/30 shadow-2xl bg-card/40 backdrop-blur-sm"
            style={{ boxShadow: '0 25px 80px -20px hsl(255 70% 65% / 0.2), 0 0 0 1px hsl(230 10% 14% / 0.5)' }}
          >
            <video
              ref={videoRef}
              src="/videos/video-1.mp4"
              className="w-full h-full object-cover aspect-video"
              muted
              loop
              playsInline
              preload="auto"
              controls={playing}
            />
            {!playing && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                onClick={handlePlay}
              >
                <img src={screenshot1} alt="Infinity геймплей" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="relative w-20 h-20 rounded-full bg-primary/25 backdrop-blur-md flex items-center justify-center border border-primary/40 group-hover:scale-110 group-hover:bg-primary/35 transition-all">
                  <Play size={36} className="text-primary ml-1" />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 text-muted-foreground hover:text-primary transition-colors animate-float"
      >
        <ChevronDown size={32} />
      </motion.a>
    </section>
  );
};

export default HeroSection;
