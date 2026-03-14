import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Check, ShieldCheck, Tag, AlertCircle, Zap, Wallet, CreditCard, Banknote, Smartphone
} from "lucide-react";
import logoImage from "@/assets/logo.jpg";
import { store } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const planOptions = [
  { id: "30d", name: "30 дней", price: 99 },
  { id: "90d", name: "90 дней", price: 250 },
  { id: "180d", name: "180 дней", price: 399 },
  { id: "365d", name: "365 дней", price: 549 },
  { id: "forever", name: "Навсегда", price: 649 },
  { id: "hwid", name: "Сброс HWID", price: 99 },
];

const paymentMethods = [
  { id: "card", label: "Банковская карта", icon: CreditCard, desc: "Visa, MasterCard, МИР" },
  { id: "sbp", label: "СБП", icon: Smartphone, desc: "Оплата по QR-коду" },
  { id: "balance", label: "С баланса", icon: Wallet, desc: "500₽ доступно" },
  { id: "crypto", label: "Криптовалюта", icon: Banknote, desc: "BTC, ETH, USDT" },
];

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get("plan") || "forever";
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [purchased, setPurchased] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const plan = planOptions.find(p => p.id === selectedPlan) || planOptions[4];
  const discount = appliedPromo ? appliedPromo.discount : 0;
  const finalPrice = Math.round(plan.price * (1 - discount / 100));

  const applyPromo = () => {
    setPromoError("");
    if (!promoInput.trim()) return;
    const promo = store.findPromo(promoInput.trim());
    if (!promo) { setPromoError("Промокод не найден"); return; }
    if (!promo.active) { setPromoError("Промокод неактивен"); return; }
    if (promo.uses >= promo.maxUses) { setPromoError("Промокод исчерпан"); return; }
    setAppliedPromo({ code: promo.code, discount: promo.discount });
    toast({ title: "Промокод применён!", description: `Скидка ${promo.discount}%` });
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  const handlePayClick = () => {
    if (!showPayments) {
      setShowPayments(true);
      return;
    }
    if (!selectedPayment) {
      toast({ title: "Выберите способ оплаты", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      store.addPurchase({
        buyer: "User",
        email: "user@example.com",
        plan: plan.name,
        price: finalPrice,
        originalPrice: plan.price,
        promoCode: appliedPromo?.code || null,
        promoDiscount: appliedPromo?.discount || 0,
        commission: 0,
        date: new Date().toISOString().split("T")[0],
      });
      setProcessing(false);
      setPurchased(true);
    }, 1200);
  };

  if (purchased) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center rounded-2xl glass border border-primary/30 p-10">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-black mb-2">Оплата успешна!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Подписка <span className="text-primary font-semibold">{plan.name}</span> активирована.
            {appliedPromo && <><br />Промокод <code className="text-primary">{appliedPromo.code}</code> применён (-{appliedPromo.discount}%)</>}
          </p>
          <p className="text-3xl font-black gradient-text mb-6">{finalPrice}₽</p>
          <div className="flex gap-3">
            <Link to="/dashboard" className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center hover:bg-primary/90 transition-colors">
              В кабинет
            </Link>
            <Link to="/" className="flex-1 h-11 rounded-lg bg-secondary text-foreground font-semibold text-sm flex items-center justify-center hover:bg-secondary/80 transition-colors">
              На главную
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(255_70%_65%_/_0.06)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <Link to="/pricing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> К тарифам
        </Link>

        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-8">
              <img src={logoImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <h1 className="text-2xl font-black">Оформление</h1>
                <p className="text-sm text-muted-foreground">Безопасная оплата</p>
              </div>
            </div>

            {/* Plan selector */}
            <div className="rounded-xl glass border border-primary/20 p-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-primary" />
                <span className="font-bold text-sm">Выберите срок</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {planOptions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`relative px-4 py-3 rounded-xl text-left text-sm transition-all border ${
                      selectedPlan === p.id
                        ? "bg-primary/10 border-primary/40 text-primary glow-border"
                        : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-border/60"
                    }`}
                  >
                    <span className="font-bold block">{p.name}</span>
                    <span className="text-xs opacity-70">{p.price}₽</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="rounded-xl glass border border-border/30 p-5 mb-5">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Tag size={14} className="text-primary" /> Промокод</h3>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    <code className="font-mono font-bold text-sm">{appliedPromo.code}</code>
                    <span className="text-xs text-primary font-semibold">-{appliedPromo.discount}%</span>
                  </div>
                  <button onClick={removePromo} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Убрать</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" placeholder="Введите промокод" value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    className="flex-1 h-10 px-4 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-all" />
                  <button onClick={applyPromo} className="px-4 h-10 rounded-lg bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                    Применить
                  </button>
                </div>
              )}
              {promoError && <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle size={12} /> {promoError}</p>}
            </div>

            {/* Summary + Pay */}
            <div className="rounded-xl glass border border-primary/20 p-6">
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{plan.name}</span>
                  <span>{plan.price}₽</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-primary">
                    <span>Скидка ({appliedPromo.code})</span>
                    <span>-{plan.price - finalPrice}₽</span>
                  </div>
                )}
                <div className="border-t border-border/30 pt-2 flex justify-between font-bold text-lg">
                  <span>Итого</span>
                  <span className="gradient-text">{finalPrice}₽</span>
                </div>
              </div>

              {/* Payment methods with animation */}
              <AnimatePresence>
                {showPayments && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <p className="text-xs text-muted-foreground mb-3">Способ оплаты</p>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map((pm, i) => (
                        <motion.button
                          key={pm.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          onClick={() => setSelectedPayment(pm.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all border ${
                            selectedPayment === pm.id
                              ? "bg-primary/10 border-primary/40 text-primary"
                              : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-border/60"
                          }`}
                        >
                          <pm.icon size={18} />
                          <div>
                            <span className="font-semibold block text-xs">{pm.label}</span>
                            <span className="text-[10px] opacity-60">{pm.desc}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handlePayClick}
                disabled={processing}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all glow-box disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                    Обработка...
                  </motion.span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    {showPayments && selectedPayment ? `Оплатить ${finalPrice}₽` : `Перейти к оплате — ${finalPrice}₽`}
                  </>
                )}
              </button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                Нажимая кнопку, вы соглашаетесь с условиями использования
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
