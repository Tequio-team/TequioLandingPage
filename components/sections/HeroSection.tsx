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

  // Parallax scroll transformations
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-28 px-6 text-center bg-azul-noche"
      style={{
        background: `
          radial-gradient(ellipse at 50% 40%, #151D32 0%, #0B1020 60%, #080c18 100%)
        `,
      }}
    >
      {/* Capa de ruido artesanal sutil */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-4 z-0">
        <filter id="heroAmateNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroAmateNoise)" />
      </svg>

      {/* Manto de Polvo de Estrellas Dorado */}
      <StarField count={36} isMitlaShape={true} className="z-10" />

      {/* Main Content Container */}
      <motion.div
        className="container mx-auto max-w-4xl relative z-20 flex flex-col items-center justify-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Logotipo Oficial en el Centro */}
        <div className="relative flex flex-col items-center mb-10">
          
          {/* Destello Ámbar Radial */}
          <motion.div
            animate={{ opacity: [0.08, 0.18, 0.08], scale: [0.98, 1.04, 0.98] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-14 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245, 166, 35, 0.25) 0%, transparent 70%)",
            }}
          />

          <div className="cursor-pointer relative">
            <Image
              src="/png/logo.png"
              alt="Logotipo Oficial Tequio"
              width={480}
              height={140}
              className="w-[85vw] max-w-[480px] h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Lema Central */}
        <p
          className="font-cinzel text-blanco-lunar text-2xl md:text-3xl lg:text-4xl leading-relaxed tracking-wide max-w-3xl mx-auto mb-8 font-bold"
          style={{
            textShadow: "0 0 25px rgba(245,166,35,0.35)",
          }}
        >
          &quot;El camino no se recorre en solitario; el conocimiento y el futuro se construyen en colectivo.&quot;
        </p>

        {/* Botón Ver Próximos Eventos */}
        <div>
          <a
            href="/eventos"
            className="cursor-pointer inline-flex items-center gap-2 font-inter text-xs font-semibold text-arena/80 px-5 py-2.5 rounded-full bg-white/[0.04] border border-amber-500/30 hover:border-amber-500/70 hover:bg-amber-500/15 hover:text-blanco-lunar transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-[0_0_15px_rgba(245,166,35,0.3)]"
          >
            <span>Ver próximos eventos</span>
            <span className="text-sm">→</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
