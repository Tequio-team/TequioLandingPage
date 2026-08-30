// ============================================================
// EVENT TYPES — Tequio
// Fuente única de verdad para los 4 tipos de faena.
// Cada tipo tiene: colores, guardián, nombre creativo y desc.
// ============================================================

export type EventType = "tequio_talks" | "forja" | "aprender" | "caravana";
export type GuardianKey = "tochtli" | "tlacu" | "kuku" | "tochtli_tlacu";

export interface EventTypeConfig {
  value: EventType;
  /** Nombre creativo que aparece en la card del evento */
  label: string;
  /** Subtítulo del pilar */
  subtitle: string;
  /** Descripción corta */
  description: string;
  /** Etiquetas de actividades */
  tags: string[];
  /** Guardián principal */
  guardian: GuardianKey;
  /** Emoji del guardián */
  guardianEmoji: string;
  /** Color primario (hex) */
  color: string;
  /** Color del borde activo */
  borderColor: string;
  /** Sombra de glow */
  glow: string;
  /** Gradiente de fondo para cards */
  gradient: string;
  /** Ícono emoji que representa el tipo */
  icon: string;
}

export const EVENT_TYPES: Record<EventType, EventTypeConfig> = {
  tequio_talks: {
    value: "tequio_talks",
    label: "Círculo de la Luna",
    subtitle: "Mentoría e Industria · Tequio Talks",
    description:
      "Charlas e inspiración directa con profesionales activos. Derribamos la barrera entre la universidad y la industria.",
    tags: ["Tequio Talks", "Mentoría 1:1", "Revisión de CV"],
    guardian: "tochtli",
    guardianEmoji: "🐰",
    color: "#F5A623",
    borderColor: "rgba(245,166,35,0.45)",
    glow: "rgba(245,166,35,0.25)",
    gradient:
      "linear-gradient(135deg, rgba(245,166,35,0.15) 0%, rgba(15,23,42,0.98) 100%)",
    icon: "🌙",
  },
  forja: {
    value: "forja",
    label: "Forja Comunitaria",
    subtitle: "Tecnología con Alma · Hackathons con Causa",
    description:
      "Maratones de código para construir plataformas reales para albergues y comunidades.",
    tags: ["Hackathon", "Workshops", "Software Social"],
    guardian: "tlacu",
    guardianEmoji: "🦝",
    color: "#C15B3A",
    borderColor: "rgba(193,91,58,0.45)",
    glow: "rgba(193,91,58,0.25)",
    gradient:
      "linear-gradient(135deg, rgba(193,91,58,0.18) 0%, rgba(15,23,42,0.98) 100%)",
    icon: "⚒️",
  },
  aprender: {
    value: "aprender",
    label: "Jornada de la Faena",
    subtitle: "Aprender y Devolver · Umbral & Jornadas",
    description:
      "Onboarding, voluntariado directo y acompañamiento. Quien aprende hoy, guía mañana.",
    tags: ["Onboarding", "Voluntariado", "Acompañamiento"],
    guardian: "tochtli_tlacu",
    guardianEmoji: "🐰🦝",
    color: "#14b8a6",
    borderColor: "rgba(20,184,166,0.45)",
    glow: "rgba(20,184,166,0.25)",
    gradient:
      "linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(15,23,42,0.98) 100%)",
    icon: "🌱",
  },
  caravana: {
    value: "caravana",
    label: "Caravana del Vuelo",
    subtitle: "Comunidad en Movimiento · Asistencia en Bloque",
    description:
      "Asistimos en bloque a eventos y conferencias tech. Nadie camina solo en la industria.",
    tags: ["Caravana Tech", "Networking", "Meetup"],
    guardian: "kuku",
    guardianEmoji: "🪶",
    color: "#10b981",
    borderColor: "rgba(16,185,129,0.45)",
    glow: "rgba(16,185,129,0.25)",
    gradient:
      "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(15,23,42,0.98) 100%)",
    icon: "🚀",
  },
};

/** Lista ordenada para selects y dropdowns */
export const EVENT_TYPES_LIST = Object.values(EVENT_TYPES);

/** Devuelve la config de un tipo, con fallback a tequio_talks */
export function getEventType(type?: string | null): EventTypeConfig {
  return EVENT_TYPES[(type as EventType) ?? "tequio_talks"] ?? EVENT_TYPES.tequio_talks;
}
