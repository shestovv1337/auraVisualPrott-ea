import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, Download, Star, Cpu } from "lucide-react";

const stats = [
  { icon: Download, value: 1100, suffix: "+", label: "Скачиваний", accent: "from-primary/20 to-primary/5" },
  { icon: Users, value: 270, suffix: "+", label: "Активных игроков", accent: "from-blue-500/20 to-blue-500/5" },
  { icon: Star, value: 56, suffix: "", label: "Модулей", accent: "from-amber-500/20 to-amber-500/5" },
  { icon: Cpu, value: 99, suffix: "%", label: "Стабильность", accent: "from-emerald-500/20 to-emerald-500/5" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {displayed.toLocaleString()}{suffix}
    </span>
  );
}

const StatsSection = () => {
  return (
    <section id="stats" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 section-glow" />
      {/* Horizontal accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl p-6 glass hover:border-primary/20 transition-all duration-500"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon size={20} className="text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-black gradient-text mb-1.5">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </section>
  );
};

export default StatsSection;
