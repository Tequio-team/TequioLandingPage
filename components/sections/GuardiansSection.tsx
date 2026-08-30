"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Modal from "@/components/ui/Modal";

const GUARDIANS = [
  {
    id: "tochtli",
    src: "/png/tochtli.png",
    name: "Tochtli",
    archetype: "El Conejo Lunar · Mentoría e Inspiración",
    color: "#F5A623",
    auraBg: "radial-gradient(circle at 50% 40%, rgba(245, 166, 35, 0.22) 0%, transparent 75%)",
    description:
      "El anfitrión, el mentor noble y el visionario. Representa la generosidad de compartir el saber y tender la mano a quien recién se integra.",
    traits: ["Orejas de Mitla", "Pecas Lunares", "Chaleco Azul Noche", "Gafete Lead Tequio", "Termo de Café", "Cincel Artesanal"],
    myth: "Inspirado en el mito del conejo que se ofreció con humildad y cuya silueta quedó grabada en la Luna como recordatorio del valor del desprendimiento.",
  },
  {
    id: "tlacu",
    src: "/png/tlacu.png",
    name: "Tlacu",
    archetype: "El Tlacuache-Jaguar · El Constructor",
    color: "#C15B3A",
    auraBg: "radial-gradient(circle at 50% 50%, rgba(193, 91, 58, 0.28) 0%, transparent 65%)",
    description:
      "El builder, la logística técnica y la acción comunitaria. Representa a quien no teme ensuciarse las manos, armar los talleres prácticos y donar horas de código o trabajo físico.",
    traits: ["Cola de Brasa Viva", "Manchas de Jaguar", "Hoodie Mangas Arremangadas", "Gorro Beanie", "Morral de Ixtle", "Cables y Adaptadores"],
    myth: "Inspirado en el Tlacuatzin, el héroe que desafió al destino para robar el fuego y entregárselo a la humanidad, fusionado con la fuerza terrestre del jaguar.",
  },
  {
    id: "kuku",
    src: "/png/kuku.png",
    name: "Kuku",
    archetype: "El Colibrí-Quetzal · El Explorador Social",
    color: "#10b981",
    auraBg: "radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.24) 0%, transparent 80%)",
    description:
      "El conector, la energía en eventos y la agilidad social. Es quien rompe el hielo, organiza las caravanas hacia grandes conferencias y une a personas tímidas con speakers y mentores.",
    traits: ["Alas Jade-Coral", "Rompevientos Retro", "Cangurera Cruzada", "Múltiples Lanyards", "Gafetes Coleccionables", "Plumillas Guía"],
    myth: "Inspirado en Huitzilin (el mensajero incansable) y la elegancia del Quetzal, símbolo de movimiento ágil y libertad de ideas.",
  },
];

export default function GuardiansSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openGuardian, setOpenGuardian] = useState<typeof GUARDIANS[0] | null>(null);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  return (
    <section
      id="guardianes"
      ref={ref}
      className="relative py-32 overflow-hidden bg-azul-noche"
      style={{
        background: "linear-gradient(to bottom, #0F172A 0%, #181524 50%, #0F172A 100%)",
      }}
    >
      {/* Textura niebla sagrada */}
      <svg className="absolute inset-0 w-full h-full opacity-6 pointer-events-none">
        <filter id="fogFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fogFilter)" />
      </svg>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-24 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-inter text-ambar text-xs md:text-sm uppercase tracking-[0.25em] font-semibold mb-2 block">
            Nuestros Alebrijes
          </span>
          <h2 className="font-cinzel text-blanco-lunar text-4xl md:text-5xl mb-6 tracking-wide font-bold">
            Los Tres Guardianes de Tequio
          </h2>
          <p className="font-inter text-arena text-base md:text-lg leading-relaxed opacity-85">
            La identidad y el espíritu de Tequio se representan a través de tres criaturas míticas, inspiradas en nuestras raíces prehispánicas y adaptadas como alebrijes contemporáneos. Cada uno encarna un pilar fundamental de la comunidad.
          </p>
        </motion.div>

        {/* 3 Columnas con auras diferenciadas, oscilación continua y enfoque dinámico al hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10">
          {GUARDIANS.map((g, i) => (
            <GuardianCard
              key={g.id}
              guardian={g}
              index={i}
              inView={inView}
              activeHoverId={activeHoverId}
              onHoverStart={() => setActiveHoverId(g.id)}
              onHoverEnd={() => setActiveHoverId(null)}
              onClick={() => setOpenGuardian(g)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal with Sacred Atmosphere */}
      <Modal
        isOpen={!!openGuardian}
        onClose={() => setOpenGuardian(null)}
        title={openGuardian ? `${openGuardian.name} — Mito de Origen` : undefined}
      >
        {openGuardian && (
          <div className="flex flex-col gap-6 text-center relative overflow-hidden">
            {/* Modal Ambient Glow */}
            <div
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: openGuardian.auraBg }}
            />
            <div className="flex justify-center relative z-10">
              <Image
                src={openGuardian.src}
                alt={openGuardian.name}
                width={150}
                height={180}
                className="object-contain"
              />
            </div>
            <p className="font-inter text-arena leading-relaxed text-base relative z-10">
              {openGuardian.myth}
            </p>
            <div className="flex flex-wrap gap-2 justify-center relative z-10">
              {openGuardian.traits.map((t) => (
                <span
                  key={t}
                  className="font-inter text-sm px-4 py-1.5 rounded-full"
                  style={{
                    background: `${openGuardian.color}22`,
                    color: openGuardian.color,
                    border: `1px solid ${openGuardian.color}55`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

function GuardianCard({
  guardian,
  index,
  inView,
  activeHoverId,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  guardian: typeof GUARDIANS[0];
  index: number;
  inView: boolean;
  activeHoverId: string | null;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  const isHovered = activeHoverId === guardian.id;
  const isDimmed = activeHoverId !== null && !isHovered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: isDimmed ? 0.75 : 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      className="cursor-pointer relative pt-16 pb-8 px-6 flex flex-col justify-between transition-all duration-400"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: "24px",
        border: `1px solid ${isHovered ? guardian.color : "rgba(217, 203, 184, 0.12)"}`,
        boxShadow: isHovered
          ? `0 15px 40px ${guardian.color}35, inset 0 0 20px ${guardian.color}15`
          : "0 6px 25px rgba(11, 16, 32, 0.5)",
      }}
    >
      {/* Aura Ceremonial Difusa por Guardián */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full pointer-events-none transition-opacity duration-400"
        style={{
          background: guardian.auraBg,
          opacity: isHovered ? 1 : 0.6,
        }}
      />

      {/* PNG 3D Ilustración con Oscilación Continua de Vida (translateY ±2px) */}
      <motion.div
        className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center"
        animate={
          isHovered
            ? { y: -8, scale: 1.08 }
            : { y: [0, -3, 0], rotate: index === 0 ? [0, 0.4, 0] : index === 1 ? [0, -0.4, 0] : [0, 0.5, 0] }
        }
        transition={
          isHovered
            ? { duration: 0.4, ease: "easeOut" }
            : { duration: 6 + index, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Image
          src={guardian.src}
          alt={guardian.name}
          width={130}
          height={155}
          className={`object-contain ${guardian.id === "kuku" ? "scale-125" : ""}`}
          priority
        />
        <div
          className="w-20 h-3 rounded-full blur-md opacity-30 bg-black -mt-2 transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.45 : 0.25 }}
        />
      </motion.div>

      {/* Header Info */}
      <div className="flex flex-col items-center text-center mb-6 pt-6">
        <h3 className="font-cinzel text-blanco-lunar text-3xl font-bold tracking-wide mb-1">
          {guardian.name}
        </h3>
        <p
          className="font-inter text-xs uppercase tracking-widest font-semibold"
          style={{ color: guardian.color }}
        >
          {guardian.archetype}
        </p>
      </div>

      {/* Content Below */}
      <div className="flex flex-col gap-4 flex-1 justify-between text-center">
        <p className="font-inter text-arena text-sm leading-[1.7] opacity-85">
          {guardian.description}
        </p>

        {/* Píldoras de Rasgos */}
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {guardian.traits.slice(0, 4).map((t) => (
            <motion.span
              key={t}
              animate={isHovered ? { scale: 1.04, boxShadow: `0 0 10px ${guardian.color}44` } : { scale: 1, boxShadow: "none" }}
              transition={{ duration: 0.2 }}
              className="font-inter text-xs px-3 py-1.5 rounded-full font-medium transition-colors duration-300"
              style={{
                background: isHovered ? `${guardian.color}25` : `${guardian.color}15`,
                color: guardian.color,
                border: `1px solid ${guardian.color}40`,
              }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
