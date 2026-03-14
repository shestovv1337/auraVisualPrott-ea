import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Calculator, Copy, Check, TrendingUp,
  Users, DollarSign, Percent, Gift, Plus, Trash2, Eye,
  Send, ExternalLink, Wallet, Crown, Star, BarChart3, Lock
} from "lucide-react";
import logoImage from "@/assets/logo.jpg";
import { store } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

type MediaTier = "free" | "plus";

const MediaPartner = () => {
  const [referrals, setReferrals] = useState(50);
  const [conversionRate, setConversionRate] = useState(15);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [promoCodes, setPromoCodes] = useState(store.getPromos());
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [mediaTier, setMediaTier] = useState<MediaTier>("free");
  const { toast } = useToast();

  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState(10);
  const [newMaxUses, setNewMaxUses] = useState(100);
  const [showAddForm, setShowAddForm] = useState(false);

  // Promo request form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqYoutuber, setReqYoutuber] = useState("");
  const [reqCode, setReqCode] = useState("");
  const [reqDiscount, setReqDiscount] = useState(10);
  const [reqMaxUses, setReqMaxUses] = useState(50);
  const [reqChannel, setReqChannel] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const refresh = () => setPromoCodes(store.getPromos());

  const pricePerSale = 260;
  // Media = 0% (бесплатный, не получает денег), Media+ = 15%
  const commissionPercent = mediaTier === "plus" ? 15 : 0;
  const estimatedBuyers = Math.round(referrals * (conversionRate / 100));
  const estimatedEarnings = estimatedBuyers * pricePerSale * (commissionPercent / 100);

  const totalEarnings = promoCodes.reduce((s, p) => s + p.earnings, 0);
  const totalBuyers = promoCodes.reduce((s, p) => s + p.uses, 0);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const addPromoCode = () => {
    if (!newCode.trim()) return;
    store.addPromo({ code: newCode.toUpperCase(), discount: newDiscount, commission: commissionPercent, maxUses: newMaxUses, active: true, owner: "МедиаПартнёр" });
    setNewCode("");
    setNewDiscount(10);
    setNewMaxUses(100);
    setShowAddForm(false);
    refresh();
  };

  const toggleCode = (code: string) => { store.togglePromo(code); refresh(); };
  const deleteCode = (code: string) => { store.deletePromo(code); refresh(); };

  // Analytics data (mock)
  const analyticsData = {
    dailySales: [3, 5, 2, 7, 4, 6, 8],
    topCodes: promoCodes.sort((a, b) => b.earnings - a.earnings).slice(0, 3),
    conversionRate: 12.5,
    avgOrderValue: 234,
    weeklyGrowth: "+18%",
    returningBuyers: 34,
    bestDay: "Суббота",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="Infinity" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">Медиа</span>Партнёр
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {mediaTier === "plus" && (
              <Link to="/payouts" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-semibold">
                <Wallet size={16} /> Выплаты
              </Link>
            )}
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft size={16} /> Кабинет
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Media tier selector */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMediaTier("free")}
                className={`rounded-xl p-5 text-left transition-all border ${
                  mediaTier === "free"
                    ? "glass border-primary/30 glow-border"
                    : "glass border-border/30 hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Star size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Медиа</h3>
                    <span className="text-xs text-green-400 font-semibold">Бесплатно</span>
                  </div>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 mt-3">
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-primary shrink-0" /> Бесплатная подписка навсегда</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-primary shrink-0" /> Реферальные промокоды</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-primary shrink-0" /> Базовая статистика использований</li>
                  <li className="flex items-center gap-1.5 opacity-50"><Lock size={12} className="shrink-0" /> Без комиссии с продаж</li>
                </ul>
              </button>

              <button
                onClick={() => setMediaTier("plus")}
                className={`rounded-xl p-5 text-left transition-all border relative ${
                  mediaTier === "plus"
                    ? "glass border-primary/30 glow-border"
                    : "glass border-border/30 hover:border-primary/20"
                }`}
              >
                <div className="absolute -top-2 right-4 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  PRO
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Crown size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Медиа+</h3>
                    <span className="text-xs text-primary font-semibold">Платная подписка</span>
                  </div>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 mt-3">
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-primary shrink-0" /> 15% комиссия с каждой продажи</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-primary shrink-0" /> Расширенная аналитика и графики</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-primary shrink-0" /> Вывод заработка на карту/QIWI</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-primary shrink-0" /> Приоритетная модерация заявок</li>
                </ul>
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className={`grid ${mediaTier === "plus" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2"} gap-4 mb-10`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl glass border border-border/30 p-5 text-center">
              <Users size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-2xl font-black gradient-text">{totalBuyers}</p>
              <p className="text-xs text-muted-foreground mt-1">Использований</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl glass border border-border/30 p-5 text-center">
              <Gift size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-2xl font-black gradient-text">{promoCodes.filter(c => c.active).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Активных кодов</p>
            </motion.div>
            {mediaTier === "plus" && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl glass border border-border/30 p-5 text-center">
                  <DollarSign size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-black gradient-text">{totalEarnings.toLocaleString()}₽</p>
                  <p className="text-xs text-muted-foreground mt-1">Заработано</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl glass border border-border/30 p-5 text-center">
                  <TrendingUp size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-black gradient-text">{commissionPercent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Комиссия</p>
                </motion.div>
              </>
            )}
          </div>

          {/* Analytics (Media+ only) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl glass border border-border/30 p-6 mb-10 relative">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <BarChart3 size={20} className="text-primary" /> {mediaTier === "plus" ? "Аналитика продаж" : "Статистика"}
            </h2>
            
            {mediaTier === "plus" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg bg-secondary/30 border border-border/20 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Конверсия</p>
                    <p className="text-2xl font-black gradient-text">{analyticsData.conversionRate}%</p>
                  </div>
                  <div className="rounded-lg bg-secondary/30 border border-border/20 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Средний чек</p>
                    <p className="text-2xl font-black gradient-text">{analyticsData.avgOrderValue}₽</p>
                  </div>
                  <div className="rounded-lg bg-secondary/30 border border-border/20 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Рост за неделю</p>
                    <p className="text-2xl font-black text-green-400">{analyticsData.weeklyGrowth}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/30 border border-border/20 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Лучший день</p>
                    <p className="text-2xl font-black gradient-text">{analyticsData.bestDay}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/30 border border-border/20 p-4">
                  <p className="text-xs text-muted-foreground mb-3">Продажи за неделю</p>
                  <div className="flex items-end gap-1 h-24">
                    {analyticsData.dailySales.map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{val}</span>
                        <div
                          className="w-full rounded-t bg-primary/40 transition-all hover:bg-primary/60"
                          style={{ height: `${(val / 8) * 100}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {analyticsData.topCodes.length > 0 && (
                  <div className="rounded-lg bg-secondary/30 border border-border/20 p-4">
                    <p className="text-xs text-muted-foreground mb-3">Топ промокодов по заработку</p>
                    <div className="space-y-2">
                      {analyticsData.topCodes.map((code, i) => (
                        <div key={code.code} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-primary font-mono font-bold">#{i + 1}</span>
                            <code className="font-mono text-xs">{code.code}</code>
                          </div>
                          <span className="text-primary font-semibold text-xs">{code.earnings}₽</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-secondary/30 border border-border/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Всего использований ваших кодов</p>
                  <p className="text-4xl font-black gradient-text">{totalBuyers}</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/15 p-5 flex flex-col items-center text-center">
                  <Lock size={28} className="text-muted-foreground mb-3" />
                  <p className="font-semibold text-sm mb-1">Заработок доступен в Медиа+</p>
                  <p className="text-xs text-muted-foreground mb-4">С Медиа+ вы получаете 15% комиссию с каждой продажи по вашему промокоду, а также графики, конверсию и вывод средств.</p>
                  <button
                    onClick={() => { setMediaTier("plus"); toast({ title: "Медиа+ активирован", description: "Теперь вы получаете 15% с продаж" }); }}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Перейти на Медиа+
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Calculator (Media+ only) */}
          {mediaTier === "plus" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl glass border border-border/30 p-6 mb-10">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Calculator size={20} className="text-primary" /> Калькулятор заработка
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Переходов в месяц</span>
                      <span className="font-semibold">{referrals}</span>
                    </div>
                    <input type="range" min={10} max={500} value={referrals} onChange={(e) => setReferrals(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Конверсия (%)</span>
                      <span className="font-semibold">{conversionRate}%</span>
                    </div>
                    <input type="range" min={1} max={50} value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Цена продукта: <span className="text-foreground">{pricePerSale}₽</span></p>
                    <p>Ваша комиссия: <span className="text-primary">{commissionPercent}%</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-primary/5 border border-primary/15 p-8">
                  <p className="text-sm text-muted-foreground mb-1">Ожидаемый доход</p>
                  <p className="text-4xl font-black gradient-text">{estimatedEarnings.toLocaleString()}₽</p>
                  <p className="text-xs text-muted-foreground mt-2">~{estimatedBuyers} покупателей/мес</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Promo codes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl glass border border-border/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Percent size={20} className="text-primary" /> Мои промокоды
              </h2>
              <button onClick={() => setShowAddForm(!showAddForm)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Создать
              </button>
            </div>

            {showAddForm && (
              <div className="rounded-lg bg-secondary/30 border border-border/30 p-4 mb-6 space-y-3">
                <input type="text" placeholder="Код (напр. MYCODE10)" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Скидка (%)</label>
                    <input type="number" value={newDiscount} onChange={(e) => setNewDiscount(Number(e.target.value))} min={1} max={50} className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Макс. использований</label>
                    <input type="number" value={newMaxUses} onChange={(e) => setNewMaxUses(Number(e.target.value))} min={1} className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                </div>
                <button onClick={addPromoCode} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Добавить промокод
                </button>
              </div>
            )}

            <div className="space-y-3">
              {promoCodes.map((promo) => (
                <div key={promo.code}>
                  <div className={`rounded-xl border p-4 transition-all ${promo.active ? "glass border-border/30 hover:border-primary/20" : "bg-secondary/20 border-border/20 opacity-60"}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <code className="text-sm font-mono font-bold">{promo.code}</code>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">-{promo.discount}%</span>
                        {mediaTier === "plus" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Комиссия: {promo.commission}%</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${promo.active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-muted text-muted-foreground border border-border/30"}`}>
                          {promo.active ? "Активен" : "Неактивен"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs">
                          <span className="text-muted-foreground">{promo.uses}/{promo.maxUses} исп.</span>
                          {mediaTier === "plus" && <span className="ml-2 text-primary font-semibold">{promo.earnings}₽</span>}
                        </div>
                        <button onClick={() => setExpandedCode(expandedCode === promo.code ? null : promo.code)} className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => copyCode(promo.code)} className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all">
                          {copiedCode === promo.code ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                        </button>
                        <button onClick={() => toggleCode(promo.code)} className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all">
                          {promo.active ? "⏸" : "▶"}
                        </button>
                        <button onClick={() => deleteCode(promo.code)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {expandedCode === promo.code && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="ml-4 mt-2 rounded-lg bg-secondary/20 border border-border/20 p-4 text-sm">
                      <p className="font-semibold mb-2">Покупатели ({promo.buyers.length}):</p>
                      {promo.buyers.length === 0 ? (
                        <p className="text-muted-foreground text-xs">Пока нет покупок по этому коду</p>
                      ) : (
                        <div className="space-y-1">
                          {promo.buyers.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                              {b}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Promo request form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl glass border border-border/30 p-6 mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Send size={20} className="text-primary" /> Подать заявку на промокод
              </h2>
              <button onClick={() => setShowRequestForm(!showRequestForm)} className="text-sm text-primary hover:underline">
                {showRequestForm ? "Скрыть" : "Заполнить заявку"}
              </button>
            </div>

            {requestSent ? (
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-center">
                <Check size={24} className="mx-auto mb-2 text-primary" />
                <p className="font-semibold text-sm">Заявка отправлена!</p>
                <p className="text-xs text-muted-foreground mt-1">Куратор рассмотрит вашу заявку в ближайшее время.</p>
                <button onClick={() => { setRequestSent(false); setShowRequestForm(false); }} className="text-xs text-primary hover:underline mt-2">
                  Отправить ещё
                </button>
              </div>
            ) : showRequestForm ? (
              <div className="space-y-3">
                <input type="text" placeholder="Ваш никнейм / имя канала" value={reqYoutuber} onChange={(e) => setReqYoutuber(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                <input type="text" placeholder="Желаемый промокод (напр. MYCODE10)" value={reqCode} onChange={(e) => setReqCode(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                <div className="flex items-center gap-2">
                  <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                  <input type="url" placeholder="Ссылка на YouTube канал" value={reqChannel} onChange={(e) => setReqChannel(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Скидка (%)</label>
                    <input type="number" value={reqDiscount} onChange={(e) => setReqDiscount(Number(e.target.value))} min={5} max={30} className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Макс. использований</label>
                    <input type="number" value={reqMaxUses} onChange={(e) => setReqMaxUses(Number(e.target.value))} min={10} max={500} className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!reqYoutuber.trim() || !reqCode.trim() || !reqChannel.trim()) return;
                    store.addRequest({ youtuber: reqYoutuber.trim(), code: reqCode.toUpperCase().trim(), discount: reqDiscount, maxUses: reqMaxUses, channelUrl: reqChannel.trim() });
                    setReqYoutuber(""); setReqCode(""); setReqChannel(""); setReqDiscount(10); setReqMaxUses(50);
                    setRequestSent(true);
                  }}
                  disabled={!reqYoutuber.trim() || !reqCode.trim() || !reqChannel.trim()}
                  className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отправить заявку
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ютуберы и стримеры могут подать заявку на персональный промокод. После одобрения куратором код станет активным.
              </p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MediaPartner;
