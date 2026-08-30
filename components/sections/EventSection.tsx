"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Countdown from "@/components/ui/Countdown";
import Modal from "@/components/ui/Modal";

// Event target date
const EVENT_DATE = new Date("2025-09-20T10:00:00");

const EVENT_DETAILS = [
  { emoji: "🦝", label: "Nivel: Todos" },
  { emoji: "💻", label: "Tech: Python, JS, No-Code" },
  { emoji: "🍕", label: "Incluye: Comida y stickers" },
];

export default function EventSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [cardHovered, setCardHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      id="evento"
      ref={ref}
      className="relative py-28 md:py-36 overflow-hidden bg-blanco-lunar"
      style={{
        background: "linear-gradient(to bottom, #1a2332 0%, #F9F7F2 15%, #F9F7F2 85%, #1a2332 100%)",
      }}
    >
      {/* Terracota Mitla Pattern Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #C15B3A 0px, #C15B3A 1px, transparent 1px, transparent 25px)`,
        }}
      />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Section Label */}
        <motion.p
          className="text-center font-inter text-gris-pizarra uppercase tracking-widest text-sm mb-4 font-semibold opacity-75"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Plaza del Encuentro
        </motion.p>

        {/* Parchment Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          whileHover={{ y: -12 }}
          onHoverStart={() => setCardHovered(true)}
          onHoverEnd={() => setCardHovered(false)}
          className="relative rounded-3xl p-10 md:p-14 overflow-hidden cursor-none"
          style={{
            background: "#ffffff",
            borderLeft: "10px solid #C15B3A",
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)",
            boxShadow: cardHovered
              ? "0 30px 80px rgba(193,91,58,0.3), 0 10px 40px rgba(193,91,58,0.2)"
              : "0 10px 50px rgba(193,91,58,0.15)",
            transition: "box-shadow 0.4s ease",
          }}
        >
          {/* Badge "Próximo Evento" (Clay Seal Shape) */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ rotate: 360 }}
            className="absolute top-8 right-8 font-inter font-bold text-xs md:text-sm text-blanco-lunar px-5 py-2.5 rounded-full border-2 border-dashed border-ambar-light shadow-lg cursor-none"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            🔥 Próximo Evento
          </motion.div>

          {/* Title */}
          <h2 className="font-cinzel text-azul-noche text-3xl md:text-5xl mb-4 pr-36 tracking-wide">
            Hackathon por la Comunidad
          </h2>

          {/* Date & Location */}
          <div className="mb-6 space-y-1">
            <p className="font-inter text-gris-pizarra text-lg font-medium">
              📅 Sábado, 20 de Septiembre · 10:00 AM
            </p>
            <p className="font-inter text-gris-pizarra text-lg font-medium">
              📍 Centro Comunitario La Esperanza, CDMX
            </p>
          </div>

          {/* Description */}
          <p className="font-inter text-gris-pizarra leading-[1.8] mb-8 text-base max-w-xl opacity-90">
            Un hackathon de 8 horas para construir soluciones reales a problemas reales.
            Equipos mixtos de estudiantes y profesionales, mentores disponibles y
            una comunidad que te apoya en cada paso.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-10">
            {EVENT_DETAILS.map(({ emoji, label }) => (
              <span
                key={label}
                className="font-inter text-sm px-4 py-2 rounded-xl border border-terracota/30 bg-terracota/10 text-terracota font-medium"
              >
                {emoji} {label}
              </span>
            ))}
          </div>

          {/* Countdown Block */}
          <div className="mb-10">
            <p className="font-inter text-gris-pizarra/70 text-xs uppercase tracking-widest mb-3 font-semibold">
              Faltan para el encuentro
            </p>
            <Countdown targetDate={EVENT_DATE} />
          </div>

          {/* Register Button */}
          <motion.button
            whileHover={{ scale: 1.06, y: -4 }}
            onClick={() => setModalOpen(true)}
            className="cursor-none font-inter font-bold text-lg text-blanco-lunar px-10 py-4 rounded-xl transition-all duration-300 shadow-xl"
            style={{
              background: "#C15B3A",
              boxShadow: "0 10px 30px rgba(193,91,58,0.4)",
            }}
          >
            Registrarme →
          </motion.button>

          {/* Tlacu PNG Peeking from Bottom Left */}
          <motion.div
            className="absolute -bottom-10 left-6 z-20 cursor-none"
            animate={cardHovered ? { rotate: [-5, 5, -5], y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 1.5, repeat: cardHovered ? Infinity : 0 }}
          >
            <Image
              src="/png/tlacu.png"
              alt="Tlacu en la tarjeta"
              width={110}
              height={140}
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Regístrate al Hackathon"
      >
        <div className="flex flex-col gap-6">
          <p className="font-inter text-arena">
            Completa el formulario y te enviaremos los detalles de acceso por correo.
          </p>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Tu nombre completo"
              className="font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-3 rounded-lg focus:outline-none focus:border-terracota"
            />
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className="font-inter bg-white/5 border border-arena/30 text-blanco-lunar px-4 py-3 rounded-lg focus:outline-none focus:border-terracota"
            />
            <select className="font-inter bg-azul-noche border border-arena/30 text-arena px-4 py-3 rounded-lg focus:outline-none focus:border-terracota">
              <option value="">¿Cuál es tu perfil?</option>
              <option value="estudiante">Estudiante</option>
              <option value="profesional">Profesional</option>
              <option value="ambos">Ambos</option>
            </select>
            <button
              type="submit"
              className="cursor-none font-inter font-bold text-blanco-lunar py-3.5 rounded-lg transition-colors duration-300"
              style={{ background: "#C15B3A" }}
              onClick={() => setModalOpen(false)}
            >
              ¡Me apunto! 🔥
            </button>
          </form>
        </div>
      </Modal>
    </section>
  );
}
