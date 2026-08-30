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
  verifyAdminPassword,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/adminAuth";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState<"external" | "internal" | "gallery" | "attendees">("external");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Filter state for Attendee list
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>("all");

  // Form State: External Route
  const [externalForm, setExternalForm] = useState({
    title: "",
    organizer_name: "",
    description: "",
    image_url: "/jpg/moment3.jpg",
    external_link: "",
    date_display: "",
    time_display: "09:00 AM — 06:00 PM",
    location: "CDMX / Presencial",
  });

  // Form State: Internal Event (Tequio Talk)
  const [internalForm, setInternalForm] = useState({
    title: "",
    type_badge: "🎙️ TEQUIO TALKS #02",
    guardian: "tochtli",
    guardian_tag: "✦ FAENA ACTIVA · 🐰 TOCHTLI (Mentoría)",
    type_category: "tequio_talks",
    date_picker: "",
    time_display: "07:00 PM — 08:30 PM (CDMX)",
    location: "Google Meet / YouTube Live",
    meeting_link: "https://meet.google.com/abc-defg-hij",
    speaker: "",
    speaker_social: "",
    image_url: "/jpg/moment2.jpg",
    dynamic_desc: "Q&A Abierto con el Ponente",
    access_info: "Acceso libre · Registro previo",
    description: "",
    capacity_limit: 60,
    is_featured: false,
  });

  // Form State: Gallery / Memoria Colectiva LinkedIn Post Embed
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    event_date: "28 de Agosto, 2026",
    guardian_tag: "🦝 Tlacu · Forja Comunitaria",
    seal_stamp: "✦ SELLO DE MAYORDOMÍA ✦",
    linkedin_post_url: "https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/",
    description: "",
    metric_1: "📊 +1,200 Impresiones en LinkedIn",
    metric_2: "🚀 42 Desarrolladores sumados",
  });

  // Real-time Lists loaded from Supabase
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [registrationsList, setRegistrationsList] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);

  // Check authentication on mount
  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;

    setIsVerifying(true);
    setAuthError(false);

    try {
      const isValid = await verifyAdminPassword(passwordInput);
      if (isValid) {
        setAdminSession(true);
        setAuthenticated(true);
        setPasswordInput("");
        loadAdminData();
      } else {
        setAuthError(true);
      }
    } catch (err) {
      setAuthError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setAdminSession(false);
    setAuthenticated(false);
  };

  const loadAdminData = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");

      // Load External Routes
      const { data: routes } = await supabase
        .from("external_routes")
        .select("*")
        .order("created_at", { ascending: false });
      if (routes) setRoutesList(routes);

      // Load Internal Events
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (events) setEventsList(events);

      // Load Gallery
      const { data: gallery } = await supabase
        .from("completed_works_gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (gallery) setGalleryList(gallery);

      // Load Event Registrations
      const { data: reg } = await supabase
        .from("event_registrations")
        .select("*, events(title, id)")
        .order("created_at", { ascending: false });
      if (reg) setRegistrationsList(reg);

      // Load Community Members
      const { data: mem } = await supabase
        .from("community_members")
        .select("*")
        .order("created_at", { ascending: false });
      if (mem) setMembersList(mem);
    } catch (err) {
      console.warn("Error cargando datos de Supabase:", err);
    }
  };

  // Submit External Route
  const handleExternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalForm.title || !externalForm.external_link) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from("external_routes").insert([
        {
          title: externalForm.title,
          organizer_name: externalForm.organizer_name || "Comunidad Tech Externo",
          description: externalForm.description,
          image_url: externalForm.image_url || "/jpg/moment3.jpg",
          external_link: externalForm.external_link,
          date_display: externalForm.date_display || "Próximamente",
          time_display: externalForm.time_display,
          location: externalForm.location,
        },
      ]);

      if (error) {
        setStatusMessage(`❌ Error: ${error.message}`);
      } else {
        setStatusMessage("✅ ¡Ruta / Evento Externo publicado con éxito!");
        setExternalForm({
          title: "",
          organizer_name: "",
          description: "",
          image_url: "/jpg/moment3.jpg",
          external_link: "",
          date_display: "",
          time_display: "09:00 AM — 06:00 PM",
          location: "CDMX / Presencial",
        });
        loadAdminData();
      }
    } catch (err: any) {
      setStatusMessage(`❌ Error de conexión: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Internal Event
  const handleInternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalForm.title) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const { supabase } = await import("@/lib/supabase");

      const slug = internalForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Date.now();

      const { error } = await supabase.from("events").insert([
        {
          slug,
          title: internalForm.title,
          type_badge: internalForm.type_badge,
          guardian: internalForm.guardian,
          guardian_tag: internalForm.guardian_tag,
          type_category: internalForm.type_category,
          date_display: internalForm.date_picker ? new Date(internalForm.date_picker).toLocaleDateString() : "Próximamente",
          start_at: internalForm.date_picker ? new Date(internalForm.date_picker).toISOString() : new Date().toISOString(),
          time_display: internalForm.time_display,
          location: internalForm.location,
          meeting_link: internalForm.meeting_link || "https://meet.google.com",
          speaker: internalForm.speaker || null,
          speaker_social: internalForm.speaker_social || null,
          image_url: internalForm.image_url || "/jpg/moment2.jpg",
          dynamic_desc: internalForm.dynamic_desc,
          access_info: internalForm.access_info,
          description: internalForm.description || internalForm.title,
          capacity_limit: internalForm.capacity_limit,
          is_featured: internalForm.is_featured,
          registered_count: 0,
        },
      ]);

      if (error) {
        setStatusMessage(`❌ Error: ${error.message}`);
      } else {
        setStatusMessage("✅ ¡Tequio Talk / Evento publicado con éxito!");
        loadAdminData();
      }
    } catch (err: any) {
      setStatusMessage(`❌ Error de conexión: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Gallery Post (LinkedIn Embed)
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.linkedin_post_url) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const { supabase } = await import("@/lib/supabase");

      const metrics = [galleryForm.metric_1, galleryForm.metric_2].filter(Boolean);

      const { error } = await supabase.from("completed_works_gallery").insert([
        {
          title: galleryForm.title,
          event_date: galleryForm.event_date || "Fecha de Faena",
          guardian_tag: galleryForm.guardian_tag,
          seal_stamp: galleryForm.seal_stamp || "✦ SELLO DE MAYORDOMÍA ✦",
          linkedin_post_url: galleryForm.linkedin_post_url,
          image_url: "/jpg/moment1.jpg",
          description: galleryForm.description || galleryForm.title,
          impact_metrics: metrics,
        },
      ]);

      if (error) {
        setStatusMessage(`❌ Error: ${error.message}`);
      } else {
        setStatusMessage("✅ ¡Publicación de LinkedIn registrada en Memoria Colectiva!");
        setGalleryForm({
          title: "",
          event_date: "28 de Agosto, 2026",
          guardian_tag: "🦝 Tlacu · Forja Comunitaria",
          seal_stamp: "✦ SELLO DE MAYORDOMÍA ✦",
          linkedin_post_url: "https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/",
          description: "",
          metric_1: "📊 +1,200 Impresiones en LinkedIn",
          metric_2: "🚀 42 Desarrolladores sumados",
        });
        loadAdminData();
      }
    } catch (err: any) {
      setStatusMessage(`❌ Error de conexión: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRegistrations = registrationsList.filter((reg) => {
    return selectedEventFilter === "all" || reg.event_id === selectedEventFilter;
  });

  const handleCopyEmails = () => {
    const emails = filteredRegistrations.map((r) => r.email).filter(Boolean).join(", ");
    if (emails) {
      navigator.clipboard.writeText(emails);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-azul-noche text-blanco-lunar relative overflow-hidden">
      <BrasaCursor />
      <Navbar />

      {!authenticated ? (
        <section className="relative pt-36 pb-24 px-6 flex items-center justify-center min-h-[80vh]">
          <StarField count={30} isMitlaShape={true} />
          <BrasaParticles count={30} className="opacity-60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 md:p-12 rounded-3xl border-2 border-amber-500/50 bg-white/[0.04] backdrop-blur-2xl max-w-md w-full text-center space-y-6 shadow-2xl relative z-10"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
                🔒
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-inter text-xs uppercase tracking-[0.25em] text-amber-400 font-bold block">
                ✦ Acceso Protegido ✦
              </span>
              <h1 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                Centro de Mando Tequio
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Ingresa la contraseña..."
                  className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-5 py-3 rounded-xl focus:outline-none focus:border-amber-400 text-center tracking-widest text-lg"
                />
              </div>

              {authError && (
                <p className="font-inter text-xs text-red-400 font-bold animate-shake">
                  ❌ Clave incorrecta.
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full cursor-pointer font-inter font-bold text-sm bg-amber-500 text-azul-noche py-3.5 rounded-xl shadow-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-azul-noche border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Desbloquear 🔑</span>
                )}
              </button>
            </form>
          </motion.div>
        </section>
      ) : (
        <>
          {/* Header Admin Banner */}
          <section className="relative pt-36 pb-12 px-6 text-center">
            <StarField count={25} isMitlaShape={true} />
            <BrasaParticles count={25} className="opacity-60" />

            <div className="container mx-auto max-w-4xl relative z-10 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-inter text-ambar text-xs uppercase tracking-[0.25em] font-semibold">
                  ✦ Centro de Mando Tequio ✦
                </span>

                <button
                  onClick={handleLogout}
                  className="cursor-pointer font-inter text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full transition-all"
                >
                  🔒 Cerrar Sesión Admin
                </button>
              </div>

              <h1 className="font-cinzel text-blanco-lunar text-4xl md:text-5xl font-bold tracking-wide">
                Administrador de Faenas & Caravanas
              </h1>

              {/* Selector de Pestañas (4 Pestañas) */}
              <div className="pt-6 flex justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab("external")}
                  className={`cursor-pointer font-inter text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                    activeTab === "external"
                      ? "bg-amber-500 text-azul-noche shadow-[0_0_15px_#F5A623] scale-105"
                      : "bg-white/5 text-arena/80 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  🪶 Rutas Externas ({routesList.length})
                </button>

                <button
                  onClick={() => setActiveTab("internal")}
                  className={`cursor-pointer font-inter text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                    activeTab === "internal"
                      ? "bg-amber-500 text-azul-noche shadow-[0_0_15px_#F5A623] scale-105"
                      : "bg-white/5 text-arena/80 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  🎙️ Tequio Talks ({eventsList.length})
                </button>

                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`cursor-pointer font-inter text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                    activeTab === "gallery"
                      ? "bg-amber-500 text-azul-noche shadow-[0_0_15px_#F5A623] scale-105"
                      : "bg-white/5 text-arena/80 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  🖼️ Memoria LinkedIn ({galleryList.length})
                </button>

                <button
                  onClick={() => setActiveTab("attendees")}
                  className={`cursor-pointer font-inter text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                    activeTab === "attendees"
                      ? "bg-amber-500 text-azul-noche shadow-[0_0_15px_#F5A623] scale-105"
                      : "bg-white/5 text-arena/80 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  📋 Asistentes & Miembros ({registrationsList.length})
                </button>
              </div>
            </div>
          </section>

          {statusMessage && (
            <div className="px-6 mb-6">
              <div className="container mx-auto max-w-4xl p-4 rounded-2xl bg-white/10 border border-ambar/40 text-center font-inter text-sm font-bold text-blanco-lunar">
                {statusMessage}
              </div>
            </div>
          )}

          <section className="pb-24 px-6">
            <div className="container mx-auto max-w-5xl relative z-10">

              <AnimatePresence mode="wait">
                {/* PESTAÑA 1: RUTAS EXTERNAS */}
                {activeTab === "external" && (
                  <motion.div key="tab-external" className="space-y-12">
                    <div className="p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                      <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                        Nueva Ruta / Caravana a Evento Externo
                      </h3>

                      <form onSubmit={handleExternalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">Título del Evento Externo *</label>
                          <input type="text" required value={externalForm.title} onChange={(e) => setExternalForm({ ...externalForm, title: e.target.value })} placeholder="Ej. DevFest CDMX 2026" className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                        </div>
                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">Organizador *</label>
                          <input type="text" required value={externalForm.organizer_name} onChange={(e) => setExternalForm({ ...externalForm, organizer_name: e.target.value })} placeholder="Ej. GDG CDMX" className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                        </div>
                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">Enlace Oficial de Registro *</label>
                          <input type="url" required value={externalForm.external_link} onChange={(e) => setExternalForm({ ...externalForm, external_link: e.target.value })} placeholder="https://devfest.com" className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                        </div>
                        <div className="md:col-span-2 text-right">
                          <button type="submit" disabled={isSubmitting} className="font-inter font-bold text-sm bg-amber-500 text-azul-noche px-8 py-3.5 rounded-xl">Publicar Ruta Externa →</button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* PESTAÑA 2: TEQUIO TALKS */}
                {activeTab === "internal" && (
                  <motion.div key="tab-internal" className="space-y-12">
                    <div className="p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                      <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">Nuevo Tequio Talk con Liga de Transmisión</h3>
                      <form onSubmit={handleInternalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">Título del Talk *</label>
                          <input type="text" required value={internalForm.title} onChange={(e) => setInternalForm({ ...internalForm, title: e.target.value })} placeholder='Ej. "Arquitectura Frontend"' className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                        </div>
                        <div>
                          <label className="block font-inter text-xs text-amber-400 font-bold mb-1">📅 Seleccionar Fecha y Hora *</label>
                          <input type="datetime-local" required value={internalForm.date_picker} onChange={(e) => setInternalForm({ ...internalForm, date_picker: e.target.value })} className="w-full font-inter bg-white/10 border border-amber-400/50 text-blanco-lunar px-4 py-2.5 rounded-xl cursor-pointer" />
                        </div>
                        <div>
                          <label className="block font-inter text-xs text-amber-400 font-bold mb-1">🔗 Enlace de Transmisión (Meet / Zoom) *</label>
                          <input type="url" required value={internalForm.meeting_link} onChange={(e) => setInternalForm({ ...internalForm, meeting_link: e.target.value })} placeholder="https://meet.google.com/abc-defg-hij" className="w-full font-inter bg-white/10 border border-amber-400/50 text-blanco-lunar px-4 py-2.5 rounded-xl" />
                        </div>
                        <div className="md:col-span-2 text-right">
                          <button type="submit" disabled={isSubmitting} className="font-inter font-bold text-sm bg-amber-500 text-azul-noche px-8 py-3.5 rounded-xl">Publicar Tequio Talk →</button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* PESTAÑA 3: NUEVA MEMORIA LINKEDIN CON SELLO CEREMONIAL */}
                {activeTab === "gallery" && (
                  <motion.div key="tab-gallery" className="space-y-12">
                    <div className="p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                      <div className="space-y-1">
                        <span className="font-inter text-xs uppercase tracking-widest text-amber-400 font-bold">
                          🖼️ Memoria Colectiva (Post de LinkedIn con Sello)
                        </span>
                        <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                          Registrar Post de LinkedIn en la Galería Viva
                        </h3>
                      </div>

                      <form onSubmit={handleGallerySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Título de la Obra Colectiva *
                          </label>
                          <input
                            type="text"
                            required
                            value={galleryForm.title}
                            onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                            placeholder="Ej. Impulso a la Comunidad — Faena Tequio en LinkedIn"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-amber-400 font-bold mb-1">
                            🔗 URL del Post de LinkedIn * (ej. https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/)
                          </label>
                          <input
                            type="url"
                            required
                            value={galleryForm.linkedin_post_url}
                            onChange={(e) => setGalleryForm({ ...galleryForm, linkedin_post_url: e.target.value })}
                            placeholder="https://www.linkedin.com/feed/update/urn:li:activity:..."
                            className="w-full font-inter bg-white/10 border border-amber-400/50 text-blanco-lunar px-4 py-2.5 rounded-xl font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            🏷️ Sello Ceremonial sobre el IFrame *
                          </label>
                          <input
                            type="text"
                            required
                            value={galleryForm.seal_stamp}
                            onChange={(e) => setGalleryForm({ ...galleryForm, seal_stamp: e.target.value })}
                            placeholder="✦ SELLO DE MAYORDOMÍA CUMPLIDA ✦"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl font-bold text-amber-300"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Guardián / Tag de Faena
                          </label>
                          <input
                            type="text"
                            value={galleryForm.guardian_tag}
                            onChange={(e) => setGalleryForm({ ...galleryForm, guardian_tag: e.target.value })}
                            placeholder="🦝 Tlacu · Forja Comunitaria"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Descripción de la Obra o Logro
                          </label>
                          <textarea
                            rows={3}
                            value={galleryForm.description}
                            onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                            placeholder="Publicación oficial sobre el impacto y los logros alcanzados..."
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-2 text-right">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="font-inter font-bold text-sm bg-amber-500 text-azul-noche px-8 py-3.5 rounded-xl shadow-xl hover:bg-amber-400 transition-all"
                          >
                            🖼️ Publicar Post en Memoria Colectiva →
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* PESTAÑA 4: ASISTENTES */}
                {activeTab === "attendees" && (
                  <motion.div key="tab-attendees" className="space-y-10">
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
                      <h3 className="font-cinzel text-blanco-lunar text-xl font-bold">📋 Inscritos ({filteredRegistrations.length})</h3>
                      <button onClick={handleCopyEmails} className="font-inter font-bold text-xs bg-amber-500 text-azul-noche px-4 py-2.5 rounded-xl">
                        {copiedSuccess ? "✓ Copiados!" : "📋 Copiar Lista de Correos"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </section>
        </>
      )}

      <FooterSection />
    </main>
  );
}
