"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import StarField from "@/components/ui/StarField";

const HIGHLIGHTED_KEYWORDS = [
  "principio ancestral mesoamericano",
  "estudiantes con hambre de aprender",
  "profesionales activos",
  "herramienta de transformación social y empatía",
  "albergues",
  "refugios de animales",
  "causas comunitarias",
];

const PARAGRAPHS = [
  "Tequio nace del principio ancestral mesoamericano donde cada persona aporta su esfuerzo, tiempo y talento en beneficio de la comunidad.",
  "Somos un colectivo híbrido que une a estudiantes con hambre de aprender y profesionales activos en la industria. No entendemos la tecnología únicamente como líneas de código, certificaciones o métricas de negocio, sino como una herramienta de transformación social y empatía.",
  "Nos encontramos en eventos y hackathons para aprender y crecer juntos, pero también salimos a la calle para poner el cuerpo y el código al servicio de quienes más lo necesitan: albergues, refugios de animales, centros de adultos mayores y causas comunitarias.",
];

export default function WhatIsTequioSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const renderHighlightedText = (text: string) => {
    let parts: React.ReactNode[] = [text];
    HIGHLIGHTED_KEYWORDS.forEach((kw) => {
      parts = parts.flatMap((node) => {
        if (typeof node !== "string") return [node];
        const sub = node.split(kw);
        return sub.flatMap((s, idx) =>
          idx < sub.length - 1
            ? [
                s,
                <span
                  key={`${kw}-${idx}`}
                  className="relative font-semibold px-0.5 text-blanco-lunar inline-block border-b-2 border-terracota"
                >
                  {kw}
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
      {/* Textura de papel amate */}
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

            {/* Paragraphs */}
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

            {/* Cita Destacada */}
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.98, x: -10 }}
              animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="my-10 pl-6 border-l-[4px] border-terracota bg-white/[0.04] py-6 pr-6 rounded-r-2xl shadow-xl"
            >
              <p className="font-cinzel text-amber-300 text-xl md:text-2xl leading-relaxed italic font-bold">
                &quot;El conocimiento que no se comparte se apaga. Quien hoy recibe guía, mañana lidera y acompaña a otros.&quot;
              </p>
            </motion.blockquote>

          </div>

          {/* Right Visual Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full lg:w-[420px] h-[480px] relative rounded-3xl overflow-hidden border-2 border-terracota/30 shadow-2xl flex-shrink-0"
          >
            <Image
              src="/jpg/moment1.jpg"
              alt="Comunidad Tequio en faena"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-azul-noche via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="font-inter text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
                ✦ Faena Colectiva ✦
              </span>
              <p className="font-cinzel text-blanco-lunar text-xl font-bold">
                Aprender en tribu, construir en comunidad.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
