import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import logoImage from "@/assets/logo.jpg";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
  };

  if (showForgot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(255_70%_65%_/_0.06)_0%,_transparent_60%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md z-10">
          <button onClick={() => { setShowForgot(false); setForgotSent(false); }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} /> Назад ко входу
          </button>
          <div className="rounded-2xl glass border border-border/40 p-8 text-center">
            <img src={logoImage} alt="Infinity" className="w-16 h-16 mx-auto rounded-xl object-cover mb-4" style={{ filter: "drop-shadow(0 0 20px hsl(255 70% 65% / 0.3))" }} />
            <h1 className="text-xl font-bold mb-1"><span className="gradient-text">Восстановление</span> пароля</h1>
            {forgotSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Инструкции отправлены на <span className="text-foreground font-medium">{forgotEmail}</span></p>
              </motion.div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4 text-left">
                <p className="text-sm text-muted-foreground text-center">Введите email, привязанный к аккаунту</p>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" autoFocus />
                </div>
                <button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-box">
                  Отправить
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(255_70%_65%_/_0.06)_0%,_transparent_60%)]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} />
          На главную
        </Link>

        <div className="rounded-2xl glass border border-border/40 p-8">
          <div className="text-center mb-8">
            <img src={logoImage} alt="Infinity" className="w-16 h-16 mx-auto rounded-xl object-cover mb-4"
              style={{ filter: "drop-shadow(0 0 20px hsl(255 70% 65% / 0.3))" }}
            />
            <h1 className="text-2xl font-bold">
              <span className="gradient-text">Inf</span>inity
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Войдите в аккаунт" : "Создайте аккаунт"}
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex rounded-lg bg-secondary/50 p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Имя пользователя</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder="Player123" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Пароль</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-11 pl-10 pr-12 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-primary hover:text-primary/80 transition-colors">
                Забыли пароль?
              </button>
            )}

            <button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-box">
              {mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
