"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getEventType } from "@/lib/eventTypes";

// ─── Types ───────────────────────────────────────────────────────────────────
interface EventRecord {
  id: string;
  title: string;
  event_date: string;
  time_display?: string;
  is_online: boolean;
  location: string;
  event_type?: string;
  guardian?: string;
  speaker_name?: string;
  speaker_linkedin?: string;
  status: string;
}

interface MemoriaRecord {
  id: string;
  author_name: string;
  quote: string;
  event_title: string;
  linkedin_post_url: string;
  guardian?: string;
  event_id?: string;
}

interface MuseoExhibit {
  event: EventRecord;
  memorias: MemoriaRecord[];
}

interface MuseoSectionProps {
  events: EventRecord[];
  memorias: MemoriaRecord[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function groupByEvent(events: EventRecord[], memorias: MemoriaRecord[]): MuseoExhibit[] {
  return events
    .filter((ev) => ev.status === "pasada" || ev.status === "abierto")
    .map((ev) => ({
      event: ev,
      memorias: memorias.filter(
        (m) =>
          m.event_id === ev.id ||
          m.event_title?.toLowerCase().trim() === ev.title?.toLowerCase().trim()
      ),
    }))
    .filter((exhibit) => exhibit.memorias.length > 0); // solo mostrar si hay memorias
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MuseoSection({ events, memorias }: MuseoSectionProps) {
  const exhibits = groupByEvent(events, memorias);

  if (exhibits.length === 0) return null;

  return (
    <section
      id="museo"
      className="relative py-16 md:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #080C18 0%, #0F172A 30%, #131929 70%, #080C18 100%)",
      }}
    >
      {/* Decorative top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-5 max-w-7xl relative z-10">
        {/* ── Section Header ── */}
        <SectionHeader count={exhibits.length} />

        {/* ── Exhibits ── */}
        <div className="space-y-24 md:space-y-32 mt-14 md:mt-20">
          {exhibits.map((exhibit, i) => (
            <Exhibit key={exhibit.event.id} exhibit={exhibit} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-inter text-amber-400 text-xs uppercase tracking-[0.3em] font-bold block mb-3">
        ✦ Archivo Ceremonial ✦
      </span>
      <h2 className="font-cinzel text-blanco-lunar text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide mb-4">
        Museo de Faenas
      </h2>
      <p className="font-inter text-arena text-sm sm:text-base leading-relaxed max-w-xl mx-auto opacity-80">
        Cada faena deja una huella. Aquí viven los eventos que ya cruzamos juntos
        y las voces de quienes los vivieron.
      </p>
      <div className="flex items-center justify-center gap-3 mt-5">
        <div className="h-px flex-1 max-w-[80px] bg-amber-400/30" />
        <span className="font-inter text-[11px] text-amber-400/70 font-semibold">
          {count} faena{count !== 1 ? "s" : ""} en el archivo
        </span>
        <div className="h-px flex-1 max-w-[80px] bg-amber-400/30" />
      </div>
    </motion.div>
  );
}

// ─── Exhibit (one event + its memories) ──────────────────────────────────────
function Exhibit({ exhibit, index }: { exhibit: MuseoExhibit; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { event, memorias } = exhibit;
  const et = getEventType(event.event_type);

  // Split memories: left half | right half
  const mid = Math.ceil(memorias.length / 2);
  const leftMemorias = memorias.slice(0, mid);
  const rightMemorias = memorias.slice(mid);

  return (
    <div ref={ref} className="relative">
      {/* Ceremonial horizontal divider */}
      {index > 0 && (
        <div
          className="absolute -top-12 left-0 right-0 flex items-center gap-4 pointer-events-none"
          aria-hidden
        >
          <div className="flex-1 h-px" style={{ background: `${et.color}30` }} />
          <span className="text-lg opacity-40">{et.icon}</span>
          <div className="flex-1 h-px" style={{ background: `${et.color}30` }} />
        </div>
      )}

      {/* ── DESKTOP layout: memories | event | memories ── */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        {/* LEFT memories */}
        <div className="flex flex-col gap-4 items-end pt-6">
          {leftMemorias.map((m, mi) => (
            <MemoriaCard
              key={m.id}
              memoria={m}
              direction="left"
              delay={mi * 0.1}
              inView={inView}
              eventColor={et.color}
            />
          ))}
          {leftMemorias.length === 0 && <div className="h-4" />}
        </div>

        {/* CENTER: event altar */}
        <div className="w-[260px] xl:w-[300px] flex-shrink-0">
          <EventAltar event={event} et={et} inView={inView} />
        </div>

        {/* RIGHT memories */}
        <div className="flex flex-col gap-4 items-start pt-6">
          {rightMemorias.map((m, mi) => (
            <MemoriaCard
              key={m.id}
              memoria={m}
              direction="right"
              delay={mi * 0.1}
              inView={inView}
              eventColor={et.color}
            />
          ))}
          {rightMemorias.length === 0 && <div className="h-4" />}
        </div>
      </div>

      {/* ── MOBILE layout: event top, memories below ── */}
      <div className="md:hidden flex flex-col gap-5">
        {/* Event card full-width */}
        <EventAltar event={event} et={et} inView={inView} isMobile />

        {/* Memories in 1 or 2 cols depending on count */}
        <div className={`grid gap-3 ${memorias.length >= 2 ? "grid-cols-2" : "grid-cols-1"}`}>
          {memorias.map((m, mi) => (
            <MemoriaCard
              key={m.id}
              memoria={m}
              direction="up"
              delay={mi * 0.08}
              inView={inView}
              eventColor={et.color}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Event Altar (central card) ───────────────────────────────────────────────
function EventAltar({
  event,
  et,
  inView,
  isMobile = false,
}: {
  event: EventRecord;
  et: ReturnType<typeof getEventType>;
  inView: boolean;
  isMobile?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-3xl overflow-hidden ${isMobile ? "w-full" : ""}`}
      style={{
        background: `linear-gradient(160deg, ${et.color}18 0%, rgba(8,12,24,0.97) 60%)`,
        border: `1.5px solid ${et.color}40`,
        boxShadow: `0 0 40px ${et.glow}, 0 16px 48px rgba(0,0,0,0.45)`,
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: et.color }} />

      <div className="p-5 sm:p-6">
        {/* Type badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-base"
            style={{ filter: `drop-shadow(0 0 6px ${et.color})` }}
          >
            {et.icon}
          </span>
          <div>
            <p
              className="font-inter text-[10px] uppercase tracking-[0.2em] font-bold"
              style={{ color: et.color }}
            >
              {et.label}
            </p>
            <p className="font-inter text-[9px] text-arena/50">{et.guardianEmoji} {et.subtitle.split("·")[0].trim()}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-cinzel text-blanco-lunar font-bold leading-snug mb-4 text-base sm:text-lg">
          {event.title}
        </h3>

        {/* Date / Modality */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">📅</span>
            <div>
              <p className="font-inter text-blanco-lunar text-xs font-bold">{event.event_date}</p>
              {event.time_display && (
                <p className="font-inter text-arena/60 text-[10px]">{event.time_display}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{event.is_online ? "🖥️" : "📍"}</span>
            <p className="font-inter text-arena/70 text-xs">{event.location}</p>
          </div>
        </div>

        {/* Speaker */}
        {event.speaker_name && (
          <div
            className="flex items-center gap-2 p-2.5 rounded-xl mb-4"
            style={{ background: `${et.color}12`, border: `1px solid ${et.color}30` }}
          >
            <span className="text-base">🎙️</span>
            <div className="min-w-0">
              <p
                className="font-inter text-[9px] uppercase font-bold tracking-wider"
                style={{ color: et.color }}
              >
                Ponente
              </p>
              <p className="font-inter text-blanco-lunar text-xs font-bold truncate">
                {event.speaker_name}
              </p>
            </div>
            {event.speaker_linkedin && (
              <a
                href={event.speaker_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex-shrink-0 bg-[#0077B5] hover:bg-[#005885] text-white text-[9px] font-bold px-2 py-1 rounded-lg transition-colors"
              >
                in
              </a>
            )}
          </div>
        )}

        {/* Status pill */}
        <div className="flex justify-center">
          <span className="font-inter text-[10px] px-3 py-1 rounded-full font-bold bg-white/10 text-arena/60">
            📜 Faena en el Archivo
          </span>
        </div>
      </div>

      {/* Animated corner glow */}
      <motion.div
        className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: `radial-gradient(circle, ${et.color}55 0%, transparent 70%)` }}
      />
    </motion.div>
  );
}

// ─── Memoria Card (side card) ─────────────────────────────────────────────────
const GUARDIAN_COLORS: Record<string, string> = {
  tochtli: "#F5A623",
  tlacu: "#C15B3A",
  kuku: "#10b981",
  tochtli_tlacu: "#14b8a6",
};

function MemoriaCard({
  memoria,
  direction,
  delay,
  inView,
  eventColor,
  compact = false,
}: {
  memoria: MemoriaRecord;
  direction: "left" | "right" | "up";
  delay: number;
  inView: boolean;
  eventColor: string;
  compact?: boolean;
}) {
  const gColor = GUARDIAN_COLORS[memoria.guardian ?? "tlacu"] ?? eventColor;

  const initX = direction === "left" ? -56 : direction === "right" ? 56 : 0;
  const initY = direction === "up" ? 30 : 0;

  const initials = memoria.author_name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: initX, y: initY }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        delay: 0.3 + delay,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.03, y: -3 }}
      className={`relative rounded-2xl overflow-hidden group cursor-default ${
        compact ? "w-full" : "w-full max-w-[230px]"
      }`}
      style={{
        background: "rgba(255,255,255,0.038)",
        border: `1px solid rgba(255,255,255,0.1)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        willChange: "transform",
      }}
      onHoverStart={(e, i) => {
        // CSS-side hover handled via style transition
      }}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
        style={{ background: gColor }}
      />

      <div className={`pl-4 pr-3 ${compact ? "py-3" : "py-4"}`}>
        {/* Quote */}
        <div className="mb-3">
          <span
            className="font-cinzel text-3xl leading-none"
            style={{ color: `${gColor}60` }}
          >
            "
          </span>
          <p
            className={`font-inter text-arena leading-relaxed ${
              compact ? "text-[11px]" : "text-xs"
            } -mt-1`}
          >
            {memoria.quote}
          </p>
        </div>

        {/* Author row */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/8">
          {/* Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: `${gColor}25`, color: gColor, border: `1px solid ${gColor}45` }}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-inter text-blanco-lunar text-[11px] font-bold truncate">
              {memoria.author_name}
            </p>
            <p className="font-inter text-arena/50 text-[10px] truncate">
              {memoria.event_title}
            </p>
          </div>

          {/* LinkedIn link */}
          <a
            href={memoria.linkedin_post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-[#0077B5]/90 hover:bg-[#0077B5] text-white text-[9px] font-black px-1.5 py-1 rounded-md transition-colors"
            title="Ver en LinkedIn"
          >
            in
          </a>
        </div>
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 20px ${gColor}15`,
          border: `1px solid ${gColor}35`,
        }}
      />
    </motion.div>
  );
}
