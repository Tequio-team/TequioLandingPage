"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import BrasaCursor from "@/components/ui/BrasaCursor";
import StarField from "@/components/ui/StarField";
import BrasaParticles from "@/components/ui/BrasaParticles";
import LinkedInEmbedCard from "@/components/ui/LinkedInEmbedCard";
import Modal from "@/components/ui/Modal";
import { getEventType } from "@/lib/eventTypes";

const LUMA_CALENDAR_EMBED_URL = "https://luma.com/embed/calendar/cal-U0kFC53t9Lv1LCY/events";
const LUMA_CALENDAR_DIRECT_URL = "https://luma.com/cal-U0kFC53t9Lv1LCY";

// Fallback active event template
const DEFAULT_ACTIVE_EVENT = {
  id: "default-active-01",
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

function countWords(str: string): number {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

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
  const [eventsList, setEventsList] = useState<any[]>([DEFAULT_ACTIVE_EVENT]);
  const [memoriaList, setMemoriaList] = useState<any[]>(DEFAULT_MEMORIA_LIST);
  const [activeEvents, setActiveEvents] = useState<any[]>([DEFAULT_ACTIVE_EVENT]);

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
          .order("created_at", { ascending: false });

        if (eventsData && eventsData.length > 0) {
          setEventsList(eventsData);
          
          const actives = eventsData.filter((e) => e.status === "activa" || e.status === "abierto");
          const displayActives = actives.length > 0 ? actives : [eventsData[0]];

          const mergedActives = displayActives.map(ev => ({
            ...DEFAULT_ACTIVE_EVENT,
            ...ev,
            speaker_name: ev.speaker_name || "",
            speaker_linkedin: ev.speaker_linkedin || "",
          }));
          setActiveEvents(mergedActives);

          setMemoriaForm((prev) => ({
            ...prev,
            event_title: prev.event_title || mergedActives[0].title,
          }));
        }

        // 2. Fetch Memoria Viva
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

    // 3. Strict LinkedIn URL validation
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
      setSubmitError(`La frase excede el límite de 50 palabras (actual: ${quoteWordCount} palabras).`);
      return;
    }

    setIsSubmitting(true);

    try {
      const { supabase } = await import("@/lib/supabase");

      const matchingEvt = eventsList.find((e) => e.title === memoriaForm.event_title);

      const newEntry = {
        author_name: memoriaForm.author_name.trim(),
        event_title: memoriaForm.event_title.trim(),
        linkedin_post_url: memoriaForm.linkedin_post_url.trim(),
        quote: memoriaForm.quote.trim(),
        guardian: matchingEvt?.guardian || memoriaForm.guardian || "tlacu",
      };

      const { data, error } = await supabase
        .from("completed_works_gallery")
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;

      setMemoriaList((prev) => [data || { id: Date.now().toString(), ...newEntry }, ...prev]);
      setSubmitSuccess(true);
      setMemoriaForm({
        author_name: "",
        event_title: eventsList[0]?.title || "",
        linkedin_post_url: "",
        quote: "",
        guardian: "tlacu",
      });

      setTimeout(() => {
        setIsMemoriaModalOpen(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err: any) {
      setSubmitError(err?.message || "Error al guardar en Memoria Viva.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-azul-noche text-blanco-lunar relative overflow-hidden">
      <BrasaCursor />
      <Navbar />

      {/* 1. HERO & PRÓXIMA FAENA DESTACADA */}
      <section className="relative pt-28 pb-8 px-5 md:pt-36 md:pb-12 md:px-6">
        <StarField count={24} isMitlaShape={true} />
        <BrasaParticles count={28} className="opacity-60" />

        <div className="container mx-auto max-w-5xl relative z-10">
          
          {/* Header Title */}
          <div className="text-center space-y-3 mb-10 md:mb-14">
            <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold block">
              ✦ Agenda Tequio & Encuentros ✦
            </span>
            <h1 className="font-cinzel text-blanco-lunar text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide">
              Eventos de la Tribu
            </h1>
            <p className="font-inter text-arena text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto opacity-85">
              Talleres prácticos, mentorías con líderes tech y hackathons comunitarios sincronizados con Luma.
            </p>
          </div>

          {/* TARJETAS DE EVENTOS ACTIVOS */}
          {activeEvents.length > 0 && (
            <div className={`grid gap-6 sm:gap-8 ${
              activeEvents.length === 1 
                ? "grid-cols-1 max-w-4xl mx-auto" 
                : activeEvents.length === 2
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
            }`}>
              {activeEvents.map((ev, index) => {
                const et = getEventType(ev.event_type);
                return (
                  <motion.div
                    key={ev.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.15 }}
                    className="relative rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden border-2 shadow-2xl backdrop-blur-xl flex flex-col h-full"
                    style={{
                      background: `linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)`,
                      borderColor: `${et.color}50`,
                      boxShadow: `0 20px 60px ${et.glow}`,
                    }}
                  >
                    {/* Glowing background accent based on event type */}
                    <div 
                      className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
                      style={{ background: et.color }}
                    />
                    
                    <div className="relative z-10 flex-grow flex flex-col">
                      {/* Header Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <span 
                          className="font-inter text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                          style={{
                            background: `${et.color}15`,
                            color: et.color,
                            border: `1px solid ${et.color}40`,
                          }}
                        >
                          <span className="text-sm">{et.icon}</span>
                          <span className="uppercase tracking-widest">{et.label}</span>
                        </span>

                        <span 
                          className="font-inter font-bold text-[10px] sm:text-xs text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md"
                          style={{
                            background: `linear-gradient(135deg, ${et.color}, ${et.color}dd)`,
                            border: `1px solid ${et.color}60`,
                          }}
                        >
                          <span className="animate-pulse">🔥</span>
                          <span>Activa</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className={`font-cinzel text-blanco-lunar font-bold mb-5 leading-tight ${
                        activeEvents.length === 1 
                          ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl" 
                          : "text-xl sm:text-2xl md:text-3xl"
                      }`}>
                        {ev.title}
                      </h2>

                      {/* Grid: Fecha y Modalidad */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl opacity-80">📅</span>
                          <div>
                            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-arena/60 font-semibold block">
                              Fecha y Horario
                            </span>
                            <p className="font-inter text-blanco-lunar text-sm font-bold">
                              {ev.event_date}
                            </p>
                            <span className="font-inter text-xs text-arena/75 block">
                              {ev.time_display}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl opacity-80">
                            {ev.is_online ? "🖥️" : "📍"}
                          </span>
                          <div>
                            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-arena/60 font-semibold block">
                              Modalidad & Lugar
                            </span>
                            <p className="font-inter text-blanco-lunar text-sm font-bold flex items-center gap-1.5">
                              <span>{ev.is_online ? "En línea: Meet/Live" : "Presencial"}</span>
                            </p>
                            <span className="font-inter text-xs text-arena/75 block">
                              {ev.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SECCIÓN DEL INVITADO / SPEAKER CON ENLACE DE LINKEDIN */}
                      {ev.speaker_name && (
                        <div 
                          className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl shadow-lg mt-auto"
                          style={{
                            background: `linear-gradient(to right, ${et.color}15, transparent)`,
                            border: `1px solid ${et.color}30`,
                          }}
                        >
                          <div className="flex items-center gap-3.5">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-inner"
                              style={{
                                background: `${et.color}25`,
                                border: `1px solid ${et.color}50`,
                              }}
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
                              <h4 className="font-inter text-blanco-lunar text-sm sm:text-base font-bold">
                                {ev.speaker_name}
                              </h4>
                            </div>
                          </div>

                          {ev.speaker_linkedin && (
                            <a
                              href={ev.speaker_linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer font-inter font-bold text-xs bg-[#0077B5]/90 hover:bg-[#0077B5] text-white px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 ml-auto"
                            >
                              <span className="font-black text-sm">in</span>
                              <span>LinkedIn ↗</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Botón directo para abrir el evento en Luma */}
                      <div className={`pt-2 ${!ev.speaker_name ? "mt-auto" : ""}`}>
                        <a
                          href={ev.luma_url || LUMA_CALENDAR_DIRECT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer inline-flex items-center justify-center gap-2 font-inter font-bold text-white px-6 py-3.5 rounded-2xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 w-full sm:w-auto"
                          style={{
                            background: `linear-gradient(135deg, ${et.color} 0%, ${et.color}dd 100%)`,
                            boxShadow: `0 10px 25px ${et.glow}`,
                          }}
                        >
                          <span>Ver evento en Luma</span>
                          <span className="text-lg">↗</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 2. CALENDARIO OFICIAL DE LUMA */}
      <section className="relative py-14 px-6 border-t border-white/10 bg-slate-900/40">
        <div className="container mx-auto max-w-5xl relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-inter text-terracota text-xs uppercase tracking-widest font-semibold block mb-1">
                ✦ Calendario en Vivo
              </span>
              <h2 className="font-cinzel text-blanco-lunar text-2xl sm:text-3xl md:text-4xl font-bold">
                Calendario de Eventos en Luma
              </h2>
            </div>

            <a
              href={LUMA_CALENDAR_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer font-inter text-xs font-bold text-azul-noche bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-xl transition-all shadow inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Abrir en Luma</span>
              <span>↗</span>
            </a>
          </div>

          {/* EMBED DEL CALENDARIO LUMA */}
          <div className="rounded-3xl overflow-hidden border-2 border-white/10 bg-azul-noche/90 shadow-2xl p-3 sm:p-5 backdrop-blur-xl">
            <iframe
              src={LUMA_CALENDAR_EMBED_URL}
              width="100%"
              height="580"
              frameBorder="0"
              style={{ border: "none" }}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
              className="w-full rounded-2xl min-h-[500px]"
            />
          </div>

        </div>
      </section>

      {/* 3. MEMORIA VIVA */}
      <section className="relative py-24 px-6 bg-slate-950/60 border-t border-white/10">
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
                Reflexiones cortas y publicaciones en LinkedIn de quienes han participado en nuestras faenas y encuentros.
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

          {/* Grid de Memoria Viva con Animaciones */}
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

          {/* 2. Selector de Evento al que asistió (Faenas Activas y Pasadas) */}
          <div className="space-y-1.5">
            <label className="font-inter text-xs font-bold text-blanco-lunar uppercase tracking-wider block">
              Faena o Evento al que asististe *
            </label>
            <select
              required
              value={memoriaForm.event_title}
              onChange={(e) => setMemoriaForm({ ...memoriaForm, event_title: e.target.value })}
              className="w-full font-inter bg-azul-noche border border-white/15 text-blanco-lunar px-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 text-sm"
            >
              <option value="">Selecciona la faena a la que asististe...</option>
              {eventsList.map((evt) => (
                <option key={evt.id} value={evt.title}>
                  {evt.title} ({evt.event_date}) {evt.status === "activa" ? "🔥" : "📜"}
                </option>
              ))}
              <option value="Faena Comunitaria Tequio">Otra Faena o Taller Tequio</option>
            </select>
          </div>

          {/* 3. URL de LinkedIn */}
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
