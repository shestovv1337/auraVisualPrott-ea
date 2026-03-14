import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, Play, ChevronLeft, ChevronRight, Pause } from "lucide-react";

import screenshot1 from "@/assets/gallery/screenshot-1.jpg";
import screenshot2 from "@/assets/gallery/screenshot-2.jpg";
import screenshot4 from "@/assets/gallery/screenshot-4.jpg";
import screenshot5 from "@/assets/gallery/screenshot-5.jpg";

type MediaItem = {
  type: "image" | "video";
  src: string;
  label: string;
};

const mediaItems: MediaItem[] = [
  { type: "image", src: screenshot1, label: "ItemHelper — подсветка предметов" },
  { type: "image", src: screenshot2, label: "ItemPhysics — реалистичная физика" },
  { type: "image", src: screenshot4, label: "Particles — настройка частиц" },
  { type: "image", src: screenshot5, label: "Crosshair Editor — кастомный прицел" },
  { type: "video", src: "/videos/video-1.mp4", label: "Обзор визуалов" },
  { type: "video", src: "/videos/video-2.mp4", label: "PvP демонстрация" },
  { type: "video", src: "/videos/video-3.mp4", label: "Настройка модулей" },
  { type: "video", src: "/videos/video-4.mp4", label: "Трейлы и эффекты" },
  { type: "video", src: "/videos/video-5.mp4", label: "Геймплей с модом" },
];

const GallerySection = () => {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [videoPlaying, setVideoPlaying] = useState<Record<number, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const navigate = useCallback((dir: number) => {
    setCurrent((prev) => (prev + dir + mediaItems.length) % mediaItems.length);
    setVideoPlaying({});
  }, []);

  const navigateLightbox = useCallback((dir: number) => {
    setLightbox((prev) => {
      if (prev === null) return null;
      return (prev + dir + mediaItems.length) % mediaItems.length;
    });
  }, []);

  const handleMainVideoClick = () => {
    const item = mediaItems[current];
    if (item.type === "video") {
      const video = videoRefs.current[current];
      if (video) {
        if (videoPlaying[current]) {
          video.pause();
          setVideoPlaying(prev => ({ ...prev, [current]: false }));
        } else {
          video.muted = false;
          video.play().then(() => {
            setVideoPlaying(prev => ({ ...prev, [current]: true }));
          }).catch(() => {
            video.muted = true;
            video.play().then(() => {
              setVideoPlaying(prev => ({ ...prev, [current]: true }));
            });
          });
        }
      }
    } else {
      setLightbox(current);
    }
  };

  const getVisibleRange = () => {
    const items: number[] = [];
    for (let i = -2; i <= 2; i++) {
      items.push((current + i + mediaItems.length) % mediaItems.length);
    }
    return items;
  };

  return (
    <section id="gallery" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(255_70%_65%_/_0.04)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-3 block">preview</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Превью</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Лучшие скриншоты и видео AuraVisual
          </p>
        </motion.div>

        {/* Main large preview with parallax */}
        <motion.div style={{ y: parallaxY }} className="relative max-w-5xl mx-auto mb-6">
          {/* Tech frame corners */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl z-20" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl z-20" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl z-20" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-2xl z-20" />

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/40 glow-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 cursor-pointer"
                onClick={handleMainVideoClick}
              >
                {mediaItems[current].type === "image" ? (
                  <img
                    src={mediaItems[current].src}
                    alt={mediaItems[current].label}
                    className="w-full h-full object-contain bg-card"
                  />
                ) : (
                  <video
                    ref={(el) => { videoRefs.current[current] = el; }}
                    src={mediaItems[current].src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={videoPlaying[current]}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
                      {mediaItems[current].type === "video" ? "video" : "screenshot"}
                    </span>
                    <h3 className="text-foreground font-bold text-lg">{mediaItems[current].label}</h3>
                  </div>
                  <span className="text-muted-foreground text-sm font-mono">
                    {current + 1} / {mediaItems.length}
                  </span>
                </div>
                {mediaItems[current].type === "video" && !videoPlaying[current] && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
                      <Play size={28} className="text-primary ml-1" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-all z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-all z-10"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* Thumbnail strip */}
        <div className="flex items-center justify-center gap-2 max-w-5xl mx-auto">
          {getVisibleRange().map((idx) => (
            <button
              key={`${idx}-${current}`}
              onClick={() => { setCurrent(idx); setVideoPlaying({}); }}
              className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                idx === current
                  ? "border-primary glow-border w-24 h-14 md:w-32 md:h-[72px]"
                  : "border-border/30 hover:border-primary/40 w-20 h-12 md:w-28 md:h-16 opacity-60 hover:opacity-100"
              }`}
            >
              {mediaItems[idx].type === "image" ? (
                <img
                  src={mediaItems[idx].src}
                  alt={mediaItems[idx].label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center relative">
                  <video src={mediaItems[idx].src} className="w-full h-full object-cover" muted preload="metadata" />
                  <Play size={14} className="text-primary absolute" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-4 right-4 text-foreground/70 hover:text-foreground transition-colors z-10"
            >
              <X size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-primary transition-colors z-10"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-primary transition-colors z-10"
            >
              <ChevronRight size={40} />
            </button>

            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {mediaItems[lightbox].type === "image" ? (
                <img
                  src={mediaItems[lightbox].src}
                  alt={mediaItems[lightbox].label}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <video
                  src={mediaItems[lightbox].src}
                  className="w-full rounded-lg"
                  controls
                  autoPlay
                  muted
                  playsInline
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
