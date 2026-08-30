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
import LinkedInEmbedCard, { CardSizeVariant } from "@/components/ui/LinkedInEmbedCard";
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
  meeting_link: "https://meet.google.com/abc-defg-hij",
  speaker: "Senior Dev & Tech Lead Mentor",
  speaker_social: "https://linkedin.com",
  dynamic: "Q&A Abierto + Revisión de CV en Vivo",
  access: "Acceso libre · Registro previo necesario",
  registeredCount: 0,
  capacityLimit: 60,
};

const TARGET_TALK_DATE = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 35 * 60 * 1000);

// Pattern of varying sizes for Masonry
const SIZE_VARIANTS: CardSizeVariant[] = ["tall", "compact", "medium", "standard"];

export default function EventosPage() {
  const [hasActiveEvent, setHasActiveEvent] = useState(true);
  const [selectedGuardian, setSelectedGuardian] = useState<string>("all");
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [galleryVisibleLimit, setGalleryVisibleLimit] = useState<number>(4); // ONLY 4 INITIALLY

  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [shareLinkedInModalOpen, setShareLinkedInModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [routeFormSubmitted, setRouteFormSubmitted] = useState(false);
  const [linkedInFormSubmitted, setLinkedInFormSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  
  const [needNamePrompt, setNeedNamePrompt] = useState(false);
  const [memberValidationMessage, setMemberValidationMessage] = useState<string | null>(null);

  const [activeTalk, setActiveTalk] = useState(DEFAULT_ACTIVE_TALK);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [externalRoutes, setExternalRoutes] = useState<any[]>([]);
  const [galleryWorks, setGalleryWorks] = useState<any[]>([]);

  const [talkForm, setTalkForm] = useState({
    nombre: "",
    email: "",
    pregunta: "",
  });

  const [routeForm, setRouteForm] = useState({
    nombre: "",
    email: "",
    notas: "",
  });

  const [linkedInForm, setLinkedInForm] = useState({
    email: "",
    nombre: "",
    title: "",
    linkedin_url: "",
    description: "",
  });

  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, minutes: 35, seconds: 20 });

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setTalkForm((prev) => ({
        ...prev,
        nombre: savedProfile.nombre || prev.nombre,
        email: savedProfile.email || prev.email,
      }));
      setRouteForm((prev) => ({
        ...prev,
        nombre: savedProfile.nombre || prev.nombre,
        email: savedProfile.email || prev.email,
      }));
      setLinkedInForm((prev) => ({
        ...prev,
        email: savedProfile.email || prev.email,
        nombre: savedProfile.nombre || prev.nombre,
      }));
    }

    if (activeTalk.id) {
      setAlreadyRegistered(isRegisteredForEvent(activeTalk.id));
    }
  }, [activeTalk.id]);

  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { supabase } = await import("@/lib/supabase");
        
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
            meeting_link: featured.meeting_link || "https://meet.google.com",
            speaker: featured.speaker || "Senior Dev Mentor",
            speaker_social: featured.speaker_social,
            dynamic: featured.dynamic_desc || "Q&A + CV Review",
            access: featured.access_info || "Acceso libre",
            registeredCount: featured.registered_count || 0,
            capacityLimit: featured.capacity_limit || 60,
          });

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
              meeting_link: e.meeting_link || "https://meet.google.com",
              speaker: e.speaker,
              speaker_social: e.speaker_social,
              statusTag: isRegisteredForEvent(e.id) ? "Ya Inscripto ✓" : e.is_featured ? "Faena Activa 🔥" : e.status === "abierto" ? "Cupos disponibles" : "Presencial",
              statusColor: isRegisteredForEvent(e.id) ? "#10b981" : e.is_featured ? "#F5A623" : e.guardian === "tlacu" ? "#C15B3A" : "#10b981",
            }))
          );
        }

        const { data: routesData } = await supabase
          .from("external_routes")
          .select("*")
          .order("created_at", { ascending: false });

        if (routesData && routesData.length > 0) {
          setExternalRoutes(routesData);
        }

        // FETCH MOST RECENT GALLERY POSTS FIRST
        const { data: galleryData } = await supabase
          .from("completed_works_gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (galleryData && galleryData.length > 0) {
          setGalleryWorks(
            galleryData.map((g, idx) => ({
              id: g.id,
              title: g.title,
              date: g.event_date,
              guardianTag: g.guardian_tag,
              sealStamp: g.seal_stamp || "✦ SELLO DE MAYORDOMÍA ✦",
              linkedinPostUrl: g.linkedin_post_url,
              imgSrc: g.image_url || "/jpg/moment1.jpg",
              description: g.description,
              authorName: g.author_name,
              impactMetrics: Array.isArray(g.impact_metrics) ? g.impact_metrics : [],
              sizeVariant: SIZE_VARIANTS[idx % SIZE_VARIANTS.length], // Dynamic size variations
            }))
          );
        }
      } catch (err) {
        console.warn("Error consultando Supabase:", err);
      }
    }

    loadSupabaseData();
  }, []);

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

  // Filter gallery works by selected category
  const filteredGalleryWorks = galleryWorks.filter((item) => {
    if (galleryFilter === "all") return true;
    if (galleryFilter === "tlacu") return item.guardianTag?.toLowerCase().includes("tlacu") || item.guardianTag?.toLowerCase().includes("forja");
    if (galleryFilter === "tochtli") return item.guardianTag?.toLowerCase().includes("tochtli") || item.guardianTag?.toLowerCase().includes("mentor");
    if (galleryFilter === "kuku") return item.guardianTag?.toLowerCase().includes("kuku") || item.guardianTag?.toLowerCase().includes("caravana");
    if (galleryFilter === "tribu") return item.authorName || item.guardianTag?.toLowerCase().includes("tribu");
    return true;
  });

  // Limit display to 4 items initially
  const visibleGalleryWorks = filteredGalleryWorks.slice(0, galleryVisibleLimit);
  const remainingGalleryCount = filteredGalleryWorks.length - galleryVisibleLimit;

  const handleTalkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!talkForm.nombre || !talkForm.email) return;

    setIsSubmitting(true);

    try {
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

  const handleRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeForm.nombre || !routeForm.email || !selectedRoute) return;

    setIsSubmitting(true);

    try {
      saveUserProfile({ nombre: routeForm.nombre, email: routeForm.email });

      const { supabase } = await import("@/lib/supabase");
      await supabase.from("route_interests").insert([
        {
          route_id: selectedRoute.id,
          full_name: routeForm.nombre,
          email: routeForm.email,
          notes: routeForm.notas || null,
        },
      ]);

      setExternalRoutes((prev) =>
        prev.map((r) => (r.id === selectedRoute.id ? { ...r, interested_count: (r.interested_count || 0) + 1 } : r))
      );
    } catch (err) {
      console.warn("Error enviando interés de ruta:", err);
    } finally {
      setIsSubmitting(false);
      setRouteFormSubmitted(true);
    }
  };

  const handleShareLinkedInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedInForm.email || !linkedInForm.linkedin_url) return;

    setIsSubmitting(true);
    setMemberValidationMessage(null);

    try {
      const { supabase } = await import("@/lib/supabase");

      const cleanEmail = linkedInForm.email.toLowerCase().trim();

      const { data: existingMember } = await supabase
        .from("community_members")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      let authorFullName = existingMember?.full_name || linkedInForm.nombre.trim();

      if (!existingMember) {
        if (!authorFullName) {
          setNeedNamePrompt(true);
          setMemberValidationMessage(
            "💡 Tu correo aún no está registrado en la tribu. Por favor escribe tu Nombre Completo abajo para darte de alta y publicar en 1 solo paso."
          );
          setIsSubmitting(false);
          return;
        }

        const { data: newMember } = await supabase
          .from("community_members")
          .insert([
            {
              full_name: authorFullName,
              email: cleanEmail,
              role_interest: "Integrante con Publicación",
            },
          ])
          .select()
          .single();

        if (newMember) {
          saveUserProfile({ nombre: authorFullName, email: cleanEmail });
        }
      } else {
        saveUserProfile({ nombre: existingMember.full_name, email: cleanEmail });
      }

      const { error } = await supabase.from("completed_works_gallery").insert([
        {
          author_email: cleanEmail,
          author_name: authorFullName,
          title: linkedInForm.title || `Publicación de ${authorFullName}`,
          event_date: "Reciente 2026",
          guardian_tag: "🪶 Tribu Tequio",
          seal_stamp: "✦ SELLO DE INTEGRANTE CUMPLIDO ✦",
          linkedin_post_url: linkedInForm.linkedin_url.trim(),
          description: linkedInForm.description || `Experiencia compartida por ${authorFullName}.`,
          impact_metrics: ["🌟 Publicación de Integrante", "👥 Comunidad Tequio"],
        },
      ]);

      if (error) {
        setMemberValidationMessage(`❌ Error: ${error.message}`);
      } else {
        setLinkedInFormSubmitted(true);
        setGalleryWorks((prev) => [
          {
            id: Date.now().toString(),
            title: linkedInForm.title || `Publicación de ${authorFullName}`,
            date: "Reciente 2026",
            guardianTag: "🪶 Tribu Tequio",
            sealStamp: "✦ SELLO DE INTEGRANTE CUMPLIDO ✦",
            linkedinPostUrl: linkedInForm.linkedin_url.trim(),
            description: linkedInForm.description || `Experiencia compartida por ${authorFullName}.`,
            authorName: authorFullName,
            impactMetrics: ["🌟 Publicación de Integrante", "👥 Comunidad Tequio"],
            sizeVariant: SIZE_VARIANTS[prev.length % SIZE_VARIANTS.length],
          },
          ...prev,
        ]);
      }
    } catch (err: any) {
      setMemberValidationMessage(`❌ Error de proceso: ${err.message}`);
    } finally {
      setIsSubmitting(false);
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
            ✦ Registro de Mayordomía & Caravanas ✦
          </span>
          <h1 className="font-cinzel text-blanco-lunar text-4xl md:text-6xl font-bold tracking-wide">
            El Fuego Vivo de la Faena
          </h1>
          <p className="font-inter text-arena text-base md:text-lg leading-relaxed max-w-2xl mx-auto opacity-85">
            &quot;Aquí se registra el llamado a la faena comunitaria y a las Caravanas del Vuelo hacia eventos de la industria tech.&quot;
          </p>

          {getUserProfile() && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 font-inter text-xs bg-white/5 border border-ambar/30 text-ambar px-4 py-1.5 rounded-full">
                <span>👤 Sesión activa:</span>
                <strong>{getUserProfile()?.nombre}</strong>
                <span className="text-arena/60">({getUserProfile()?.email})</span>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* TARJETA PRINCIPAL ("EL EVENTO EN PUERTA — TEQUIO TALKS #01") */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-5xl relative z-10">
          <AnimatePresence mode="wait">
            {hasActiveEvent && (
              <motion.div
                key="active-talk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="relative p-8 md:p-12 rounded-3xl border-2 border-ambar/50 bg-white/[0.04] backdrop-blur-xl shadow-2xl overflow-visible space-y-8"
                style={{ boxShadow: "0 20px 60px rgba(245, 166, 35, 0.2)" }}
              >
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                      <p className="flex items-center justify-between gap-2">
                        <span><strong>Ponente invitado:</strong> {activeTalk.speaker}</span>
                        {activeTalk.speaker_social && (
                          <a
                            href={activeTalk.speaker_social}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 underline hover:text-amber-300 font-bold"
                          >
                            LinkedIn / Perfil ↗
                          </a>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6 relative pt-4 lg:pt-0">
                    <div className="relative -mt-12 lg:-mt-16 flex flex-col items-center">
                      <Image
                        src={activeTalk.guardianSrc}
                        alt="Tochtli Sabio"
                        width={180}
                        height={220}
                        className="object-contain animate-breathe relative z-10 drop-shadow-2xl"
                        priority
                      />
                    </div>

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

                    <div className="w-full space-y-2">
                      <button
                        onClick={() => {
                          setFormSubmitted(alreadyRegistered);
                          setRegistrationModalOpen(true);
                        }}
                        className="w-full cursor-pointer font-inter font-bold text-base text-blanco-lunar py-4 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #E5A93C 0%, #C85A32 100%)",
                        }}
                      >
                        <span>{alreadyRegistered ? "✓ Ya estás inscripto (Ver enlace de transmisión)" : "Reservar mi Lugar en el Talk"}</span>
                        <span className="text-xl">→</span>
                      </button>

                      <span className="font-inter text-xs text-arena/80 block">
                        👥 <strong>{activeTalk.registeredCount} / {activeTalk.capacityLimit}</strong> Lugares Reservados
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* RUTAS DEL VUELO */}
      <section className="py-16 px-6 border-t border-white/10 bg-black/20">
        <div className="container mx-auto max-w-5xl relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-inter text-amber-400 text-xs uppercase tracking-[0.25em] font-bold block">
                🪶 Caravana del Vuelo (Comunidades Externas)
              </span>
              <h2 className="font-cinzel text-blanco-lunar text-3xl md:text-4xl font-bold">
                Eventos Externos a los que Iremos en Grupo
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {externalRoutes.map((route) => (
              <div
                key={route.id}
                className="rounded-3xl overflow-hidden bg-white/[0.035] border border-amber-500/30 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-2xl group"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={route.image_url || "/jpg/moment3.jpg"}
                    alt={route.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 font-inter text-xs uppercase font-bold px-3.5 py-1 rounded-full bg-azul-noche/90 text-amber-400 border border-amber-400/40">
                    {route.organizer_name}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-cinzel text-blanco-lunar text-xl font-bold">{route.title}</h3>
                    <p className="font-inter text-arena text-xs leading-relaxed opacity-90">{route.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setSelectedRoute(route);
                        setRouteFormSubmitted(false);
                        setRouteModalOpen(true);
                      }}
                      className="cursor-pointer font-inter font-bold text-xs bg-amber-500 text-azul-noche px-5 py-3 rounded-xl hover:bg-amber-400 transition-all flex-1 text-center"
                    >
                      Me sumo a ir en grupo →
                    </button>
                    <a
                      href={route.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer font-inter font-bold text-xs bg-white/10 text-blanco-lunar border border-white/20 px-5 py-3 rounded-xl hover:bg-white/20 transition-all flex-1 text-center"
                    >
                      Registro Oficial ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENDA DE FAENAS */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl relative z-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-cinzel text-blanco-lunar text-2xl md:text-3xl font-bold">
              📅 Agenda de Faenas Tequio
            </h2>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "✦ Todos" },
                { id: "tochtli", label: "🐰 Tochtli (Mentoría)" },
                { id: "tlacu", label: "🦝 Tlacu (Construcción)" },
                { id: "kuku", label: "🪶 Kuku (Caravanas)" },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedGuardian(chip.id)}
                  className={`cursor-pointer font-inter text-xs font-bold px-4 py-2 rounded-full transition-all ${
                    selectedGuardian === chip.id
                      ? "bg-amber-500 text-azul-noche scale-105"
                      : "bg-white/5 text-arena/80 hover:bg-white/10"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* AGENDA PINTEREST MASONRY DE EVENTOS */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredEvents.map((evt, idx) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 30, filter: "blur(3px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.5,
                  delay: (idx % 3) * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -5 }}
                className="break-inside-avoid mb-6 rounded-3xl overflow-hidden bg-white/[0.035] border border-amber-500/30 flex flex-col justify-between hover:border-amber-400 hover:shadow-[0_15px_35px_rgba(245,166,35,0.2)] transition-all duration-300 backdrop-blur-xl group"
              >
                {/* Event Poster / Image Header if present */}
                {evt.image_url && (
                  <div className="relative h-44 w-full overflow-hidden border-b border-white/10">
                    <Image
                      src={evt.image_url}
                      alt={evt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-azul-noche via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 font-inter text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-azul-noche/90 text-amber-400 border border-amber-400/40">
                      {evt.typeLabel || " Faena Tequio"}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-inter text-xs font-bold text-amber-400">
                        {evt.guardianBadge}
                      </span>
                      <span className="font-inter text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {evt.statusTag}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-blanco-lunar text-xl font-bold group-hover:text-amber-300 transition-colors">
                      {evt.title}
                    </h3>

                    <div className="space-y-1.5 font-inter text-xs text-arena/80 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p>📅 <strong>Fecha:</strong> {evt.date}</p>
                      <p>⏰ <strong>Horario:</strong> {evt.time}</p>
                      <p>📍 <strong>Transmisión:</strong> {evt.location}</p>
                      {evt.speaker && <p className="text-amber-300 pt-1">👤 <strong>Ponente:</strong> {evt.speaker}</p>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setFormSubmitted(isRegisteredForEvent(evt.id));
                        setRegistrationModalOpen(true);
                      }}
                      className="cursor-pointer font-inter text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>{isRegisteredForEvent(evt.id) ? "Ver liga de acceso ✓" : "Reservar lugar →"}</span>
                    </button>

                    {evt.speaker_social && (
                      <a
                        href={evt.speaker_social}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-inter text-[10px] text-arena/60 hover:text-amber-300 underline"
                      >
                        Ponente ↗
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMORIA COLECTIVA CON FILTROS, MASONRY DIVERSO, INICIAL 4 POSTS Y BOTÓN VER MÁS */}
      <section className="py-20 px-6 border-t border-white/10 bg-black/20">
        <div className="container mx-auto max-w-5xl relative z-10 space-y-10">
          
          {/* HEADER & FILTROS CATEGORÍA DE GALERÍA */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="font-inter text-amber-400 text-xs uppercase tracking-[0.25em] font-bold block">
                  🖼️ MEMORIA COLECTIVA VIVA (LinkedIn Embeds)
                </span>
                <h2 className="font-cinzel text-blanco-lunar text-3xl md:text-4xl font-bold">
                  Obras Colectivas & Publicaciones de la Tribu
                </h2>
                <p className="font-inter text-arena text-sm opacity-85">
                  &quot;Se muestran las 4 publicaciones más recientes. Inmortaliza tu testimonio en la galería compartiendo el enlace de tu post.&quot;
                </p>
              </div>

              <div>
                <button
                  onClick={() => {
                    setLinkedInFormSubmitted(false);
                    setNeedNamePrompt(false);
                    setMemberValidationMessage(null);
                    setShareLinkedInModalOpen(true);
                  }}
                  className="cursor-pointer font-inter font-bold text-xs bg-amber-500 text-azul-noche px-6 py-3.5 rounded-2xl shadow-xl hover:bg-amber-400 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>✍️ Compartir mi Post de LinkedIn</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* CHIPS DE FILTRADO PARA MEMORIA COLECTIVA */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              {[
                { id: "all", label: "✦ Todas las Obras" },
                { id: "tlacu", label: "🦝 Forja & Hackathons" },
                { id: "tochtli", label: "🐰 Mentoría & Talks" },
                { id: "kuku", label: "🪶 Caravanas del Vuelo" },
                { id: "tribu", label: "👥 Post de Integrantes" },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => {
                    setGalleryFilter(chip.id);
                    setGalleryVisibleLimit(4); // Reset to 4 on filter change
                  }}
                  className={`cursor-pointer font-inter text-xs font-bold px-4 py-2 rounded-full transition-all ${
                    galleryFilter === chip.id
                      ? "bg-amber-500 text-azul-noche scale-105 shadow-[0_0_15px_#F5A623]"
                      : "bg-white/5 text-arena/80 hover:bg-white/10 hover:text-blanco-lunar border border-white/10"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* GALERÍA MASONRY DE 4 POSTS INICIALES CON TAMAÑOS VARIABLES & APARICIÓN SUAVE */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {visibleGalleryWorks.map((item, idx) => (
              <LinkedInEmbedCard
                key={item.id}
                id={item.id}
                index={idx}
                sizeVariant={item.sizeVariant || SIZE_VARIANTS[idx % SIZE_VARIANTS.length]}
                title={item.title}
                date={item.date}
                guardianTag={item.guardianTag}
                sealStamp={item.sealStamp}
                linkedinPostUrl={item.linkedinPostUrl}
                imgSrc={item.imgSrc}
                description={item.description}
                impactMetrics={item.impactMetrics}
                authorName={item.authorName}
              />
            ))}
          </div>

          {/* BOTÓN DE "VER MÁS OBRAS" SI EXISTEN MÁS POSTS */}
          {remainingGalleryCount > 0 && (
            <div className="text-center pt-6">
              <button
                onClick={() => setGalleryVisibleLimit((prev) => prev + 4)}
                className="cursor-pointer font-inter font-bold text-xs bg-white/10 text-blanco-lunar border border-amber-500/40 px-8 py-3.5 rounded-2xl hover:bg-amber-500 hover:text-azul-noche hover:border-amber-400 transition-all duration-300 shadow-xl inline-flex items-center gap-2"
              >
                <span>📜 Cargar Más Obras de la Tribu (+{remainingGalleryCount} más)</span>
                <span>↓</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* MODAL 1: RESERVAR LUGAR EN TEQUIO TALK INTERNO */}
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
              {!formSubmitted ? (
                <>
                  <div className="text-center space-y-1">
                    <span className="font-inter text-xs uppercase tracking-widest text-ambar font-bold block">
                      🎙️ Reservación a Faena Interna
                    </span>
                    <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                      {activeTalk.title}
                    </h3>
                  </div>

                  <form onSubmit={handleTalkSubmit} className="space-y-4">
                    <div>
                      <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">Tu Nombre Completo *</label>
                      <input type="text" required value={talkForm.nombre} onChange={(e) => setTalkForm({ ...talkForm, nombre: e.target.value })} className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                    </div>

                    <div>
                      <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">Correo Electrónico *</label>
                      <input type="email" required value={talkForm.email} onChange={(e) => setTalkForm({ ...talkForm, email: e.target.value })} className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <button type="button" onClick={() => setRegistrationModalOpen(false)} className="font-inter text-xs text-arena/70">Cancelar</button>
                      <button type="submit" disabled={isSubmitting} className="font-inter font-bold text-sm bg-amber-500 text-azul-noche px-6 py-3 rounded-xl">{isSubmitting ? "Guardando..." : "Reservar mi lugar →"}</button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-5 py-4">
                  <span className="font-inter text-xs uppercase tracking-widest text-emerald-400 font-bold block">✦ Lugar Confirmado ✦</span>
                  <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">¡Tu acceso a la sesión está activo!</h3>
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-inter space-y-2">
                    <span className="text-emerald-300 font-bold block">📍 Enlace oficial de transmisión (Google Meet / Zoom):</span>
                    <a href={activeTalk.meeting_link || "https://meet.google.com"} target="_blank" rel="noopener noreferrer" className="cursor-pointer font-bold text-amber-300 underline text-sm break-all">{activeTalk.meeting_link || "https://meet.google.com/abc-defg-hij"} ↗</a>
                  </div>
                  <button onClick={() => setRegistrationModalOpen(false)} className="font-inter font-bold text-xs bg-emerald-500 text-azul-noche px-6 py-2.5 rounded-xl">Entendido</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: SUMARME A LA CARAVANA */}
      <AnimatePresence>
        {routeModalOpen && selectedRoute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick={() => setRouteModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="p-8 rounded-3xl bg-azul-noche border-2 border-amber-500/50 max-w-lg w-full space-y-6 shadow-2xl relative">
              {!routeFormSubmitted ? (
                <form onSubmit={handleRouteSubmit} className="space-y-4">
                  <div className="text-center space-y-1">
                    <span className="font-inter text-xs uppercase tracking-widest text-amber-400 font-bold block">🪶 Me sumo a ir en grupo</span>
                    <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">{selectedRoute.title}</h3>
                  </div>
                  <div>
                    <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">Tu Nombre Completo *</label>
                    <input type="text" required value={routeForm.nombre} onChange={(e) => setRouteForm({ ...routeForm, nombre: e.target.value })} className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">Correo Electrónico *</label>
                    <input type="email" required value={routeForm.email} onChange={(e) => setRouteForm({ ...routeForm, email: e.target.value })} className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <button type="button" onClick={() => setRouteModalOpen(false)} className="font-inter text-xs text-arena/70">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="font-inter font-bold text-sm bg-amber-500 text-azul-noche px-6 py-3 rounded-xl">{isSubmitting ? "Guardando..." : "Sumarme a la Caravana →"}</button>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">¡Estás en la lista de la Caravana!</h3>
                  <a href={selectedRoute.external_link} target="_blank" rel="noopener noreferrer" className="cursor-pointer font-inter font-bold text-xs bg-amber-500 text-azul-noche px-6 py-3 rounded-xl block text-center">Ir ahora al Registro Oficial ↗</a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: COMPARTIR POST DE LINKEDIN CON AUTO-REGISTRO */}
      <AnimatePresence>
        {shareLinkedInModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setShareLinkedInModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="p-8 rounded-3xl bg-azul-noche border-2 border-amber-500/50 max-w-lg w-full space-y-6 shadow-2xl relative"
            >
              {!linkedInFormSubmitted ? (
                <>
                  <div className="text-center space-y-1">
                    <span className="font-inter text-xs uppercase tracking-widest text-amber-400 font-bold block">
                      🖼️ Publicar en Memoria Colectiva
                    </span>
                    <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                      Compartir mi Post de LinkedIn
                    </h3>
                  </div>

                  <form onSubmit={handleShareLinkedInSubmit} className="space-y-4">
                    <div>
                      <label className="block font-inter text-xs text-amber-400 font-bold mb-1">
                        Tu Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={linkedInForm.email}
                        onChange={(e) => setLinkedInForm({ ...linkedInForm, email: e.target.value })}
                        placeholder="tu-correo@ejemplo.com"
                        className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className={needNamePrompt ? "p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-400" : ""}>
                      <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                        Nombre Completo {needNamePrompt ? "* (Necesario para inscribirte en la tribu)" : "(Opcional)"}
                      </label>
                      <input
                        type="text"
                        required={needNamePrompt}
                        value={linkedInForm.nombre}
                        onChange={(e) => setLinkedInForm({ ...linkedInForm, nombre: e.target.value })}
                        placeholder="Ej. Sofía Morales / Carlos Mendoza"
                        className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-xs text-amber-400 font-bold mb-1">
                        🔗 Enlace de tu Post de LinkedIn * (lnkd.in o linkedin.com/feed/update/...)
                      </label>
                      <input
                        type="text"
                        required
                        value={linkedInForm.linkedin_url}
                        onChange={(e) => setLinkedInForm({ ...linkedInForm, linkedin_url: e.target.value })}
                        placeholder="https://lnkd.in/p/g-Dc7yaS"
                        className="w-full font-inter bg-white/10 border border-amber-400/50 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                        Título o Frase del Post
                      </label>
                      <input
                        type="text"
                        value={linkedInForm.title}
                        onChange={(e) => setLinkedInForm({ ...linkedInForm, title: e.target.value })}
                        placeholder="Ej. Mi testimonio en la Caravana del Vuelo Tequio"
                        className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {memberValidationMessage && (
                      <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-400 text-xs font-inter text-amber-200 font-semibold">
                        {memberValidationMessage}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setShareLinkedInModalOpen(false)}
                        className="font-inter text-xs text-arena/70"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="font-inter font-bold text-sm bg-amber-500 text-azul-noche px-6 py-3 rounded-xl shadow-lg hover:bg-amber-400 transition-all"
                      >
                        {isSubmitting ? "Publicando..." : needNamePrompt ? "Inscribirme y Publicar Post →" : "Publicar mi Post →"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <span className="font-inter text-xs uppercase tracking-widest text-emerald-400 font-bold block">
                    ✦ Post Inmortalizado ✦
                  </span>
                  <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                    ¡Tu publicación está en la Memoria Colectiva!
                  </h3>
                  <p className="font-inter text-arena text-xs opacity-90 leading-relaxed">
                    Hemos registrado tu membresía en la tribu y grabado tu post de LinkedIn en la galería viva.
                  </p>
                  <button
                    onClick={() => setShareLinkedInModalOpen(false)}
                    className="font-inter font-bold text-xs bg-emerald-500 text-azul-noche px-6 py-2.5 rounded-xl"
                  >
                    Ver en la Galería
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
