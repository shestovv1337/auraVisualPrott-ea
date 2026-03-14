import { motion } from "framer-motion";
import { Video, DollarSign, TrendingUp, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Video,
    step: "01",
    title: "Сними видео",
    desc: "Обзор, PvP, PvE — любой формат с AuraVisual. Добавь хештег #AuraVisual",
  },
  {
    icon: TrendingUp,
    step: "02",
    title: "Получи промокод",
    desc: "Новички: 15% с продаж + подписка. Есть аудитория? Обсудим лично для вас",
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Выводи деньги",
    desc: "Вывод от 100₽ прямо на сайте в личном кабинете",
  },
];

const MediaSection = () => {
  return (
    <section id="media" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 section-glow" />
      <div className="absolute inset-0 noise-bg" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-3 block">partnership</span>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Снимай видео — <span className="gradient-text">зарабатывай</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Медиа-программа AuraVisual: снимай контент и получай процент от продаж
          </p>
        </motion.div>

        {/* Steps — connected with line */}
        <div className="relative max-w-4xl mx-auto mb-12">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative rounded-2xl p-8 glass text-center hover:border-primary/30 transition-all duration-300 hover:translate-y-[-2px]"
              >
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 mt-2 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
                  <item.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="rounded-xl glass p-6 text-sm text-muted-foreground border-l-2 border-l-primary/40">
            <p className="font-semibold text-foreground mb-3">⚠️ Запрещено:</p>
            <ul className="space-y-1.5">
              <li>• Накрутка просмотров, лайков или комментариев</li>
              <li>• Скрытие статистики или комментариев</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/media"
            className="group inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-primary/10 border border-primary/30 text-primary font-semibold hover:bg-primary/20 transition-all"
          >
            Стать медиа-партнёром
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="https://discord.gg/rPsjGJmFu8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl glass font-medium text-sm hover:border-primary/30 transition-all"
          >
            <MessageCircle size={16} className="text-primary" />
            Подать заявку — Discord
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MediaSection;
