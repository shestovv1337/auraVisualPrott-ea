import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import offVisual from "@/assets/offvisual.png";
import onVisual from "@/assets/onvisual.png";

const BeforeAfterSection = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) updatePosition(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(255_70%_65%_/_0.04)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-3 block">comparison</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            AuraVisual <span className="gradient-text">в действии</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Сравни геймплей до и после активации мода
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Tech corners */}
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl z-20" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl z-20" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl z-20" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-2xl z-20" />

            <div
              ref={containerRef}
              className="relative aspect-video rounded-2xl overflow-hidden border border-border/40 glow-border cursor-col-resize select-none"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onClick={(e) => updatePosition(e.clientX)}
            >
              {/* After (full) */}
              <img
                src={onVisual}
                alt="С AuraVisual"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              {/* Before (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={offVisual}
                  alt="Без AuraVisual"
                  className="absolute top-0 left-0 h-full object-cover"
                  style={{ width: `${containerWidth}px`, maxWidth: "none" }}
                  draggable={false}
                />
              </div>

              {/* Slider line */}
              <div
                className="absolute top-0 bottom-0 z-10"
                style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-0.5 h-full bg-primary/80 shadow-[0_0_10px_hsl(255_70%_65%_/_0.5)]" />
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm border-2 border-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
                  <div className="flex items-center gap-0.5">
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-primary" />
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-primary" />
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">
                Без мода
              </div>
              <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/40 text-xs font-bold font-mono uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles size={12} />
                С AuraVisual
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
