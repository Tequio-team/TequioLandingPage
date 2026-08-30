"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import StarField from "@/components/ui/StarField";

const KEYWORDS: Record<string, string> = {
  "principio ancestral mesoamericano": "Tradición comunitaria donde cada persona aporta tiempo, fuerza y talento por el bien común.",
  "estudiantes con hambre de aprender": "Jóvenes talentos que aportan energía, curiosidad y perspectiva fresca.",
  "profesionales activos": "Mentores de la industria que comparten su camino y abren puertas.",
  "herramienta de transformación social y empatía": "Uso del código enfocado en resolver problemas reales de las personas.",
  "albergues": "Apoyo técnico y voluntariado físico para centros de apoyo social.",
  "refugios de animales": "Construcción de plataformas digitales para adopción y rescate.",
  "causas comunitarias": "Proyectos con impacto directo en comunidades vulnerables y adultos mayores.",
};

const PARAGRAPHS = [
  "Tequio nace del principio ancestral mesoamericano donde cada persona aporta su esfuerzo, tiempo y talento en beneficio de la comunidad.",
  "Somos un colectivo híbrido que une a estudiantes con hambre de aprender y profesionales activos en la industria. No entendemos la tecnología únicamente como líneas de código, certificaciones o métricas de negocio, sino como una herramienta de transformación social y empatía.",
  "Nos encontramos en eventos y hackathons para aprender y crecer juntos, pero también salimos a la calle para poner el cuerpo y el código al servicio de quienes más lo necesitan: albergues, refugios de animales, centros de adultos mayores y causas comunitarias.",
];

export default function WhatIsTequioSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTooltip, setActiveTooltip] = useState<{ kw: string; x: number; y: number } | null>(null);

  const handleKeywordHover = (e: React.MouseEvent, kw: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({
      kw,
      x: rect.left + rect.width / 2,
      y: rect.top - 12,
    });
  };

  const renderHighlightedText = (text: string) => {
    let parts: React.ReactNode[] = [text];
    Object.keys(KEYWORDS).forEach((kw) => {
      parts = parts.flatMap((node) => {
        if (typeof node !== "string") return [node];
        const sub = node.split(kw);
        return sub.flatMap((s, idx) =>
          idx < sub.length - 1
            ? [
                s,
                <span
                  key={`${kw}-${idx}`}
                  className="cursor-pointer relative font-semibold px-1 text-blanco-lunar inline-block group"
                  onMouseEnter={(e) => handleKeywordHover(e, kw)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {kw}
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-terracota rounded-full"
                    initial={{ width: "0%" }}
                    animate={inView ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  />
                </span>,
              ]
            : [s]
        );
      });
    });
    return parts;
  };

  return (
    <section
      id="que-es-tequio"
      ref={ref}
      className="relative py-32 overflow-hidden bg-azul-noche"
      style={{
        background: "linear-gradient(to bottom, #0B1020 0%, #151D32 50%, #0B1020 100%)",
      }}
    >
      {/* Textura de papel amate / piedra volcánica con máscara radial (visible en bordes 20%) */}
      <div
        className="absolute inset-0 opacity-18 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, transparent 40%, black 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 40%, black 90%)",
        }}
      >
        <svg className="w-full h-full">
          <filter id="amateSideTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#amateSideTexture)" />
        </svg>
      </div>

      <StarField count={16} isMitlaShape={true} className="opacity-25" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-14 items-center">
          
          {/* Main Text Content */}
          <div className="flex-1 relative pl-8">
            
            {/* Chisel Vertical Entrance Line */}
            <svg
              className="absolute left-0 top-0 h-full"
              width="6"
              viewBox="0 0 6 100"
              preserveAspectRatio="none"
            >
              <motion.line
                x1="3" y1="0" x2="3" y2="100"
                stroke="#C15B3A"
                strokeWidth="4"
                strokeDasharray="6 3 2 3"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 200 }}
                animate={inView ? { strokeDashoffset: 0 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Título de Sección */}
            <motion.h2
              className="font-cinzel text-blanco-lunar text-4xl md:text-6xl mb-8 tracking-wide font-bold"
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              Qué es Tequio
            </motion.h2>

            {/* Paragraphs with Stagger (translateY 12px -> 0, 600ms, 120ms stagger) */}
            {PARAGRAPHS.map((para, i) => (
              <motion.p
                key={i}
                className="font-inter text-arena text-lg leading-[1.85] mb-6 opacity-90"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.12, duration: 0.6 }}
              >
                {renderHighlightedText(para)}
              </motion.p>
            ))}

            {/* Cita Destacada (Bloque Central): Fade-In + Scale 0.98 -> 1 en 700ms */}
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.98, x: -10 }}
              animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="my-10 pl-6 border-l-[4px] border-terracota bg-white/[0.04] py-6 pr-6 rounded-r-2xl shadow-xl"
            >
              <p className="font-cinzel text-blanco-lunar text-xl md:text-2xl leading-relaxed italic font-bold">
                &quot;El conocimiento que no se comparte se apaga. Quien hoy recibe guía, mañana lidera y acompaña a otros.&quot;
              </p>
            </motion.blockquote>

          </div>

          {/* Tochtli PNG Presence */}
          <motion.div
            className="shrink-0 relative"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Image
              src="/png/tochtli.png"
              alt="Tochtli — Guía de Tequio"
              width={260}
              height={320}
              className="object-contain"
              priority
            />
          </motion.div>

        </div>
      </div>

      {/* Tooltip for Keywords */}
      {activeTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed z-50 px-5 py-3 rounded-xl text-sm font-inter text-blanco-lunar pointer-events-none max-w-xs text-center border-2 border-terracota bg-azul-noche/95 shadow-2xl"
          style={{
            left: activeTooltip.x,
            top: activeTooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-bold text-ambar mb-1 capitalize">{activeTooltip.kw}</div>
          <div className="text-arena/90 text-xs">{KEYWORDS[activeTooltip.kw]}</div>
        </motion.div>
      )}
    </section>
  );
}
