"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import BrasaParticles from "@/components/ui/BrasaParticles";

const CORE_ACTIVITIES = [
  {
    id: "circulo-de-la-luna",
    guardian: "Tochtli",
    badgeIcon: "🐰",
    title: "Círculo de la Luna",
    subtitle: "Mentoría & Talks",
    shortDesc: "Charlas e inspiración directa con profesionales activos en la industria.",
    traits: ["Mentoría", "Carrera"],
    color: "#F5A623",
    glowColor: "rgba(245, 166, 35, 0.3)",
    shadowColor: "rgba(245, 166, 35, 0.15)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    id: "forja-comunitaria",
    guardian: "Tlacu",
    badgeIcon: "🦝",
    title: "Forja Comunitaria",
    subtitle: "Hackathons con Causa",
    shortDesc: "Maratones de código creando plataformas reales para albergues y comunidades.",
    traits: ["Código con Causa", "Impacto"],
    color: "#C15B3A",
    glowColor: "rgba(193, 91, 58, 0.3)",
    shadowColor: "rgba(193, 91, 58, 0.15)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "caravana-del-vuelo",
    guardian: "Kuku",
    badgeIcon: "🪶",
    title: "Caravana del Vuelo",
    subtitle: "Caravanas & Networking",
    shortDesc: "Asistencia en bloque a eventos tech. Nadie camina solo en la industria.",
    traits: ["Networking", "En Bloque"],
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.3)",
    shadowColor: "rgba(16, 185, 129, 0.15)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
      </svg>
    ),
  },
];

export default function ActivitiesFlashcardsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="actividades"
      ref={ref}
      className="relative py-24 overflow-hidden bg-azul-noche"
      style={{
        background: "linear-gradient(to bottom, #0F172A 0%, #151D32 50%, #0F172A 100%)",
      }}
    >
      <BrasaParticles count={30} className="z-0 opacity-60" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-inter text-ambar text-xs uppercase tracking-[0.2em] font-semibold mb-2 block">
            ✦ Nuestras Actividades ✦
          </span>
          <h2 className="font-cinzel text-blanco-lunar text-3xl md:text-4xl font-bold tracking-wide">
            ¿Qué Hacemos en Tequio?
          </h2>
        </motion.div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CORE_ACTIVITIES.map((card, index) => (
            <CompactFlashCard key={card.id} card={card} index={index} inView={inView} />
          ))}
        </div>

        {/* Link to Events */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href="/eventos"
            className="cursor-pointer font-inter text-xs font-semibold text-arena/80 hover:text-ambar transition-colors inline-flex items-center gap-1 border-b border-arena/30 pb-0.5"
          >
            <span>Ver convocatorias y faenas activas</span>
            <span>→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

function CompactFlashCard({
  card,
  index,
  inView,
}: {
  card: typeof CORE_ACTIVITIES[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        delay: index * 0.11,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      // whileHover via Framer Motion so it's compositor-only
      whileHover={{ y: -5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="cursor-pointer relative p-6 rounded-2xl flex flex-col justify-between overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.035)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${hovered ? card.color : "rgba(217, 203, 184, 0.12)"}`,
        boxShadow: hovered
          ? `0 10px 25px ${card.shadowColor}, inset 0 0 12px ${card.glowColor}`
          : "0 4px 15px rgba(11, 16, 32, 0.4)",
        // Only animate non-layout properties in CSS
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        willChange: "transform",
      }}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-2.5 rounded-xl flex items-center justify-center"
            style={{
              background: `${card.color}18`,
              color: card.color,
              border: `1px solid ${card.color}40`,
            }}
          >
            {card.icon}
          </div>
          <span className="font-inter text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10" style={{ color: card.color }}>
            {card.badgeIcon} {card.guardian}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-cinzel text-blanco-lunar text-xl font-bold mb-1 tracking-wide">
          {card.title}
        </h3>
        <p className="font-inter text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: card.color }}>
          {card.subtitle}
        </p>

        {/* Description */}
        <p className="font-inter text-arena text-xs leading-relaxed opacity-85 mb-4">
          {card.shortDesc}
        </p>
      </div>

      {/* Footer */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.traits.map((t) => (
            <span
              key={t}
              className="font-inter text-[10px] px-2 py-0.5 rounded font-medium"
              style={{
                background: `${card.color}15`,
                color: card.color,
                border: `1px solid ${card.color}35`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Accent line */}
        <div
          className="h-[3px] rounded-full w-full"
          style={{
            background: hovered
              ? `linear-gradient(90deg, ${card.color} 0%, transparent 100%)`
              : "rgba(255, 255, 255, 0.08)",
            boxShadow: hovered ? `0 0 8px ${card.color}` : "none",
            transition: "background 0.25s ease, box-shadow 0.25s ease",
          }}
        />
      </div>
    </motion.div>
  );
}
