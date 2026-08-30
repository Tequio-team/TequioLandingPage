"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function FloatingUpcomingEvent() {
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const handleClick = () => {
    if (pathname === "/eventos") {
      const el = document.getElementById("active-talk");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    } else {
      router.push("/eventos#active-talk");
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5"
      >
        {/* BOTÓN FLOTANTE COMPACTO CON LETRA NEGRA E INSIGNIA DE NOTIFICACIÓN ROJA */}
        <div className="relative">
          {/* LUZ ROJA PARPADEANTE DE NOTIFICACIÓN EN LA ESQUINA */}
          <span className="absolute -top-1 -right-1 z-20 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-black" />
          </span>

          <button
            onClick={handleClick}
            className="cursor-pointer font-inter font-extrabold text-xs bg-amber-400 text-black px-4 py-2.5 rounded-full shadow-[0_8px_25px_rgba(245,166,35,0.45)] border border-amber-300 hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
          >
            <span className="text-sm">🔔</span>
            <span>Evento en puerta · Ver detalles →</span>
          </button>
        </div>

        {/* BOTÓN CERRAR DISCRETO */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Ocultar notificación"
          className="cursor-pointer w-5 h-5 rounded-full bg-black/60 text-white/80 text-[10px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-white/20"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
