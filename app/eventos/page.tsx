"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import BrasaCursor from "@/components/ui/BrasaCursor";
import StarField from "@/components/ui/StarField";
import BrasaParticles from "@/components/ui/BrasaParticles";
import LinkedInEmbedCard from "@/components/ui/LinkedInEmbedCard";
import LumaCheckoutButton from "@/components/ui/LumaCheckoutButton";
import Modal from "@/components/ui/Modal";

// Fallback active event template in case Supabase table is empty
const DEFAULT_ACTIVE_EVENT = {
  id: "default-active-01",
  title: "De Estudiante a Tech Lead: El Camino Sin Secretos",
  event_date: "Jueves 17 de Septiembre, 2026",
  time_display: "07:00 PM — 08:30 PM (CDMX)",
  is_online: true,
  location: "Google Meet",
  luma_url: "https://luma.com/event/evt-C1nAPcQ4ME9mTeL",
  description:
    "Mentoría directa sobre cómo navegar la transición académica a liderazgo técnico, romper el síndrome del impostor y destacar en la industria tech.",
  guardian: "tochtli",
  is_featured: true,
  status: "abierto",
};

const DEFAULT_EVENTS_LIST = [
  DEFAULT_ACTIVE_EVENT,
  {
    id: "default-event-02",
    title: "Hackathon por la Comunidad: Código Abierto con Causa",
    event_date: "Sábado 20 de Septiembre, 2026",
    time_display: "10:00 AM — 06:00 PM (CDMX)",
    is_online: false,
    location: "Centro Comunitario La Esperanza, CDMX",
    luma_url: "https://luma.com/event/evt-C1nAPcQ4ME9mTeL",
    description: "8 horas de desarrollo colaborativo construyendo soluciones reales a retos comunitarios.",
    guardian: "tlacu",
    is_featured: false,
    status: "abierto",
  },
  {
    id: "default-event-03",
    title: "Caravana al DevFest CDMX 2026",
    event_date: "Sábado 24 de Octubre, 2026",
    time_display: "09:00 AM — 06:00 PM (CDMX)",
    is_online: false,
    location: "Telmex Hub / WTC CDMX",
    luma_url: "https://luma.com/event/evt-C1nAPcQ4ME9mTeL",
    description: "Asistiremos en bloque como tribu Tequio al gran encuentro anual de desarrolladores.",
    guardian: "kuku",
    is_featured: false,
    status: "abierto",
  },
];

const DEFAULT_MEMORIA_LIST = [
  {
    id: "memoria-1",
    author_name: "Sofía Morales",
    quote: "Aprender en comunidad rompió el miedo a programar en proyectos reales con impacto tangible.",
    event_title: "Hackathon por la Comunidad: Código Abierto con Causa",
    linkedin_post_url: "https://www.linkedin.com/posts/sofia-morales-tequio-faena",
    guardian: "tlacu",
  },
  {
    id: "memoria-2",
    author_name: "David Reyes",
    quote: "El verdadero poder del software está en poner el conocimiento al servicio de los demás.",
    event_title: "De Estudiante a Tech Lead: El Camino Sin Secretos",
    linkedin_post_url: "https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/",
    guardian: "tochtli",
  },
  {
    id: "memoria-3",
    author_name: "Carlos Mendoza",
    quote: "Caminar en tribu te impulsa a llegar más lejos de lo que jamás imaginaste solo.",
    event_title: "Caravana al DevFest CDMX 2026",
    linkedin_post_url: "https://www.linkedin.com/posts/carlos-mendoza-talent-land-tequio",
    guardian: "kuku",
  },
];

// Helper to count words
function countWords(str: string): number {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

// Strict LinkedIn URL validator
function isValidLinkedInUrl(url: string): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes("linkedin.com/") ||
    clean.includes("lnkd.in/") ||
    clean.startsWith("https://linkedin.com") ||
    clean.startsWith("https://www.linkedin.com")
  );
}

export default function EventosPage() {
  const [selectedGuardian, setSelectedGuardian] = useState<string>("all");
  const [events, setEvents] = useState<any[]>(DEFAULT_EVENTS_LIST);
  const [memoriaList, setMemoriaList] = useState<any[]>(DEFAULT_MEMORIA_LIST);
  const [activeEvent, setActiveEvent] = useState<any>(DEFAULT_ACTIVE_EVENT);

  // Modal State for Memoria Viva
  const [isMemoriaModalOpen, setIsMemoriaModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [memoriaForm, setMemoriaForm] = useState({
    author_name: "",
    event_title: "",
    linkedin_post_url: "",
    quote: "",
    guardian: "tlacu",
  });

  // Load live data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const { supabase } = await import("@/lib/supabase");

        // 1. Fetch Events
        const { data: eventsData } = await supabase
          .from("events")
          .select("*")
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false });

        if (eventsData && eventsData.length > 0) {
          setEvents(eventsData);
          const featured = eventsData.find((e) => e.is_featured) || eventsData[0];
          setActiveEvent(featured);

          // Default event in form
          setMemoriaForm((prev) => ({
            ...prev,
            event_title: prev.event_title || featured.title,
          }));
        }

        // 2. Fetch Memoria Viva (Completed Works Gallery)
        const { data: memoriaData } = await supabase
          .from("completed_works_gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (memoriaData && memoriaData.length > 0) {
          setMemoriaList(memoriaData);
        }
      } catch (err) {
        console.warn("Error cargando datos de Supabase:", err);
      }
    }

    loadData();
  }, []);

  const filteredEvents = events.filter((evt) => {
    if (selectedGuardian === "all") return true;
    return evt.guardian === selectedGuardian;
  });

  const quoteWordCount = countWords(memoriaForm.quote);
  const isWordLimitExceeded = quoteWordCount > 50;

  const handleMemoriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // 1. Validate Author Name
    if (!memoriaForm.author_name.trim()) {
      setSubmitError("Por favor escribe tu nombre completo.");
      return;
    }

    // 2. Validate Event
    if (!memoriaForm.event_title.trim()) {
      setSubmitError("Por favor selecciona el evento al que asististe.");
      return;
    }

    // 3. Strict 100% LinkedIn URL validation
    if (!isValidLinkedInUrl(memoriaForm.linkedin_post_url)) {
      setSubmitError("El enlace debe ser una URL válida de LinkedIn (ej: https://www.linkedin.com/posts/...)");
      return;
    }

    // 4. Validate Quote length (max 50 words)
    if (!memoriaForm.quote.trim()) {
      setSubmitError("Por favor escribe una frase o reflexión corta que obtuviste del evento.");
      return;
    }

    if (quoteWordCount > 50) {
      setSubmitError(`La frase excede el límite de 50 palabras (actual: ${quoteWordCount} palabras). Por favor hazla más concisa.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const { supabase } = await import("@/lib/supabase");

      // Find matching event id if any
      const matchingEvt = events.find((e) => e.title === memoriaForm.event_title);

      const newEntry = {
        author_name: memoriaForm.author_name.trim(),
        event_title: memoriaForm.event_title.trim(),
        event_id: matchingEvt?.id || null,
        linkedin_post_url: memoriaForm.linkedin_post_url.trim(),
        quote: memoriaForm.quote.trim(),
        guardian: matchingEvt?.guardian || memoriaForm.guardian || "tlacu",
      };

      const { data, error } = await supabase
        .from("completed_works_gallery")
        .insert([newEntry])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Prepend to local list
      setMemoriaList((prev) => [data || { id: Date.now().toString(), ...newEntry }, ...prev]);
      setSubmitSuccess(true);
      setMemoriaForm({
        author_name: "",
        event_title: events[0]?.title || "",
        linkedin_post_url: "",
        quote: "",
        guardian: "tlacu",
      });

      setTimeout(() => {
        setIsMemoriaModalOpen(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err: any) {
      setSubmitError(err?.message || "Error al guardar en Memoria Viva. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-azul-noche text-blanco-lunar relative overflow-hidden">
      <BrasaCursor />
      <Navbar />

      {/* 1. HERO & PRÓXIMA FAENA DESTACADA (CON REGISTRO LUMA) */}
      <section className="relative pt-36 pb-20 px-6">
        <StarField count={35} isMitlaShape={true} />
        <BrasaParticles count={40} className="opacity-70" />

        <div className="container mx-auto max-w-5xl relative z-10">
          
          {/* Header Title */}
          <div className="text-center space-y-4 mb-14">
            <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold block">
              ✦ Agenda de Faenas & Encuentros ✦
            </span>
            <h1 className="font-cinzel text-blanco-lunar text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide">
              Eventos de la Tribu
            </h1>
            <p className="font-inter text-arena text-base sm:text-lg leading-relaxed max-w-2xl mx-auto opacity-85">
              Talleres prácticos, mentorías con líderes tech y hackathons comunitarios. Elige tu faena y regístrate directamente con Luma.
            </p>
          </div>

          {/* ACTIVE TALK CARD CON CHECKOUT LUMA */}
          {activeEvent && (
            <motion.div
              id="active-talk"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl p-8 sm:p-10 md:p-14 overflow-hidden border-2 border-amber-400/40 shadow-[0_20px_60px_rgba(245,166,35,0.15)] backdrop-blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
              }}
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="font-inter text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                  <span>✦ FAENA ACTIVA DESTACADA</span>
                </span>

                <span className="font-inter font-bold text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="animate-pulse">🔥</span>
                  <span>Inscripciones Abiertas con Luma</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="font-cinzel text-blanco-lunar text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {activeEvent.title}
              </h2>

              {/* Grid: Fecha y Modalidad con Iconos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">📅</span>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-arena/60 font-semibold block">
                      Cuándo es
                    </span>
                    <p className="font-inter text-blanco-lunar text-sm sm:text-base font-bold">
                      {activeEvent.event_date}
                    </p>
                    <span className="font-inter text-xs text-arena/75 block">
                      {activeEvent.time_display}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">
                    {activeEvent.is_online ? "🖥️" : "📍"}
                  </span>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-arena/60 font-semibold block">
                      Modalidad & Lugar
                    </span>
                    <p className="font-inter text-blanco-lunar text-sm sm:text-base font-bold flex items-center gap-1.5">
                      <span>{activeEvent.is_online ? "En línea (Google Meet / Live)" : "Presencial (En persona)"}</span>
                    </p>
                    <span className="font-inter text-xs text-arena/75 block">
                      {activeEvent.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {activeEvent.description && (
                <p className="font-inter text-arena/90 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
                  {activeEvent.description}
                </p>
              )}

              {/* Luma Button CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
                <LumaCheckoutButton
                  lumaUrl={activeEvent.luma_url}
                  variant="primary"
                >
                  <span>Registrarme con Luma</span>
                  <span className="text-xl">→</span>
                </LumaCheckoutButton>

                <div className="font-inter text-xs text-arena/60 flex items-center gap-1.5">
                  <span>🎟️ Check-in instantáneo vía</span>
                  <strong className="text-amber-400">Luma Checkout</strong>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* 2. AGENDA DE TODOS LOS EVENTOS */}
      <section className="relative py-16 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-inter text-terracota text-xs uppercase tracking-widest font-semibold block mb-2">
                ✦ Calendario Tequio
              </span>
              <h2 className="font-cinzel text-blanco-lunar text-3xl md:text-4xl font-bold">
                Próximas Faenas y Encuentros
              </h2>
            </div>

            {/* Filter by Guardian */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Todos" },
                { id: "tochtli", label: "🐰 Tochtli (Mentoría)" },
                { id: "tlacu", label: "🦝 Tlacu (Forja)" },
                { id: "kuku", label: "🪶 Kuku (Caravanas)" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedGuardian(filter.id)}
                  className={`cursor-pointer font-inter text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                    selectedGuardian === filter.id
                      ? "bg-amber-400 text-azul-noche shadow-lg scale-105"
                      : "bg-white/5 hover:bg-white/10 text-arena/80 border border-white/10"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt, idx) => (
              <motion.div
                key={evt.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className="rounded-3xl bg-azul-noche/80 border border-white/10 p-6 flex flex-col justify-between space-y-5 hover:border-amber-400/50 hover:shadow-xl transition-all backdrop-blur-md"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-inter text-[11px] font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      {evt.guardian === "tochtli"
                        ? "🐰 Tochtli"
                        : evt.guardian === "kuku"
                        ? "🪶 Kuku"
                        : "🦝 Tlacu"}
                    </span>

                    <span className="font-inter text-[11px] font-semibold text-arena/60 flex items-center gap-1">
                      <span>{evt.is_online ? "🖥️ En línea" : "📍 Presencial"}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-cinzel text-blanco-lunar text-lg md:text-xl font-bold leading-snug">
                    {evt.title}
                  </h3>

                  {/* Date & Location */}
                  <div className="space-y-1.5 text-xs text-arena/80 font-inter bg-white/5 p-3.5 rounded-xl border border-white/5">
                    <p className="font-bold text-blanco-lunar flex items-center gap-2">
                      <span>📅</span>
                      <span>{evt.event_date}</span>
                    </p>
                    <p className="text-arena/70 flex items-center gap-2">
                      <span>⏰</span>
                      <span>{evt.time_display}</span>
                    </p>
                    <p className="text-arena/70 flex items-center gap-2">
                      <span>{evt.is_online ? "🌐" : "📍"}</span>
                      <span className="truncate">{evt.location}</span>
                    </p>
                  </div>

                  {/* Description */}
                  {evt.description && (
                    <p className="font-inter text-arena/75 text-xs leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  )}
                </div>

                {/* Bottom CTA Luma */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="font-inter text-[11px] text-arena/50">
                    {evt.status === "finalizado" ? "Evento concluido" : "Cupo con Luma"}
                  </span>

                  {evt.status === "finalizado" ? (
                    <span className="font-inter text-xs text-arena/50 bg-white/5 px-3 py-1.5 rounded-lg">
                      Finalizado
                    </span>
                  ) : (
                    <LumaCheckoutButton
                      lumaUrl={evt.luma_url}
                      variant="compact"
                    >
                      <span>Inscribirme en Luma →</span>
                    </LumaCheckoutButton>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. MEMORIA VIVA (PUBLICACIONES DE INTEGRANTES CON VALIDACIÓN LINKEDIN) */}
      <section className="relative py-24 px-6 bg-slate-900/60 border-t border-white/10">
        <div className="container mx-auto max-w-6xl relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-3 max-w-2xl">
              <span className="font-inter text-terracota text-xs uppercase tracking-widest font-semibold block">
                ✦ Memoria Colectiva
              </span>
              <h2 className="font-cinzel text-blanco-lunar text-3xl sm:text-4xl md:text-5xl font-bold">
                Memoria Viva de la Tribu
              </h2>
              <p className="font-inter text-arena text-sm sm:text-base leading-relaxed opacity-85">
                Reflexiones cortas y publicaciones en LinkedIn de quienes han participado en nuestras faenas y encuentros tecnológicos.
              </p>
            </div>

            {/* Botón para compartir experiencia */}
            <button
              onClick={() => setIsMemoriaModalOpen(true)}
              className="cursor-pointer font-inter font-bold text-sm bg-gradient-to-r from-amber-500 to-terracota hover:from-amber-400 hover:to-orange-500 text-blanco-lunar px-6 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 flex-shrink-0"
            >
              <span>✦ Publicar en Memoria Viva</span>
              <span>✍️</span>
            </button>
          </div>

          {/* Grid de Memoria Viva */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoriaList.map((item, idx) => (
              <LinkedInEmbedCard
                key={item.id || idx}
                id={item.id}
                index={idx}
                authorName={item.author_name}
                eventTitle={item.event_title}
                quote={item.quote}
                linkedinPostUrl={item.linkedin_post_url}
                guardian={item.guardian}
              />
            ))}
          </div>

        </div>
      </section>

      {/* MODAL DE PUBLICACIÓN EN MEMORIA VIVA */}
      <Modal
        isOpen={isMemoriaModalOpen}
        onClose={() => setIsMemoriaModalOpen(false)}
        title="Publicar en Memoria Viva"
      >
        <form onSubmit={handleMemoriaSubmit} className="flex flex-col gap-5 pt-2">
          <p className="font-inter text-xs text-arena/80 leading-relaxed">
            Comparte la frase o lección principal que te llevaste del evento y enlaza tu publicación de LinkedIn.
          </p>

          {/* Mensajes de Alerta / Error */}
          {submitError && (
            <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-2.5 rounded-xl text-xs font-inter">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-inter flex items-center gap-2">
              <span>✓</span>
              <span>¡Tu experiencia se ha publicado en la Memoria Viva!</span>
            </div>
          )}

          {/* 1. Nombre Completo */}
          <div className="space-y-1.5">
            <label className="font-inter text-xs font-bold text-blanco-lunar uppercase tracking-wider block">
              Tu Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={memoriaForm.author_name}
              onChange={(e) => setMemoriaForm({ ...memoriaForm, author_name: e.target.value })}
              placeholder="Ej: Sofía Morales"
              className="w-full font-inter bg-white/5 border border-white/15 text-blanco-lunar px-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          {/* 2. Selector de Evento al que asistió */}
          <div className="space-y-1.5">
            <label className="font-inter text-xs font-bold text-blanco-lunar uppercase tracking-wider block">
              Evento al que asististe *
            </label>
            <select
              required
              value={memoriaForm.event_title}
              onChange={(e) => setMemoriaForm({ ...memoriaForm, event_title: e.target.value })}
              className="w-full font-inter bg-azul-noche border border-white/15 text-blanco-lunar px-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 text-sm"
            >
              <option value="">Selecciona el evento...</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.title}>
                  {evt.title} ({evt.event_date})
                </option>
              ))}
              <option value="Faena Comunitaria Tequio">Otra Faena o Taller Tequio</option>
            </select>
          </div>

          {/* 3. URL de LinkedIn (100% Verificada) */}
          <div className="space-y-1.5">
            <label className="font-inter text-xs font-bold text-blanco-lunar uppercase tracking-wider block">
              Enlace de tu Publicación en LinkedIn *
            </label>
            <input
              type="url"
              required
              value={memoriaForm.linkedin_post_url}
              onChange={(e) => setMemoriaForm({ ...memoriaForm, linkedin_post_url: e.target.value })}
              placeholder="https://www.linkedin.com/posts/... o https://lnkd.in/..."
              className="w-full font-inter bg-white/5 border border-white/15 text-blanco-lunar px-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 text-sm"
            />
            <span className="font-inter text-[11px] text-amber-400/80 block">
              Verificamos que sea un enlace válido de LinkedIn para garantizar la autenticidad.
            </span>
          </div>

          {/* 4. Frase / Reflexión corta (Máx 50 palabras) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-inter text-xs font-bold text-blanco-lunar uppercase tracking-wider block">
                Frase o lección que te llevas (Máx. 50 palabras) *
              </label>
              <span
                className={`font-inter text-xs font-bold ${
                  isWordLimitExceeded ? "text-red-400" : "text-arena/70"
                }`}
              >
                {quoteWordCount}/50 palabras
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={memoriaForm.quote}
              onChange={(e) => setMemoriaForm({ ...memoriaForm, quote: e.target.value })}
              placeholder="Ej: Aprender en comunidad rompió mi miedo a programar proyectos reales con impacto social."
              className={`w-full font-inter bg-white/5 border text-blanco-lunar px-4 py-3 rounded-xl focus:outline-none text-sm resize-none ${
                isWordLimitExceeded
                  ? "border-red-500 focus:border-red-400"
                  : "border-white/15 focus:border-amber-400"
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isWordLimitExceeded}
            className="cursor-pointer font-inter font-bold text-blanco-lunar py-3.5 rounded-xl transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{ background: "#C15B3A" }}
          >
            {isSubmitting ? "Publicando en Memoria..." : "Publicar en Memoria Viva →"}
          </button>
        </form>
      </Modal>

      <FooterSection />
    </main>
  );
}
