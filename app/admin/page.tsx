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

  const [activeTab, setActiveTab] = useState<"events" | "gallery">("events");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State: Event with Luma, Speaker, and Status (activa / pasada)
  const [eventForm, setEventForm] = useState({
    title: "",
    event_date: "",
    time_display: "07:00 PM — 08:30 PM (CDMX)",
    is_online: true,
    location: "Google Meet",
    luma_url: "",
    speaker_name: "",
    speaker_linkedin: "",
    guardian: "tochtli",
    status: "activa" as "activa" | "pasada",
  });

  // Real-time Lists loaded from Supabase
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);

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
    } catch {
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

      // Load Events
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (events) setEventsList(events);

      // Load Gallery (Memoria Viva)
      const { data: gallery } = await supabase
        .from("completed_works_gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (gallery) setGalleryList(gallery);
    } catch (err) {
      console.warn("Error cargando datos de Supabase:", err);
    }
  };

  // Submit Event Form
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.event_date || !eventForm.luma_url) {
      setStatusMessage("❌ Por favor completa el título, fecha y el enlace de registro de Luma.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const { supabase } = await import("@/lib/supabase");

      // Si se crea como activa, actualizar las anteriores a pasadas para que la nueva sea la activa principal
      if (eventForm.status === "activa") {
        await supabase.from("events").update({ status: "pasada" }).eq("status", "activa");
      }

      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            title: eventForm.title.trim(),
            event_date: eventForm.event_date.trim(),
            time_display: eventForm.time_display.trim(),
            is_online: eventForm.is_online,
            location: eventForm.is_online && !eventForm.location ? "Google Meet" : eventForm.location.trim(),
            luma_url: eventForm.luma_url.trim(),
            speaker_name: eventForm.speaker_name.trim() || null,
            speaker_linkedin: eventForm.speaker_linkedin.trim() || null,
            guardian: eventForm.guardian,
            status: eventForm.status,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setStatusMessage(
        eventForm.status === "activa"
          ? "✅ ¡Faena Activa publicada con éxito y fijada como la principal!"
          : "✅ ¡Faena Pasada registrada con éxito en el catálogo para Memoria Viva!"
      );

      // Actualizar lista local
      if (eventForm.status === "activa") {
        setEventsList((prev) => [data, ...prev.map((e) => ({ ...e, status: "pasada" }))]);
      } else {
        setEventsList((prev) => [data, ...prev]);
      }

      // Reset Form
      setEventForm({
        title: "",
        event_date: "",
        time_display: "07:00 PM — 08:30 PM (CDMX)",
        is_online: true,
        location: "Google Meet",
        luma_url: "",
        speaker_name: "",
        speaker_linkedin: "",
        guardian: "tochtli",
        status: "activa",
      });
    } catch (err: any) {
      setStatusMessage(`❌ Error al crear evento: ${err?.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an Event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este evento?")) return;
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("events").delete().eq("id", id);
      setEventsList((prev) => prev.filter((e) => e.id !== id));
      setStatusMessage("🗑️ Evento eliminado con éxito.");
    } catch (err: any) {
      setStatusMessage(`❌ Error al eliminar evento: ${err.message}`);
    }
  };

  // Toggle Event Status (Activa vs Pasada)
  const handleToggleEventStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "activa" ? "pasada" : "activa";
    try {
      const { supabase } = await import("@/lib/supabase");

      // Si pasa a activa, poner las otras en pasada
      if (nextStatus === "activa") {
        await supabase.from("events").update({ status: "pasada" }).eq("status", "activa");
      }

      await supabase.from("events").update({ status: nextStatus }).eq("id", id);

      setEventsList((prev) =>
        prev.map((e) => {
          if (e.id === id) return { ...e, status: nextStatus };
          if (nextStatus === "activa" && e.status === "activa") return { ...e, status: "pasada" };
          return e;
        })
      );
      setStatusMessage(`🔄 Estado cambiado a Faena ${nextStatus === "activa" ? "Activa 🔥" : "Pasada 📜"}.`);
    } catch (err: any) {
      setStatusMessage(`❌ Error al actualizar estado: ${err.message}`);
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta publicación de la Memoria Viva?")) return;
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("completed_works_gallery").delete().eq("id", id);
      setGalleryList((prev) => prev.filter((g) => g.id !== id));
      setStatusMessage("🗑️ Publicación eliminada de la Memoria Viva.");
    } catch (err: any) {
      setStatusMessage(`❌ Error al eliminar publicación: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-azul-noche text-blanco-lunar relative overflow-hidden">
      <BrasaCursor />
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-12 px-6">
        <StarField count={25} isMitlaShape={true} />
        <BrasaParticles count={30} className="opacity-60" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold mb-3 block">
            ✦ Mayordomía Tequio ✦
          </span>
          <h1 className="font-cinzel text-blanco-lunar text-3xl md:text-5xl font-bold tracking-wide mb-4">
            Consola de Gestión
          </h1>
          <p className="font-inter text-arena text-sm md:text-base max-w-xl mx-auto opacity-80">
            Administra los eventos de la tribu conectados a Luma y modera la Memoria Viva.
          </p>
        </div>
      </section>

      {/* Main Admin Section */}
      <section className="relative pb-24 px-6">
        <div className="container mx-auto max-w-5xl relative z-10">
          {!authenticated ? (
            /* Authentication Modal / Card */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto rounded-3xl bg-azul-noche/90 border border-terracota/40 p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="text-center space-y-3 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-terracota/20 border border-terracota/40 mx-auto flex items-center justify-center">
                  <Image
                    src="/png/tlacu.png"
                    alt="Mayordomía"
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-blanco-lunar">
                  Acceso de Mayordomía
                </h3>
                <p className="font-inter text-xs text-arena/70">
                  Introduce la clave de acceso para gestionar eventos y publicaciones.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Clave de Mayordomía"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full font-inter bg-white/5 border border-white/20 text-blanco-lunar px-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                {authError && (
                  <p className="font-inter text-xs text-red-400 font-semibold text-center">
                    ❌ Clave incorrecta. Verifica tu acceso con los coordinadores.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="cursor-pointer w-full font-inter font-bold text-blanco-lunar py-3.5 rounded-xl bg-terracota hover:bg-orange-600 transition-all shadow-lg text-sm"
                >
                  {isVerifying ? "Verificando..." : "Ingresar a la Consola →"}
                </button>
              </form>
            </motion.div>
          ) : (
            /* Dashboard Content */
            <div className="space-y-8">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🦝</span>
                  <div>
                    <h3 className="font-inter text-sm font-bold text-blanco-lunar">
                      Panel de Administración
                    </h3>
                    <span className="font-inter text-xs text-emerald-400 flex items-center gap-1">
                      <span>●</span> Conectado con Supabase & Luma
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={loadAdminData}
                    className="cursor-pointer font-inter text-xs text-arena hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-all"
                  >
                    🔄 Recargar Datos
                  </button>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer font-inter text-xs text-red-300 hover:text-red-200 bg-red-500/20 hover:bg-red-500/30 px-3.5 py-2 rounded-xl transition-all border border-red-500/30"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              {statusMessage && (
                <div className="bg-white/10 border border-white/20 text-blanco-lunar px-4 py-3 rounded-2xl text-xs sm:text-sm font-inter flex items-center justify-between">
                  <span>{statusMessage}</span>
                  <button
                    onClick={() => setStatusMessage(null)}
                    className="text-white/60 hover:text-white font-bold ml-4"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="flex gap-3 border-b border-white/10 pb-4">
                <button
                  onClick={() => setActiveTab("events")}
                  className={`cursor-pointer font-inter text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${
                    activeTab === "events"
                      ? "bg-amber-400 text-azul-noche shadow-lg"
                      : "bg-white/5 hover:bg-white/10 text-arena"
                  }`}
                >
                  📅 Gestión de Faenas ({eventsList.length})
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`cursor-pointer font-inter text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${
                    activeTab === "gallery"
                      ? "bg-amber-400 text-azul-noche shadow-lg"
                      : "bg-white/5 hover:bg-white/10 text-arena"
                  }`}
                >
                  🖼️ Memoria Viva ({galleryList.length})
                </button>
              </div>

              {/* TAB 1: GESTIÓN DE EVENTOS LUMA */}
              {activeTab === "events" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Formulario Crear Evento */}
                  <div className="lg:col-span-6 rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-blanco-lunar">
                        Publicar o Registrar Faena
                      </h3>
                      <p className="font-inter text-xs text-arena/70 mt-1">
                        Publica la faena activa en puerta o registra faenas pasadas para que los miembros puedan seleccionarlas en Memoria Viva.
                      </p>
                    </div>

                    <form onSubmit={handleEventSubmit} className="space-y-4">
                      {/* Estado: Faena Activa vs Faena Pasada */}
                      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                        <label className="font-inter text-xs font-bold text-amber-400 block uppercase tracking-wider">
                          Tipo de Registro
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-inter font-bold">
                            <input
                              type="radio"
                              name="eventStatus"
                              checked={eventForm.status === "activa"}
                              onChange={() => setEventForm({ ...eventForm, status: "activa" })}
                              className="accent-amber-400"
                            />
                            <span>🔥 Faena Activa (En Puerta)</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs font-inter font-bold">
                            <input
                              type="radio"
                              name="eventStatus"
                              checked={eventForm.status === "pasada"}
                              onChange={() => setEventForm({ ...eventForm, status: "pasada" })}
                              className="accent-terracota"
                            />
                            <span>📜 Faena Pasada (Para Memoria)</span>
                          </label>
                        </div>
                      </div>

                      {/* Título */}
                      <div>
                        <label className="font-inter text-xs font-bold text-blanco-lunar block mb-1">
                          Título de la Faena / Evento *
                        </label>
                        <input
                          type="text"
                          required
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          placeholder="Ej: De Estudiante a Tech Lead"
                          className="w-full font-inter bg-white/5 border border-white/15 text-blanco-lunar px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Fecha y Hora */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-inter text-xs font-bold text-blanco-lunar block mb-1">
                            Fecha *
                          </label>
                          <input
                            type="text"
                            required
                            value={eventForm.event_date}
                            onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                            placeholder="Ej: Jueves 17 de Septiembre, 2026"
                            className="w-full font-inter bg-white/5 border border-white/15 text-blanco-lunar px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="font-inter text-xs font-bold text-blanco-lunar block mb-1">
                            Horario
                          </label>
                          <input
                            type="text"
                            value={eventForm.time_display}
                            onChange={(e) => setEventForm({ ...eventForm, time_display: e.target.value })}
                            placeholder="07:00 PM — 08:30 PM (CDMX)"
                            className="w-full font-inter bg-white/5 border border-white/15 text-blanco-lunar px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Modalidad */}
                      <div className="space-y-1.5 bg-azul-noche/60 p-4 rounded-xl border border-white/10">
                        <label className="font-inter text-xs font-bold text-blanco-lunar block">
                          Modalidad del Evento
                        </label>
                        <div className="flex items-center gap-4 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-inter">
                            <input
                              type="radio"
                              name="modality"
                              checked={eventForm.is_online === true}
                              onChange={() => setEventForm({ ...eventForm, is_online: true, location: "Google Meet" })}
                              className="accent-amber-400"
                            />
                            <span>🖥️ En línea (Meet / Live)</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs font-inter">
                            <input
                              type="radio"
                              name="modality"
                              checked={eventForm.is_online === false}
                              onChange={() => setEventForm({ ...eventForm, is_online: false, location: "" })}
                              className="accent-terracota"
                            />
                            <span>📍 En persona (Presencial)</span>
                          </label>
                        </div>
                      </div>

                      {/* Ubicación */}
                      <div>
                        <label className="font-inter text-xs font-bold text-blanco-lunar block mb-1">
                          Lugar / Plataforma *
                        </label>
                        <input
                          type="text"
                          required
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          placeholder={eventForm.is_online ? "Google Meet / YouTube Live" : "Ej: Centro Comunitario La Esperanza, CDMX"}
                          className="w-full font-inter bg-white/5 border border-white/15 text-blanco-lunar px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Link de Luma */}
                      <div>
                        <label className="font-inter text-xs font-bold text-amber-400 block mb-1">
                          Enlace del Evento en Luma *
                        </label>
                        <input
                          type="url"
                          required
                          value={eventForm.luma_url}
                          onChange={(e) => setEventForm({ ...eventForm, luma_url: e.target.value })}
                          placeholder="https://luma.com/event/evt-C1nAPcQ4ME9mTeL o https://lu.ma/..."
                          className="w-full font-inter bg-white/5 border border-amber-400/50 text-blanco-lunar px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-300 text-xs sm:text-sm font-mono"
                        />
                      </div>

                      {/* Ponente / Invitado: Nombre y LinkedIn */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                        <div>
                          <label className="font-inter text-xs font-bold text-blanco-lunar block mb-1">
                            Nombre del Ponente / Invitado
                          </label>
                          <input
                            type="text"
                            value={eventForm.speaker_name}
                            onChange={(e) => setEventForm({ ...eventForm, speaker_name: e.target.value })}
                            placeholder="Ej: David Reyes"
                            className="w-full font-inter bg-white/5 border border-white/15 text-blanco-lunar px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="font-inter text-xs font-bold text-blanco-lunar block mb-1">
                            LinkedIn del Ponente
                          </label>
                          <input
                            type="url"
                            value={eventForm.speaker_linkedin}
                            onChange={(e) => setEventForm({ ...eventForm, speaker_linkedin: e.target.value })}
                            placeholder="https://www.linkedin.com/in/..."
                            className="w-full font-inter bg-white/5 border border-white/15 text-blanco-lunar px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Guardián */}
                      <div>
                        <label className="font-inter text-xs font-bold text-blanco-lunar block mb-1">
                          Guardián Tequio
                        </label>
                        <select
                          value={eventForm.guardian}
                          onChange={(e) => setEventForm({ ...eventForm, guardian: e.target.value })}
                          className="w-full font-inter bg-azul-noche border border-white/15 text-blanco-lunar px-3 py-2.5 rounded-xl focus:outline-none text-xs sm:text-sm"
                        >
                          <option value="tochtli">🐰 Tochtli (Mentoría)</option>
                          <option value="tlacu">🦝 Tlacu (Forja)</option>
                          <option value="kuku">🪶 Kuku (Caravanas)</option>
                        </select>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer w-full font-inter font-bold text-blanco-lunar py-3.5 rounded-xl bg-terracota hover:bg-orange-600 transition-all shadow-lg text-sm disabled:opacity-50"
                      >
                        {isSubmitting ? "Guardando en Supabase..." : "Guardar Faena →"}
                      </button>
                    </form>
                  </div>

                  {/* Lista de Eventos / Faenas en Supabase */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="font-cinzel text-xl font-bold text-blanco-lunar">
                      Catálogo de Faenas ({eventsList.length})
                    </h3>

                    <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                      {eventsList.map((evt) => (
                        <div
                          key={evt.id}
                          className={`rounded-2xl border p-5 space-y-3 relative group transition-all ${
                            evt.status === "activa"
                              ? "bg-amber-500/10 border-amber-400/50 shadow-[0_0_20px_rgba(245,166,35,0.15)]"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-amber-400 font-inter">
                                  {evt.guardian === "tochtli" ? "🐰 Tochtli" : evt.guardian === "kuku" ? "🪶 Kuku" : "🦝 Tlacu"}
                                </span>
                                <span
                                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                    evt.status === "activa"
                                      ? "bg-amber-400 text-azul-noche"
                                      : "bg-white/10 text-arena/70"
                                  }`}
                                >
                                  {evt.status === "activa" ? "🔥 Faena Activa" : "📜 Faena Pasada"}
                                </span>
                              </div>
                              <h4 className="font-cinzel font-bold text-blanco-lunar text-base">
                                {evt.title}
                              </h4>
                            </div>

                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="text-red-400 hover:text-red-300 text-xs bg-red-500/10 p-1.5 rounded-lg transition-all"
                              title="Eliminar evento"
                            >
                              🗑️
                            </button>
                          </div>

                          <div className="text-xs text-arena/80 font-inter space-y-1 bg-black/20 p-2.5 rounded-xl">
                            <p>📅 {evt.event_date} · {evt.time_display}</p>
                            <p>{evt.is_online ? "🖥️ En línea:" : "📍 Presencial:"} {evt.location}</p>
                            {evt.speaker_name && (
                              <p className="flex items-center gap-1.5 text-blanco-lunar">
                                <span>🎙️ Ponente:</span>
                                <strong>{evt.speaker_name}</strong>
                                {evt.speaker_linkedin && (
                                  <a
                                    href={evt.speaker_linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-400 hover:underline text-[11px] ml-1"
                                  >
                                    (LinkedIn ↗)
                                  </a>
                                )}
                              </p>
                            )}
                            <p className="truncate text-amber-400 font-mono text-[11px]">
                              🔗 Luma: {evt.luma_url}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                            <button
                              onClick={() => handleToggleEventStatus(evt.id, evt.status)}
                              className={`cursor-pointer font-bold px-3 py-1 rounded-lg transition-all ${
                                evt.status === "activa"
                                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30"
                                  : "bg-white/10 text-arena hover:text-white"
                              }`}
                            >
                              {evt.status === "activa" ? "Cambiar a Faena Pasada 📜" : "Fijar como Faena Activa 🔥"}
                            </button>

                            <a
                              href={evt.luma_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:underline text-[11px]"
                            >
                              Abrir Luma ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEMORIA VIVA */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-blanco-lunar">
                        Publicaciones en Memoria Viva ({galleryList.length})
                      </h3>
                      <p className="font-inter text-xs text-arena/70">
                        Reflexiones compartidas por los asistentes con enlaces verificados de LinkedIn.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryList.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-inter font-bold text-sm text-blanco-lunar">
                                {item.author_name}
                              </h4>
                              <span className="text-[11px] text-terracota font-bold block">
                                📍 {item.event_title}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteGallery(item.id)}
                              className="text-red-400 hover:text-red-300 text-xs bg-red-500/10 p-1.5 rounded-lg transition-all"
                              title="Eliminar publicación"
                            >
                              🗑️
                            </button>
                          </div>

                          <p className="font-inter text-arena text-xs italic leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                          <span className="text-amber-400 font-semibold text-[11px]">
                            LinkedIn Verificado ✓
                          </span>

                          <a
                            href={item.linkedin_post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:underline font-bold text-xs"
                          >
                            Ver en LinkedIn ↗
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
