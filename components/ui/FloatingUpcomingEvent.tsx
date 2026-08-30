"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const DEFAULT_EVENT = {
  id: "00000000-0000-0000-0000-000000000001",
  title: '"De Estudiante a Tech Lead: El Camino Sin Secretos"',
  date: "17 de Septiembre, 2026",
  badge: "🎙️ TEQUIO TALKS #01",
};

export default function FloatingUpcomingEvent() {
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [eventData, setEventData] = useState(DEFAULT_EVENT);
  const [hasEvent, setHasEvent] = useState(true);

  // Fetch upcoming featured event from Supabase
  useEffect(() => {
    async function loadUpcomingEvent() {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase
          .from("events")
          .select("*")
          .eq("status", "abierto")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setEventData({
            id: data.id,
            title: data.title,
            date: data.date_display,
            badge: data.type_badge || "🎙️ FAENA PRÓXIMA",
          });
          setHasEvent(true);
        }
      } catch (err) {
        console.warn("Error cargando evento próximo para notificación flotante:", err);
      }
    }

    loadUpcomingEvent();
  }, []);

  const handleClick = () => {
    if (pathname === "/eventos") {
      const el = document.getElementById("active-talk");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    } else {
      router.push("/eventos");
    }
  };

  if (dismissed || !hasEvent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full sm:w-auto"
      >
        <div
          className="relative p-4 md:p-5 rounded-3xl bg-azul-noche/95 border-2 border-amber-500/60 shadow-[0_15px_45px_rgba(245,166,35,0.35)] backdrop-blur-2xl text-blanco-lunar space-y-3 group cursor-pointer"
          onClick={handleClick}
        >
          {/* BOTÓN PARA CERRAR NOTIFICACIÓN */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            aria-label="Cerrar notificación"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/80 border border-white/20 text-arena text-xs flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md z-10"
          >
            ✕
          </button>

          {/* HEADER CON LUZ ROJA PARPADEANTE EN VIVO */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="font-inter text-[10px] uppercase tracking-widest font-bold text-amber-400">
                ✦ Evento Próximo en Puerta ✦
              </span>
            </div>

            <span className="font-inter text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {eventData.badge}
            </span>
          </div>

          {/* TÍTULO Y FECHA DEL EVENTO */}
          <div className="space-y-1">
            <h4 className="font-cinzel text-blanco-lunar text-sm font-bold group-hover:text-amber-300 transition-colors line-clamp-2">
              {eventData.title}
            </h4>
            <p className="font-inter text-xs text-arena/80">
              📅 {eventData.date}
            </p>
          </div>

          {/* BOTÓN CTA ACCIÓN PRINCIPAL */}
          <div className="pt-1 flex items-center justify-between">
            <span className="font-inter font-bold text-xs bg-amber-500 text-azul-noche px-4 py-2 rounded-xl group-hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md">
              <span>🚀 Ver Evento & Registrarme</span>
              <span>→</span>
            </span>

            <span className="font-inter text-[10px] text-amber-400 font-semibold underline">
              Cupos limitados
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
