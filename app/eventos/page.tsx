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
import {
  getUserProfile,
  saveUserProfile,
  saveEventRegistration,
  isRegisteredForEvent,
} from "@/lib/session";

// Fallback active event template in case Supabase table is empty
const DEFAULT_ACTIVE_TALK = {
  id: "00000000-0000-0000-0000-000000000001",
  title: '"De Estudiante a Tech Lead: El Camino Sin Secretos"',
  tagHeader: "✦ FAENA ACTIVA · 🐰 TOCHTLI (Mentoría e Inspiración)",
  typeBadge: "🎙️ TEQUIO TALKS #01",
  guardian: "tochtli",
  guardianSrc: "/png/tochtli.png",
  date: "Jueves 17 de Septiembre, 2026",
  time: "07:00 PM — 08:30 PM (CDMX)",
  location: "Google Meet / YouTube Live",
  speaker: "Senior Dev & Tech Lead Mentor",
  dynamic: "Q&A Abierto + Revisión de CV en Vivo",
  access: "Acceso libre · Registro previo necesario",
  registeredCount: 0,
  capacityLimit: 60,
};

// Target Date for Live Countdown (Sept 17)
const TARGET_TALK_DATE = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 35 * 60 * 1000);

export default function EventosPage() {
  const [hasActiveEvent, setHasActiveEvent] = useState(true);
  const [selectedGuardian, setSelectedGuardian] = useState<string>("all");
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  // Live Dynamic States initialized strictly from Supabase
  const [activeTalk, setActiveTalk] = useState(DEFAULT_ACTIVE_TALK);
  const [allEvents, setAllEvents] = useState<Array<{
    id: string;
    title: string;
    guardian: string;
    guardianBadge: string;
    type: string;
    typeLabel: string;
    date: string;
    time: string;
    location: string;
    statusTag: string;
    statusColor: string;
  }>>([]);

  const [galleryWorks, setGalleryWorks] = useState<Array<{
    id: string;
    title: string;
    date: string;
    guardianTag: string;
    imgSrc: string;
    description: string;
    impactMetrics: string[];
  }>>([]);

  const [talkForm, setTalkForm] = useState({
    nombre: "",
    email: "",
    pregunta: "",
  });

  // Real-time Countdown logic
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, minutes: 35, seconds: 20 });

  // Auto-fill form from LocalStorage user profile & check registration status
  useEffect(() => {
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setTalkForm((prev) => ({
        ...prev,
        nombre: savedProfile.nombre || prev.nombre,
        email: savedProfile.email || prev.email,
      }));
    }

    if (activeTalk.id) {
      setAlreadyRegistered(isRegisteredForEvent(activeTalk.id));
    }
  }, [activeTalk.id]);

  // 1. Fetch EXCLUSIVELY from Supabase tables (`events` and `completed_works_gallery`)
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { supabase } = await import("@/lib/supabase");
        
        // A) Fetch ALL events from Supabase
        const { data: eventsData } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false });

        if (eventsData && eventsData.length > 0) {
          const featured = eventsData.find((e) => e.is_featured) || eventsData[0];
          
          setActiveTalk({
            id: featured.id,
            title: featured.title,
            tagHeader: featured.guardian_tag || "✦ FAENA ACTIVA · 🐰 TOCHTLI (Mentoría)",
            typeBadge: featured.type_badge || "🎙️ TEQUIO TALKS",
            guardian: featured.guardian,
            guardianSrc: featured.guardian === "tlacu" ? "/png/tlacu.png" : featured.guardian === "kuku" ? "/png/kuku.png" : "/png/tochtli.png",
            date: featured.date_display,
            time: featured.time_display,
            location: featured.location,
            speaker: featured.speaker || "Senior Dev Mentor",
            dynamic: featured.dynamic_desc || "Q&A + CV Review",
            access: featured.access_info || "Acceso libre",
            registeredCount: featured.registered_count || 0,
            capacityLimit: featured.capacity_limit || 60,
          });

          // Check registration for active talk
          setAlreadyRegistered(isRegisteredForEvent(featured.id));

          setAllEvents(
            eventsData.map((e) => ({
              id: e.id,
              title: e.title,
              guardian: e.guardian,
              guardianBadge: e.guardian_tag || e.guardian,
              type: e.type_category,
              typeLabel: e.type_badge,
              date: e.date_display,
              time: e.time_display,
              location: e.location,
              statusTag: isRegisteredForEvent(e.id) ? "Ya Inscripto ✓" : e.is_featured ? "Faena Activa 🔥" : e.status === "abierto" ? "Cupos disponibles" : "Presencial",
              statusColor: isRegisteredForEvent(e.id) ? "#10b981" : e.is_featured ? "#F5A623" : e.guardian === "tlacu" ? "#C15B3A" : "#10b981",
            }))
          );
        }

        // B) Fetch completed works gallery from Supabase
        const { data: galleryData } = await supabase
          .from("completed_works_gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (galleryData && galleryData.length > 0) {
          setGalleryWorks(
            galleryData.map((g) => ({
              id: g.id,
              title: g.title,
              date: g.event_date,
              guardianTag: g.guardian_tag,
              imgSrc: g.image_url,
              description: g.description,
              impactMetrics: Array.isArray(g.impact_metrics) ? g.impact_metrics : [],
            }))
          );
        }
      } catch (err) {
        console.warn("Error consultando Supabase:", err);
      }
    }

    loadSupabaseData();
  }, []);

  // 2. Real-time Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = TARGET_TALK_DATE.getTime() - new Date().getTime();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = allEvents.filter((evt) => {
    return selectedGuardian === "all" || evt.guardian === selectedGuardian;
  });

  // 3. Handle Registration Submission & Save to LocalStorage Session
  const handleTalkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!talkForm.nombre || !talkForm.email) return;

    setIsSubmitting(true);

    try {
      // Save user profile & event registration in browser localStorage session
      saveUserProfile({ nombre: talkForm.nombre, email: talkForm.email });
      saveEventRegistration(activeTalk.id);
      setAlreadyRegistered(true);

      const { supabase } = await import("@/lib/supabase");
      
      const { error } = await supabase.from("event_registrations").insert([
        {
          event_id: activeTalk.id,
          full_name: talkForm.nombre,
          email: talkForm.email,
          speaker_question: talkForm.pregunta || null,
          role_type: "Estudiante",
          modality: "Virtual",
        },
      ]);

      if (!error) {
        setActiveTalk((prev) => ({ ...prev, registeredCount: prev.registeredCount + 1 }));
      }
    } catch (err) {
      console.warn("Error en registro Supabase:", err);
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-azul-noche text-blanco-lunar relative overflow-hidden">
      <BrasaCursor />
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-36 pb-16 px-6 text-center overflow-hidden">
        <StarField count={30} isMitlaShape={true} />
        <BrasaParticles count={35} className="opacity-60" />

        <div className="container mx-auto max-w-4xl relative z-10 space-y-4">
          <span className="font-inter text-ambar text-xs md:text-sm uppercase tracking-[0.25em] font-semibold block">
            ✦ Registro de Mayordomía ✦
          </span>
          <h1 className="font-cinzel text-blanco-lunar text-4xl md:text-6xl font-bold tracking-wide">
            El Fuego Vivo de la Faena
          </h1>
          <p className="font-inter text-arena text-base md:text-lg leading-relaxed max-w-2xl mx-auto opacity-85">
            &quot;Aquí se registra el llamado a la faena comunitaria. Consulta el evento en puerta o explora las obras colectivas que la tribu ha erigido.&quot;
          </p>

          {/* User Session Welcome Badge if Profile Exists */}
          {getUserProfile() && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 font-inter text-xs bg-white/5 border border-ambar/30 text-ambar px-4 py-1.5 rounded-full">
                <span>👤 Sesión activa:</span>
                <strong>{getUserProfile()?.nombre}</strong>
                <span className="text-arena/60">({getUserProfile()?.email})</span>
              </span>
            </div>
          )}

          {/* CMS State Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setHasActiveEvent(!hasActiveEvent)}
              className="cursor-pointer text-xs font-inter text-arena/60 underline hover:text-arena px-3 py-1"
            >
              [{hasActiveEvent ? "Simular Altar Vacío (Sin evento activo)" : "Simular Evento en Puerta (Con Tequio Talk)"}]
            </button>
          </div>
        </div>
      </section>

      {/* TARJETA PRINCIPAL ("EL EVENTO EN PUERTA — TEQUIO TALKS #01") */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-5xl relative z-10">
          
          <AnimatePresence mode="wait">
            {hasActiveEvent ? (
              <motion.div
                key="active-talk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="relative p-8 md:p-12 rounded-3xl border-2 border-ambar/50 bg-white/[0.04] backdrop-blur-xl shadow-2xl overflow-visible space-y-8"
                style={{ boxShadow: "0 20px 60px rgba(245, 166, 35, 0.2)" }}
              >
                {/* Header Superior */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-xs uppercase tracking-widest font-bold text-ambar px-4 py-1 rounded-full bg-ambar/10 border border-ambar/30">
                    {activeTalk.tagHeader}
                  </span>

                  {alreadyRegistered && (
                    <span className="font-inter text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      ✓ Ya estás inscripto
                    </span>
                  )}
                </div>

                {/* Dos Columnas Limpias (60% Contenido / 40% Anfitrión & Acción) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Columna Izquierda (60% - Contenido) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="font-inter text-xs uppercase tracking-wider text-ambar font-bold block mb-2">
                        {activeTalk.typeBadge}
                      </span>
                      <h2 className="font-cinzel text-blanco-lunar text-3xl md:text-4xl font-bold leading-tight">
                        {activeTalk.title}
                      </h2>
                    </div>

                    <div className="space-y-2 font-inter text-sm md:text-base text-arena/90 bg-white/5 p-5 rounded-2xl border border-white/10">
                      <p>📅 <strong>Cuándo:</strong> {activeTalk.date}</p>
                      <p>⏰ <strong>Horario:</strong> {activeTalk.time}</p>
                      <p>📍 <strong>Transmisión:</strong> {activeTalk.location}</p>
                    </div>

                    <div className="space-y-2 font-inter text-xs text-arena/90">
                      <p className="flex items-center gap-2">
                        <span className="text-ambar font-bold">✦</span>
                        <span><strong>Ponente invitado:</strong> {activeTalk.speaker}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-ambar font-bold">✦</span>
                        <span><strong>Dinámica:</strong> {activeTalk.dynamic}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-ambar font-bold">✦</span>
                        <span><strong>Acceso:</strong> {activeTalk.access}</span>
                      </p>
                    </div>
                  </div>

                  {/* Columna Derecha (40% - Anfitrión Tochtli & Acción) */}
                  <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6 relative pt-4 lg:pt-0">
                    
                    {/* Tochtli desbordando 25px hacia arriba */}
                    <div className="relative -mt-12 lg:-mt-16 flex flex-col items-center">
                      <Image
                        src={activeTalk.guardianSrc}
                        alt="Tochtli, el sabio Conejo Lunar con orejas de Mitla guiando el Tequio Talk"
                        width={180}
                        height={220}
                        className="object-contain animate-breathe relative z-10 drop-shadow-2xl"
                        priority
                      />
                      <span className="font-inter text-[11px] italic text-arena/70 mt-1">
                        &quot;Tochtli te reserva un lugar en el círculo.&quot;
                      </span>
                    </div>

                    {/* Reloj Regresivo en Tiempo Real */}
                    <div className="bg-white/5 px-5 py-3 rounded-2xl border border-white/10 w-full">
                      <span className="font-inter text-[10px] uppercase tracking-widest text-arena/70 font-semibold block mb-1">
                        ⏳ Tiempo Restante para el Live
                      </span>
                      <div className="flex justify-center gap-3 font-cinzel text-xl font-bold text-blanco-lunar">
                        <div>{String(timeLeft.days).padStart(2, "0")}<span className="text-xs font-inter text-arena/60">d</span></div>:
                        <div>{String(timeLeft.hours).padStart(2, "0")}<span className="text-xs font-inter text-arena/60">h</span></div>:
                        <div>{String(timeLeft.minutes).padStart(2, "0")}<span className="text-xs font-inter text-arena/60">m</span></div>:
                        <div>{String(timeLeft.seconds).padStart(2, "0")}<span className="text-xs font-inter text-arena/60">s</span></div>
                      </div>
                    </div>

                    {/* Botón de Inscripción o Estado de Inscripto */}
                    <div className="w-full space-y-2">
                      {alreadyRegistered ? (
                        <button
                          onClick={() => {
                            setFormSubmitted(true);
                            setRegistrationModalOpen(true);
                          }}
                          className="w-full cursor-pointer font-inter font-bold text-base text-blanco-lunar py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow-2xl transition-all flex items-center justify-center gap-2"
                        >
                          <span>✓ Ya estás inscripto (Ver detalles)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setFormSubmitted(false);
                            setRegistrationModalOpen(true);
                          }}
                          className="w-full cursor-pointer font-inter font-bold text-base text-blanco-lunar py-4 rounded-2xl shadow-2xl transition-all hover:scale-105 hover:shadow-[0_12px_35px_rgba(229,169,60,0.6)] flex items-center justify-center gap-2"
                          style={{
                            background: "linear-gradient(135deg, #E5A93C 0%, #C85A32 100%)",
                          }}
                        >
                          <span>Reservar mi Lugar en el Talk</span>
                          <span className="text-xl">→</span>
                        </button>
                      )}

                      <span className="font-inter text-xs text-arena/80 block">
                        👥 <strong>{activeTalk.registeredCount} / {activeTalk.capacityLimit}</strong> Lugares Reservados
                      </span>
                    </div>

                  </div>

                </div>
              </motion.div>
            ) : (
              /* ALTAR VACÍO */
              <motion.div
                key="empty-altar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="relative p-12 rounded-3xl border-2 border-ambar/40 bg-white/[0.03] backdrop-blur-xl text-center max-w-3xl mx-auto shadow-2xl space-y-6"
              >
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-50 bg-ambar pointer-events-none" />
                    <Image
                      src="/png/tochtli.png"
                      alt="Tochtli, el sabio Conejo Lunar custodiando el altar"
                      width={180}
                      height={220}
                      className="object-contain animate-breathe"
                    />
                  </div>
                </div>

                <span className="font-inter text-xs uppercase tracking-[0.2em] text-ambar font-semibold block">
                  🌙 Estado: El Fuego está en Calma
                </span>

                <h3 className="font-cinzel text-blanco-lunar text-3xl font-bold">
                  El Altar de la Faena está en Calma
                </h3>

                <p className="font-inter text-arena text-base leading-relaxed max-w-xl mx-auto opacity-90">
                  &quot;El fuego de la faena está en calma. Únete a la tribu en nuestra comunidad de Discord para ser el primero en escuchar el llamado.&quot;
                </p>

                <div>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer inline-flex items-center gap-2 font-inter font-bold bg-ambar text-azul-noche px-8 py-4 rounded-2xl shadow-xl hover:bg-ambar-light transition-all hover:scale-105"
                  >
                    <span>Unirme a la tribu en Discord</span>
                    <span>→</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* FILTROS POR GUARDIÁN CON CHIPS TÁCTILES */}
      <section className="py-6 px-6">
        <div className="container mx-auto max-w-5xl relative z-10 bg-white/[0.03] p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-inter text-xs uppercase tracking-wider text-ambar font-bold">
              Filtrar Agenda:
            </span>
          </div>

          {/* Chips Táctiles */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: "all", label: "✦ Todos" },
              { id: "tochtli", label: "🐰 Tochtli (Mentoría)" },
              { id: "tlacu", label: "🦝 Tlacu (Construcción)" },
              { id: "kuku", label: "🪶 Kuku (Caravanas)" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedGuardian(chip.id)}
                className={`cursor-pointer font-inter text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedGuardian === chip.id
                    ? "bg-amber-500 text-azul-noche shadow-[0_0_15px_#F5A623] scale-105"
                    : "bg-white/5 text-arena/80 hover:bg-white/10 hover:text-blanco-lunar border border-white/10"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CALENDARIO DE PRÓXIMAS FAENAS PROGRAMADAS */}
      <section className="py-10 px-6">
        <div className="container mx-auto max-w-5xl relative z-10 space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel text-blanco-lunar text-2xl md:text-3xl font-bold">
              📅 Próximas Faenas Programadas
            </h2>
            <span className="font-inter text-xs text-arena/60">
              {filteredEvents.length} eventos encontrados
            </span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 rounded-2xl bg-white/[0.035] border border-white/10 flex flex-col justify-between hover:border-ambar/50 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-inter text-xs font-bold text-ambar">
                        {evt.guardianBadge}
                      </span>
                      <span
                        className="font-inter text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `${evt.statusColor}22`,
                          color: evt.statusColor,
                          border: `1px solid ${evt.statusColor}44`,
                        }}
                      >
                        {evt.statusTag}
                      </span>
                    </div>

                    <span className="font-inter text-xs text-arena/70 font-semibold block mb-1">
                      {evt.typeLabel}
                    </span>

                    <h3 className="font-cinzel text-blanco-lunar text-lg font-bold mb-4 group-hover:text-ambar transition-colors">
                      {evt.title}
                    </h3>

                    <div className="space-y-1 font-inter text-xs text-arena/80 mb-6">
                      <p>📅 {evt.date}</p>
                      <p>⏰ {evt.time}</p>
                      <p>📍 {evt.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setFormSubmitted(isRegisteredForEvent(evt.id));
                      setRegistrationModalOpen(true);
                    }}
                    className="cursor-pointer font-inter text-xs font-bold text-ambar hover:underline inline-flex items-center gap-1 pt-3 border-t border-white/10"
                  >
                    <span>{isRegisteredForEvent(evt.id) ? "Ver detalles" : "Inscribirme"}</span>
                    <span>→</span>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
              <p className="font-cinzel text-amber-400 text-xl font-bold">🪵 Las Brasas Guardan Reposo</p>
              <p className="font-inter text-arena text-xs opacity-85">
                No hay más eventos filtrados para este guardián.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* MEMORIA COLECTIVA */}
      <section className="py-20 px-6 border-t border-white/10 bg-black/20">
        <div className="container mx-auto max-w-5xl relative z-10 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-inter text-terracota text-xs uppercase tracking-[0.2em] font-bold block">
              🖼️ MEMORIA COLECTIVA (Obras Erigidas)
            </span>
            <h2 className="font-cinzel text-blanco-lunar text-3xl md:text-4xl font-bold">
              Obras Colectivas de la Tribu
            </h2>
            <p className="font-inter text-arena text-base italic opacity-85">
              &quot;Cada faena cumplida es una piedra más en el camino colectivo. Aquí recordamos lo que hemos construido juntos.&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryWorks.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden bg-white/[0.035] border border-white/10 flex flex-col justify-between hover:border-terracota/50 transition-all duration-300 group shadow-xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.imgSrc}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-azul-noche via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 font-inter text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-azul-noche/90 text-ambar border border-ambar/30">
                    {item.guardianTag}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-inter text-xs text-arena/60 font-semibold block mb-1">
                      📅 {item.date}
                    </span>
                    <h3 className="font-cinzel text-blanco-lunar text-lg font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="font-inter text-arena text-xs leading-relaxed opacity-85 mb-3">
                      {item.description}
                    </p>

                    <div className="p-3 rounded-xl bg-terracota/10 border border-terracota/20 space-y-1">
                      {item.impactMetrics.map((m, idx) => (
                        <p key={idx} className="font-inter text-xs text-amber-300 font-semibold">
                          {m}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs font-inter text-terracota font-bold text-right">
                    Faena Cumplida ✓
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MODAL LIGERO DE 3 CAMPOS: AUTO-RELLENO & AVISO DE INSCRIPTO */}
      <AnimatePresence>
        {registrationModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setRegistrationModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="p-8 rounded-3xl bg-azul-noche border-2 border-amber-500/50 max-w-lg w-full space-y-6 shadow-2xl relative"
            >
              {!formSubmitted && !alreadyRegistered ? (
                <>
                  <div className="text-center space-y-1">
                    <span className="font-inter text-xs uppercase tracking-widest text-ambar font-bold block">
                      🎙️ Tequio Talks #01
                    </span>
                    <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                      Reservar mi Lugar en el Talk
                    </h3>
                    <p className="font-inter text-arena text-xs opacity-80">
                      {getUserProfile() ? "✦ Tus datos han sido autorrellenados automáticamente desde tu sesión." : "Tochtli te reserva un lugar en el círculo de mentoría."}
                    </p>
                  </div>

                  <form onSubmit={handleTalkSubmit} className="space-y-4">
                    <div>
                      <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={talkForm.nombre}
                        onChange={(e) => setTalkForm({ ...talkForm, nombre: e.target.value })}
                        placeholder="Ej. Quetzalli Gómez"
                        className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-ambar"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={talkForm.email}
                        onChange={(e) => setTalkForm({ ...talkForm, email: e.target.value })}
                        placeholder="correo@ejemplo.com"
                        className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-ambar"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                        ¿Qué pregunta te gustaría hacerle al ponente? (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={talkForm.pregunta}
                        onChange={(e) => setTalkForm({ ...talkForm, pregunta: e.target.value })}
                        placeholder="Escribe tu duda sobre carrera o tech lead..."
                        className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-ambar"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setRegistrationModalOpen(false)}
                        className="font-inter text-xs text-arena/70 hover:text-white"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="font-inter font-bold text-sm text-blanco-lunar px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #E5A93C 0%, #C85A32 100%)",
                        }}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Reservar mi lugar</span>
                            <span>→</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* VISTA DE CONFIRMACIÓN O AVISO DE YA INSCRIPTO */
                <div className="text-center space-y-4 py-4">
                  <span className="font-inter text-xs uppercase tracking-widest text-emerald-400 font-bold block">
                    ✦ Lugar Reservado en tu Sesión ✦
                  </span>
                  <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                    ¡Tu lugar está asegurado en el Círculo!
                  </h3>
                  <p className="font-inter text-arena text-xs opacity-90 leading-relaxed">
                    Hola <strong>{talkForm.nombre || getUserProfile()?.nombre}</strong>. Ya registramos tu lugar para esta faena con el correo <strong>{talkForm.email || getUserProfile()?.email}</strong>.
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-inter text-emerald-300">
                    📍 Acceso Directo: Google Meet / YouTube Live (Se activará 15m antes).
                  </div>

                  <button
                    onClick={() => setRegistrationModalOpen(false)}
                    className="font-inter font-bold text-xs bg-emerald-500 text-azul-noche px-6 py-2.5 rounded-xl hover:bg-emerald-400"
                  >
                    Entendido
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FooterSection />
    </main>
  );
}
