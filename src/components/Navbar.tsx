import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo.jpg";

const navLinks = [
  { label: "Главная", href: "#hero", isHash: true },
  { label: "Функции", href: "#features", isHash: true },
  { label: "Галерея", href: "#gallery", isHash: true },
  { label: "Тарифы", href: "/pricing", isHash: false },
  { label: "FAQ", href: "/faq", isHash: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (link: typeof navLinks[0], e: React.MouseEvent) => {
    if (link.isHash) {
      if (window.location.pathname !== "/") {
        e.preventDefault();
        navigate("/" + link.href);
      }
    }
    setOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:top-0 ${
      scrolled ? "glass-heavy border-b border-border/20 shadow-lg shadow-black/20" : "bg-transparent"
    } max-md:top-2 max-md:mx-3 max-md:rounded-2xl max-md:border max-md:border-border/30 max-md:glass-heavy`}>
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent max-md:hidden" />
      )}
      
      <div className="container mx-auto flex items-center justify-between h-14 md:h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoImage} alt="AuraVisual" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-bold text-lg tracking-tight">
            <span className="gradient-text">AuraVisual</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isHash ? (
              <a key={link.href} href={link.href} onClick={(e) => handleClick(link, e)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                {link.label}
              </a>
            ) : (
              <Link key={link.href} to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth" className="inline-flex items-center justify-center h-9 px-5 rounded-lg text-muted-foreground font-medium text-sm hover:text-foreground transition-colors">
            Войти
          </Link>
          <Link to="/dashboard" className="inline-flex items-center justify-center h-9 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-box">
            Кабинет
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/20 overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) =>
                link.isHash ? (
                  <a key={link.href} href={link.href} onClick={(e) => handleClick(link, e)}
                    className="py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} to={link.href} onClick={() => setOpen(false)}
                    className="py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                    {link.label}
                  </Link>
                )
              )}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/20">
                <Link to="/auth" onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-10 rounded-lg border border-border/50 text-foreground font-semibold text-sm">
                  Войти
                </Link>
                <Link to="/dashboard" onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                  Кабинет
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
