"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const LUMA_CALENDAR_URL = "https://luma.com/cal-U0kFC53t9Lv1LCY";

const DEFAULT_EVENT = {
  id: "default-event-1",
  title: "De Estudiante a Tech Lead: El Camino Sin Secretos",
  event_date: "Jueves 17 de Septiembre, 2026",
  time_display: "07:00 PM — 08:30 PM (CDMX)",
  is_online: true,
  location: "Google Meet",
  luma_url: "https://luma.com/event/evt-C1nAPcQ4ME9mTeL",
  speaker_name: "David Reyes",
  speaker_linkedin: "https://www.linkedin.com/in/david-reyes-tech",
  guardian: "tochtli",
  status: "activa",
};

export default function EventSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [cardHovered, setCardHovered] = useState(false);
  const [activeEvent, setActiveEvent] = useState(DEFAULT_EVENT);

  useEffect(() => {
    async function loadActiveEvent() {
      try {
        const { supabase } = await import("@/lib/supabase");
        // Support both new "activa" and old "abierto" status
        const { data: activa } = await supabase
          .from("events")
          .select("*")
          .in("status", ["activa", "abierto"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (activa) {
          // Merge speaker fallback from DEFAULT_EVENT if DB fields are empty
          setActiveEvent({
            ...DEFAULT_EVENT,
            ...activa,
            speaker_name: activa.speaker_name || DEFAULT_EVENT.speaker_name,
            speaker_linkedin: activa.speaker_linkedin || DEFAULT_EVENT.speaker_linkedin,
          });
        }
      } catch (err) {
        console.warn("Usando evento local por defecto:", err);
      }
    }

    loadActiveEvent();
  }, []);

  return (
    <section
      id="evento"
      ref={ref}
      className="relative py-14 md:py-28 overflow-hidden bg-blanco-lunar"
      style={{
        background: "linear-gradient(to bottom, #1a2332 0%, #F9F7F2 15%, #F9F7F2 85%, #1a2332 100%)",
      }}
    >
      {/* Terracota Mitla Pattern Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #C15B3A 0px, #C15B3A 1px, transparent 1px, transparent 25px)`,
        }}
      />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        {/* Section Label */}
        <motion.p
          className="text-center font-inter text-gris-pizarra uppercase tracking-widest text-sm mb-4 font-semibold opacity-75"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Plaza del Encuentro
        </motion.p>

        {/* Parchment Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          whileHover={{ y: -8 }}
          onHoverStart={() => setCardHovered(true)}
          onHoverEnd={() => setCardHovered(false)}
          className="relative rounded-3xl p-6 sm:p-8 md:p-12 overflow-hidden"
          style={{
            background: "#ffffff",
            borderLeft: "10px solid #C15B3A",
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)",
            boxShadow: cardHovered
              ? "0 30px 80px rgba(193,91,58,0.25), 0 10px 40px rgba(193,91,58,0.15)"
              : "0 10px 50px rgba(193,91,58,0.12)",
            transition: "box-shadow 0.4s ease",
          }}
        >
          {/* Badge "Próximo Evento" */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <span className="font-inter text-xs uppercase tracking-widest text-terracota font-bold flex items-center gap-1.5">
              <span>✦ FAENA COMUNITARIA</span>
            </span>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-inter font-bold text-xs text-blanco-lunar px-4 py-1.5 rounded-full border border-amber-300 shadow-md flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
            >
              <span>🔥 Faena Activa</span>
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="font-cinzel text-azul-noche text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 md:mb-6 tracking-wide font-bold leading-tight">
            {activeEvent.title}
          </h2>

          {/* Date, Time & Modality with Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 md:mb-6 bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80">
            <div className="flex items-center gap-3">
              <span className="text-2xl flex-shrink-0">📅</span>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-500 block font-semibold">
                  Fecha y Horario
                </span>
                <p className="font-inter text-azul-noche text-sm sm:text-base font-bold">
                  {activeEvent.event_date}
                </p>
                <span className="font-inter text-xs text-gris-pizarra block">
                  {activeEvent.time_display}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl flex-shrink-0">
                {activeEvent.is_online ? "🖥️" : "📍"}
              </span>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-500 block font-semibold">
                  Modalidad & Ubicación
                </span>
                <p className="font-inter text-azul-noche text-sm sm:text-base font-bold flex items-center gap-1.5">
                  <span>{activeEvent.is_online ? "En línea (Meet / Live)" : "Presencial (En persona)"}</span>
                </p>
                <span className="font-inter text-xs text-gris-pizarra block">
                  {activeEvent.location}
                </span>
              </div>
            </div>
          </div>

          {/* Guest / Speaker Banner */}
          {activeEvent.speaker_name && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-500/40 flex items-center justify-center text-xl flex-shrink-0">
                  🎙️
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-terracota block tracking-wider">
                    Ponente / Invitado Especial
                  </span>
                  <p className="font-inter text-azul-noche text-base font-bold">
                    {activeEvent.speaker_name}
                  </p>
                </div>
              </div>

              {activeEvent.speaker_linkedin && (
                <a
                  href={activeEvent.speaker_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter font-bold text-xs bg-[#0077B5] hover:bg-[#005885] text-white px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <span className="font-black text-sm">in</span>
                  <span>Ver perfil en LinkedIn ↗</span>
                </a>
              )}
            </div>
          )}

          {/* Direct Luma Link */}
          <div className="pt-2">
            <a
              href={activeEvent.luma_url || LUMA_CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center justify-center gap-2.5 font-inter font-bold bg-gradient-to-r from-terracota via-orange-600 to-amber-500 text-blanco-lunar px-8 py-4 rounded-2xl shadow-[0_10px_28px_rgba(193,91,58,0.45)] hover:shadow-[0_14px_35px_rgba(245,166,35,0.6)] hover:scale-105 active:scale-95 text-base md:text-lg border border-amber-400/40 transition-all duration-300"
            >
              <span>Ver evento en Luma</span>
              <span className="text-xl">↗</span>
            </a>
          </div>

          {/* Tlacu PNG Peeking from Bottom Right */}
          <motion.div
            className="absolute -bottom-10 right-6 z-20 pointer-events-none hidden md:block"
            animate={cardHovered ? { rotate: [-5, 5, -5], y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 1.5, repeat: cardHovered ? Infinity : 0 }}
          >
            <Image
              src="/png/tlacu.png"
              alt="Guardián Tlacu"
              width={90}
              height={110}
              className="object-contain opacity-90"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
