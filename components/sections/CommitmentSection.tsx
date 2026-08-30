"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BrasaParticles from "@/components/ui/BrasaParticles";
import { formatLinkedInEmbedUrl } from "@/components/ui/LinkedInEmbedCard";

const DEFAULT_POSTS: Array<{
  id: string;
  title: string;
  date: string;
  linkedinPostUrl: string;
  authorName?: string;
}> = [
  {
    id: "post-1",
    title: "Impulso a la Comunidad — Faena Tequio en LinkedIn",
    date: "28 de Agosto, 2026",
    linkedinPostUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/",
  },
  {
    id: "post-2",
    title: "Caravana y Encuentro Tech — Registro de Miembro",
    date: "20 de Agosto, 2026",
    linkedinPostUrl: "https://lnkd.in/p/g-Dc7yaS",
  },
];

export default function CommitmentSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [posts, setPosts] = useState(DEFAULT_POSTS);

  // Fetch live posts from Supabase completed_works_gallery
  useEffect(() => {
    async function loadGalleryPosts() {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase
          .from("completed_works_gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setPosts(
            data.map((g) => ({
              id: g.id,
              title: g.title,
              date: g.event_date || "Agosto 2026",
              linkedinPostUrl: g.linkedin_post_url,
              authorName: g.author_name,
            }))
          );
        }
      } catch (err) {
        console.warn("Error cargando posts de LinkedIn para compromiso:", err);
      }
    }

    loadGalleryPosts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const currentPost = posts[currentSlide] || posts[0];

  return (
    <section
      id="compromiso"
      className="relative py-28 overflow-hidden bg-azul-noche"
      style={{
        background: `
          radial-gradient(ellipse at 20% 100%, rgba(193, 91, 58, 0.3) 0%, transparent 65%),
          linear-gradient(to bottom, #0F172A 0%, #1F1A2C 50%, #0d0f1a 100%)
        `,
      }}
    >
      <BrasaParticles count={45} className="z-0 opacity-70 md:opacity-80" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* LAYOUT EN 1 COLUMNA EN MÓVIL (ESLOGAN ARRIBA, CARROUSEL ABAJO) Y 2 COLUMNAS EN DESKTOP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA (ESLOGAN & MANIFIESTO) */}
          <div className="space-y-6 text-left">
            <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold block">
              ✦ Nuestro Compromiso ✦
            </span>

            <h2 className="font-cinzel text-blanco-lunar text-2xl sm:text-3xl md:text-5xl leading-tight font-bold">
              &quot;Poner nuestra piedra en la obra colectiva.&quot;
            </h2>

            <p className="font-inter text-arena text-base md:text-lg leading-relaxed opacity-90">
              Quien entra a Tequio no solo busca crecer profesionalmente; asume el compromiso de aprender en tribu, construir tecnología útil con causa y dejar una huella imborrable en la red.
            </p>

            <div className="pt-2">
              <Link
                href="/eventos"
                className="cursor-pointer inline-flex items-center gap-3 font-inter font-bold text-sm sm:text-base text-blanco-lunar px-8 py-4 rounded-2xl bg-terracota transition-all duration-300 shadow-2xl hover:shadow-[0_12px_35px_rgba(193,91,58,0.7)] hover:scale-105"
              >
                <span>Ver faenas y próximas actividades</span>
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>

          {/* COLUMNA DERECHA (OBRAS Y PUBLICACIONES DE LA TRIBU EN LINKEDIN) */}
          <div className="relative w-full">
            
            {/* Header Nav del Carrusel */}
            <div className="flex items-center justify-between font-inter text-xs text-amber-400 font-bold mb-3 px-1">
              <span>
                🖼️ Obra de la Tribu ({currentSlide + 1} de {posts.length})
              </span>

              {/* Botones de Navegación Nav */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Post anterior"
                  aria-controls="carousel"
                  tabIndex={0}
                  className="cursor-pointer w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-blanco-lunar hover:bg-amber-500 hover:text-azul-noche transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Post siguiente"
                  aria-controls="carousel"
                  tabIndex={0}
                  className="cursor-pointer w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-blanco-lunar hover:bg-amber-500 hover:text-azul-noche transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  →
                </button>
              </div>
            </div>

            {/* MARCO CEREMONIAL SIN IFRAMES CON GUARDIÁN Y VER POST EN LINKEDIN */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPost.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                role="region"
                aria-live="polite"
                aria-label="LinkedIn post carousel"
                className="relative rounded-3xl overflow-hidden border-2 border-terracota/40 bg-azul-noche/95 shadow-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between min-h-[340px]"
              >
                {/* HEADER CON GUARDIÁN Y DATOS */}
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-terracota/20 border border-terracota/40 p-2 flex items-center justify-center relative shadow-lg flex-shrink-0">
                      <Image
                        src="/png/tlacu.png"
                        alt="Guardián Tlacu"
                        width={44}
                        height={44}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-inter text-xs text-amber-400 font-bold block uppercase tracking-wider">
                        ✦ Obra de la Tribu Tequio
                      </span>
                      <h4 className="font-inter text-sm font-bold text-blanco-lunar">
                        {currentPost.authorName || "Integrante de la Comunidad"}
                      </h4>
                      <span className="font-inter text-[11px] text-arena/60">
                        📅 {currentPost.date}
                      </span>
                    </div>
                  </div>

                  <span className="font-inter text-[10px] uppercase font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                    LinkedIn Verified ✓
                  </span>
                </div>

                {/* TÍTULO Y CITA */}
                <div className="space-y-3 flex-1">
                  <h3 className="font-cinzel text-blanco-lunar text-xl sm:text-2xl font-bold leading-snug">
                    {currentPost.title}
                  </h3>
                  <p className="font-inter text-arena/85 text-xs sm:text-sm leading-relaxed">
                    &quot;Construyendo en colectivo y dejando huella viva en el ecosistema tecnológico.&quot;
                  </p>
                </div>

                {/* FOOTER CON BOTÓN DIRECTO A LINKEDIN */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <span className="font-inter text-xs text-arena/60">
                    Comunidad Tequio ✦
                  </span>

                  <a
                    href={currentPost.linkedinPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-inter font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-terracota text-blanco-lunar px-5 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <span>Ver Post en LinkedIn</span>
                    <span>↗</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* DOTS DE NAVEGACIÓN */}
            <div className="flex justify-center gap-2 pt-4">
              {posts.map((post, idx) => (
                <button
                  key={post.id}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Ir al post ${idx + 1}`}
                  className={`cursor-pointer h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? "w-8 bg-amber-400 shadow-[0_0_10px_#F5A623]"
                      : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
