"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { getEventType } from "@/lib/eventTypes";

const LUMA_CALENDAR_URL = "https://luma.com/cal-U0kFC53t9Lv1LCY";

const DEFAULT_EVENTS = [
  {
    id: "default-event-1",
    title: "De Estudiante a Tech Lead: El Camino Sin Secretos",
    event_date: "Jueves 17 de Septiembre, 2026",
    time_display: "07:00 PM — 08:30 PM (CDMX)",
    is_online: true,
    location: "Google Meet",
    luma_url: "https://luma.com/event/evt-C1nAPcQ4ME9mTeL",
    speaker_name: "David Reyes",
    speaker_linkedin: "https://www.linkedin.com/in/david-reyes-tech",
    event_type: "tequio_talks",
    guardian: "tochtli",
    status: "activa",
  },
];

export default function EventSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeEvents, setActiveEvents] = useState(DEFAULT_EVENTS);

  useEffect(() => {
    async function loadActiveEvents() {
      try {
        const { supabase } = await import("@/lib/supabase");
        // Fetch ALL active events (multiple allowed)
        const { data } = await supabase
          .from("events")
          .select("*")
          .in("status", ["activa", "abierto"])
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          // Merge speaker fallback from DEFAULT for first event
          const merged = data.map((ev) => ({
            ...DEFAULT_EVENTS[0],
            ...ev,
            speaker_name: ev.speaker_name || "",
            speaker_linkedin: ev.speaker_linkedin || "",
          }));
          setActiveEvents(merged);
        }
      } catch (err) {
        console.warn("Usando eventos locales por defecto:", err);
      }
    }

    loadActiveEvents();
  }, []);

  return (
    <section
      id="evento"
      ref={ref}
      className="relative py-14 md:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #1a2332 0%, #F9F7F2 15%, #F9F7F2 85%, #1a2332 100%)",
      }}
    >
      {/* Pattern background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #C15B3A 0px, #C15B3A 1px, transparent 1px, transparent 25px)`,
        }}
      />

      <div className="container mx-auto px-5 max-w-4xl relative z-10">
        {/* Section Label */}
        <motion.p
          className="text-center font-inter text-gris-pizarra uppercase tracking-widest text-xs sm:text-sm mb-4 font-semibold opacity-75"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Plaza del Encuentro
        </motion.p>

        {/* Multiple active event cards */}
        <div className={`${activeEvents.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""}`}>
          {activeEvents.map((ev, i) => (
            <EventCard key={ev.id} event={ev} index={i} inView={inView} totalCount={activeEvents.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({
  event,
  index,
  inView,
  totalCount,
}: {
  event: typeof DEFAULT_EVENTS[0];
  index: number;
  inView: boolean;
  totalCount: number;
}) {
  const [hovered, setHovered] = useState(false);
  const et = getEventType(event.event_type);
  const isSingle = totalCount === 1;

  const guardianImg =
    event.guardian === "tochtli" || event.guardian === "tochtli_tlacu"
      ? "/png/tochtli.png"
      : event.guardian === "kuku"
      ? "/png/kuku.png"
      : "/png/tlacu.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: "#ffffff",
        borderLeft: `8px solid ${et.color}`,
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
        boxShadow: hovered
          ? `0 24px 60px ${et.glow}, 0 8px 30px rgba(0,0,0,0.12)`
          : "0 8px 40px rgba(193,91,58,0.10)",
        transition: "box-shadow 0.35s ease",
        willChange: "transform",
      }}
    >
      <div className={`p-5 sm:p-8 ${isSingle ? "md:p-10" : ""}`}>
        {/* Event Type Badge + Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {/* Type pill */}
            <span
              className="font-inter text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{
                background: `${et.color}18`,
                color: et.color,
                border: `1px solid ${et.color}45`,
              }}
            >
              <span>{et.icon}</span>
              <span>{et.label}</span>
              <span>{et.guardianEmoji}</span>
            </span>
          </div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="font-inter font-bold text-[10px] sm:text-xs text-white px-3 py-1.5 rounded-full border shadow-md flex items-center gap-1.5"
            style={{
              background: `linear-gradient(135deg, ${et.color}, ${et.color}cc)`,
              borderColor: `${et.color}60`,
            }}
          >
            <span>🔥 Faena Activa</span>
          </motion.div>
        </div>

        {/* Event Type subtitle */}
        <p
          className="font-inter text-[11px] uppercase tracking-widest font-semibold mb-2"
          style={{ color: et.color }}
        >
          {et.subtitle}
        </p>

        {/* Title */}
        <h2 className={`font-cinzel text-azul-noche font-bold leading-tight mb-4 ${
          isSingle
            ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl"
            : "text-lg sm:text-xl md:text-2xl"
        }`}>
          {event.title}
        </h2>

        {/* Date & Modality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 bg-gray-50/90 p-4 rounded-2xl border border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xl flex-shrink-0">📅</span>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 block font-semibold">
                Fecha y Horario
              </span>
              <p className="font-inter text-azul-noche text-sm font-bold">{event.event_date}</p>
              <span className="font-inter text-xs text-gris-pizarra block">{event.time_display}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl flex-shrink-0">{event.is_online ? "🖥️" : "📍"}</span>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 block font-semibold">
                Modalidad & Lugar
              </span>
              <p className="font-inter text-azul-noche text-sm font-bold">
                {event.is_online ? "En línea (Meet / Live)" : "Presencial"}
              </p>
              <span className="font-inter text-xs text-gris-pizarra block">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Speaker Banner */}
        {event.speaker_name && (
          <div
            className="mb-4 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl"
            style={{
              background: `${et.color}12`,
              border: `1px solid ${et.color}35`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${et.color}20`, border: `1px solid ${et.color}45` }}
              >
                🎙️
              </div>
              <div>
                <span
                  className="text-[10px] uppercase font-bold block tracking-wider"
                  style={{ color: et.color }}
                >
                  Ponente / Invitado Especial
                </span>
                <p className="font-inter text-azul-noche text-sm font-bold">{event.speaker_name}</p>
              </div>
            </div>

            {event.speaker_linkedin && (
              <a
                href={event.speaker_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter font-bold text-xs bg-[#0077B5] hover:bg-[#005885] text-white px-3.5 py-2 rounded-xl transition-colors shadow flex items-center gap-1.5"
              >
                <span className="font-black text-sm">in</span>
                <span>LinkedIn ↗</span>
              </a>
            )}
          </div>
        )}

        {/* Luma CTA */}
        <a
          href={event.luma_url || LUMA_CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer inline-flex items-center justify-center gap-2 font-inter font-bold text-white px-6 py-3.5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform text-sm md:text-base"
          style={{
            background: `linear-gradient(135deg, ${et.color} 0%, ${et.color}cc 100%)`,
            boxShadow: `0 10px 24px ${et.glow}`,
          }}
        >
          <span>Ver evento en Luma</span>
          <span className="text-lg">↗</span>
        </a>
      </div>

      {/* Guardian decoration — only shown when single and not on mobile */}
      {isSingle && (
        <motion.div
          className="absolute -bottom-8 right-4 z-20 pointer-events-none hidden md:block"
          animate={hovered ? { rotate: [-4, 4, -4], y: -4 } : { rotate: 0, y: 0 }}
          transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
        >
          <Image
            src={guardianImg}
            alt="Guardián"
            width={80}
            height={98}
            className="object-contain opacity-85"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
