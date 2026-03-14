import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import logoImage from "@/assets/logo.jpg";

const SITE_PASSWORD = "aura2026";

const PasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("site_unlocked") === "true");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem("site_unlocked", "true");
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(255_70%_65%_/_0.06)_0%,_transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-2xl glass border border-border/40 p-8 text-center">
          <img src={logoImage} alt="Infinity" className="w-16 h-16 mx-auto rounded-xl object-cover mb-4"
            style={{ filter: "drop-shadow(0 0 20px hsl(255 70% 65% / 0.3))" }}
          />
          <h1 className="text-xl font-bold mb-1">
            <span className="gradient-text">Inf</span>inity
          </h1>
          <p className="text-sm text-muted-foreground mb-6">Доступ ограничен. Введите пароль.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-11 pl-10 pr-12 rounded-lg bg-secondary/50 border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none transition-all ${
                  error ? "border-red-500 shake" : "border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                }`}
                autoFocus
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-400">Неверный пароль</p>}
            <button type="submit"
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-box">
              Войти
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordGate;
