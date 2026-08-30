"use client";
import { useState } from "react";
import BrasaParticles from "@/components/ui/BrasaParticles";

const PILLARS = [
  {
    id: "nadie-camina-solo",
    title: "Nadie camina solo",
    subtitle: "Mentoría e Industria · Círculo de la Luna",
    guardianBadge: "🐰 Tochtli",
    description:
      "Derribamos la barrera entre la universidad y la industria. A través del Círculo de la Luna y Sendero del Guía, profesionales activos brindan mentoría 1:1, revisión de CV y charlas de carrera.",
    activitiesTag: ["Tequio Talks", "Mentoría 1:1", "Revisión de CV"],
    color: "#F5A623",
    glowColor: "rgba(245, 166, 35, 0.35)",
    shadowColor: "rgba(245, 166, 35, 0.18)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "tecnologia-con-alma",
    title: "Tecnología con Alma",
    subtitle: "Impacto Real con Sentido Social · Forja Comunitaria",
    guardianBadge: "🦝 Tlacu",
    description:
      "Donamos tiempo y habilidades técnicas para resolver problemas reales del entorno. Mediante la Forja Comunitaria y Talleres de la Brasa, construimos software útil para albergues y comunidades.",
    activitiesTag: ["Hackathons con Causa", "Workshops Prácticos", "Software Social"],
    color: "#C15B3A",
    glowColor: "rgba(193, 91, 58, 0.35)",
    shadowColor: "rgba(193, 91, 58, 0.18)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    id: "aprender-y-devolver",
    title: "Aprender y Devolver",
    subtitle: "Ciclo del Conocimiento · Umbral & Jornadas",
    guardianBadge: "🐰 Tochtli & 🦝 Tlacu",
    description:
      "El conocimiento no se acumula; se comparte. Quien aprende hoy, guía mañana en el Umbral de la Tribu y participa presencialmente en las Jornadas de la Faena en campo.",
    activitiesTag: ["Onboarding", "Voluntariado Directo", "Acompañamiento"],
    color: "#14b8a6",
    glowColor: "rgba(20, 184, 166, 0.35)",
    shadowColor: "rgba(20, 184, 166, 0.18)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
  {
    id: "comunidad-en-movimiento",
    title: "Comunidad en Movimiento",
    subtitle: "Asistencia en Bloque · Caravana del Vuelo",
    guardianBadge: "🪶 Kuku",
    description:
      "Asistimos en bloque a eventos y conferencias tech a través de la Caravana del Vuelo y Fogatas de la Tribu, creando espacios seguros, accesibles y libres de intimidación.",
    activitiesTag: ["Caravanas Tech", "Networking Seguro", "Meetups"],
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.35)",
    shadowColor: "rgba(16, 185, 129, 0.18)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

export default function PillarsSection() {
  return (
    <section
      id="pilares"
      className="relative py-16 md:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #0F172A 0%, #151D32 50%, #0F172A 100%)",
      }}
    >
      <BrasaParticles count={30} className="z-0 opacity-55" />

      <div className="container mx-auto px-5 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-cinzel text-blanco-lunar text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 tracking-wide font-bold">
            Los Pilares y Actividades de Nuestra Faena
          </h2>
          <p className="font-inter text-arena text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto opacity-85">
            Las losas de saber y las acciones colectivas que sostienen la filosofía y el trabajo diario en Tequio.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar }: { pillar: typeof PILLARS[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer relative p-5 sm:p-7 rounded-2xl flex flex-col justify-between overflow-hidden hover:-translate-y-1 transition-transform duration-300"
      style={{
        background: "rgba(255, 255, 255, 0.035)",
        border: `1px solid ${hovered ? pillar.color : "rgba(217, 203, 184, 0.12)"}`,
        boxShadow: hovered
          ? `0 12px 35px ${pillar.shadowColor}, inset 0 0 15px ${pillar.glowColor}`
          : "0 6px 25px rgba(11, 16, 32, 0.5)",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-2.5 sm:p-3 rounded-xl"
            style={{
              background: `${pillar.color}18`,
              color: pillar.color,
              border: `1px solid ${pillar.color}40`,
              boxShadow: hovered ? `0 0 16px ${pillar.color}66` : "none",
              transition: "box-shadow 0.25s ease",
            }}
          >
            {pillar.icon}
          </div>
          <span className="font-inter text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10" style={{ color: pillar.color }}>
            {pillar.guardianBadge}
          </span>
        </div>

        <h3 className="font-cinzel text-blanco-lunar text-xl sm:text-2xl font-bold mb-1 tracking-wide">
          {pillar.title}
        </h3>
        <p
          className="font-inter text-[10px] sm:text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: pillar.color }}
        >
          {pillar.subtitle}
        </p>

        <p className="font-inter text-arena text-xs sm:text-sm leading-[1.75] opacity-85 mb-4">
          {pillar.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {pillar.activitiesTag.map((act) => (
            <span
              key={act}
              className="font-inter text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-arena/80 border border-white/10"
            >
              {act}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
