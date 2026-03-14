import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, Clock, Crown, Sparkles, Star, RotateCcw, Zap, Gem, Rocket, Infinity, User, Key, Wallet, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const plans = [
  { name: "30 дней", price: 99, period: "1 месяц", desc: "Попробуй все возможности мода", icon: Clock, popular: false },
  { name: "90 дней", price: 250, period: "3 месяца", desc: "Оптимальный вариант для активных игроков", icon: Zap, popular: false },
  { name: "180 дней", price: 399, period: "6 месяцев", desc: "Полгода комфортной игры", icon: Star, popular: true },
  { name: "365 дней", price: 549, period: "1 год", desc: "Максимальная выгода на год", icon: Crown, popular: false },
  { name: "Навсегда", price: 649, period: "∞", desc: "Один раз — и навсегда", icon: Infinity, popular: false },
  { name: "Сброс HWID", price: 99, period: "разово", desc: "Сброс привязки к устройству", icon: RotateCcw, popular: false, isHwid: true },
];

const allFeatures = [
  "Все модули Combat, Visual, Misc",
  "Кастомные частицы и трейлы",
  "TargetESP и Prediction",
  "Приоритетная поддержка 24/7",
  "Ранний доступ к обновлениям",
  "Все будущие модули бесплатно",
];

const faqItems = [
  { q: "Как получить ключ?", a: "После оплаты ключ появится в личном кабинете автоматически." },
  { q: "Как активировать мод?", a: "Скачайте мод в личном кабинете." },
  { q: "На какой версии мод?", a: "На релизе будет версия 1.21.4 Fabric. Другие версии появятся в следующих обновлениях." },
  { q: "Что такое сброс HWID?", a: "HWID привязывает ключ к вашему компьютеру. Сброс позволяет перенести лицензию на другое устройство." },
];

type DeliveryMethod = "account" | "key";
type PaymentMethod = "balance" | "direct";

const Pricing = () => {
  const [delivery, setDelivery] = useState<DeliveryMethod>("account");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("balance");
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);
  const [balance] = useState(500); // Mock balance — synced with Dashboard
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBuy = (plan: typeof plans[0]) => {
    if (paymentMethod === "direct") {
      navigate("/checkout");
      return;
    }
    // Balance payment
    if (balance < plan.price) {
      toast({ title: "Недостаточно средств", description: `Нужно ${plan.price}₽, на балансе ${balance}₽. Пополните баланс в личном кабинете.`, variant: "destructive" });
      return;
    }
    setBuyingPlan(plan.name);
    setTimeout(() => {
      toast({ title: "Подписка оформлена!", description: `${plan.name} — ${plan.price}₽ списано с баланса` });
      setBuyingPlan(null);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-glow-secondary/3 rounded-full blur-[180px]" />
      
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          hsl(255 70% 65% / 0.5),
          hsl(255 70% 65% / 0.5) 1px,
          transparent 1px,
          transparent 80px
        )`
      }} />

      <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">pricing</span>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles size={14} />
            Простые тарифы
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black mb-5 tracking-tight">
            Выбери свой <span className="gradient-text">план</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Все тарифы включают полный доступ ко всем модулям
          </p>
        </motion.div>

        {/* Delivery + Payment toggles */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <div className="inline-flex rounded-xl glass border border-border/30 p-1">
            {[
              { id: "account" as DeliveryMethod, label: "На аккаунт", icon: User },
              { id: "key" as DeliveryMethod, label: "Ключом", icon: Key },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setDelivery(method.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  delivery === method.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <method.icon size={16} />
                {method.label}
              </button>
            ))}
          </div>

          {/* Payment method toggle */}
          <div className="inline-flex rounded-xl glass border border-border/30 p-1">
            {[
              { id: "balance" as PaymentMethod, label: `С баланса (${balance}₽)`, icon: Wallet },
              { id: "direct" as PaymentMethod, label: "Прямая оплата", icon: ShieldCheck },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  paymentMethod === method.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <method.icon size={16} />
                {method.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className={`relative rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px] ${
                plan.popular
                  ? "glass border-primary/30 glow-border"
                  : plan.isHwid
                  ? "glass border-border/30 border-dashed"
                  : "glass"
              }`}
            >
              {plan.popular && (
                <>
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary/50 rounded-tl-2xl" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary/50 rounded-tr-2xl" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary/50 rounded-bl-2xl" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary/50 rounded-br-2xl" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold font-mono tracking-widest">
                    BEST VALUE
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.popular ? "bg-primary/15" : plan.isHwid ? "bg-secondary/80" : "bg-secondary"
                }`}>
                  <plan.icon size={20} className={plan.popular ? "text-primary" : "text-muted-foreground"} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{plan.period}</p>
                </div>
              </div>

              <div className="mb-1">
                <span className={`text-4xl font-black font-mono ${plan.popular ? "gradient-text" : ""}`}>{plan.price}₽</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">{plan.desc}</p>

              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-5" />

              <button
                onClick={() => handleBuy(plan)}
                disabled={buyingPlan === plan.name}
                className={`group w-full h-11 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-intense"
                    : plan.isHwid
                    ? "glass border border-border/50 text-foreground hover:border-primary/30"
                    : "glass border border-border/50 text-foreground hover:border-primary/30 hover:text-primary"
                } disabled:opacity-50`}
              >
                {plan.popular && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {buyingPlan === plan.name ? (
                    "Оформляем..."
                  ) : paymentMethod === "balance" ? (
                    <><Wallet size={16} /> {plan.isHwid ? "Сбросить" : "Купить"} с баланса</>
                  ) : (
                    plan.isHwid ? "Сбросить" : "Купить"
                  )}
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* All features included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <div className="rounded-2xl glass border border-primary/15 p-8">
            <h3 className="text-center font-bold text-lg mb-6">
              <span className="font-mono text-primary text-xs tracking-widest uppercase block mb-2">included</span>
              Все тарифы включают
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-foreground/80">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <span className="text-primary font-mono text-sm tracking-widest uppercase mb-3 block">faq</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Частые <span className="gradient-text">вопросы</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                className="rounded-xl glass p-6 hover:border-primary/20 transition-colors border-l-2 border-l-primary/20 hover:border-l-primary/40"
              >
                <h3 className="font-bold text-sm mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
