import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Crosshair, Eye, Sparkles, Move, RotateCcw, Target,
  Lock, LayoutDashboard, Bell, Footprints, Heart,
  Ratio, Shield, CloudFog, Box, Navigation, Search,
  Hand, Bug, Flame, Atom, Swords, MousePointer,
  Users, Shirt, ChevronDown as DownIcon, Gamepad2,
  Sun, Moon, MapPin, Timer, Scroll, Volume2, Camera,
  Palette, Zap, Hammer, Globe, CircleDot, Glasses
} from "lucide-react";
import screenshot2 from "@/assets/gallery/screenshot-2.jpg";

type Category = "combat" | "visual" | "misc";

const features: Record<Category, { icon: any; title: string; desc: string }[]> = {
  combat: [
    { icon: Swords, title: "AutoShift", desc: "Автоматический присед во время ударов" },
    { icon: Hand, title: "BindSwap", desc: "Мгновенная смена предметов в левой руке" },
    { icon: Users, title: "ClickFriend", desc: "Добавление игроков в друзья по клику" },
    { icon: Navigation, title: "ElytraHelper", desc: "Свап элитры в игре" },
    { icon: Search, title: "ItemHelper", desc: "Помощь в использовании предметов по бинду" },
    { icon: Shield, title: "KTSave", desc: "Не даёт выйти из игры во время PVP" },
    { icon: Zap, title: "Sprint", desc: "Автоматический бег" },
    { icon: Shirt, title: "TapokSwap", desc: "Свапает ботинки" },
    { icon: DownIcon, title: "Twerk", desc: "Автоматические приседания" },
  ],
  visual: [
    { icon: Ratio, title: "Aspect", desc: "Изменение соотношения сторон экрана" },
    { icon: Bug, title: "Baby", desc: "Уменьшение размера персонажа" },
    { icon: Box, title: "BlockOutline", desc: "Кастомная обводка блоков" },
    { icon: Camera, title: "Camera", desc: "Настройка положения камеры" },
    { icon: Sparkles, title: "ChinaHat", desc: "Стильная китайская шляпа над головой" },
    { icon: LayoutDashboard, title: "ClickGui", desc: "Меню настроек клиента" },
    { icon: Crosshair, title: "CustomCrosshair", desc: "Кастомный прицел" },
    { icon: Box, title: "CustomHitbox", desc: "Кастомизация хитбоксов игроков" },
    { icon: LayoutDashboard, title: "HUD", desc: "Настройка элементов интерфейса" },
    { icon: CircleDot, title: "CustomItemRadius", desc: "Отображение радиуса кастомных предметов" },
    { icon: Eye, title: "Freelook", desc: "Осмотр вокруг без изменения позиции" },
    { icon: Flame, title: "HitColor", desc: "Изменение цвета урона по противнику" },
    { icon: Timer, title: "ItemCooldown", desc: "Отображение кулдаунов предметов" },
    { icon: Atom, title: "ItemPhysic", desc: "Реалистичная физика выброшенных предметов" },
    { icon: Footprints, title: "JumpCircle", desc: "Красивые круги при прыжке" },
    { icon: Users, title: "NameTag", desc: "Ник над игроком" },
    { icon: Glasses, title: "NightVision", desc: "Ночное видение без эффекта зелья" },
    { icon: Sun, title: "Nimb", desc: "Нимб над головой" },
    { icon: Eye, title: "NoRender", desc: "Отключение ненужных элементов рендера" },
    { icon: Sparkles, title: "Particle", desc: "Кастомные частицы" },
    { icon: Heart, title: "PotionWarning", desc: "Предупреждения о заканчивающихся зельях" },
    { icon: Navigation, title: "Prediction", desc: "Предсказание движения предметов" },
    { icon: Volume2, title: "Sounds", desc: "Кастомные звуки" },
    { icon: Target, title: "TargetESP", desc: "Подсветка цели в бою" },
    { icon: Palette, title: "Theme", desc: "Изменение темы оформления клиента" },
    { icon: Timer, title: "TNTTimer", desc: "Таймер взрыва ТНТ над динамитом" },
    { icon: Shield, title: "TotemLogger", desc: "Отслеживание тотемов противника" },
    { icon: Footprints, title: "Trail", desc: "Красивый след за персонажем" },
    { icon: Timer, title: "TrapTimer", desc: "Таймер исчезновения трапок" },
    { icon: Hand, title: "ViewModel", desc: "Настройка положения руки и предметов" },
    { icon: Search, title: "Zoom", desc: "Приближение как в подзорную трубу" },
    { icon: Hammer, title: "SwingAnimation", desc: "Кастомная анимация взмаха" },
    { icon: LayoutDashboard, title: "TargetHud", desc: "Инфо о игроке: броня, HP, ник, скин" },
    { icon: Bell, title: "Notifications", desc: "Уведомления о модулях и свапе" },
    { icon: Heart, title: "LowHealth", desc: "Предупреждение о низком здоровье" },
    { icon: CloudFog, title: "CustomFog", desc: "Кастомный цвет тумана" },
  ],
  misc: [
    { icon: Moon, title: "AFK", desc: "Автоматические действия в АФК режиме" },
    { icon: Globe, title: "Ambience", desc: "Изменение цвета неба, тумана и атмосферы" },
    { icon: Gamepad2, title: "AutoEvent", desc: "Автоматическое отслеживание ивентов" },
    { icon: RotateCcw, title: "AutoRevival", desc: "Автоматическое возрождение после смерти" },
    { icon: Sparkles, title: "BetterMinecraft", desc: "Улучшения стандартного Minecraft" },
    { icon: MapPin, title: "CoordDropper", desc: "Сброс координат в чат по кнопке" },
    { icon: MapPin, title: "DeathCoordinates", desc: "Сохранение координат места смерти" },
    { icon: Scroll, title: "ItemScroller", desc: "Перемещение предметов без задержки" },
    { icon: Lock, title: "LockSword", desc: "Блокировка выброса меча из рук" },
    { icon: Shield, title: "NameProtect", desc: "Скрытие имени в игре" },
    { icon: MousePointer, title: "TapeMouse", desc: "Автоматическое зажатие кнопок мыши" },
  ],
};

const tabs: { key: Category; label: string; count: number }[] = [
  { key: "combat", label: "Combat", count: features.combat.length },
  { key: "visual", label: "Visual", count: features.visual.length },
  { key: "misc", label: "Misc", count: features.misc.length },
];

const totalModules = tabs.reduce((sum, t) => sum + t.count, 0);

const FeaturesSection = () => {
  const [active, setActive] = useState<Category>("combat");

  return (
    <section id="features" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={screenshot2} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/93" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>
      <div className="absolute inset-0 noise-bg" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-3 block">modules</span>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="gradient-text">{totalModules}+</span> функций
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Полный набор модулей для комфортной игры
          </p>
        </motion.div>

        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  active === tab.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs font-mono ${active === tab.key ? "text-primary-foreground/70" : "text-muted-foreground/50"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto"
          >
            {features[active].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="group relative rounded-xl p-5 glass hover:border-primary/30 transition-all duration-300 hover:translate-y-[-2px]"
              >
                <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/3 transition-colors" />
                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
                    <f.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors font-mono">{f.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturesSection;
