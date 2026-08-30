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

  const [activeTab, setActiveTab] = useState<"external" | "internal" | "attendees">("external");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    date_display: "",
    time_display: "07:00 PM — 08:30 PM (CDMX)",
    location: "Google Meet / YouTube Live",
    speaker: "",
    speaker_social: "",
    image_url: "/jpg/moment2.jpg",
    dynamic_desc: "Q&A Abierto con el Ponente",
    access_info: "Acceso libre · Registro previo",
    description: "",
    capacity_limit: 60,
    is_featured: false,
  });

  // Real-time Lists loaded from Supabase
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
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

      // Load Event Registrations
      const { data: reg } = await supabase
        .from("event_registrations")
        .select("*, events(title)")
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
          date_display: internalForm.date_display || "Próximamente",
          start_at: new Date().toISOString(),
          time_display: internalForm.time_display,
          location: internalForm.location,
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
        setInternalForm({
          title: "",
          type_badge: "🎙️ TEQUIO TALKS #02",
          guardian: "tochtli",
          guardian_tag: "✦ FAENA ACTIVA · 🐰 TOCHTLI (Mentoría)",
          type_category: "tequio_talks",
          date_display: "",
          time_display: "07:00 PM — 08:30 PM (CDMX)",
          location: "Google Meet / YouTube Live",
          speaker: "",
          speaker_social: "",
          image_url: "/jpg/moment2.jpg",
          dynamic_desc: "Q&A Abierto con el Ponente",
          access_info: "Acceso libre · Registro previo",
          description: "",
          capacity_limit: 60,
          is_featured: false,
        });
        loadAdminData();
      }
    } catch (err: any) {
      setStatusMessage(`❌ Error de conexión: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-azul-noche text-blanco-lunar relative overflow-hidden">
      <BrasaCursor />
      <Navbar />

      {/* RENDER LOCK SCREEN IF NOT AUTHENTICATED */}
      {!authenticated ? (
        <section className="relative pt-36 pb-24 px-6 flex items-center justify-center min-h-[80vh]">
          <StarField count={30} isMitlaShape={true} />
          <BrasaParticles count={30} className="opacity-60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 md:p-12 rounded-3xl border-2 border-amber-500/50 bg-white/[0.04] backdrop-blur-2xl max-w-md w-full text-center space-y-6 shadow-2xl relative z-10"
            style={{ boxShadow: "0 20px 60px rgba(245, 166, 35, 0.2)" }}
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
              <p className="font-inter text-arena text-xs opacity-80">
                Ingresa la clave de administración para acceder al panel de control.
              </p>
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
                  ❌ Clave incorrecta. Verifica tu contraseña.
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
                  <>
                    <span>Desbloquear Centro de Mando</span>
                    <span>🔑</span>
                  </>
                )}
              </button>
            </form>

            <p className="font-inter text-[11px] text-arena/50 italic">
              ✦ Verificación encriptada mediante SHA-256
            </p>
          </motion.div>
        </section>
      ) : (
        /* DASHBOARD COMPLETO CUANDO ESTÁ AUTENTICADO */
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
              <p className="font-inter text-arena text-base max-w-2xl mx-auto opacity-85">
                Publica rutas a eventos de comunidades externas, programa Tequio Talks y consulta la lista de la tribu en tiempo real.
              </p>

              {/* Selector de Pestañas */}
              <div className="pt-6 flex justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab("external")}
                  className={`cursor-pointer font-inter text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                    activeTab === "external"
                      ? "bg-amber-500 text-azul-noche shadow-[0_0_15px_#F5A623] scale-105"
                      : "bg-white/5 text-arena/80 hover:bg-white/10 hover:text-blanco-lunar border border-white/10"
                  }`}
                >
                  🪶 Rutas & Eventos Externos ({routesList.length})
                </button>

                <button
                  onClick={() => setActiveTab("internal")}
                  className={`cursor-pointer font-inter text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                    activeTab === "internal"
                      ? "bg-amber-500 text-azul-noche shadow-[0_0_15px_#F5A623] scale-105"
                      : "bg-white/5 text-arena/80 hover:bg-white/10 hover:text-blanco-lunar border border-white/10"
                  }`}
                >
                  🎙️ Tequio Talks & Eventos ({eventsList.length})
                </button>

                <button
                  onClick={() => setActiveTab("attendees")}
                  className={`cursor-pointer font-inter text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                    activeTab === "attendees"
                      ? "bg-amber-500 text-azul-noche shadow-[0_0_15px_#F5A623] scale-105"
                      : "bg-white/5 text-arena/80 hover:bg-white/10 hover:text-blanco-lunar border border-white/10"
                  }`}
                >
                  📋 Asistentes & Miembros ({registrationsList.length})
                </button>
              </div>
            </div>
          </section>

          {/* STATUS NOTIFICATION */}
          {statusMessage && (
            <div className="px-6 mb-6">
              <div className="container mx-auto max-w-4xl p-4 rounded-2xl bg-white/10 border border-ambar/40 text-center font-inter text-sm font-bold text-blanco-lunar">
                {statusMessage}
              </div>
            </div>
          )}

          {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
          <section className="pb-24 px-6">
            <div className="container mx-auto max-w-5xl relative z-10">

              <AnimatePresence mode="wait">
                {/* PESTAÑA 1: EVENTOS EXTERNOS / CARAVANAS */}
                {activeTab === "external" && (
                  <motion.div
                    key="tab-external"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-12"
                  >
                    {/* Formulario Nueva Ruta Externa */}
                    <div className="p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                      <div className="space-y-1">
                        <span className="font-inter text-xs uppercase tracking-widest text-amber-400 font-bold">
                          🪶 Publicar Evento de Comunidad Externa
                        </span>
                        <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                          Nueva Ruta / Caravana del Vuelo
                        </h3>
                        <p className="font-inter text-arena text-xs opacity-80">
                          Agrega el evento externo al que asistiremos en grupo. Los usuarios podrán dar clic a su enlace de registro oficial y dejar su correo para coordinarnos.
                        </p>
                      </div>

                      <form onSubmit={handleExternalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Título del Evento Externo *
                          </label>
                          <input
                            type="text"
                            required
                            value={externalForm.title}
                            onChange={(e) => setExternalForm({ ...externalForm, title: e.target.value })}
                            placeholder="Ej. DevFest CDMX 2026 / Hackathon HackMX"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Organizador / Comunidad *
                          </label>
                          <input
                            type="text"
                            required
                            value={externalForm.organizer_name}
                            onChange={(e) => setExternalForm({ ...externalForm, organizer_name: e.target.value })}
                            placeholder="Ej. Google Developer Group CDMX"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Enlace Oficial de Registro Externo *
                          </label>
                          <input
                            type="url"
                            required
                            value={externalForm.external_link}
                            onChange={(e) => setExternalForm({ ...externalForm, external_link: e.target.value })}
                            placeholder="https://eventos.com/registro-oficial"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Fecha Programada
                          </label>
                          <input
                            type="text"
                            value={externalForm.date_display}
                            onChange={(e) => setExternalForm({ ...externalForm, date_display: e.target.value })}
                            placeholder="Ej. Sábado 24 de Octubre, 2026"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Lugar / Sede
                          </label>
                          <input
                            type="text"
                            value={externalForm.location}
                            onChange={(e) => setExternalForm({ ...externalForm, location: e.target.value })}
                            placeholder="Ej. World Trade Center CDMX"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            URL de la Imagen / Poster (/jpg/moment3.jpg o Enlace HTTP)
                          </label>
                          <input
                            type="text"
                            value={externalForm.image_url}
                            onChange={(e) => setExternalForm({ ...externalForm, image_url: e.target.value })}
                            placeholder="/jpg/moment3.jpg"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Descripción de la Caravana / Plan de Viaje en Grupo
                          </label>
                          <textarea
                            rows={3}
                            value={externalForm.description}
                            onChange={(e) => setExternalForm({ ...externalForm, description: e.target.value })}
                            placeholder="Explicación de cómo asistiremos juntos, punto de reunión o grupo de comunicación..."
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="md:col-span-2 text-right">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="cursor-pointer font-inter font-bold text-sm bg-amber-500 text-azul-noche px-8 py-3.5 rounded-xl shadow-xl hover:bg-amber-400 transition-all hover:scale-105"
                          >
                            {isSubmitting ? "Publicando en Supabase..." : "🚀 Publicar Ruta Externa"}
                          </button>
                        </div>

                      </form>
                    </div>

                    {/* Lista de Rutas Publicadas */}
                    <div className="space-y-4">
                      <h3 className="font-cinzel text-blanco-lunar text-xl font-bold">
                        🪶 Rutas Externas Publicadas ({routesList.length})
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routesList.map((route) => (
                          <div
                            key={route.id}
                            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative overflow-hidden"
                          >
                            <span className="font-inter text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {route.organizer_name}
                            </span>

                            <h4 className="font-cinzel text-blanco-lunar text-lg font-bold">
                              {route.title}
                            </h4>

                            <p className="font-inter text-arena text-xs opacity-85 line-clamp-2">
                              {route.description}
                            </p>

                            <div className="space-y-1 font-inter text-xs text-arena/70 pt-2 border-t border-white/10">
                              <p>📅 <strong>Fecha:</strong> {route.date_display}</p>
                              <p>📍 <strong>Lugar:</strong> {route.location}</p>
                              <p>👥 <strong>Semanas sumadas:</strong> {route.interested_count} personas</p>
                            </div>

                            <div className="pt-2">
                              <a
                                href={route.external_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-inter text-xs font-bold text-amber-400 hover:underline"
                              >
                                Ir a Registro Oficial ↗
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PESTAÑA 2: TEQUIO TALKS & EVENTOS INTERNOS */}
                {activeTab === "internal" && (
                  <motion.div
                    key="tab-internal"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-12"
                  >
                    {/* Formulario Nuevo Tequio Talk */}
                    <div className="p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                      <div className="space-y-1">
                        <span className="font-inter text-xs uppercase tracking-widest text-amber-400 font-bold">
                          🎙️ Publicar Evento Interno / Tequio Talk
                        </span>
                        <h3 className="font-cinzel text-blanco-lunar text-2xl font-bold">
                          Nuevo Tequio Talk o Workshop
                        </h3>
                      </div>

                      <form onSubmit={handleInternalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        <div className="md:col-span-2">
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Título del Talk / Sesión *
                          </label>
                          <input
                            type="text"
                            required
                            value={internalForm.title}
                            onChange={(e) => setInternalForm({ ...internalForm, title: e.target.value })}
                            placeholder='Ej. "Arquitectura Microservicios en la Práctica"'
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Guardián Anfitrión
                          </label>
                          <select
                            value={internalForm.guardian}
                            onChange={(e) => {
                              const g = e.target.value;
                              setInternalForm({
                                ...internalForm,
                                guardian: g,
                                guardian_tag: g === "tochtli" ? "✦ FAENA ACTIVA · 🐰 TOCHTLI (Mentoría)" : g === "tlacu" ? "✦ FAENA ACTIVA · 🦝 TLACU (Construcción)" : "✦ FAENA ACTIVA · 🪶 KUKU (Caravanas)",
                              });
                            }}
                            className="w-full font-inter bg-azul-noche border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          >
                            <option value="tochtli">🐰 Tochtli (Mentoría & Inspiración)</option>
                            <option value="tlacu">🦝 Tlacu (Construcción & Hackathons)</option>
                            <option value="kuku">🪶 Kuku (Caravanas & Conexión)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Insignia / Badge
                          </label>
                          <input
                            type="text"
                            value={internalForm.type_badge}
                            onChange={(e) => setInternalForm({ ...internalForm, type_badge: e.target.value })}
                            placeholder="Ej. 🎙️ TEQUIO TALKS #02"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Nombre del Ponente Invitado
                          </label>
                          <input
                            type="text"
                            value={internalForm.speaker}
                            onChange={(e) => setInternalForm({ ...internalForm, speaker: e.target.value })}
                            placeholder="Ej. Ing. Sofía Morales (Staff Engineer)"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            LinkedIn / Red Social del Ponente
                          </label>
                          <input
                            type="url"
                            value={internalForm.speaker_social}
                            onChange={(e) => setInternalForm({ ...internalForm, speaker_social: e.target.value })}
                            placeholder="https://linkedin.com/in/nombre-ponente"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Fecha Programada
                          </label>
                          <input
                            type="text"
                            value={internalForm.date_display}
                            onChange={(e) => setInternalForm({ ...internalForm, date_display: e.target.value })}
                            placeholder="Ej. Jueves 15 de Octubre, 2026"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block font-inter text-xs text-arena/80 font-semibold mb-1">
                            Transmisión / Sede
                          </label>
                          <input
                            type="text"
                            value={internalForm.location}
                            onChange={(e) => setInternalForm({ ...internalForm, location: e.target.value })}
                            placeholder="Ej. Google Meet / YouTube Live"
                            className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                          <input
                            type="checkbox"
                            id="is_featured"
                            checked={internalForm.is_featured}
                            onChange={(e) => setInternalForm({ ...internalForm, is_featured: e.target.checked })}
                            className="w-5 h-5 accent-amber-500 cursor-pointer"
                          />
                          <label htmlFor="is_featured" className="font-inter text-xs text-arena cursor-pointer font-bold">
                            🔥 Marcar como Faena Activa Destacada (Aparecerá en la tarjeta principal con reloj regresivo)
                          </label>
                        </div>

                        <div className="md:col-span-2 text-right">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="cursor-pointer font-inter font-bold text-sm bg-amber-500 text-azul-noche px-8 py-3.5 rounded-xl shadow-xl hover:bg-amber-400 transition-all hover:scale-105"
                          >
                            {isSubmitting ? "Publicando..." : "🎙️ Publicar Tequio Talk"}
                          </button>
                        </div>

                      </form>
                    </div>
                  </motion.div>
                )}

                {/* PESTAÑA 3: ASISTENTES & INTEGRANTES DE LA TRIBU */}
                {activeTab === "attendees" && (
                  <motion.div
                    key="tab-attendees"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-10"
                  >
                    <div className="space-y-4">
                      <h3 className="font-cinzel text-blanco-lunar text-xl font-bold">
                        📋 Reservaciones a Faenas en Tiempo Real ({registrationsList.length})
                      </h3>

                      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                        <table className="w-full text-left font-inter text-xs border-collapse">
                          <thead>
                            <tr className="bg-white/5 text-amber-400 uppercase tracking-wider font-semibold border-b border-white/10">
                              <th className="p-4">Nombre</th>
                              <th className="p-4">Correo</th>
                              <th className="p-4">Rol / Modalidad</th>
                              <th className="p-4">Pregunta para Ponente</th>
                              <th className="p-4">Fecha Registro</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-arena/90">
                            {registrationsList.map((row) => (
                              <tr key={row.id} className="hover:bg-white/5">
                                <td className="p-4 font-bold text-blanco-lunar">{row.full_name}</td>
                                <td className="p-4 text-amber-300">{row.email}</td>
                                <td className="p-4">{row.role_type || "Estudiante"}</td>
                                <td className="p-4 italic opacity-80">{row.speaker_question || "Sin pregunta"}</td>
                                <td className="p-4 opacity-60">{new Date(row.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <h3 className="font-cinzel text-blanco-lunar text-xl font-bold">
                        🏛️ Códice de la Tribu / Integrantes ({membersList.length})
                      </h3>

                      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                        <table className="w-full text-left font-inter text-xs border-collapse">
                          <thead>
                            <tr className="bg-white/5 text-terracota uppercase tracking-wider font-semibold border-b border-white/10">
                              <th className="p-4">Nombre Completo</th>
                              <th className="p-4">Correo Electrónico</th>
                              <th className="p-4">Interés / Rol</th>
                              <th className="p-4">Fecha de Alta</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-arena/90">
                            {membersList.map((row) => (
                              <tr key={row.id} className="hover:bg-white/5">
                                <td className="p-4 font-bold text-blanco-lunar">{row.full_name}</td>
                                <td className="p-4 text-amber-300">{row.email}</td>
                                <td className="p-4">{row.role_interest}</td>
                                <td className="p-4 opacity-60">{new Date(row.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
