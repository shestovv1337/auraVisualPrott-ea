import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, HelpCircle, Zap, CreditCard, Shield, Users, Sparkles, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  { category: "general", question: "Что такое Infinity?", answer: "Infinity — это визуальный мод для Minecraft 1.21.4 Fabric, включающий TargetESP, FreeLook, Particles, Trails, Prediction и многое другое. Он делает игру красивее и удобнее." },
  { category: "general", question: "На какой версии Minecraft работает?", answer: "На релизе будет версия 1.21.4 Fabric. Другие версии появятся в следующих обновлениях по результатам голосования в нашем Telegram." },
  { category: "general", question: "Совместим ли с другими модами?", answer: "Да, Infinity совместим с большинством популярных модов. При возникновении конфликтов обратитесь в поддержку @InfinitySupport." },
  { category: "general", question: "Даёт ли мод бан на серверах?", answer: "Infinity использует только визуальные функции без серверного вмешательства, поэтому риск бана минимален." },
  { category: "payment", question: "Сколько стоит Premium?", answer: "Цена будет объявлена при релизе. Можем точно сказать — дешевле, чем у конкурентов." },
  { category: "payment", question: "Как оплатить Premium?", answer: "Перейдите на страницу тарифов, нажмите «Купить», заполните данные и совершите оплату. Поддерживаются банковские карты, QIWI и ЮMoney." },
  { category: "payment", question: "Можно ли вернуть деньги?", answer: "Возврат возможен в течение 24 часов после покупки, если вы не использовали ключ. Обратитесь в поддержку." },
  { category: "payment", question: "Что даёт промокод?", answer: "Промокод даёт скидку на покупку Premium. Получить можно у наших медиа-партнёров." },
  { category: "keys", question: "Где найти мой ключ?", answer: "После оплаты ключ появится в личном кабинете в разделе «Мои ключи» и будет отправлен на email." },
  { category: "keys", question: "Ключ не работает, что делать?", answer: "Убедитесь, что правильно скопировали ключ. Если проблема остаётся — создайте тикет в поддержке." },
  { category: "keys", question: "Можно ли перенести ключ?", answer: "Нет, ключи привязаны к аккаунту покупателя и не подлежат передаче." },
  { category: "media", question: "Как стать медиа-партнёром?", answer: "Сними 1-3 видео с Infinity, добавь хештег #Infinity и напиши @hagenezuk0 в Telegram. Новички получают 20% с продаж, опытные — 25% + подписка навсегда." },
  { category: "media", question: "Сколько я заработаю?", answer: "Комиссия 20-25% с каждой покупки по вашему промокоду. Точный процент зависит от вашей аудитории." },
  { category: "media", question: "Как вывести деньги?", answer: "На сайте в личном кабинете. Минимальная сумма вывода — 100₽. Поддерживаются карты, QIWI и ЮMoney." },
  { category: "support", question: "Как создать тикет поддержки?", answer: "Личный кабинет → Поддержка → Новый тикет. Доступно только для Premium пользователей." },
  { category: "support", question: "Как быстро отвечают?", answer: "Обычно в течение 24 часов. Также можно написать @InfinitySupport в Telegram." },
];

const categories = [
  { id: "all", label: "Все", icon: HelpCircle },
  { id: "general", label: "Общие", icon: Zap },
  { id: "payment", label: "Оплата", icon: CreditCard },
  { id: "keys", label: "Ключи", icon: Shield },
  { id: "media", label: "Медиа", icon: Users },
  { id: "support", label: "Поддержка", icon: MessageCircle },
];

const FAQ = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (idx: number) => {
    setOpenItems(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const filtered = faqData.filter(f => {
    const matchCategory = activeCategory === "all" || f.category === activeCategory;
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Background effects */}
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-glow-secondary/3 rounded-full blur-[150px]" />

      <main className="pt-28 pb-20 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Sparkles size={14} />
              Помощь
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black mb-5 tracking-tight">
              Часто задаваемые <span className="gradient-text">вопросы</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Найдите ответ на свой вопрос или обратитесь в поддержку
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по вопросам..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl glass border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-all bg-card/60 backdrop-blur-xl"
            />
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-2 mb-10 flex-wrap">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeCategory === c.id
                    ? "bg-primary text-primary-foreground glow-box"
                    : "glass text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <c.icon size={14} />
                {c.label}
              </button>
            ))}
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filtered.map((item, idx) => (
              <motion.div
                key={`${item.category}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.03 }}
                className="rounded-xl glass overflow-hidden hover:border-primary/20 transition-colors"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <span className="font-medium text-sm pr-4 group-hover:text-primary transition-colors">{item.question}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                      openItems.includes(idx) ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openItems.includes(idx) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border/20 pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <HelpCircle size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Ничего не найдено. Попробуйте другой запрос.</p>
            </div>
          )}

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-14 rounded-2xl glass p-10 text-center glow-border">
            <h3 className="text-2xl font-bold mb-3">Не нашли ответ?</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Создайте тикет в личном кабинете или напишите в Telegram
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all glow-intense">
                Перейти в кабинет
              </Link>
              <a
                href="https://t.me/AuraVisualSupport"

                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl glass font-medium text-sm hover:border-primary/30 transition-all"
              >
                <MessageCircle size={16} className="text-primary" />
                @InfinitySupport
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
