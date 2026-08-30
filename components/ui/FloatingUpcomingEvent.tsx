"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function FloatingUpcomingEvent() {
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [eventTitle, setEventTitle] = useState("De Estudiante a Tech Lead");

  // Fetch upcoming event from Supabase
  useEffect(() => {
    async function loadUpcomingEvent() {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase
          .from("events")
          .select("title")
          .eq("status", "abierto")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data?.title) {
          setEventTitle(data.title.replace(/"/g, ""));
        }
      } catch (err) {
        console.warn("Error cargando evento próximo para botón flotante:", err);
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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        {/* BOTÓN FLOTANTE ESTILO WHATSAPP COMPACTO CON INSIGNIA ROJA EN VIVO */}
        <div className="relative group">
          
          {/* LUZ ROJA PARPADEANTE DE NOTIFICACIÓN EN LA ESQUINA DEL BOTÓN */}
          <span className="absolute -top-1 -right-1 z-20 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-azul-noche" />
          </span>

          <button
            onClick={handleClick}
            className="cursor-pointer font-inter font-bold text-xs bg-amber-500 text-azul-noche px-4 py-3 rounded-full shadow-[0_10px_30px_rgba(245,166,35,0.4)] border border-amber-300 hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-base animate-bounce">🔔</span>
            <div className="flex items-center gap-1.5">
              <span>Próximo Evento</span>
              <span className="text-arena/70 hidden sm:inline">· {eventTitle}</span>
              <span className="font-bold text-sm">→</span>
            </div>
          </button>
        </div>

        {/* BOTÓN CERRAR DISCRETO */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Ocultar notificación"
          className="cursor-pointer w-6 h-6 rounded-full bg-white/10 text-arena/70 text-[10px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-white/10"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
