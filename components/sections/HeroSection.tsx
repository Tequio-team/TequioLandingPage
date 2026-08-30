"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import StarField from "@/components/ui/StarField";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax and scroll transformations
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-28 px-6 text-center"
      style={{
        background: `
          radial-gradient(ellipse at 50% 40%, #151D32 0%, #0B1020 60%, #080c18 100%)
        `,
      }}
    >
      {/* Capa de ruido artesanal sutil para evitar plástico digital */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-4 z-0">
        <filter id="heroAmateNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroAmateNoise)" />
      </svg>

      {/* Manto de Polvo de Estrellas Dorado (1-2px) & Constelaciones Prehispánicas en Parallax */}
      <StarField count={36} isMitlaShape={true} className="z-10" />

      {/* Main Content Container (Acto 1: El Umbral) */}
      <motion.div
        className="container mx-auto max-w-4xl relative z-20 flex flex-col items-center justify-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Logotipo Oficial en el Centro con Destello Ámbar Pulso Detrás */}
        <div className="relative flex flex-col items-center mb-10">
          
          {/* Destello Ámbar Radial que Pulsa Detrás del Logo */}
          <motion.div
            animate={{ opacity: [0.08, 0.18, 0.08], scale: [0.98, 1.04, 0.98] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-14 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245, 166, 35, 0.25) 0%, transparent 70%)",
            }}
          />

          {/* Entrance: Logo Fade-In + Scale (0.96 -> 1 en 900ms) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="cursor-pointer relative"
          >
            <Image
              src="/png/logo.png"
              alt="Logotipo Oficial Tequio"
              width={480}
              height={140}
              className="w-[85vw] max-w-[480px] h-auto object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Lema Central: Aparece 250ms después con fade-in y translateY(8px) -> 0 */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          className="font-cinzel text-blanco-lunar text-2xl md:text-3xl lg:text-4xl leading-relaxed tracking-wide max-w-3xl mx-auto mb-8 font-bold"
          style={{
            textShadow: "0 0 25px rgba(245,166,35,0.35)",
          }}
        >
          &quot;El camino no se recorre en solitario; el conocimiento y el futuro se construyen en colectivo.&quot;
        </motion.p>

        {/* Botón Tenue y Elegante: Ver Próximos Eventos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <a
            href="/eventos"
            className="cursor-pointer inline-flex items-center gap-2 font-inter text-xs font-semibold text-arena/80 px-5 py-2.5 rounded-full bg-white/[0.04] border border-amber-500/30 hover:border-amber-500/70 hover:bg-amber-500/15 hover:text-blanco-lunar transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-[0_0_15px_rgba(245,166,35,0.3)]"
          >
            <span>Ver próximos eventos</span>
            <span className="text-amber-400">→</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Indicador Sutil de Scroll al Fondo (Fina línea vertical dorada 2px) */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none"
        style={{ opacity: contentOpacity }}
      >
        <span className="font-inter text-arena/60 text-xs tracking-[0.2em] uppercase font-medium">Scroll</span>
        <div className="w-[2px] h-14 bg-amber-500/20 rounded-full overflow-hidden relative">
          <motion.div
            animate={{ y: [-56, 56] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-1/2 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full shadow-[0_0_10px_#F5A623]"
          />
        </div>
      </motion.div>
    </section>
  );
}
