"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function FloatingUpcomingEvent() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasActiveEvent, setHasActiveEvent] = useState(true);
  const [eventTitle, setEventTitle] = useState("De Estudiante a Tech Lead");

  // Check if there is an active upcoming event in Supabase
  useEffect(() => {
    async function checkUpcomingEvent() {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase
          .from("events")
          .select("title")
          .eq("status", "activa")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data?.title) {
          setEventTitle(data.title.replace(/"/g, ""));
          setHasActiveEvent(true);
        } else {
          setHasActiveEvent(false);
        }
      } catch (err) {
        console.warn("Error consultando evento próximo:", err);
      }
    }

    checkUpcomingEvent();
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-50 hidden md:flex items-center"
    >
      {/* BOTÓN FLOTANTE PERMANENTE CON ILUSTRACIÓN DE TOCHTLI Y LUZ ROJA SI HAY EVENTO */}
      <div className="relative group" onClick={handleClick}>
        
        {/* LUZ ROJA PARPADEANTE EN VIVO (SOLO SE PRENDE CUANDO HAY EVENTO EN PUERTA) */}
        {hasActiveEvent && (
          <span className="absolute -top-1.5 -right-1 z-20 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-85" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-azul-noche" />
          </span>
        )}

        <button
          className="cursor-pointer font-inter font-extrabold text-xs bg-amber-400 text-black px-4 py-2.5 rounded-full shadow-[0_10px_30px_rgba(245,166,35,0.5)] border-2 border-amber-300 hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5"
        >
          {/* AVATAR DE TOCHTLI EL CONEJO LUNAR GUARDIÁN */}
          <div className="relative w-7 h-7 flex-shrink-0">
            <Image
              src="/png/tochtli.png"
              alt="Tochtli el Sabio Conejo Lunar"
              fill
              className="object-contain drop-shadow-md"
            />
          </div>

          {/* ETIQUETA DINÁMICA: "EVENTO EN PUERTA" CON LUZ O SALUDO DE TOCHTLI */}
          <div className="flex items-center gap-1.5">
            <span>
              {hasActiveEvent ? "Faena en puerta · Ver detalles" : "¡Hola de Tequio!"}
            </span>
            <span className="font-bold text-sm">→</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
