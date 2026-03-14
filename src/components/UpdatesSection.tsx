import { motion } from "framer-motion";
import { Plus, Zap, MessageCircle } from "lucide-react";

const updates = [
  {
    date: "Февраль 2026",
    badge: "Новое",
    title: "Обновление Infinity",
    items: [
      "ShiftTap — автоматически нажимает shift при ударе",
      "LowHealth — предупреждает о низком здоровье",
      "AspectRatio — растяжение экрана без потери качества",
      "Protected — скрытие ника в табе и скорборде",
      "CustomFog — кастомный цвет тумана",
      "Custom HitBox — кастомный цвет заливки хит бокса",
      "Prediction — траектория жемчуга, стрел, трезубца",
    ],
  },
  {
    date: "Январь 2026",
    badge: "Функции",
    title: "Новые модули",
    items: [
      "ItemHelper — подсветка нужных предметов в инвентаре",
      "ViewModel — изменение положения предметов в руках",
      "TargetHud — информация о игроке (броня, HP, скин)",
      "CustomCrosshair — кастомный прицел по выбору",
    ],
  },
];

const UpdatesSection = () => {
  return (
    <section id="updates" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 section-glow" />
      <div className="absolute inset-0 noise-bg" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-3 block">changelog</span>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="gradient-text">Обновления</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Следи за развитием Infinity
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />

          <div className="space-y-6">
            {updates.map((update, i) => (
              <motion.div
                key={update.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-16 md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-[18px] md:left-[26px] top-8 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/30 ring-4 ring-background" />
                
                <div className="rounded-2xl glass p-7 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                      {update.badge}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{update.date}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-primary" />
                    {update.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {update.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm">
                        <Plus size={14} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Telegram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <a
            href="https://t.me/siriusvisual"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl glass font-semibold text-sm hover:border-primary/30 transition-all"
          >
            <MessageCircle size={16} className="text-primary" />
            Все новости в Telegram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default UpdatesSection;
