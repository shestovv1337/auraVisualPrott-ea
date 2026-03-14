import { motion, useScroll, useTransform } from "framer-motion";
import { Palette, Gauge, Swords, Headphones, Shield, Zap } from "lucide-react";
import { useRef } from "react";
import screenshot3 from "@/assets/gallery/screenshot-3.jpg";
import screenshot4 from "@/assets/gallery/screenshot-4.jpg";

const advantages = [
  { icon: Headphones, title: "Поддержка 24/7", desc: "Быстрая техническая поддержка — отвечаем круглосуточно без выходных.", num: "01" },
  { icon: Palette, title: "Дизайн", desc: "Элегантный минималистичный интерфейс, который не мешает геймплею.", num: "02" },
  { icon: Gauge, title: "Производительность", desc: "Оптимизированный код для высокого FPS даже на слабых компьютерах.", num: "03" },
  { icon: Swords, title: "PvP преимущества", desc: "Лучшие визуалы для PvP: частицы, трейлы, ESP и предикшн.", num: "04" },
  { icon: Shield, title: "Безопасность", desc: "Мод не даёт бан — только визуальные функции без серверного вмешательства.", num: "05" },
  { icon: Zap, title: "Быстрые обновления", desc: "Поддержка актуальных версий Minecraft — обновления в первые дни.", num: "06" },
];

const AdvantagesSection = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="advantages" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={screenshot4} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/94" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>
      <div className="absolute inset-0 noise-bg" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-3 block">why us</span>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Преимущества <span className="gradient-text">нашего мода</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Мощный набор функций для комфорта и стиля
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl p-7 glass hover:border-primary/30 transition-all duration-500 hover:translate-y-[-2px]"
            >
              <div className="relative">
                <span className="absolute -top-1 -right-1 text-5xl font-black text-primary/[0.06] group-hover:text-primary/[0.12] transition-colors font-mono select-none">
                  {adv.num}
                </span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
                  <adv.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{adv.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{adv.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large feature showcase with parallax */}
        <div ref={imgRef} className="mt-16 max-w-5xl mx-auto">
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/30 glow-border">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl z-10" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl z-10" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl z-10" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-primary/40 rounded-br-2xl z-10" />
              
              <img src={screenshot3} alt="AuraVisual в игре" className="w-full aspect-video object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">screenshot</span>
                  <h3 className="text-foreground font-bold text-xl mt-1">AuraVisual в действии</h3>
                </div>
                <span className="text-xs text-muted-foreground font-mono">1920×1080</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
