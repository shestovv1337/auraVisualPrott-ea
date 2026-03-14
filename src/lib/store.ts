// Shared store with localStorage persistence for promo codes, purchases, and promo requests

export interface PromoCode {
  code: string;
  discount: number;
  commission: number; // % that goes to the media partner (e.g. 25 = 25%)
  uses: number;
  maxUses: number;
  active: boolean;
  owner: string;
  earnings: number;
  buyers: string[];
}

export interface Purchase {
  id: number;
  buyer: string;
  email: string;
  plan: string;
  price: number;
  originalPrice: number;
  promoCode: string | null;
  promoDiscount: number;
  commission: number; // amount earned by media partner
  date: string;
}

export interface PromoRequest {
  id: number;
  youtuber: string;
  code: string;
  discount: number;
  maxUses: number;
  channelUrl: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export interface PayoutRequest {
  id: number;
  owner: string;
  amount: number;
  method: string;
  details: string;
  status: "pending" | "paid" | "rejected";
  date: string;
}

export interface ConfigItem {
  id: number;
  author: string;
  description: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  date: string;
  buyers: string[];
}

export type TicketCategory = "bug" | "question" | "payout" | "youtube" | "other";

export interface TicketReply {
  id: number;
  author: string;
  isAdmin: boolean;
  text: string;
  date: string;
}

export interface Ticket {
  id: number;
  user: string;
  title: string;
  category: TicketCategory;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  date: string;
  description: string;
  replies: TicketReply[];
}
const defaultConfigs: ConfigItem[] = [
  { id: 1, author: "xNezuko", description: "123 123", price: 49, status: "approved", date: "2026-02-10", buyers: [] },
  { id: 2, author: "Demon1k", description: "123 123", price: 39, status: "approved", date: "2026-02-11", buyers: [] },
  { id: 3, author: "coldxbt", description: "123 123", price: 29, status: "approved", date: "2026-02-12", buyers: [] },
  { id: 4, author: "frostbyte", description: "123 123", price: 59, status: "approved", date: "2026-02-13", buyers: [] },
  { id: 5, author: "NewPlayer", description: "123 123", price: 35, status: "pending", date: "2026-02-14", buyers: [] },
];

const defaultTickets: Ticket[] = [
  { id: 1, user: "Player123", title: "Не работает FreeLook", category: "bug", status: "open", priority: "high", date: "2026-02-12", description: "При включении FreeLook камера залипает и не двигается.", replies: [
    { id: 1, author: "Admin", isAdmin: true, text: "Проверяем, спасибо за отчёт!", date: "2026-02-12" },
    { id: 2, author: "Player123", isAdmin: false, text: "Жду фикса, спасибо!", date: "2026-02-13" },
  ]},
  { id: 2, user: "ProPlayer", title: "Вопрос по оплате", category: "question", status: "open", priority: "medium", date: "2026-02-13", description: "Можно ли оплатить через QIWI?", replies: [] },
  { id: 3, user: "TestUser", title: "Баг с частицами", category: "bug", status: "closed", priority: "low", date: "2026-02-08", description: "Частицы отображаются некорректно на AMD видеокартах.", replies: [
    { id: 1, author: "Admin", isAdmin: true, text: "Исправлено в версии 2.1", date: "2026-02-09" },
  ]},
  { id: 4, user: "YouTuber_Vanya", title: "Заявка на YouTube партнёрство", category: "youtube", status: "open", priority: "high", date: "2026-02-14", description: "Канал: https://youtube.com/@vanya_plays, 15k подписчиков. Хочу стать медиа-партнёром.", replies: [] },
];


// ── Default data ──

const defaultPromos: PromoCode[] = [
  { code: "YOUTUBE10", discount: 10, commission: 25, uses: 23, maxUses: 100, active: true, owner: "YouTuber_Vanya", earnings: 2691, buyers: ["player1@mail.ru", "player2@mail.ru", "gamer88@mail.ru"] },
  { code: "MEDIA20", discount: 20, commission: 30, uses: 8, maxUses: 50, active: true, owner: "MediaGuy", earnings: 748, buyers: ["test@mail.ru"] },
  { code: "SPECIAL30", discount: 30, commission: 50, uses: 50, maxUses: 50, active: false, owner: "YouTuber_Vanya", earnings: 4095, buyers: ["user5@mail.ru", "pro@mail.ru"] },
];

const defaultPurchases: Purchase[] = [
  { id: 1, buyer: "Player123", email: "player@mail.ru", plan: "Premium", price: 234, originalPrice: 260, promoCode: "YOUTUBE10", promoDiscount: 10, commission: 59, date: "2026-02-10" },
  { id: 2, buyer: "ProPlayer", email: "pro@mail.ru", plan: "Premium", price: 260, originalPrice: 260, promoCode: null, promoDiscount: 0, commission: 0, date: "2026-02-05" },
  { id: 3, buyer: "TestBuyer", email: "test@mail.ru", plan: "Premium", price: 208, originalPrice: 260, promoCode: "MEDIA20", promoDiscount: 20, commission: 62, date: "2026-02-12" },
];

const defaultRequests: PromoRequest[] = [
  { id: 1, youtuber: "NewYoutuber", code: "NEWTUBE15", discount: 15, maxUses: 50, channelUrl: "https://youtube.com/@newtube", status: "pending", date: "2026-02-13" },
  { id: 2, youtuber: "StreamerKid", code: "STREAM25", discount: 25, maxUses: 30, channelUrl: "https://youtube.com/@streamerkid", status: "pending", date: "2026-02-14" },
];

const defaultPayouts: PayoutRequest[] = [
  { id: 1, owner: "YouTuber_Vanya", amount: 2000, method: "Банковская карта", details: "4276 **** **** 1234", status: "paid", date: "2026-02-08" },
  { id: 2, owner: "MediaGuy", amount: 500, method: "QIWI", details: "+7 999 ***-**-12", status: "pending", date: "2026-02-13" },
];

// ── localStorage helpers ──

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

// ── State with persistence ──

let _promos: PromoCode[] = load("av_promos", defaultPromos);
let _purchases: Purchase[] = load("av_purchases", defaultPurchases);
let _requests: PromoRequest[] = load("av_requests", defaultRequests);
let _payouts: PayoutRequest[] = load("av_payouts", defaultPayouts);
let _tickets: Ticket[] = load("av_tickets", defaultTickets);
let _configs: ConfigItem[] = load("av_configs", defaultConfigs);
let _nextPurchaseId = load("av_next_pid", 4);
let _nextRequestId = load("av_next_rid", 3);
let _nextPayoutId = load("av_next_payid", 3);
let _nextTicketId = load("av_next_tid", 5);
let _nextReplyId = load("av_next_repid", 4);
let _nextConfigId = load("av_next_cfgid", 6);

function persist() {
  save("av_promos", _promos);
  save("av_purchases", _purchases);
  save("av_requests", _requests);
  save("av_payouts", _payouts);
  save("av_tickets", _tickets);
  save("av_configs", _configs);
  save("av_next_pid", _nextPurchaseId);
  save("av_next_rid", _nextRequestId);
  save("av_next_payid", _nextPayoutId);
  save("av_next_tid", _nextTicketId);
  save("av_next_repid", _nextReplyId);
  save("av_next_cfgid", _nextConfigId);
}

export const store = {
  // Promos
  getPromos: () => [..._promos],
  addPromo: (p: Omit<PromoCode, "uses" | "earnings" | "buyers">) => {
    _promos = [..._promos, { ...p, uses: 0, earnings: 0, buyers: [] }];
    persist();
  },
  togglePromo: (code: string) => {
    _promos = _promos.map(p => p.code === code ? { ...p, active: !p.active } : p);
    persist();
  },
  deletePromo: (code: string) => {
    _promos = _promos.filter(p => p.code !== code);
    persist();
  },
  updatePromoCommission: (code: string, commission: number) => {
    _promos = _promos.map(p => p.code === code ? { ...p, commission } : p);
    persist();
  },
  findPromo: (code: string) => _promos.find(p => p.code.toUpperCase() === code.toUpperCase()),

  // Purchases
  getPurchases: () => [..._purchases],
  getPurchasesByPromo: (code: string) => _purchases.filter(p => p.promoCode?.toUpperCase() === code.toUpperCase()),
  addPurchase: (p: Omit<Purchase, "id">) => {
    const purchase = { ...p, id: _nextPurchaseId++ };
    _purchases = [purchase, ..._purchases];
    if (p.promoCode) {
      _promos = _promos.map(pr => {
        if (pr.code.toUpperCase() === p.promoCode?.toUpperCase()) {
          const commissionAmount = Math.round(p.price * (pr.commission / 100));
          return { ...pr, uses: pr.uses + 1, earnings: pr.earnings + commissionAmount, buyers: [...pr.buyers, p.email] };
        }
        return pr;
      });
    }
    persist();
    return purchase;
  },
  hasBuyerPurchased: (email: string) => _purchases.some(p => p.email.toLowerCase() === email.toLowerCase()),

  // Promo requests
  getRequests: () => [..._requests],
  addRequest: (r: Omit<PromoRequest, "id" | "status" | "date">) => {
    _requests = [..._requests, { ...r, id: _nextRequestId++, status: "pending", date: new Date().toISOString().split("T")[0] }];
    persist();
  },
  approveRequest: (id: number, commission: number = 25) => {
    const req = _requests.find(r => r.id === id);
    if (req) {
      _requests = _requests.map(r => r.id === id ? { ...r, status: "approved" as const } : r);
      store.addPromo({ code: req.code, discount: req.discount, commission, maxUses: req.maxUses, active: true, owner: req.youtuber });
    }
    persist();
  },
  rejectRequest: (id: number) => {
    _requests = _requests.map(r => r.id === id ? { ...r, status: "rejected" as const } : r);
    persist();
  },

  // Payouts
  getPayouts: () => [..._payouts],
  addPayout: (p: Omit<PayoutRequest, "id" | "status" | "date">) => {
    _payouts = [..._payouts, { ...p, id: _nextPayoutId++, status: "pending", date: new Date().toISOString().split("T")[0] }];
    persist();
  },
  updatePayoutStatus: (id: number, status: PayoutRequest["status"]) => {
    _payouts = _payouts.map(p => p.id === id ? { ...p, status } : p);
    persist();
  },

  // Tickets
  getTickets: () => [..._tickets],
  addTicket: (t: Omit<Ticket, "id" | "status" | "date" | "replies">) => {
    _tickets = [{ ...t, id: _nextTicketId++, status: "open", date: new Date().toISOString().split("T")[0], replies: [] }, ..._tickets];
    persist();
  },
  updateTicketStatus: (id: number, status: Ticket["status"]) => {
    _tickets = _tickets.map(t => t.id === id ? { ...t, status } : t);
    persist();
  },
  addReply: (ticketId: number, author: string, isAdmin: boolean, text: string) => {
    _tickets = _tickets.map(t => t.id === ticketId ? { ...t, replies: [...t.replies, { id: _nextReplyId++, author, isAdmin, text, date: new Date().toISOString().split("T")[0] }] } : t);
    persist();
  },

  // Configs
  getConfigs: () => [..._configs],
  getApprovedConfigs: () => _configs.filter(c => c.status === "approved"),
  getPendingConfigs: () => _configs.filter(c => c.status === "pending"),
  addConfig: (c: { author: string; description: string; price: number }) => {
    _configs = [..._configs, { ...c, id: _nextConfigId++, status: "pending", date: new Date().toISOString().split("T")[0], buyers: [] }];
    persist();
  },
  approveConfig: (id: number) => {
    _configs = _configs.map(c => c.id === id ? { ...c, status: "approved" as const } : c);
    persist();
  },
  rejectConfig: (id: number) => {
    _configs = _configs.map(c => c.id === id ? { ...c, status: "rejected" as const } : c);
    persist();
  },
  deleteConfig: (id: number) => {
    _configs = _configs.filter(c => c.id !== id);
    persist();
  },
  buyConfig: (configId: number, buyer: string) => {
    _configs = _configs.map(c => c.id === configId ? { ...c, buyers: [...c.buyers, buyer] } : c);
    persist();
  },
  hasUserBoughtConfig: (configId: number, buyer: string) => {
    const c = _configs.find(cfg => cfg.id === configId);
    return c ? c.buyers.includes(buyer) : false;
  },

  // Reset
  reset: () => {
    localStorage.removeItem("av_promos");
    localStorage.removeItem("av_purchases");
    localStorage.removeItem("av_requests");
    localStorage.removeItem("av_payouts");
    localStorage.removeItem("av_tickets");
    localStorage.removeItem("av_configs");
    localStorage.removeItem("av_next_pid");
    localStorage.removeItem("av_next_rid");
    localStorage.removeItem("av_next_payid");
    localStorage.removeItem("av_next_tid");
    localStorage.removeItem("av_next_repid");
    localStorage.removeItem("av_next_cfgid");
    _promos = [...defaultPromos];
    _purchases = [...defaultPurchases];
    _requests = [...defaultRequests];
    _payouts = [...defaultPayouts];
    _tickets = [...defaultTickets];
    _configs = [...defaultConfigs];
    _nextPurchaseId = 4;
    _nextRequestId = 3;
    _nextPayoutId = 3;
    _nextTicketId = 5;
    _nextReplyId = 4;
    _nextConfigId = 6;
  },
};
