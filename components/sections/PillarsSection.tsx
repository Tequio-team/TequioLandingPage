"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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
    color: "#F5A623", // Ámbar
    glowColor: "rgba(245, 166, 35, 0.35)",
    shadowColor: "rgba(245, 166, 35, 0.18)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    color: "#C15B3A", // Terracota
    glowColor: "rgba(193, 91, 58, 0.35)",
    shadowColor: "rgba(193, 91, 58, 0.18)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    color: "#14b8a6", // Turquesa
    glowColor: "rgba(20, 184, 166, 0.35)",
    shadowColor: "rgba(20, 184, 166, 0.18)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    color: "#10b981", // Verde Jade
    glowColor: "rgba(16, 185, 129, 0.35)",
    shadowColor: "rgba(16, 185, 129, 0.18)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

export default function PillarsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="pilares"
      ref={ref}
      className="relative py-32 overflow-hidden bg-azul-noche"
      style={{
        background: "linear-gradient(to bottom, #0F172A 0%, #151D32 50%, #0F172A 100%)",
      }}
    >
      {/* Micro-partículas de brasa cálida que ascienden despacio */}
      <BrasaParticles count={40} className="z-0 opacity-70" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-cinzel text-blanco-lunar text-4xl md:text-5xl mb-4 tracking-wide font-bold">
            Los Pilares y Actividades de Nuestra Faena
          </h2>
          <p className="font-inter text-arena text-lg leading-relaxed max-w-2xl mx-auto opacity-85">
            Las losas de saber y las acciones colectivas que sostienen la filosofía y el trabajo diario en Tequio.
          </p>
        </motion.div>

        {/* Cuadrícula Ordenada 2x2 con Actividades Integradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.id} pillar={pillar} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  pillar,
  index,
  inView,
}: {
  pillar: typeof PILLARS[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const delays = [0, 0.12, 0.25, 0.38];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delays[index], duration: 0.7 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="cursor-pointer relative p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.035)",
        border: `1px solid ${hovered ? pillar.color : "rgba(217, 203, 184, 0.12)"}`,
        boxShadow: hovered
          ? `0 12px 35px ${pillar.shadowColor}, inset 0 0 15px ${pillar.glowColor}`
          : "0 6px 25px rgba(11, 16, 32, 0.5)",
      }}
    >
      {/* Sub-capa artesanal */}
      <svg className="absolute inset-0 w-full h-full opacity-4 pointer-events-none">
        <filter id={`pillarNoise-${pillar.id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#pillarNoise-${pillar.id})`} />
      </svg>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div
            className="p-3.5 rounded-xl transition-all duration-300"
            style={{
              background: `${pillar.color}18`,
              color: pillar.color,
              border: `1px solid ${pillar.color}40`,
              boxShadow: hovered ? `0 0 20px ${pillar.color}77` : "none",
            }}
          >
            {pillar.icon}
          </div>
          <span className="font-inter text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10" style={{ color: pillar.color }}>
            {pillar.guardianBadge}
          </span>
        </div>

        <h3 className="font-cinzel text-blanco-lunar text-2xl md:text-3xl font-bold mb-2 tracking-wide">
          {pillar.title}
        </h3>
        <p
          className="font-inter text-xs uppercase tracking-widest font-semibold mb-4"
          style={{ color: pillar.color }}
        >
          {pillar.subtitle}
        </p>

        <p className="font-inter text-arena text-base leading-[1.8] opacity-85 mb-6">
          {pillar.description}
        </p>

        {/* Píldoras de Actividades Integradas */}
        <div className="flex flex-wrap gap-2 mb-2">
          {pillar.activitiesTag.map((act) => (
            <span
              key={act}
              className="font-inter text-xs px-3 py-1 rounded-md font-medium"
              style={{
                background: `${pillar.color}18`,
                color: pillar.color,
                border: `1px solid ${pillar.color}40`,
              }}
            >
              ✦ {act}
            </span>
          ))}
        </div>
      </div>

      {/* Línea inferior de 3px que se ilumina en hover */}
      <div className="relative mt-6 pt-2 z-10">
        <motion.div
          className="h-[3px] rounded-full w-full transition-all duration-300"
          style={{
            background: hovered
              ? `linear-gradient(90deg, ${pillar.color} 0%, transparent 100%)`
              : "rgba(255, 255, 255, 0.08)",
            boxShadow: hovered ? `0 0 12px ${pillar.color}` : "none",
          }}
        />
      </div>
    </motion.div>
  );
}
