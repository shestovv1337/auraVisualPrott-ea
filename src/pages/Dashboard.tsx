import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Key, ShoppingCart, MessageSquare, User, LogOut,
  Copy, Check, ChevronRight, Clock, AlertCircle,
  Shield, Crown, Send, Plus, HelpCircle, Download, Store,
  Wallet, Upload, CreditCard, Star, BarChart3, Percent
} from "lucide-react";
import logoImage from "@/assets/logo.jpg";
import { store, type TicketCategory, type ConfigItem } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

type Tab = "keys" | "purchases" | "support" | "profile" | "download" | "configs" | "media_stats" | "media_promos";

const mockUser = {
  username: "Player123",
  email: "player@example.com",
  role: "user" as "user" | "media" | "media_plus",
  joined: "2026-01-15",
  subscription: "Premium",
};

const mockKeys = [
  { id: "AV-XXXX-XXXX-1234", status: "active", expires: "2026-03-15", plan: "Premium" },
  { id: "AV-XXXX-XXXX-5678", status: "expired", expires: "2025-12-01", plan: "Basic" },
];

const mockPurchases = [
  { id: 1, item: "Infinity Premium", price: "260₽", date: "2026-02-10", status: "Оплачено" },
];

const categoryLabels: Record<TicketCategory, string> = {
  bug: "🐛 Баг",
  question: "❓ Вопрос",
  payout: "💰 Выплата",
  youtube: "🎬 YouTube заявка",
  other: "📋 Другое",
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { toast } = useToast();

  // Tickets from store
  const [tickets, setTickets] = useState(store.getTickets());
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<TicketCategory>("bug");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [viewingTicket, setViewingTicket] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [ticketFilter, setTicketFilter] = useState<string>("all");
  const [configs, setConfigs] = useState(store.getApprovedConfigs());
  const [showSubmitConfig, setShowSubmitConfig] = useState(false);
  const [cfgDesc, setCfgDesc] = useState("");
  const [cfgPrice, setCfgPrice] = useState("");
  const [cfgFileName, setCfgFileName] = useState("");
  const [balance, setBalance] = useState(500);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  const hasPremium = mockUser.subscription === "Premium";
  const isMedia = mockUser.role === "media" || mockUser.role === "media_plus";
  const isMediaPlus = mockUser.role === "media_plus";

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast({ title: "Скопировано!", description: "Ключ скопирован в буфер обмена" });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const createTicket = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    store.addTicket({
      user: mockUser.username,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      description: newDesc.trim(),
    });
    setTickets(store.getTickets());
    setNewTitle("");
    setNewDesc("");
    setShowNewTicket(false);
    toast({ title: "Тикет создан", description: "Мы ответим в ближайшее время" });
  };

  const sendReply = (ticketId: number) => {
    if (!replyText.trim()) return;
    store.addReply(ticketId, mockUser.username, false, replyText.trim());
    setTickets(store.getTickets());
    setReplyText("");
    toast({ title: "Ответ отправлен" });
  };

  const viewedTicket = viewingTicket !== null ? tickets.find(t => t.id === viewingTicket) : null;

  const filteredTickets = tickets.filter(t => {
    if (ticketFilter === "all") return t.user === mockUser.username;
    return t.user === mockUser.username && t.category === ticketFilter;
  });

  // Build tabs based on role
  const baseTabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Профиль", icon: User },
    { id: "keys", label: "Мои ключи", icon: Key },
    { id: "download", label: "Скачать клиент", icon: Download },
    { id: "configs", label: "Магазин конфигов", icon: Store },
    { id: "purchases", label: "Покупки", icon: ShoppingCart },
  ];

  // Add media-specific tabs
  if (isMedia) {
    baseTabs.push({ id: "media_promos", label: "Мои промокоды", icon: Percent });
  }
  if (isMediaPlus) {
    baseTabs.push({ id: "media_stats", label: "Аналитика", icon: BarChart3 });
  }

  const tabs = baseTabs;

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.cfg,.txt,.yml,.yaml";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setCfgFileName(file.name);
    };
    input.click();
  };

  // Media promo data
  const promoCodes = store.getPromos();
  const totalEarnings = promoCodes.reduce((s, p) => s + p.earnings, 0);
  const totalBuyers = promoCodes.reduce((s, p) => s + p.uses, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="Infinity" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">Infinity</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} />
              <span>{mockUser.username}</span>
              {isMediaPlus && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <Crown size={10} /> Медиа+
                </span>
              )}
              {isMedia && !isMediaPlus && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/30 flex items-center gap-1">
                  <Star size={10} /> Медиа
                </span>
              )}
              {hasPremium && !isMedia && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Premium</span>
              )}
            </div>
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-16 flex">
        <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r border-border/30 bg-card/30 p-4 gap-1 fixed left-0 top-16 bottom-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setViewingTicket(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}

          {/* Media partner link — only show for non-media users */}
          {!isMedia && (
            <Link to="/media" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
              <Crown size={18} />
              Стать партнёром
            </Link>
          )}

          {/* Full media page link for media users */}
          {isMedia && (
            <Link to="/media" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
              <Crown size={18} />
              Медиа-панель
            </Link>
          )}

          <Link to="/faq" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
            <HelpCircle size={18} />
            FAQ
          </Link>

          <div className="mt-auto p-4 rounded-xl glass border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              {isMediaPlus ? (
                <Crown size={16} className="text-primary" />
              ) : isMedia ? (
                <Star size={16} className="text-primary" />
              ) : hasPremium ? (
                <Crown size={16} className="text-primary" />
              ) : (
                <Shield size={16} className="text-muted-foreground" />
              )}
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {isMediaPlus ? "Медиа+" : isMedia ? "Медиа" : hasPremium ? "Premium" : "Бесплатный"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isMediaPlus ? "15% комиссия с продаж" : isMedia ? "Бесплатная подписка" : `Подписка: ${mockUser.subscription}`}
            </p>
          </div>
        </aside>

        <div className="md:hidden fixed top-16 left-0 right-0 z-40 glass border-b border-border/30 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setViewingTicket(null); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id ? "text-primary border-primary" : "text-muted-foreground border-transparent"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <main className="flex-1 md:ml-64 p-6 pt-8 md:pt-8 mt-12 md:mt-0">
          <div className="max-w-4xl mx-auto">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {activeTab === "keys" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Мои ключи</h2>
                  <div className="space-y-4">
                    {mockKeys.map((key) => (
                      <div key={key.id} className={`rounded-xl p-5 border transition-all ${key.status === "active" ? "glass border-primary/20 glow-border" : "glass border-border/30 opacity-60"}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${key.status === "active" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                                {key.status === "active" ? "Активен" : "Истёк"}
                              </span>
                              <span className="text-xs text-muted-foreground">{key.plan}</span>
                            </div>
                            <code className="text-sm font-mono text-foreground">{key.id}</code>
                            <p className="text-xs text-muted-foreground mt-1">
                              <Clock size={12} className="inline mr-1" />
                              Действует до: {key.expires}
                            </p>
                          </div>
                          <button onClick={() => copyKey(key.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors shrink-0">
                            {copiedKey === key.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                            {copiedKey === key.id ? "Скопировано" : "Копировать"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "purchases" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">История покупок</h2>
                  <div className="rounded-xl glass border border-border/30 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left p-4 text-muted-foreground font-medium">Товар</th>
                          <th className="text-left p-4 text-muted-foreground font-medium hidden sm:table-cell">Дата</th>
                          <th className="text-left p-4 text-muted-foreground font-medium">Цена</th>
                          <th className="text-left p-4 text-muted-foreground font-medium">Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPurchases.map((p) => (
                          <tr key={p.id} className="border-b border-border/20 last:border-0">
                            <td className="p-4 font-medium">{p.item}</td>
                            <td className="p-4 text-muted-foreground hidden sm:table-cell">{p.date}</td>
                            <td className="p-4 text-primary font-semibold">{p.price}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "support" && (
                <div>
                  {viewedTicket ? (
                    <div>
                      <button onClick={() => setViewingTicket(null)} className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center gap-1">
                        ← Назад к тикетам
                      </button>
                      <div className="rounded-xl glass border border-border/30 p-6 mb-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            viewedTicket.status === "open" ? "bg-primary/10 text-primary border border-primary/20" :
                            viewedTicket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                            "bg-muted text-muted-foreground border border-border/30"
                          }`}>
                            {viewedTicket.status === "open" ? "Открыт" : viewedTicket.status === "in_progress" ? "В работе" : "Закрыт"}
                          </span>
                          <span className="text-xs text-muted-foreground">{categoryLabels[viewedTicket.category]}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            viewedTicket.priority === "high" ? "bg-destructive/10 text-destructive border-destructive/20" :
                            viewedTicket.priority === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                            "bg-muted text-muted-foreground border-border/30"
                          }`}>
                            {viewedTicket.priority === "high" ? "Высокий" : viewedTicket.priority === "medium" ? "Средний" : "Низкий"}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">{viewedTicket.date}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{viewedTicket.title}</h3>
                        <p className="text-sm text-muted-foreground">{viewedTicket.description}</p>
                      </div>
                      <div className="space-y-3 mb-4">
                        {viewedTicket.replies.map(r => (
                          <motion.div key={r.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className={`rounded-xl p-4 border ${r.isAdmin ? "glass border-primary/20 ml-0 mr-8" : "bg-secondary/30 border-border/20 ml-8 mr-0"}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold">{r.author}</span>
                              {r.isAdmin && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Поддержка</span>}
                              <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
                            </div>
                            <p className="text-sm">{r.text}</p>
                          </motion.div>
                        ))}
                      </div>
                      {viewedTicket.status !== "closed" && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendReply(viewedTicket.id)}
                            placeholder="Написать ответ..."
                            className="flex-1 h-11 px-4 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50"
                          />
                          <button onClick={() => sendReply(viewedTicket.id)} className="px-5 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                            <Send size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Тех. поддержка</h2>
                        {hasPremium ? (
                          <button onClick={() => setShowNewTicket(!showNewTicket)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                            <Plus size={16} /> Новый тикет
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 text-muted-foreground text-sm border border-border/30">
                            <Shield size={16} />
                            Только для Premium
                          </div>
                        )}
                      </div>
                      {!hasPremium && (
                        <div className="rounded-xl bg-primary/5 border border-primary/15 p-5 mb-6 flex items-start gap-3">
                          <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Поддержка доступна для Premium</p>
                            <p className="text-xs text-muted-foreground mt-1">Оформите Premium подписку чтобы создавать тикеты.</p>
                            <Link to="/pricing" className="text-xs text-primary hover:underline mt-2 inline-block">Посмотреть тарифы →</Link>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 mb-6 flex-wrap">
                        {[
                          { id: "all", label: "Все" },
                          { id: "bug", label: "🐛 Баги" },
                          { id: "question", label: "❓ Вопросы" },
                          { id: "youtube", label: "🎬 YouTube" },
                          { id: "payout", label: "💰 Выплаты" },
                          { id: "other", label: "📋 Другое" },
                        ].map(f => (
                          <button key={f.id} onClick={() => setTicketFilter(f.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${ticketFilter === f.id ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"}`}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                      {showNewTicket && hasPremium && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl glass border border-primary/20 p-5 mb-6 space-y-3">
                          <h3 className="font-semibold text-sm">Новый тикет</h3>
                          <div className="flex gap-2 flex-wrap">
                            {(["bug", "question", "youtube", "payout", "other"] as TicketCategory[]).map(cat => (
                              <button key={cat} onClick={() => setNewCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${newCategory === cat ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/50 text-muted-foreground border border-border/30"}`}>
                                {categoryLabels[cat]}
                              </button>
                            ))}
                          </div>
                          <input type="text" placeholder="Заголовок тикета" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                          <textarea placeholder={newCategory === "youtube" ? "Укажите ссылку на канал, кол-во подписчиков" : "Опишите проблему подробно..."}
                            value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={4}
                            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 resize-none" />
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-muted-foreground">Приоритет:</label>
                            {(["low", "medium", "high"] as const).map(p => (
                              <button key={p} onClick={() => setNewPriority(p)} className={`text-xs px-2 py-1 rounded-lg transition-all ${newPriority === p ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground"}`}>
                                {p === "high" ? "Высокий" : p === "medium" ? "Средний" : "Низкий"}
                              </button>
                            ))}
                          </div>
                          <button onClick={createTicket} disabled={!newTitle.trim() || !newDesc.trim()} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Создать тикет
                          </button>
                        </motion.div>
                      )}
                      <div className="space-y-3">
                        {filteredTickets.map((ticket) => (
                          <div key={ticket.id} onClick={() => setViewingTicket(ticket.id)}
                            className="rounded-xl glass border border-border/30 p-5 hover:border-primary/20 transition-all cursor-pointer group">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    ticket.status === "open" ? "bg-primary/10 text-primary border border-primary/20" :
                                    ticket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                    "bg-muted text-muted-foreground border border-border/30"
                                  }`}>
                                    {ticket.status === "open" ? "Открыт" : ticket.status === "in_progress" ? "В работе" : "Закрыт"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{categoryLabels[ticket.category]}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                    ticket.priority === "high" ? "bg-destructive/10 text-destructive border-destructive/20" :
                                    ticket.priority === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                    "bg-muted text-muted-foreground border-border/30"
                                  }`}>
                                    {ticket.priority === "high" ? "Высокий" : ticket.priority === "medium" ? "Средний" : "Низкий"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{ticket.date}</span>
                                </div>
                                <h3 className="font-medium group-hover:text-primary transition-colors">{ticket.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <MessageSquare size={12} className="inline mr-1" />{ticket.replies.length} ответов
                                </p>
                              </div>
                              <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                            </div>
                          </div>
                        ))}
                        {filteredTickets.length === 0 && (
                          <p className="text-center text-sm text-muted-foreground py-8">Тикетов нет. Создайте новый!</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "download" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Скачать клиент</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "1.21.4 Fabric Default", desc: "Стандартный клиент Fabric для Minecraft 1.21.4", tag: "Рекомендуется" },
                      { name: "1.21.4 Fabric Lunar", desc: "Версия для Lunar Client на Fabric 1.21.4", tag: "Lunar" },
                    ].map((client) => (
                      <div key={client.name} className="rounded-xl glass border border-border/30 p-6 hover:border-primary/30 transition-all group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Download size={22} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{client.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{client.tag}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">{client.desc}</p>
                        <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                          <Download size={16} /> Скачать
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "configs" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Магазин конфигов</h2>
                    <button onClick={() => setShowSubmitConfig(!showSubmitConfig)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                      <Plus size={16} /> Выставить конфиг
                    </button>
                  </div>
                  {showSubmitConfig && (
                    <div className="rounded-xl glass border border-primary/20 p-5 mb-6 space-y-3">
                      <h3 className="font-semibold text-sm">Выставить конфиг на продажу</h3>
                      <p className="text-xs text-muted-foreground">Конфиг будет отправлен на модерацию.</p>
                      <input type="text" placeholder="Описание конфига" value={cfgDesc} onChange={(e) => setCfgDesc(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                      <input type="number" placeholder="Цена (₽)" value={cfgPrice} onChange={(e) => setCfgPrice(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                      <button type="button" onClick={handleFileSelect}
                        className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm text-left flex items-center gap-2 hover:border-primary/50 transition-all">
                        <Upload size={16} className="text-muted-foreground shrink-0" />
                        <span className={cfgFileName ? "text-foreground" : "text-muted-foreground"}>
                          {cfgFileName || "Прикрепить файл конфига (.json, .cfg, .txt)"}
                        </span>
                      </button>
                      <button onClick={() => {
                        if (!cfgDesc.trim() || !cfgPrice.trim() || !cfgFileName) {
                          toast({ title: "Заполните все поля", description: "Описание, цена и файл обязательны", variant: "destructive" }); return;
                        }
                        store.addConfig({ author: mockUser.username, description: cfgDesc.trim(), price: Number(cfgPrice) });
                        setCfgDesc(""); setCfgPrice(""); setCfgFileName(""); setShowSubmitConfig(false); setConfigs(store.getApprovedConfigs());
                        toast({ title: "Конфиг отправлен", description: "Ожидайте одобрения администратора" });
                      }} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Отправить на модерацию
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {configs.map((config) => {
                      const owned = store.hasUserBoughtConfig(config.id, mockUser.email);
                      return (
                        <div key={config.id} className="rounded-xl glass border border-border/30 p-6 hover:border-primary/30 transition-all group">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                              <User size={18} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-sm">{config.author}</h3>
                              <span className="text-xs text-muted-foreground">Автор конфига</span>
                            </div>
                            <span className="ml-auto text-lg font-black gradient-text">{config.price}₽</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{config.description}</p>
                          {owned ? (
                            <button className="w-full h-10 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold flex items-center justify-center gap-2 cursor-default">
                              <Check size={16} /> Куплено
                            </button>
                          ) : (
                            <button onClick={() => {
                              if (balance < config.price) {
                                toast({ title: "Недостаточно средств", description: `Нужно ${config.price}₽, на балансе ${balance}₽.`, variant: "destructive" }); return;
                              }
                              setBalance(prev => prev - config.price);
                              store.buyConfig(config.id, mockUser.email);
                              setConfigs(store.getApprovedConfigs());
                              toast({ title: "Конфиг куплен!", description: `${config.author} — ${config.price}₽` });
                            }} className="w-full h-10 rounded-lg glass border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                              <ShoppingCart size={16} /> Купить за {config.price}₽
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {configs.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8 col-span-2">Конфигов пока нет</p>
                    )}
                  </div>
                </div>
              )}

              {/* ═══ MEDIA PROMOS TAB (media/media+ only) ═══ */}
              {activeTab === "media_promos" && isMedia && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Мои промокоды</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl glass border border-border/30 p-5 text-center">
                      <p className="text-2xl font-black gradient-text">{totalBuyers}</p>
                      <p className="text-xs text-muted-foreground mt-1">Использований</p>
                    </div>
                    <div className="rounded-xl glass border border-border/30 p-5 text-center">
                      <p className="text-2xl font-black gradient-text">{promoCodes.filter(c => c.active).length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Активных кодов</p>
                    </div>
                    {isMediaPlus && (
                      <>
                        <div className="rounded-xl glass border border-border/30 p-5 text-center">
                          <p className="text-2xl font-black gradient-text">{totalEarnings.toLocaleString()}₽</p>
                          <p className="text-xs text-muted-foreground mt-1">Заработано</p>
                        </div>
                        <div className="rounded-xl glass border border-border/30 p-5 text-center">
                          <p className="text-2xl font-black gradient-text">15%</p>
                          <p className="text-xs text-muted-foreground mt-1">Комиссия</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-3">
                    {promoCodes.map((promo) => (
                      <div key={promo.code} className={`rounded-xl border p-4 transition-all ${promo.active ? "glass border-border/30" : "bg-secondary/20 border-border/20 opacity-60"}`}>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-sm font-mono font-bold">{promo.code}</code>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">-{promo.discount}%</span>
                            <span className="text-xs text-muted-foreground">{promo.uses}/{promo.maxUses} исп.</span>
                            {isMediaPlus && <span className="text-xs text-primary font-semibold">{promo.earnings}₽</span>}
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(promo.code); toast({ title: "Скопировано!" }); }}
                            className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all">
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!isMediaPlus && (
                    <div className="mt-6 rounded-xl bg-primary/5 border border-primary/15 p-5 text-center">
                      <p className="text-sm font-semibold mb-1">Хотите зарабатывать с промокодов?</p>
                      <p className="text-xs text-muted-foreground mb-3">Перейдите на Медиа+ и получайте 15% с каждой продажи</p>
                      <Link to="/media" className="inline-flex px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Узнать больше
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ MEDIA ANALYTICS TAB (media+ only) ═══ */}
              {activeTab === "media_stats" && isMediaPlus && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Аналитика продаж</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="rounded-xl glass border border-border/30 p-5 text-center">
                      <p className="text-2xl font-black gradient-text">12.5%</p>
                      <p className="text-xs text-muted-foreground mt-1">Конверсия</p>
                    </div>
                    <div className="rounded-xl glass border border-border/30 p-5 text-center">
                      <p className="text-2xl font-black gradient-text">234₽</p>
                      <p className="text-xs text-muted-foreground mt-1">Средний чек</p>
                    </div>
                    <div className="rounded-xl glass border border-border/30 p-5 text-center">
                      <p className="text-2xl font-black text-green-400">+18%</p>
                      <p className="text-xs text-muted-foreground mt-1">Рост за неделю</p>
                    </div>
                    <div className="rounded-xl glass border border-border/30 p-5 text-center">
                      <p className="text-2xl font-black gradient-text">{totalEarnings.toLocaleString()}₽</p>
                      <p className="text-xs text-muted-foreground mt-1">Общий заработок</p>
                    </div>
                  </div>
                  <div className="rounded-xl glass border border-border/30 p-6 mb-6">
                    <h3 className="font-bold text-sm mb-4">Продажи за неделю</h3>
                    <div className="flex items-end gap-2 h-32">
                      {[3, 5, 2, 7, 4, 6, 8].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs text-muted-foreground">{val}</span>
                          <div className="w-full rounded-t bg-primary/40 hover:bg-primary/60 transition-colors" style={{ height: `${(val / 8) * 100}%` }} />
                          <span className="text-[10px] text-muted-foreground">{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl glass border border-border/30 p-6">
                    <h3 className="font-bold text-sm mb-4">Топ промокодов</h3>
                    <div className="space-y-3">
                      {promoCodes.sort((a, b) => b.earnings - a.earnings).slice(0, 5).map((code, i) => (
                        <div key={code.code} className="flex items-center justify-between text-sm rounded-lg bg-secondary/20 border border-border/20 p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-primary font-mono font-bold">#{i + 1}</span>
                            <code className="font-mono text-xs">{code.code}</code>
                            <span className="text-xs text-muted-foreground">{code.uses} продаж</span>
                          </div>
                          <span className="text-primary font-bold">{code.earnings.toLocaleString()}₽</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Профиль</h2>

                  {/* Balance card */}
                  <div className="rounded-xl glass border border-primary/20 glow-border p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Wallet size={22} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Баланс</p>
                          <p className="text-2xl font-black gradient-text">{balance}₽</p>
                        </div>
                      </div>
                      <button onClick={() => setShowTopUp(!showTopUp)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                        <Plus size={16} /> Пополнить
                      </button>
                    </div>
                    {showTopUp && (
                      <div className="flex gap-2 mt-2">
                        {[100, 250, 500, 1000].map(amt => (
                          <button key={amt} onClick={() => { setBalance(prev => prev + amt); setShowTopUp(false); toast({ title: "Баланс пополнен", description: `+${amt}₽` }); }}
                            className="flex-1 h-10 rounded-lg bg-secondary/50 border border-border/50 text-sm font-semibold hover:border-primary/50 hover:bg-primary/10 transition-all">
                            {amt}₽
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl glass border border-border/30 p-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <User size={28} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{mockUser.username}</h3>
                        <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-muted-foreground text-sm">Роль</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          {isMediaPlus ? <><Crown size={14} className="text-primary" /> Медиа+</> :
                           isMedia ? <><Star size={14} className="text-primary" /> Медиа</> :
                           <><Shield size={14} className="text-muted-foreground" /> Пользователь</>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-muted-foreground text-sm">Подписка</span>
                        <span className="text-sm font-medium text-primary">{mockUser.subscription}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-muted-foreground text-sm">Окончание подписки</span>
                        <span className="text-sm font-medium text-foreground">2026-03-15</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-muted-foreground text-sm">HWID</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">a1b2c3d4-e5f6-7890</code>
                          <span className="text-xs text-green-400">Привязан</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-muted-foreground text-sm">ID</span>
                        <code className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">#12345</code>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-muted-foreground text-sm">Дата регистрации</span>
                        <span className="text-sm font-medium">{mockUser.joined}</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground text-sm">Discord</span>
                        <span className="text-sm text-primary font-medium">Не привязан</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
