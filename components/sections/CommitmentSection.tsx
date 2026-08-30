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
  const [iframeLoaded, setIframeLoaded] = useState(false);

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
    setIframeLoaded(false);
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setIframeLoaded(false);
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const currentPost = posts[currentSlide] || posts[0];
  const embedUrl = formatLinkedInEmbedUrl(currentPost?.linkedinPostUrl);
  const isShortLink = currentPost?.linkedinPostUrl?.includes("lnkd.in");

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
      <BrasaParticles count={45} className="z-0 opacity-40 md:opacity-80" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* LAYOUT EN 2 COLUMNAS: IZQUIERDA (ESLOGAN) / DERECHA (POST LINKEDIN + OVERLAY CON TLACU & TÍTULO) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA (50% / ESLOGAN & MANIFIESTO) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold block">
              ✦ Nuestro Compromiso ✦
            </span>

            <h2 className="font-cinzel text-blanco-lunar text-2xl sm:text-3xl md:text-5xl leading-tight font-bold">
              &quot;Poner nuestra piedra en la obra colectiva.&quot;
            </h2>

            <p className="font-inter text-arena text-base md:text-lg leading-relaxed opacity-90">
              Quien entra a Tequio no solo busca crecer profesionalmente; asume el compromiso de aprender en tribu, construir tecnología útil con causa y dejar una huella imborrable en la red.
            </p>

            <div className="pt-4">
              <Link
                href="/eventos"
                className="cursor-pointer inline-flex items-center gap-3 font-inter font-bold text-base text-blanco-lunar px-8 py-4 rounded-2xl bg-terracota transition-all duration-300 shadow-2xl hover:shadow-[0_12px_35px_rgba(193,91,58,0.7)] hover:scale-105"
              >
                <span>Ver faenas y próximas actividades</span>
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>

          {/* COLUMNA DERECHA (50% / POST EN VIVO DE LINKEDIN + OVERLAY CON TLACU, TÍTULO Y BOTÓN LINKEDIN) */}
          <div className="lg:col-span-6 relative">
            
            {/* Header Nav del Carrusel */}
            <div className="flex items-center justify-between font-inter text-xs text-amber-400 font-bold mb-3 px-1">
              <span>
                🖼️ Post en Vivo ({currentSlide + 1} de {posts.length})
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

            {/* MARCO ESPECIAL ULTRA-CLEAN CON IFRAME + OVERLAY CON TLACU Y VER POST */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPost.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                role="region"
                aria-live="polite"
                aria-label="LinkedIn post carousel"
                className="relative rounded-3xl overflow-hidden border-2 border-terracota/40 bg-azul-noche/95 shadow-2xl min-h-[440px] flex flex-col justify-between"
              >
                {/* IFRAME EN VIVO DE LINKEDIN */}
                <div className="relative w-full h-[400px] bg-black/60 overflow-hidden flex items-center justify-center">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-azul-noche via-white/10 to-azul-noche animate-pulse flex items-center justify-center z-10">
                      <span className="font-inter text-xs text-amber-400 font-bold">
                        ⚡ Cargando post en vivo...
                      </span>
                    </div>
                  )}

                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      height="400"
                      width="100%"
                      frameBorder="0"
                      allowFullScreen={false}
                      title={currentPost.title}
                      onLoad={() => setIframeLoaded(true)}
                      className={`w-full h-[400px] transition-opacity duration-300 ${
                        iframeLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ) : (
                    <div className="p-8 text-center space-y-3">
                      <span className="font-inter text-xs text-amber-400 font-bold uppercase tracking-widest block">
                        🔗 Publicación Oficial en LinkedIn
                      </span>
                      <p className="font-cinzel text-blanco-lunar text-lg font-bold">
                        {currentPost.title}
                      </p>
                    </div>
                  )}
                </div>

                {/* OVERLAY EXCLUSIVO: TLACU CON OPACIDAD + TÍTULO Y BOTÓN LINKEDIN */}
                <div className="p-5 bg-gradient-to-t from-azul-noche via-azul-noche/95 to-azul-noche/50 md:to-azul-noche/70 z-30 flex items-center justify-between gap-4 border-t border-white/10 relative overflow-hidden">
                  
                  <div className="absolute right-28 -bottom-4 w-28 h-28 opacity-25 pointer-events-none z-0">
                    <Image
                      src="/png/tlacu.png"
                      alt="Tlacu Guardián"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="space-y-0.5 relative z-10 max-w-[65%]">
                    <h4 className="font-cinzel text-blanco-lunar text-sm font-bold line-clamp-1">
                      {currentPost.title}
                    </h4>
                    {currentPost.authorName && (
                      <span className="font-inter text-[11px] text-arena/70 block italic">
                        Por: {currentPost.authorName}
                      </span>
                    )}
                  </div>

                  <a
                    href={currentPost.linkedinPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-inter font-bold text-xs bg-amber-500 text-azul-noche px-4 py-2.5 rounded-xl shadow-lg hover:bg-amber-400 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-1.5 relative z-10"
                  >
                    <span>Ver en LinkedIn</span>
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
                  onClick={() => {
                    setIframeLoaded(false);
                    setCurrentSlide(idx);
                  }}
                  aria-label={`Ir al post ${idx + 1}`}
                  className={`cursor-pointer h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? "w-8 bg-amber-400 shadow-[0_0_10px_#F5A623]"
                      : "w-2.5 bg-white/30 hover:bg-white/60"
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
