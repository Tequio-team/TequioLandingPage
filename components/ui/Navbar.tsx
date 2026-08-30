"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Modal from "@/components/ui/Modal";

const NAV_LINKS = [
  { href: "/", sectionId: "hero", label: "Inicio", guardianBadge: "🌙" },
  { href: "/#que-es-tequio", sectionId: "que-es-tequio", label: "Propósito", guardianBadge: "📜" },
  { href: "/#pilares", sectionId: "pilares", label: "Pilares", guardianBadge: "🧱" },
  { href: "/#guardianes", sectionId: "guardianes", label: "Guardianes", guardianBadge: "🐰" },
  { href: "/eventos", sectionId: "eventos", label: "Eventos", guardianBadge: "🦝" },
  { href: "/manifiesto", sectionId: "manifiesto", label: "Manifiesto", guardianBadge: "🪶" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Easter Egg Click Count on Medallion "O"
  const [logoClicks, setLogoClicks] = useState(0);
  const [easterEggOpen, setEasterEggOpen] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => {
      setVisible(v > 40 || pathname !== "/");
    });
    return unsub;
  }, [scrollY, pathname]);

  // Section Observer for Landing Page (#hero, #que-es-tequio, #pilares, #guardianes)
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [pathname]);

  const handleLogoClick = () => {
    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);
    if (nextCount >= 3) {
      setEasterEggOpen(true);
      setLogoClicks(0);
    }
  };

  // Determine if a link is active
  const isLinkActive = (link: typeof NAV_LINKS[0]) => {
    if (pathname === "/eventos") {
      return link.href === "/eventos";
    }
    if (pathname === "/manifiesto") {
      return link.href === "/manifiesto";
    }
    if (pathname === "/unirse") {
      return false; // "Inscribirme" button is active
    }
    // Home Page "/"
    if (pathname === "/") {
      if (link.href === "/" && activeSection === "hero") return true;
      if (link.href.startsWith("/#") && activeSection === link.sectionId) return true;
    }
    return false;
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "rgba(11, 16, 32, 0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(217, 203, 184, 0.12)",
        }}
      >
        {/* Logo Link with Medallion Easter Egg */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer group relative"
          title="Tequio — Ir al Umbral"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/png/logo.png"
              alt="Tochtli, el sabio Conejo Lunar y logotipo oficial de Tequio"
              width={120}
              height={36}
              className="object-contain h-9 w-auto"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop Nav links with illuminated active indicator */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer font-inter text-sm relative transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ambar rounded px-1.5 py-1 group ${active ? "text-ambar font-bold drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]" : "text-arena/80 hover:text-ambar"
                  }`}
              >
                {link.label}

                {/* Animated active bar or hover line */}
                {active ? (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-ambar rounded-full shadow-[0_0_12px_#F5A623]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-ambar/60 transition-all duration-300 group-hover:w-full rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Button & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/unirse"
            className={`cursor-pointer font-inter text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${pathname === "/unirse"
                ? "bg-ambar text-azul-noche shadow-[0_0_25px_rgba(245,166,35,0.7)] scale-105"
                : "bg-terracota text-blanco-lunar hover:bg-terracota/90 hover:shadow-[0_0_20px_rgba(193,91,58,0.5)]"
              }`}
          >
            Inscribirme
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menú Ceremonial"
            className="lg:hidden flex flex-col items-center justify-center w-9 h-9 text-arena focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ambar rounded"
          >
            <div className={`w-6 h-0.5 bg-arena transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : "mb-1.5"}`} />
            <div className={`w-6 h-0.5 bg-arena transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "mb-1.5"}`} />
            <div className={`w-6 h-0.5 bg-arena transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu with Alebrije Badges & Active Glow */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-azul-noche/98 pt-24 px-8 lg:hidden flex flex-col justify-between pb-12 overflow-y-auto"
            style={{ background: "#0B1020" }}
          >
            <div className="flex flex-col gap-5">
              <span className="font-inter text-xs uppercase tracking-[0.2em] text-ambar font-semibold">
                Navegación Ceremonial
              </span>

              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-cinzel text-2xl font-bold tracking-wide border-b border-white/10 pb-3 flex items-center justify-between transition-colors ${active ? "text-ambar border-ambar" : "text-blanco-lunar hover:text-ambar"
                      }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xl">{link.guardianBadge}</span>
                  </Link>
                );
              })}
            </div>

            <p className="font-inter text-arena/60 text-xs text-center mt-8">
              © 2026 Comunidad Tequio · Construido en colectivo.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg Modal (3-Clicks on Medallion Logo) */}
      <Modal
        isOpen={easterEggOpen}
        onClose={() => setEasterEggOpen(false)}
        title="✨ Consejo Ancestral de Tochtli ✨"
      >
        <div className="flex flex-col gap-4 text-center">
          <p className="font-cinzel text-ambar text-xl font-bold">
            &quot;El fuego que no se comparte se apaga. Quien hoy recibe guía, mañana lidera y acompaña a otros.&quot;
          </p>
          <p className="font-inter text-arena text-sm opacity-90">
            ¡Has despertado el medallón del Códice! Has encontrado el consejo oculto de los guardianes.
          </p>
        </div>
      </Modal>
    </>
  );
}
