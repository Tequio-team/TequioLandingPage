"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BrasaParticles from "@/components/ui/BrasaParticles";
import LinkedInEmbedCard from "@/components/ui/LinkedInEmbedCard";

const DEFAULT_POSTS: Array<{
  id: string;
  title: string;
  date: string;
  guardianTag: string;
  sealStamp: string;
  linkedinPostUrl: string;
  description: string;
  impactMetrics: string[];
  authorName?: string;
}> = [
  {
    id: "post-1",
    title: "Impulso a la Comunidad — Faena Tequio en LinkedIn",
    date: "28 de Agosto, 2026",
    guardianTag: "🦝 Tlacu · Forja Comunitaria",
    sealStamp: "✦ FAENA OFICIAL CUMPLIDA ✦",
    linkedinPostUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/",
    description: "Publicación oficial sobre el impacto y los logros alcanzados en la faena comunitaria.",
    impactMetrics: ["📊 +1,200 Impresiones en LinkedIn", "🚀 42 Desarrolladores sumados"],
  },
  {
    id: "post-2",
    title: "Caravana y Encuentro Tech — Registro de Miembro",
    date: "20 de Agosto, 2026",
    guardianTag: "🪶 Kuku · Caravana del Vuelo",
    sealStamp: "✦ PUBLICACIÓN DE LA TRIBU ✦",
    linkedinPostUrl: "https://lnkd.in/p/g-Dc7yaS",
    description: "Testimonio publicado por integrante de la comunidad Tequio sobre la experiencia en caravana.",
    impactMetrics: ["🌟 Testimonio de la Tribu", "👥 Asistencia en Grupo"],
  },
];

export default function CommitmentSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
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
              guardianTag: g.guardian_tag || "🦝 Tribu Tequio",
              sealStamp: g.seal_stamp || "✦ SELLO DE MAYORDOMÍA ✦",
              linkedinPostUrl: g.linkedin_post_url,
              description: g.description,
              authorName: g.author_name,
              impactMetrics: Array.isArray(g.impact_metrics) ? g.impact_metrics : [],
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
      ref={ref}
      className="relative py-28 overflow-hidden bg-azul-noche"
      style={{
        background: `
          radial-gradient(ellipse at 20% 100%, rgba(193, 91, 58, 0.3) 0%, transparent 65%),
          linear-gradient(to bottom, #0F172A 0%, #1F1A2C 50%, #0d0f1a 100%)
        `,
      }}
    >
      <BrasaParticles count={45} className="z-0 opacity-80" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* LAYOUT EN 2 COLUMNAS: IZQUIERDA (ESLOGAN) / DERECHA (POST LINKEDIN + OVERLAY CON TLACU) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA (50% / ESLOGAN & MANIFIESTO) */}
          <motion.div
            className="lg:col-span-6 space-y-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold block">
              ✦ Nuestro Compromiso ✦
            </span>

            <h2 className="font-cinzel text-blanco-lunar text-3xl md:text-5xl leading-tight font-bold">
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
          </motion.div>

          {/* COLUMNA DERECHA (50% / POST DE LINKEDIN + OVERLAY CON TLACU Y VER POST) */}
          <motion.div
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
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
                  className="cursor-pointer w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-blanco-lunar hover:bg-amber-500 hover:text-azul-noche transition-all"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Post siguiente"
                  className="cursor-pointer w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-blanco-lunar hover:bg-amber-500 hover:text-azul-noche transition-all"
                >
                  →
                </button>
              </div>
            </div>

            {/* VISTA ESPECIAL CON OVERLAY: LINKEDIN EMBED + TLACU CON OPACIDAD Y BOTÓN DE ACCIÓN */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPost.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl overflow-hidden border-2 border-terracota/40 bg-azul-noche/90 shadow-2xl"
              >
                {/* TARJETA DE LINKEDIN */}
                <LinkedInEmbedCard
                  id={currentPost.id}
                  title={currentPost.title}
                  date={currentPost.date}
                  guardianTag={currentPost.guardianTag}
                  sealStamp={currentPost.sealStamp}
                  linkedinPostUrl={currentPost.linkedinPostUrl}
                  description={currentPost.description}
                  impactMetrics={currentPost.impactMetrics}
                  authorName={currentPost.authorName}
                  sizeVariant="tall"
                />

                {/* OVERLAY MÍSTICO INFERIOR CON TLACU FLOTANTE EN OPACIDAD */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-azul-noche via-azul-noche/90 to-transparent z-30 flex items-end justify-between gap-4 border-t border-white/10">
                  
                  {/* TLACU EN OPACIDAD SUTIL A LA IZQUIERDA DEL OVERLAY */}
                  <div className="flex items-center gap-3 relative">
                    <div className="relative w-14 h-16 opacity-30 flex-shrink-0">
                      <Image
                        src="/png/tlacu.png"
                        alt="Tlacu el Tlacuache-Jaguar"
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <span className="font-inter text-[10px] uppercase font-bold text-terracota block">
                        ✦ Obra Registrada ✦
                      </span>
                      <h4 className="font-cinzel text-blanco-lunar text-sm font-bold line-clamp-1">
                        {currentPost.title}
                      </h4>
                    </div>
                  </div>

                  {/* BOTÓN DIRECTO VER EN LINKEDIN */}
                  <a
                    href={currentPost.linkedinPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-inter font-bold text-xs bg-amber-500 text-azul-noche px-4 py-2.5 rounded-xl shadow-lg hover:bg-amber-400 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-1.5"
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
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Ir al post ${idx + 1}`}
                  className={`cursor-pointer h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? "w-8 bg-amber-400 shadow-[0_0_10px_#F5A623]"
                      : "w-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
