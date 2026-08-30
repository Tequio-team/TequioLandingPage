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
import { getUserProfile, saveUserProfile } from "@/lib/session";

export default function UnirsePage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "Estudiante con hambre de aprender",
    interes: "Hackathons Comunitarios & Proyectos Sociales",
    mensaje: "",
  });

  // Auto-fill from localStorage session on mount
  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        nombre: profile.nombre || prev.nombre,
        email: profile.email || prev.email,
        rol: profile.rol || prev.rol,
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email) return;

    setIsSealing(true);

    try {
      // Save profile to browser session
      saveUserProfile({
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
      });

      const { supabase } = await import("@/lib/supabase");
      await supabase.from("community_members").insert([
        {
          full_name: formData.nombre,
          email: formData.email,
          role_interest: formData.rol,
          motivation: formData.mensaje || null,
        },
      ]);
    } catch (err) {
      console.warn("Supabase insertion skipped or offline:", err);
    } finally {
      setIsSealing(false);
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-azul-noche text-blanco-lunar relative overflow-hidden">
      <BrasaCursor />
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-36 pb-16 px-6 text-center">
        <StarField count={30} isMitlaShape={true} />
        <BrasaParticles count={35} className="opacity-70" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold mb-3 block">
            ✦ El Registro de la Tribu ✦
          </span>
          <h1 className="font-cinzel text-blanco-lunar text-4xl md:text-6xl font-bold tracking-wide mb-6">
            Inscríbete en el Códice de la Faena
          </h1>
          <p className="font-inter text-arena text-lg leading-relaxed max-w-2xl mx-auto opacity-85">
            Sumar tu nombre es asumir el compromiso de poner una piedra en la obra colectiva. Quien entra a Tequio aprende en tribu y deja huella.
          </p>

          {/* User Session Badge */}
          {getUserProfile() && (
            <div className="pt-4">
              <span className="inline-flex items-center gap-2 font-inter text-xs bg-white/5 border border-terracota/30 text-terracota px-4 py-1.5 rounded-full">
                <span>👤 Sesión activa:</span>
                <strong>{getUserProfile()?.nombre}</strong>
                <span className="text-arena/60">({getUserProfile()?.email})</span>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Form & Confirmation Container */}
      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-2xl relative z-10">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              /* FORMULARIO: INSCRIBIR MI NOMBRE */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 md:p-12 rounded-3xl border border-terracota/40 bg-white/[0.03] backdrop-blur-xl shadow-2xl relative"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Nombre */}
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wider text-arena/80 font-semibold mb-2">
                      Tu Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej. Quetzalli Gómez"
                      className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-5 py-3.5 rounded-xl focus:outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/30 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wider text-arena/80 font-semibold mb-2">
                      Correo Electrónico de Contacto *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-5 py-3.5 rounded-xl focus:outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/30 transition-all"
                    />
                  </div>

                  {/* Rol */}
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wider text-arena/80 font-semibold mb-2">
                      ¿Cómo deseas participar en la Faena?
                    </label>
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                      className="w-full font-inter bg-azul-noche border border-arena/30 text-blanco-lunar px-5 py-3.5 rounded-xl focus:outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/30 transition-all"
                    >
                      <option>Estudiante con hambre de aprender</option>
                      <option>Profesional Mentor de la Industria</option>
                      <option>Diseñador / Creador UX/UI</option>
                      <option>Voluntario de Logística Comunitario</option>
                    </select>
                  </div>

                  {/* Interés */}
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wider text-arena/80 font-semibold mb-2">
                      Área de Mayor Interés
                    </label>
                    <select
                      value={formData.interes}
                      onChange={(e) => setFormData({ ...formData, interes: e.target.value })}
                      className="w-full font-inter bg-azul-noche border border-arena/30 text-blanco-lunar px-5 py-3.5 rounded-xl focus:outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/30 transition-all"
                    >
                      <option>Hackathons Comunitarios & Proyectos Sociales</option>
                      <option>Plataformas para Refugios de Animales</option>
                      <option>Sistemas para Asilos y Adultos Mayores</option>
                      <option>Redes e Infraestructura para Zonas Rurales</option>
                    </select>
                  </div>

                  {/* Mensaje opcional */}
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wider text-arena/80 font-semibold mb-2">
                      ¿Qué superpoder o talento deseas aportar? (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Cuéntanos un poco sobre ti..."
                      className="w-full font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-5 py-3.5 rounded-xl focus:outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/30 transition-all"
                    />
                  </div>

                  {/* Botón Sello de Faena Cumplida */}
                  <motion.button
                    type="submit"
                    disabled={isSealing}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full cursor-pointer relative font-inter font-bold text-lg text-blanco-lunar py-4 rounded-xl bg-terracota shadow-2xl transition-all flex items-center justify-center gap-3 overflow-hidden"
                  >
                    {isSealing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-7 h-7 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <span>Inscribir mi nombre</span>
                        <span className="text-xl">→</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              /* CONFIRMACIÓN CEREMONIAL: TU NOMBRE HA SIDO GRABADO */
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-3xl border-2 border-ambar/50 bg-white/[0.04] backdrop-blur-2xl text-center space-y-6 shadow-2xl"
              >
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-50 bg-ambar pointer-events-none" />
                    <Image
                      src="/png/logo.png"
                      alt="Sello de la Faena Tequio"
                      width={160}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                </div>

                <span className="font-inter text-xs uppercase tracking-[0.25em] text-ambar font-bold block">
                  ✦ Grabado en el Códice ✦
                </span>

                <h2 className="font-cinzel text-blanco-lunar text-3xl md:text-4xl font-bold">
                  ¡Tu nombre ha sido grabado en el códice!
                </h2>

                <p className="font-cinzel text-ambar text-lg font-bold italic max-w-lg mx-auto">
                  &quot;Bienvenido, {formData.nombre}. Quien entra a Tequio pone su piedra en la obra colectiva.&quot;
                </p>

                <p className="font-inter text-arena text-sm opacity-90 max-w-md mx-auto leading-relaxed">
                  Hemos enviado los detalles del próximo encuentro a <strong>{formData.email}</strong>. ¡Nos vemos muy pronto en la faena!
                </p>

                <div className="pt-6 flex justify-center gap-4">
                  <Link
                    href="/eventos"
                    className="cursor-pointer font-inter font-bold text-sm bg-terracota text-blanco-lunar px-8 py-3.5 rounded-xl shadow-xl hover:bg-terracota/90 transition-all hover:scale-105"
                  >
                    Ver La Faena Actual →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      <FooterSection />
    </main>
  );
}
