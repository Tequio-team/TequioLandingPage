"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BrasaParticles from "@/components/ui/BrasaParticles";

const CAROUSEL_SLIDES = [
  {
    id: 1,
    src: "/jpg/moment1.jpg",
    title: "Hackathons con Causa",
    subtitle: "Construyendo tecnología útil para comunidades en equipo.",
  },
  {
    id: 2,
    src: "/jpg/moment2.jpg",
    title: "Mentoría Directa 1:1",
    subtitle: "Acompañamiento cercano entre la universidad y la industria.",
  },
  {
    id: 3,
    src: "/jpg/moment3.jpg",
    title: "Voluntariado Comunitario",
    subtitle: "Ponemos el cuerpo y el corazón en refugios y albergues.",
  },
];

export default function CommitmentSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance crossfade carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="compromiso"
      ref={ref}
      className="relative py-32 overflow-hidden bg-azul-noche"
      style={{
        background: `
          radial-gradient(ellipse at 50% 100%, rgba(193, 91, 58, 0.35) 0%, transparent 70%),
          linear-gradient(to bottom, #0F172A 0%, #1F1A2C 50%, #0d0f1a 100%)
        `,
      }}
    >
      {/* Micro-partículas de brasa de fuegos ceremoniales */}
      <BrasaParticles count={50} className="z-0 opacity-85" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 space-y-16 text-center">
        
        {/* Frase de Compromiso (Manifiesto) */}
        <motion.div
          className="max-w-4xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold block">
            ✦ Nuestro Compromiso ✦
          </span>
          <p className="font-cinzel text-blanco-lunar text-2xl md:text-4xl leading-relaxed font-bold">
            &quot;Quien entra a Tequio no solo busca crecer profesionalmente; asume el compromiso de poner su piedra en la obra colectiva. Aquí construimos tecnología con causa, aprendemos en tribu y dejamos huella.&quot;
          </p>
        </motion.div>

        {/* Carrusel de Momentos Tequio con Desvanecimiento Suave (Crossfade) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto h-[320px] md:h-[460px] rounded-3xl overflow-hidden border-2 border-terracota/40 shadow-2xl bg-black/40 group"
          style={{ boxShadow: "0 15px 50px rgba(193, 91, 58, 0.2)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={CAROUSEL_SLIDES[currentSlide].id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={CAROUSEL_SLIDES[currentSlide].src}
                alt={CAROUSEL_SLIDES[currentSlide].title}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay Gradiente de Noche en la Base */}
              <div className="absolute inset-0 bg-gradient-to-t from-azul-noche via-azul-noche/30 to-transparent" />

              {/* Pie de Foto Ceremonial */}
              <div className="absolute bottom-6 left-8 right-8 text-left z-10">
                <span className="font-inter text-xs uppercase tracking-widest text-ambar font-bold block mb-1">
                  Momento de la Faena · 0{currentSlide + 1} / 0{CAROUSEL_SLIDES.length}
                </span>
                <h3 className="font-cinzel text-blanco-lunar text-2xl md:text-3xl font-bold">
                  {CAROUSEL_SLIDES[currentSlide].title}
                </h3>
                <p className="font-inter text-arena/90 text-sm md:text-base opacity-90 mt-1">
                  {CAROUSEL_SLIDES[currentSlide].subtitle}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicadores de Puntos (Dots Nav) */}
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            {CAROUSEL_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Ver foto ${idx + 1}`}
                className={`cursor-pointer h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-8 bg-ambar shadow-[0_0_8px_#F5A623]" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Botón CTA Principal: Ver las Próximas Actividades → */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="pt-2"
        >
          <Link
            href="/eventos"
            className="cursor-pointer relative inline-flex items-center gap-3 font-inter font-bold text-lg text-blanco-lunar px-10 py-5 rounded-2xl bg-terracota transition-all duration-300 shadow-2xl hover:shadow-[0_12px_35px_rgba(193,91,58,0.7)] hover:scale-105"
          >
            <span className="tracking-wide">Ver las próximas actividades</span>
            <span className="text-2xl">→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
