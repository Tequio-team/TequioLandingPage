"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface LinkedInEmbedCardProps {
  id: string;
  index?: number;
  authorName: string;
  eventTitle: string;
  quote: string;
  linkedinPostUrl: string;
  guardian?: "tochtli" | "tlacu" | "kuku" | string;
  createdDate?: string;
}

export function formatLinkedInEmbedUrl(url?: string): string | null {
  if (!url) return null;
  return url.trim();
}

export default function LinkedInEmbedCard({
  id,
  index = 0,
  authorName,
  eventTitle,
  quote,
  linkedinPostUrl,
  guardian = "tlacu",
  createdDate = "Reciente",
}: LinkedInEmbedCardProps) {
  const [copied, setCopied] = useState(false);

  const gKey = guardian?.toLowerCase() || "tlacu";

  const guardianInfo = {
    tochtli: {
      name: "Tochtli",
      avatarSrc: "/png/tochtli.png",
      color: "#F5A623",
      badgeEmoji: "🐰",
      gradient: "from-amber-500/20 via-white/5 to-transparent",
      borderColor: "border-amber-500/30",
    },
    tlacu: {
      name: "Tlacu",
      avatarSrc: "/png/tlacu.png",
      color: "#C15B3A",
      badgeEmoji: "🦝",
      gradient: "from-terracota/20 via-white/5 to-transparent",
      borderColor: "border-terracota/30",
    },
    kuku: {
      name: "Kuku",
      avatarSrc: "/png/kuku.png",
      color: "#10b981",
      badgeEmoji: "🪶",
      gradient: "from-emerald-500/20 via-white/5 to-transparent",
      borderColor: "border-emerald-500/30",
    },
  }[gKey] || {
    name: "Tlacu",
    avatarSrc: "/png/tlacu.png",
    color: "#C15B3A",
    badgeEmoji: "🦝",
    gradient: "from-terracota/20 via-white/5 to-transparent",
    borderColor: "border-terracota/30",
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkedinPostUrl) {
      navigator.clipboard?.writeText(linkedinPostUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`w-full break-inside-avoid sm:mb-6 rounded-3xl overflow-hidden bg-gradient-to-b ${guardianInfo.gradient} border ${guardianInfo.borderColor} flex flex-col justify-between shadow-xl relative group hover:border-amber-400 hover:shadow-[0_20px_45px_rgba(245,166,35,0.2)] transition-all duration-300 backdrop-blur-xl select-none p-5 sm:p-6 space-y-4`}
      style={{
        background: "rgba(15, 23, 42, 0.85)",
      }}
    >
      {/* 1. HEADER: GUARDIÁN + NOMBRE + FECHA */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center relative p-1 shadow-md flex-shrink-0"
            style={{
              background: `radial-gradient(circle, ${guardianInfo.color}30 0%, rgba(255,255,255,0.05) 100%)`,
              border: `1px solid ${guardianInfo.color}60`,
            }}
          >
            <Image
              src={guardianInfo.avatarSrc}
              alt={guardianInfo.name}
              width={34}
              height={34}
              className="object-contain"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="font-inter text-sm font-bold text-blanco-lunar truncate">
              {authorName || "Integrante de Tequio"}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-arena/60">
              <span className="text-amber-400 font-semibold">LinkedIn Verificado ✓</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          title="Copiar enlace de LinkedIn"
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-blanco-lunar border border-white/15 flex items-center justify-center text-[10px] transition-all shadow flex-shrink-0"
        >
          {copied ? "✓" : "🔗"}
        </button>
      </div>

      {/* 2. CONTENIDO: EVENTO AL QUE ASISTIÓ Y FRASE CORTA */}
      <div className="space-y-3 flex-1">
        {/* Badge del Evento */}
        <div className="flex items-center gap-1.5">
          <span className="font-inter text-[10px] uppercase font-bold text-terracota bg-terracota/15 px-2.5 py-1 rounded-full border border-terracota/30 truncate max-w-full">
            📍 {eventTitle || "Faena Comunitaria"}
          </span>
        </div>

        {/* Frase / Reflexión corta (<= 50 palabras) */}
        <p className="font-inter text-blanco-lunar text-sm sm:text-base leading-relaxed italic font-medium">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* 3. FOOTER: VER PUBLICACIÓN EN LINKEDIN */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <span className="font-inter text-[11px] text-arena/60">
          Memoria Viva ✦
        </span>

        {linkedinPostUrl && (
          <a
            href={linkedinPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter font-bold text-xs bg-gradient-to-r from-amber-500 to-terracota hover:from-amber-400 hover:to-orange-500 text-blanco-lunar px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105 inline-flex items-center gap-1.5"
          >
            <span>Ver publicación en LinkedIn</span>
            <span className="text-sm">↗</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
