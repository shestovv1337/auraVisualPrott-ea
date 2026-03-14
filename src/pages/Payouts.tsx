import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, DollarSign, Clock, Check, XCircle,
  Send, Wallet, TrendingUp, CreditCard
} from "lucide-react";
import logoImage from "@/assets/logo.jpg";
import { store, type PayoutRequest } from "@/lib/store";

const Payouts = () => {
  const [payouts, setPayouts] = useState(store.getPayouts());
  const promos = store.getPromos();

  // Calculate available balance (earned - already requested/paid)
  const totalEarnings = promos.reduce((s, p) => s + p.earnings, 0);
  const totalRequested = payouts
    .filter(p => p.status !== "rejected")
    .reduce((s, p) => s + p.amount, 0);
  const availableBalance = Math.max(0, totalEarnings - totalRequested);
  const totalPaid = payouts
    .filter(p => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  // Request form
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("card");
  const [details, setDetails] = useState("");

  const submitRequest = () => {
    if (amount <= 0 || amount > availableBalance || !details.trim()) return;
    store.addPayout({
      owner: "МедиаПартнёр",
      amount,
      method: method === "card" ? "Банковская карта" : method === "qiwi" ? "QIWI" : "ЮMoney",
      details: details.trim(),
    });
    setPayouts(store.getPayouts());
    setAmount(0);
    setDetails("");
    setShowForm(false);
  };

  const statusLabel = (s: PayoutRequest["status"]) =>
    s === "pending" ? "Ожидает" : s === "paid" ? "Выплачено" : "Отклонено";

  const statusClass = (s: PayoutRequest["status"]) =>
    s === "pending"
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      : s === "paid"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-destructive/10 text-destructive border-destructive/20";

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/media" className="flex items-center gap-2">
            <img src={logoImage} alt="Infinity" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">Выплаты</span>
            </span>
          </Link>
          <Link to="/media" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Медиа-партнёр
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: TrendingUp, label: "Всего заработано", value: `${totalEarnings.toLocaleString()}₽` },
              { icon: Wallet, label: "Доступно к выводу", value: `${availableBalance.toLocaleString()}₽` },
              { icon: DollarSign, label: "Выплачено", value: `${totalPaid.toLocaleString()}₽` },
            ].map(s => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl glass border border-border/30 p-5 text-center">
                <s.icon size={20} className="mx-auto mb-2 text-primary" />
                <p className="text-2xl font-black gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Request payout */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl glass border border-border/30 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Send size={20} className="text-primary" /> Запросить выплату
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                disabled={availableBalance <= 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DollarSign size={16} /> Вывести
              </button>
            </div>

            {availableBalance <= 0 && !showForm && (
              <p className="text-sm text-muted-foreground">У вас пока нет доступных средств для вывода.</p>
            )}

            {showForm && (
              <div className="space-y-3 mt-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Сумма (макс: {availableBalance.toLocaleString()}₽)</label>
                  <input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => setAmount(Math.min(Number(e.target.value), availableBalance))}
                    min={1}
                    max={availableBalance}
                    placeholder="0"
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Способ оплаты</label>
                  <div className="flex gap-2">
                    {[
                      { id: "card", label: "Карта", icon: CreditCard },
                      { id: "qiwi", label: "QIWI", icon: Wallet },
                      { id: "yoomoney", label: "ЮMoney", icon: DollarSign },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          method === m.id
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-secondary/30 text-muted-foreground border-border/30 hover:border-border/50"
                        }`}
                      >
                        <m.icon size={14} />
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Реквизиты (номер карты / кошелька)</label>
                  <input
                    type="text"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <button
                  onClick={submitRequest}
                  disabled={amount <= 0 || !details.trim()}
                  className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отправить запрос на {amount.toLocaleString()}₽
                </button>
              </div>
            )}
          </motion.div>

          {/* Payout history */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl glass border border-border/30 p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Clock size={20} className="text-primary" /> История выплат
            </h2>

            {payouts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Запросов на выплату пока нет</p>
            ) : (
              <div className="space-y-3">
                {payouts.map(p => (
                  <div key={p.id} className="rounded-xl border border-border/30 p-4 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusClass(p.status)}`}>
                          {p.status === "pending" && <Clock size={10} className="mr-1" />}
                          {p.status === "paid" && <Check size={10} className="mr-1" />}
                          {p.status === "rejected" && <XCircle size={10} className="mr-1" />}
                          {statusLabel(p.status)}
                        </span>
                        <span className="text-xs text-muted-foreground">{p.date}</span>
                      </div>
                      <p className="text-sm">
                        <span className="font-semibold">{p.amount.toLocaleString()}₽</span>
                        <span className="text-muted-foreground ml-2">· {p.method} · {p.details}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Per-promo breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl glass border border-border/30 p-6 mt-8">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-primary" /> Доход по промокодам
            </h2>
            <div className="space-y-3">
              {promos.map(p => (
                <div key={p.code} className="flex items-center justify-between rounded-lg bg-secondary/20 border border-border/20 p-4">
                  <div className="flex items-center gap-3">
                    <code className="font-mono font-bold text-sm">{p.code}</code>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      {p.commission}% комиссия
                    </span>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-muted-foreground">{p.uses} покупок · </span>
                    <span className="text-primary font-bold">{p.earnings.toLocaleString()}₽</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Payouts;
