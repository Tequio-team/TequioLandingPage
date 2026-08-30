"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import StarField from "@/components/ui/StarField";
import BrasaParticles from "@/components/ui/BrasaParticles";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-5 text-center bg-azul-noche"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #151D32 0%, #0B1020 60%, #080c18 100%)`,
      }}
    >
      {/* Noise texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-4 z-0">
        <filter id="heroAmateNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroAmateNoise)" />
      </svg>

      <BrasaParticles count={20} className="z-10 opacity-30 md:opacity-55" />
      <StarField count={28} isMitlaShape={true} className="z-10 opacity-35 md:opacity-75" />

      <motion.div
        className="container mx-auto max-w-3xl relative z-20 flex flex-col items-center justify-center gap-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Logo */}
        <div className="relative flex flex-col items-center">
          <motion.div
            animate={{ opacity: [0.07, 0.16, 0.07], scale: [0.98, 1.03, 0.98] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-12 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245, 166, 35, 0.22) 0%, transparent 70%)",
            }}
          />
          <Image
            src="/png/logo.png"
            alt="Logotipo Oficial Tequio"
            width={480}
            height={140}
            className="w-[80vw] max-w-[360px] sm:max-w-[420px] md:max-w-[480px] h-auto object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <p
          className="font-cinzel text-blanco-lunar text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug tracking-wide max-w-2xl font-bold px-2"
          style={{ textShadow: "0 0 22px rgba(245,166,35,0.32)" }}
        >
          &quot;El camino no se recorre en solitario; el conocimiento y el futuro se construyen en colectivo.&quot;
        </p>

        {/* CTA */}
        <a
          href="/eventos"
          className="cursor-pointer inline-flex items-center gap-2 font-inter text-xs font-semibold text-arena/80 px-5 py-2.5 rounded-full bg-white/[0.04] border border-amber-500/30 hover:border-amber-500/70 hover:bg-amber-500/15 hover:text-blanco-lunar transition-all duration-300 backdrop-blur-md shadow-lg"
        >
          <span>Ver próximos eventos</span>
          <span className="text-sm">→</span>
        </a>
      </motion.div>
    </section>
  );
}
