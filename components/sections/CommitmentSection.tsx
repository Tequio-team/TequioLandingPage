"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BrasaParticles from "@/components/ui/BrasaParticles";

const DEFAULT_POSTS = [
  {
    id: "post-1",
    authorName: "Sofía Morales",
    quote: "Aprender en comunidad rompió el miedo a programar en proyectos reales con impacto tangible.",
    eventTitle: "Hackathon por la Comunidad: Código Abierto con Causa",
    linkedinPostUrl: "https://www.linkedin.com/posts/sofia-morales-tequio-faena",
    guardian: "tlacu",
  },
  {
    id: "post-2",
    authorName: "David Reyes",
    quote: "El verdadero poder del software está en poner el conocimiento al servicio de los demás.",
    eventTitle: "De Estudiante a Tech Lead: El Camino Sin Secretos",
    linkedinPostUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/",
    guardian: "tochtli",
  },
  {
    id: "post-3",
    authorName: "Carlos Mendoza",
    quote: "Caminar en tribu te impulsa a llegar más lejos de lo que jamás imaginaste solo.",
    eventTitle: "Caravana al DevFest CDMX 2026",
    linkedinPostUrl: "https://www.linkedin.com/posts/carlos-mendoza-talent-land-tequio",
    guardian: "kuku",
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
              authorName: g.author_name,
              quote: g.quote || "Construyendo en colectivo y dejando huella viva.",
              eventTitle: g.event_title || "Faena Comunitaria",
              linkedinPostUrl: g.linkedin_post_url,
              guardian: g.guardian || "tlacu",
            }))
          );
        }
      } catch (err) {
        console.warn("Usando posts locales por defecto:", err);
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

  const guardianAvatar =
    currentPost.guardian === "tochtli"
      ? "/png/tochtli.png"
      : currentPost.guardian === "kuku"
      ? "/png/kuku.png"
      : "/png/tlacu.png";

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

          {/* COLUMNA DERECHA (MEMORIA VIVA DE LA TRIBU) */}
          <div className="relative w-full">
            {/* Header Nav del Carrusel */}
            <div className="flex items-center justify-between font-inter text-xs text-amber-400 font-bold mb-3 px-1">
              <span>
                🖼️ Memoria Viva ({currentSlide + 1} de {posts.length})
              </span>

              {/* Botones de Navegación */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Post anterior"
                  className="cursor-pointer w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-blanco-lunar hover:bg-amber-500 hover:text-azul-noche transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Post siguiente"
                  className="cursor-pointer w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-blanco-lunar hover:bg-amber-500 hover:text-azul-noche transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  →
                </button>
              </div>
            </div>

            {/* TARJETA DE MEMORIA VIVA */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPost.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl overflow-hidden border-2 border-terracota/40 bg-azul-noche/95 shadow-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between min-h-[320px]"
              >
                {/* HEADER CON AVATAR, AUTOR Y BADGE */}
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-terracota/20 border border-terracota/40 p-1.5 flex items-center justify-center relative shadow-lg flex-shrink-0">
                      <Image
                        src={guardianAvatar}
                        alt="Guardián"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-inter text-base font-bold text-blanco-lunar">
                        {currentPost.authorName}
                      </h4>
                      <span className="font-inter text-xs text-amber-400 font-semibold block">
                        LinkedIn Verificado ✓
                      </span>
                    </div>
                  </div>

                  <span className="font-inter text-[10px] uppercase font-bold text-terracota bg-terracota/15 px-3 py-1 rounded-full border border-terracota/30 max-w-[180px] truncate">
                    {currentPost.eventTitle}
                  </span>
                </div>

                {/* FRASE / REFLEXIÓN CORTA (MAX 50 PALABRAS) */}
                <div className="space-y-3 flex-1">
                  <p className="font-inter text-blanco-lunar text-base sm:text-lg italic font-medium leading-relaxed">
                    &ldquo;{currentPost.quote}&rdquo;
                  </p>
                </div>

                {/* FOOTER CON BOTÓN DIRECTO A LINKEDIN */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <span className="font-inter text-xs text-arena/60">
                    Memoria de la Tribu ✦
                  </span>

                  <a
                    href={currentPost.linkedinPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-inter font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-terracota text-blanco-lunar px-5 py-2.5 rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <span>Ver publicación en LinkedIn</span>
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
