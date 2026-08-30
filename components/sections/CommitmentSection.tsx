"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
      <BrasaParticles count={50} className="z-0 opacity-85" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 space-y-12 text-center">
        
        {/* Frase de Compromiso (Manifiesto) */}
        <motion.div
          className="max-w-4xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-inter text-terracota text-xs md:text-sm uppercase tracking-[0.25em] font-semibold block">
            ✦ Nuestro Compromiso ✦
          </span>
          <p className="font-cinzel text-blanco-lunar text-2xl md:text-4xl leading-relaxed font-bold">
            &quot;Quien entra a Tequio no solo busca crecer profesionalmente; asume el compromiso de poner su piedra en la obra colectiva. Aquí construimos tecnología con causa y dejamos huella en la red.&quot;
          </p>
        </motion.div>

        {/* VISOR DE POSTS DE LINKEDIN UNO A UNO CON CONTROLES NAV */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-2xl mx-auto space-y-6"
        >
          {/* Header Indicador del Post Actual */}
          <div className="flex items-center justify-between font-inter text-xs text-amber-400 font-bold px-2">
            <span>
              🖼️ Publicación de la Tribu ({currentSlide + 1} de {posts.length})
            </span>

            {/* Controles Nav Flechas */}
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

          {/* RENDERIZADO DEL POST ACTUAL DE LINKEDIN UNO A UNO */}
          <AnimatePresence mode="wait">
            <motion.div
              key={posts[currentSlide]?.id || currentSlide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-left"
            >
              {posts[currentSlide] && (
                <LinkedInEmbedCard
                  id={posts[currentSlide].id}
                  title={posts[currentSlide].title}
                  date={posts[currentSlide].date}
                  guardianTag={posts[currentSlide].guardianTag}
                  sealStamp={posts[currentSlide].sealStamp}
                  linkedinPostUrl={posts[currentSlide].linkedinPostUrl}
                  description={posts[currentSlide].description}
                  impactMetrics={posts[currentSlide].impactMetrics}
                  authorName={posts[currentSlide].authorName}
                  sizeVariant="tall"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* NAV DOTS */}
          <div className="flex justify-center gap-2 pt-2">
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

        {/* Botón CTA Principal */}
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
            <span className="tracking-wide">Ver todas las obras en la Memoria Colectiva</span>
            <span className="text-2xl">→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
