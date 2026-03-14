import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, Shield, Crown, Search, ChevronRight,
  Ban, Check, Eye, ArrowLeft, BarChart3,
  Key, MessageSquare, Settings, Plus, Trash2,
  Clock, Copy, DollarSign, X, Percent, CheckCircle, XCircle, Wallet, Store, Star
} from "lucide-react";
import logoImage from "@/assets/logo.jpg";
import { store, type TicketCategory, type ConfigItem } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

type AdminTab = "users" | "keys" | "tickets" | "promos" | "payouts" | "configs" | "stats" | "announcements" | "settings";

// ── Realistic local state data ──

const initialUsers = [
  { id: 1, name: "Player123", email: "player@mail.ru", role: "user" as string, status: "active" as string, joined: "2026-02-10" },
  { id: 2, name: "MediaGuy", email: "media@mail.ru", role: "media_plus", status: "active", joined: "2026-01-20" },
  { id: 3, name: "TestUser", email: "test@mail.ru", role: "user", status: "banned", joined: "2025-12-05" },
  { id: 4, name: "ProPlayer", email: "pro@mail.ru", role: "user", status: "active", joined: "2026-02-01" },
  { id: 5, name: "YouTuber_Vanya", email: "vanya@gmail.com", role: "media", status: "active", joined: "2026-01-10" },
];

const initialKeys = [
  { id: "AV-8F3A-KX91-0001", user: "Player123", plan: "Premium", status: "active" as string, created: "2026-02-10", expires: "2026-03-10", duration: "30 дней" },
  { id: "AV-2B7C-MN42-0002", user: "ProPlayer", plan: "Basic", status: "active", created: "2026-02-01", expires: "2026-02-15", duration: "14 дней" },
  { id: "AV-9D1E-QW83-0003", user: "TestUser", plan: "Premium", status: "expired", created: "2025-11-01", expires: "2025-12-01", duration: "30 дней" },
];

const categoryLabels: Record<TicketCategory, string> = {
  bug: "🐛 Баг",
  question: "❓ Вопрос",
  payout: "💰 Выплата",
  youtube: "🎬 YouTube",
  other: "📋 Другое",
};

const durations = ["1 день", "3 дня", "7 дней", "14 дней", "30 дней", "90 дней"];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Real state
  const [users, setUsers] = useState(initialUsers);
  const [keys, setKeys] = useState(initialKeys);
  const [tickets, setTickets] = useState(store.getTickets());
  const [adminReplyText, setAdminReplyText] = useState("");
  const [viewingTicketId, setViewingTicketId] = useState<number | null>(null);
  const [ticketFilter, setTicketFilter] = useState<string>("all");

  // Key creation
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [newKeyUser, setNewKeyUser] = useState("");
  const [newKeyPlan, setNewKeyPlan] = useState("Premium");
  const [newKeyDuration, setNewKeyDuration] = useState("30 дней");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // User detail modal
  const [viewingUser, setViewingUser] = useState<typeof initialUsers[0] | null>(null);

  // Promo management from shared store
  const [promos, setPromos] = useState(store.getPromos());
  const [promoRequests, setPromoRequests] = useState(store.getRequests());
  const [purchases, setPurchases] = useState(store.getPurchases());
  const [editingCommission, setEditingCommission] = useState<string | null>(null);
  const [commissionValue, setCommissionValue] = useState(25);
  const [approveCommission, setApproveCommission] = useState(25);
  const [expandedPromo, setExpandedPromo] = useState<string | null>(null);
  const refreshPromos = () => { setPromos(store.getPromos()); setPromoRequests(store.getRequests()); setPurchases(store.getPurchases()); setPayoutsList(store.getPayouts()); setConfigsList(store.getConfigs()); };
  const [payoutsList, setPayoutsList] = useState(store.getPayouts());
  const [configsList, setConfigsList] = useState(store.getConfigs());

  const tabs = [
    { id: "users" as AdminTab, label: "Пользователи", icon: Users },
    { id: "keys" as AdminTab, label: "Ключи", icon: Key },
    { id: "tickets" as AdminTab, label: "Тикеты", icon: MessageSquare },
    { id: "promos" as AdminTab, label: "Промокоды", icon: Percent },
    { id: "payouts" as AdminTab, label: "Выплаты", icon: Wallet },
    { id: "configs" as AdminTab, label: "Конфиги", icon: Store },
    { id: "stats" as AdminTab, label: "Статистика", icon: BarChart3 },
    { id: "announcements" as AdminTab, label: "Объявления", icon: MessageSquare },
    { id: "settings" as AdminTab, label: "Настройки", icon: Settings },
  ];

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBan = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "banned" : "active" } : u));
  };

  const cycleRole = (id: number) => {
    const roleOrder = ["user", "media", "media_plus"];
    setUsers(users.map(u => {
      if (u.id !== id) return u;
      const nextIdx = (roleOrder.indexOf(u.role) + 1) % roleOrder.length;
      return { ...u, role: roleOrder[nextIdx] };
    }));
  };

  // Announcements
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Обновление 2.1", text: "Исправлены баги с частицами и добавлены новые трейлы.", date: "2026-02-14", active: true },
    { id: 2, title: "Техработы 15.02", text: "Серверы будут недоступны с 03:00 до 05:00 МСК.", date: "2026-02-13", active: false },
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnText, setNewAnnText] = useState("");
  const [showAnnForm, setShowAnnForm] = useState(false);

  // Settings
  const [siteSettings, setSiteSettings] = useState({
    registrationOpen: true,
    maintenanceMode: false,
    maxKeysPerUser: 3,
    minPayoutAmount: 100,
    autoApproveConfigs: false,
  });

  const createKey = () => {
    if (!newKeyUser.trim()) return;
    const durationDays: Record<string, number> = { "1 день": 1, "3 дня": 3, "7 дней": 7, "14 дней": 14, "30 дней": 30, "90 дней": 90 };
    const days = durationDays[newKeyDuration] || 30;
    const now = new Date();
    const exp = new Date(now.getTime() + days * 86400000);
    const randomId = `AV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${String(keys.length + 1).padStart(4, "0")}`;
    setKeys([{
      id: randomId,
      user: newKeyUser,
      plan: newKeyPlan,
      status: "active",
      created: now.toISOString().split("T")[0],
      expires: exp.toISOString().split("T")[0],
      duration: newKeyDuration,
    }, ...keys]);
    setNewKeyUser("");
    setShowKeyForm(false);
  };

  const revokeKey = (id: string) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: "expired" } : k));
  };

  const closeTicket = (id: number) => {
    store.updateTicketStatus(id, "closed");
    setTickets(store.getTickets());
    toast({ title: "Тикет закрыт" });
  };

  const reopenTicket = (id: number) => {
    store.updateTicketStatus(id, "open");
    setTickets(store.getTickets());
    toast({ title: "Тикет открыт" });
  };

  const sendAdminReply = (ticketId: number) => {
    if (!adminReplyText.trim()) return;
    store.addReply(ticketId, "Admin", true, adminReplyText.trim());
    setTickets(store.getTickets());
    setAdminReplyText("");
    toast({ title: "Ответ отправлен" });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeKeys = keys.filter(k => k.status === "active").length;
  const expiredKeys = keys.filter(k => k.status === "expired").length;
  const openTickets = tickets.filter(t => t.status === "open").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="Infinity" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">Админ</span>Панель
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Settings size={16} /> Кабинет
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <Crown size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r border-border/30 bg-card/30 p-4 gap-1 fixed left-0 top-16 bottom-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === "tickets" && openTickets > 0 && (
                <span className="ml-auto bg-destructive/20 text-destructive text-xs font-bold px-1.5 py-0.5 rounded-full">{openTickets}</span>
              )}
            </button>
          ))}
          <Link to="/" className="mt-auto flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
            <ArrowLeft size={18} /> На сайт
          </Link>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 glass border-b border-border/30 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === tab.id ? "text-primary border-primary" : "text-muted-foreground border-transparent"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 md:ml-64 p-6 pt-8 md:pt-8 mt-12 md:mt-0">
          <div className="max-w-5xl mx-auto">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

              {/* ═══ USERS TAB ═══ */}
              {activeTab === "users" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Пользователи</h2>
                    <span className="text-sm text-muted-foreground">{users.length} всего</span>
                  </div>
                  <div className="relative mb-6">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Поиск по имени или email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="rounded-xl glass border border-border/30 p-5 hover:border-primary/20 transition-all group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                              <Users size={18} className="text-muted-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{user.name}</span>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  user.role === "media_plus"
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : user.role === "media"
                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                    : "bg-secondary text-muted-foreground border border-border/30"
                                }`}>
                                  {user.role === "media_plus" ? <><Crown size={10} /> Медиа+</> : user.role === "media" ? <><Star size={10} /> Медиа</> : <><Shield size={10} /> Юзер</>}
                                </span>
                                {user.status === "banned" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                                    <Ban size={10} /> Бан
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{user.email} · {user.joined}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => cycleRole(user.id)} className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all" title="Сменить роль (user → media → media+)">
                              <Crown size={16} />
                            </button>
                            <button onClick={() => setViewingUser(user)} className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all" title="Просмотр">
                              <Eye size={16} />
                            </button>
                            {user.status === "active" ? (
                              <button onClick={() => toggleBan(user.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all" title="Забанить">
                                <Ban size={16} />
                              </button>
                            ) : (
                              <button onClick={() => toggleBan(user.id)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all" title="Разбанить">
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ KEYS TAB ═══ */}
              {activeTab === "keys" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Управление ключами</h2>
                    <button onClick={() => setShowKeyForm(!showKeyForm)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                      <Plus size={16} /> Создать ключ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Всего ключей", value: String(keys.length), color: "text-foreground" },
                      { label: "Активных", value: String(activeKeys), color: "text-primary" },
                      { label: "Истёкших", value: String(expiredKeys), color: "text-destructive" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl glass border border-border/30 p-5 text-center">
                        <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {showKeyForm && (
                    <div className="rounded-xl glass border border-primary/20 p-5 mb-6 space-y-3">
                      <h3 className="font-semibold text-sm mb-2">Новый ключ</h3>
                      <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={newKeyUser}
                        onChange={(e) => setNewKeyUser(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select value={newKeyPlan} onChange={(e) => setNewKeyPlan(e.target.value)} className="h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50">
                          <option value="Basic">Basic</option>
                          <option value="Premium">Premium</option>
                        </select>
                        <select value={newKeyDuration} onChange={(e) => setNewKeyDuration(e.target.value)} className="h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50">
                          {durations.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <button onClick={createKey} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Создать
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {keys.map((key) => (
                      <div key={key.id} className={`rounded-xl border p-5 transition-all ${key.status === "active" ? "glass border-border/30 hover:border-primary/20" : "bg-secondary/20 border-border/20 opacity-60"}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${key.status === "active" ? "bg-primary/10 text-primary border border-primary/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                                {key.status === "active" ? "Активен" : "Истёк"}
                              </span>
                              <span className="text-xs text-muted-foreground">{key.plan}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/30">
                                <Clock size={10} className="inline mr-1" />{key.duration}
                              </span>
                            </div>
                            <code className="text-sm font-mono font-bold">{key.id}</code>
                            <p className="text-xs text-muted-foreground mt-1">
                              Пользователь: <span className="text-foreground">{key.user}</span> · Создан: {key.created} · До: {key.expires}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => copyKey(key.id)} className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all">
                              {copiedKey === key.id ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                            </button>
                            {key.status === "active" && (
                              <button onClick={() => revokeKey(key.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all" title="Отозвать">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ TICKETS TAB ═══ */}
              {activeTab === "tickets" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Тикеты поддержки</h2>

                  {/* Viewing a specific ticket */}
                  {viewingTicketId && tickets.find(t => t.id === viewingTicketId) ? (() => {
                    const ticket = tickets.find(t => t.id === viewingTicketId)!;
                    return (
                      <div>
                        <button onClick={() => setViewingTicketId(null)} className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center gap-1">
                          ← Назад к тикетам
                        </button>
                        <div className="rounded-xl glass border border-border/30 p-6 mb-4">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              ticket.status === "open" ? "bg-primary/10 text-primary border border-primary/20" :
                              ticket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                              "bg-muted text-muted-foreground border border-border/30"
                            }`}>
                              {ticket.status === "open" ? "Открыт" : ticket.status === "in_progress" ? "В работе" : "Закрыт"}
                            </span>
                            <span className="text-xs">{categoryLabels[ticket.category]}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{ticket.date}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-1">{ticket.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">от {ticket.user}</p>
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                          <div className="flex gap-2 mt-4">
                            {ticket.status !== "closed" && (
                              <button onClick={() => closeTicket(ticket.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20">Закрыть</button>
                            )}
                            {ticket.status === "closed" && (
                              <button onClick={() => reopenTicket(ticket.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20">Открыть</button>
                            )}
                            {ticket.status === "open" && (
                              <button onClick={() => { store.updateTicketStatus(ticket.id, "in_progress"); setTickets(store.getTickets()); toast({ title: "Тикет в работе" }); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20">В работу</button>
                            )}
                          </div>
                        </div>

                        {/* Replies */}
                        <div className="space-y-3 mb-4">
                          {ticket.replies.map(r => (
                            <div key={r.id} className={`rounded-xl p-4 border ${r.isAdmin ? "glass border-primary/20" : "bg-secondary/30 border-border/20 ml-8"}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold">{r.author}</span>
                                {r.isAdmin && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Админ</span>}
                                <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
                              </div>
                              <p className="text-sm">{r.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Admin reply */}
                        {ticket.status !== "closed" && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={adminReplyText}
                              onChange={(e) => setAdminReplyText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && sendAdminReply(ticket.id)}
                              placeholder="Ответить как админ..."
                              className="flex-1 h-11 px-4 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50"
                            />
                            <button onClick={() => sendAdminReply(ticket.id)} className="px-5 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                              Ответить
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })() : (
                    /* Ticket list */
                    <div>
                      <div className="flex gap-2 mb-6 flex-wrap">
                        {[
                          { id: "all", label: "Все" },
                          { id: "bug", label: "🐛 Баги" },
                          { id: "question", label: "❓ Вопросы" },
                          { id: "youtube", label: "🎬 YouTube" },
                          { id: "payout", label: "💰 Выплаты" },
                          { id: "other", label: "📋 Другое" },
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setTicketFilter(f.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              ticketFilter === f.id
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {tickets.filter(t => ticketFilter === "all" || t.category === ticketFilter).map((ticket) => (
                          <div key={ticket.id} onClick={() => setViewingTicketId(ticket.id)} className="rounded-xl glass border border-border/30 p-5 hover:border-primary/20 transition-all group cursor-pointer">
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
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    ticket.priority === "high" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                                    ticket.priority === "medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                    "bg-muted text-muted-foreground border border-border/30"
                                  }`}>
                                    {ticket.priority === "high" ? "Высокий" : ticket.priority === "medium" ? "Средний" : "Низкий"}
                                  </span>
                                  <span className="text-xs">{categoryLabels[ticket.category]}</span>
                                  <span className="text-xs text-muted-foreground">{ticket.date}</span>
                                </div>
                                <h3 className="font-medium group-hover:text-primary transition-colors">{ticket.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">от {ticket.user} · {ticket.replies.length} ответов</p>
                              </div>
                              <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ PROMOS TAB ═══ */}
              {activeTab === "promos" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Управление промокодами</h2>

                  {/* Revenue summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Всего покупок", value: String(purchases.length) },
                      { label: "С промокодом", value: String(purchases.filter(p => p.promoCode).length) },
                      { label: "Общий доход", value: `${purchases.reduce((s, p) => s + p.price, 0).toLocaleString()}₽` },
                      { label: "Комиссии выплачено", value: `${purchases.reduce((s, p) => s + p.commission, 0).toLocaleString()}₽` },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl glass border border-border/30 p-4 text-center">
                        <p className="text-xl font-black gradient-text">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pending requests */}
                  {promoRequests.filter(r => r.status === "pending").length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        Заявки на промокоды ({promoRequests.filter(r => r.status === "pending").length})
                      </h3>
                      <div className="space-y-3">
                        {promoRequests.filter(r => r.status === "pending").map(req => (
                          <div key={req.id} className="rounded-xl glass border border-primary/20 p-5">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-medium">{req.youtuber}</span>
                                  <code className="text-xs bg-secondary px-2 py-0.5 rounded font-mono">{req.code}</code>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">-{req.discount}%</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Макс: {req.maxUses} исп. · {req.date}</p>
                                <a href={req.channelUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{req.channelUrl}</a>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <label className="text-xs text-muted-foreground">Комиссия:</label>
                                  <input type="number" value={approveCommission} onChange={(e) => setApproveCommission(Number(e.target.value))} min={5} max={80} className="w-16 h-8 px-2 rounded-lg bg-secondary/50 border border-border/50 text-xs text-center focus:outline-none focus:border-primary/50" />
                                  <span className="text-xs text-muted-foreground">%</span>
                                </div>
                                <button
                                  onClick={() => { store.approveRequest(req.id, approveCommission); refreshPromos(); toast({ title: "Заявка одобрена", description: `Промокод ${req.code} активирован с комиссией ${approveCommission}%` }); }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                >
                                  <CheckCircle size={14} /> Одобрить
                                </button>
                                <button
                                  onClick={() => { store.rejectRequest(req.id); refreshPromos(); toast({ title: "Заявка отклонена" }); }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                                >
                                  <XCircle size={14} /> Отклонить
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processed requests */}
                  {promoRequests.filter(r => r.status !== "pending").length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-bold text-sm mb-3">История заявок</h3>
                      <div className="space-y-2">
                        {promoRequests.filter(r => r.status !== "pending").map(req => (
                          <div key={req.id} className="rounded-lg bg-secondary/20 border border-border/20 p-3 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{req.youtuber}</span>
                              <code className="text-xs font-mono">{req.code}</code>
                            </div>
                            <span className={`text-xs font-semibold ${req.status === "approved" ? "text-primary" : "text-destructive"}`}>
                              {req.status === "approved" ? "Одобрено" : "Отклонено"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All promos with detailed stats */}
                  <h3 className="font-bold text-sm mb-3">Все промокоды ({promos.length})</h3>
                  <div className="space-y-3">
                    {promos.map(promo => {
                      const promoPurchases = store.getPurchasesByPromo(promo.code);
                      return (
                        <div key={promo.code}>
                          <div className={`rounded-xl border p-5 transition-all ${promo.active ? "glass border-border/30" : "bg-secondary/20 border-border/20 opacity-60"}`}>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <code className="font-mono font-bold text-sm">{promo.code}</code>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">-{promo.discount}%</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${promo.active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-muted text-muted-foreground border border-border/30"}`}>
                                    {promo.active ? "Активен" : "Неактивен"}
                                  </span>
                                  {/* Commission badge */}
                                  {editingCommission === promo.code ? (
                                    <div className="flex items-center gap-1">
                                      <input type="number" value={commissionValue} onChange={(e) => setCommissionValue(Number(e.target.value))} min={5} max={80} className="w-14 h-6 px-1 rounded bg-secondary/50 border border-border/50 text-xs text-center focus:outline-none focus:border-primary/50" />
                                      <span className="text-xs">%</span>
                                      <button onClick={() => { store.updatePromoCommission(promo.code, commissionValue); setEditingCommission(null); refreshPromos(); }} className="text-xs text-primary hover:underline">✓</button>
                                      <button onClick={() => setEditingCommission(null)} className="text-xs text-muted-foreground hover:underline">✕</button>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setCommissionValue(promo.commission); setEditingCommission(promo.code); }} className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors cursor-pointer" title="Нажмите чтобы изменить комиссию">
                                      Комиссия: {promo.commission}%
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Владелец: <span className="text-foreground">{promo.owner}</span> · 
                                  Покупок: <span className="text-foreground">{promo.uses}</span>/{promo.maxUses} · 
                                  Заработок медиа: <span className="text-primary font-semibold">{promo.earnings.toLocaleString()}₽</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setExpandedPromo(expandedPromo === promo.code ? null : promo.code)} className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all">
                                  <Eye size={16} />
                                </button>
                                <button onClick={() => { store.togglePromo(promo.code); refreshPromos(); }} className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all">
                                  {promo.active ? "⏸" : "▶"}
                                </button>
                                <button onClick={() => { store.deletePromo(promo.code); refreshPromos(); }} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Expanded purchase details */}
                          {expandedPromo === promo.code && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="ml-4 mt-2 rounded-lg bg-secondary/20 border border-border/20 p-4">
                              <p className="font-semibold text-sm mb-3">Покупки по коду {promo.code} ({promoPurchases.length}):</p>
                              {promoPurchases.length === 0 ? (
                                <p className="text-muted-foreground text-xs">Пока нет покупок по этому коду</p>
                              ) : (
                                <div className="space-y-2">
                                  {promoPurchases.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between text-xs rounded-lg bg-background/50 border border-border/20 p-3">
                                      <div>
                                        <span className="font-medium text-foreground">{p.buyer}</span>
                                        <span className="text-muted-foreground ml-2">{p.email}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-right">
                                        <span className="text-muted-foreground">{p.date}</span>
                                        <span className="text-foreground font-semibold">{p.price}₽</span>
                                        <span className="text-primary font-semibold">комиссия: {p.commission}₽</span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="flex justify-between text-xs font-semibold pt-2 border-t border-border/20">
                                    <span>Итого:</span>
                                    <span>Оплачено: {promoPurchases.reduce((s, p) => s + p.price, 0).toLocaleString()}₽ · Комиссия: <span className="text-primary">{promoPurchases.reduce((s, p) => s + p.commission, 0).toLocaleString()}₽</span></span>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* All purchases table */}
                  <h3 className="font-bold text-sm mt-8 mb-3">Все покупки ({purchases.length})</h3>
                  <div className="space-y-2">
                    {purchases.map(p => (
                      <div key={p.id} className="rounded-lg glass border border-border/30 p-3 flex items-center justify-between text-sm flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{p.buyer}</span>
                          <span className="text-xs text-muted-foreground">{p.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">{p.date}</span>
                          <span>{p.plan}</span>
                          {p.promoCode ? (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{p.promoCode} (-{p.promoDiscount}%)</span>
                          ) : (
                            <span className="text-muted-foreground">без промо</span>
                          )}
                          <span className="font-semibold">{p.price}₽</span>
                          {p.commission > 0 && <span className="text-primary font-semibold">→ {p.commission}₽ медиа</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ PAYOUTS TAB ═══ */}
              {activeTab === "payouts" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Управление выплатами</h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Ожидают", value: String(payoutsList.filter(p => p.status === "pending").length), color: "text-yellow-400" },
                      { label: "Выплачено", value: `${payoutsList.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0).toLocaleString()}₽` },
                      { label: "Всего запросов", value: String(payoutsList.length) },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl glass border border-border/30 p-4 text-center">
                        <p className={`text-xl font-black ${s.color || "gradient-text"}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {payoutsList.map(p => (
                      <div key={p.id} className="rounded-xl glass border border-border/30 p-5 flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium">{p.owner}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              p.status === "pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                              p.status === "paid" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                              "bg-destructive/10 text-destructive border-destructive/20"
                            }`}>
                              {p.status === "pending" ? "Ожидает" : p.status === "paid" ? "Выплачено" : "Отклонено"}
                            </span>
                            <span className="text-xs text-muted-foreground">{p.date}</span>
                          </div>
                          <p className="text-sm">
                            <span className="text-primary font-bold">{p.amount.toLocaleString()}₽</span>
                            <span className="text-muted-foreground ml-2">· {p.method} · {p.details}</span>
                          </p>
                        </div>
                        {p.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => { store.updatePayoutStatus(p.id, "paid"); setPayoutsList(store.getPayouts()); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                              <CheckCircle size={14} /> Выплатить
                            </button>
                            <button onClick={() => { store.updatePayoutStatus(p.id, "rejected"); setPayoutsList(store.getPayouts()); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all">
                              <XCircle size={14} /> Отклонить
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {payoutsList.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Запросов на выплату нет</p>}
                  </div>
                </div>
              )}

              {/* ═══ CONFIGS TAB ═══ */}
              {activeTab === "configs" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Управление конфигами</h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "На модерации", value: String(configsList.filter(c => c.status === "pending").length), color: "text-yellow-400" },
                      { label: "Одобрено", value: String(configsList.filter(c => c.status === "approved").length), color: "text-primary" },
                      { label: "Всего", value: String(configsList.length) },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl glass border border-border/30 p-4 text-center">
                        <p className={`text-xl font-black ${s.color || "gradient-text"}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {configsList.map(cfg => (
                      <div key={cfg.id} className="rounded-xl glass border border-border/30 p-5 flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium">{cfg.author}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              cfg.status === "pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                              cfg.status === "approved" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                              "bg-destructive/10 text-destructive border-destructive/20"
                            }`}>
                              {cfg.status === "pending" ? "На модерации" : cfg.status === "approved" ? "Одобрен" : "Отклонён"}
                            </span>
                            <span className="text-xs text-muted-foreground">{cfg.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{cfg.description}</p>
                          <p className="text-sm mt-1"><span className="text-primary font-bold">{cfg.price}₽</span> · <span className="text-muted-foreground">{cfg.buyers.length} покупок</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                          {cfg.status === "pending" && (
                            <>
                              <button onClick={() => { store.approveConfig(cfg.id); setConfigsList(store.getConfigs()); toast({ title: "Конфиг одобрен" }); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                                <CheckCircle size={14} /> Одобрить
                              </button>
                              <button onClick={() => { store.rejectConfig(cfg.id); setConfigsList(store.getConfigs()); toast({ title: "Конфиг отклонён" }); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all">
                                <XCircle size={14} /> Отклонить
                              </button>
                            </>
                          )}
                          <button onClick={() => { store.deleteConfig(cfg.id); setConfigsList(store.getConfigs()); toast({ title: "Конфиг удалён" }); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {configsList.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Конфигов нет</p>}
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Статистика</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Пользователи", value: String(users.length) },
                      { label: "Активных ключей", value: String(activeKeys) },
                      { label: "Медиа-партнёры", value: String(users.filter(u => u.role === "media").length) },
                      { label: "Тикеты (откр.)", value: String(openTickets) },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl glass border border-border/30 p-5 text-center">
                        <p className="text-2xl font-black gradient-text">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl glass border border-border/30 p-6 mb-6">
                    <h3 className="font-bold mb-4">Доход за последние 7 дней</h3>
                    <div className="flex items-end gap-2 h-40">
                      {[35, 52, 28, 67, 45, 78, 61].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs text-muted-foreground">{Math.round(val * 120)}₽</span>
                          <div
                            className="w-full rounded-t-md bg-primary/30 hover:bg-primary/50 transition-colors"
                            style={{ height: `${val}%` }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl glass border border-border/30 p-5">
                      <h3 className="font-bold text-sm mb-3">Последние действия</h3>
                      <div className="space-y-2 text-sm">
                        {[
                          "Ключ AV-8F3A создан для Player123",
                          "YouTuber_Vanya запросил выплату",
                          "TestUser забанен",
                          "MediaGuy получил роль Медиа",
                        ].map((log, i) => (
                          <div key={i} className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl glass border border-border/30 p-5">
                      <h3 className="font-bold text-sm mb-3">Выплаты медиа</h3>
                      <div className="space-y-2 text-sm">
                        {payoutsList.filter(p => p.status === "pending").map((p) => (
                          <div key={p.id} className="flex items-center justify-between text-muted-foreground">
                            <span>{p.owner}</span>
                            <span className="text-primary font-semibold">{p.amount.toLocaleString()}₽</span>
                          </div>
                        ))}
                        {payoutsList.filter(p => p.status === "pending").length === 0 && (
                          <p className="text-muted-foreground text-xs">Нет ожидающих выплат</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ═══ ANNOUNCEMENTS TAB ═══ */}
              {activeTab === "announcements" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Объявления</h2>
                    <button onClick={() => setShowAnnForm(!showAnnForm)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                      <Plus size={16} /> Создать
                    </button>
                  </div>
                  {showAnnForm && (
                    <div className="rounded-xl glass border border-primary/20 p-5 mb-6 space-y-3">
                      <input type="text" placeholder="Заголовок" value={newAnnTitle} onChange={(e) => setNewAnnTitle(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                      <textarea placeholder="Текст объявления..." value={newAnnText} onChange={(e) => setNewAnnText(e.target.value)} rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 resize-none" />
                      <button onClick={() => {
                        if (!newAnnTitle.trim()) return;
                        setAnnouncements([{ id: Date.now(), title: newAnnTitle.trim(), text: newAnnText.trim(), date: new Date().toISOString().split("T")[0], active: true }, ...announcements]);
                        setNewAnnTitle(""); setNewAnnText(""); setShowAnnForm(false);
                        toast({ title: "Объявление создано" });
                      }} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Опубликовать
                      </button>
                    </div>
                  )}
                  <div className="space-y-3">
                    {announcements.map(ann => (
                      <div key={ann.id} className={`rounded-xl glass border p-5 transition-all ${ann.active ? "border-border/30" : "border-border/20 opacity-60"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm">{ann.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${ann.active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-muted text-muted-foreground border border-border/30"}`}>
                              {ann.active ? "Активно" : "Скрыто"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{ann.date}</span>
                            <button onClick={() => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, active: !a.active } : a))}
                              className="p-1.5 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all text-xs">
                              {ann.active ? "Скрыть" : "Показать"}
                            </button>
                            <button onClick={() => setAnnouncements(announcements.filter(a => a.id !== ann.id))}
                              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{ann.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ SETTINGS TAB ═══ */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Настройки сайта</h2>
                  <div className="rounded-xl glass border border-border/30 p-6 space-y-6">
                    {[
                      { key: "registrationOpen" as const, label: "Открытая регистрация", desc: "Новые пользователи могут регистрироваться" },
                      { key: "maintenanceMode" as const, label: "Режим обслуживания", desc: "Сайт недоступен для обычных пользователей" },
                      { key: "autoApproveConfigs" as const, label: "Авто-одобрение конфигов", desc: "Конфиги публикуются без модерации" },
                    ].map(setting => (
                      <div key={setting.key} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{setting.label}</p>
                          <p className="text-xs text-muted-foreground">{setting.desc}</p>
                        </div>
                        <button
                          onClick={() => setSiteSettings({ ...siteSettings, [setting.key]: !siteSettings[setting.key] })}
                          className={`w-12 h-6 rounded-full transition-all relative ${siteSettings[setting.key] ? "bg-primary" : "bg-secondary border border-border/50"}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-foreground absolute top-0.5 transition-all ${siteSettings[setting.key] ? "left-6" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-3 border-b border-border/20">
                      <div>
                        <p className="text-sm font-medium">Макс. ключей на пользователя</p>
                        <p className="text-xs text-muted-foreground">Ограничение активных ключей</p>
                      </div>
                      <input type="number" value={siteSettings.maxKeysPerUser} onChange={(e) => setSiteSettings({ ...siteSettings, maxKeysPerUser: Number(e.target.value) })}
                        className="w-16 h-8 px-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-center focus:outline-none focus:border-primary/50" min={1} max={10} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Мин. сумма выплаты (₽)</p>
                        <p className="text-xs text-muted-foreground">Минимальная сумма для запроса выплаты</p>
                      </div>
                      <input type="number" value={siteSettings.minPayoutAmount} onChange={(e) => setSiteSettings({ ...siteSettings, minPayoutAmount: Number(e.target.value) })}
                        className="w-20 h-8 px-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-center focus:outline-none focus:border-primary/50" min={50} step={50} />
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl glass border border-destructive/20 p-6">
                    <h3 className="font-bold text-sm text-destructive mb-3">Опасная зона</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Сбросить все данные</p>
                        <p className="text-xs text-muted-foreground">Удалит все промокоды, покупки и тикеты</p>
                      </div>
                      <button onClick={() => { store.reset(); refreshPromos(); toast({ title: "Данные сброшены" }); }}
                        className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors">
                        Сбросить
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </main>
      </div>

      {/* User detail modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setViewingUser(null)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-xl glass border border-border/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setViewingUser(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{viewingUser.name}</h3>
                <p className="text-sm text-muted-foreground">{viewingUser.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground">Роль</span>
                <span className="font-medium">{viewingUser.role === "media_plus" ? "Медиа+" : viewingUser.role === "media" ? "Медиа" : "Пользователь"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground">Статус</span>
                <span className={viewingUser.status === "active" ? "text-primary" : "text-destructive"}>{viewingUser.status === "active" ? "Активен" : "Забанен"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground">Дата регистрации</span>
                <span>{viewingUser.joined}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Ключей</span>
                <span>{keys.filter(k => k.user === viewingUser.name).length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
