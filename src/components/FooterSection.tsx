import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.jpg";

const FooterSection = () => {
  return (
    <footer className="py-16 border-t border-border/20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-0 noise-bg" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="AuraVisual" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-lg tracking-tight">
                <span className="gradient-text">Inf</span>inity
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-4">
              Лучший визуальный мод для Minecraft 1.21.4 Fabric. Стиль, удобство и бесплатные визуалы.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground font-mono">
              <span>Телеграмм: <a href="https://t.me/siriusvisual" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@siriusvisual</a></span>
              <span>Поддержка: <a href="mailto:siriusvisual@mail.ru" className="text-primary hover:underline">siriusvisual@mail.ru</a></span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Навигация</h4>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-primary transition-colors">Функции</a>
              <a href="#gallery" className="hover:text-primary transition-colors">Галерея</a>
              <Link to="/pricing" className="hover:text-primary transition-colors">Тарифы</Link>
              <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Соцсети</h4>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <a href="https://discord.gg/rPsjGJmFu8" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Discord</a>
              <a href="https://t.me/siriusvisual" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Telegram</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © 2026 AuraVisual — Minecraft 1.21.4 Fabric
          </p>
          <p className="text-xs text-muted-foreground">
            Не связан с Mojang Studios
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
