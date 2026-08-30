"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export type CardSizeVariant = "tall" | "compact" | "medium" | "standard";

export interface LinkedInEmbedCardProps {
  id: string;
  index?: number;
  sizeVariant?: CardSizeVariant;
  title: string;
  date: string;
  guardianTag: string;
  sealStamp?: string;
  linkedinPostUrl: string;
  imgSrc?: string;
  avatarGuardian?: "tochtli" | "tlacu" | "kuku" | string;
  description?: string;
  impactMetrics?: string[];
  authorName?: string;
  tags?: string[];
  onOpenDetail?: (item: any) => void;
}

export function formatLinkedInEmbedUrl(url?: string): string | null {
  if (!url) return null;
  return url.trim();
}

export default function LinkedInEmbedCard({
  id,
  index = 0,
  sizeVariant = "standard",
  title,
  date,
  guardianTag,
  sealStamp,
  linkedinPostUrl,
  imgSrc,
  avatarGuardian,
  description,
  impactMetrics = [],
  authorName,
  tags = [],
  onOpenDetail,
}: LinkedInEmbedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  // Determine guardian key
  const gKey = avatarGuardian?.toLowerCase() || (guardianTag?.toLowerCase().includes("tochtli") ? "tochtli" : guardianTag?.toLowerCase().includes("kuku") ? "kuku" : "tlacu");

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
    name: "Tribu",
    avatarSrc: "/png/tlacu.png",
    color: "#F5A623",
    badgeEmoji: "✦",
    gradient: "from-amber-500/20 via-white/5 to-transparent",
    borderColor: "border-amber-500/30",
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkedinPostUrl) {
      navigator.clipboard?.writeText(linkedinPostUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail({
        id,
        title,
        date,
        guardianTag,
        sealStamp,
        linkedinPostUrl,
        avatarGuardian: gKey,
        description,
        impactMetrics,
        authorName,
        tags,
        sizeVariant,
      });
    }
  };

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={`w-full break-inside-avoid sm:mb-6 rounded-3xl overflow-hidden bg-gradient-to-b ${guardianInfo.gradient} border ${guardianInfo.borderColor} flex flex-col justify-between shadow-xl relative group hover:border-amber-400 hover:shadow-[0_20px_45px_rgba(245,166,35,0.2)] transition-all duration-300 backdrop-blur-xl cursor-pointer select-none p-4 sm:p-6 space-y-4`}
      style={{
        background: "rgba(15, 23, 42, 0.85)",
      }}
    >
      {/* 1. HEADER CON AVATAR DEL GUARDIÁN ESCOGIDO + DATOS DEL AUTOR */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* AVATAR ILUSTRADO DEL GUARDIÁN */}
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center relative p-1.5 shadow-md flex-shrink-0"
            style={{
              background: `radial-gradient(circle, ${guardianInfo.color}30 0%, rgba(255,255,255,0.05) 100%)`,
              border: `1px solid ${guardianInfo.color}60`,
            }}
          >
            <Image
              src={guardianInfo.avatarSrc}
              alt={guardianInfo.name}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          {/* NOMBRE DEL AUTOR Y FECHA */}
          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="font-inter text-xs sm:text-sm font-bold text-blanco-lunar truncate">
              {authorName || "Integrante de Tequio"}
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-arena/60 truncate">
              <span style={{ color: guardianInfo.color }} className="font-bold">
                {guardianInfo.badgeEmoji} {guardianInfo.name}
              </span>
              <span>·</span>
              <span>{date}</span>
            </div>
          </div>
        </div>

        {/* BOTÓN COPIAR ENLACE RÁPIDO */}
        <button
          onClick={handleCopyLink}
          title="Copiar enlace"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-blanco-lunar border border-white/15 flex items-center justify-center text-[10px] sm:text-xs transition-all shadow flex-shrink-0"
        >
          {copied ? "✓" : "🔗"}
        </button>
      </div>

      {/* 2. CONTENIDO PRINCIPAL: TÍTULO Y DESCRIPCIÓN DEL EVENTO / HISTORIA */}
      <div className="space-y-2.5 flex-1">
        {/* TAG DE LA FAENA */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-inter text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-amber-300 border border-amber-400/30 truncate">
            {guardianTag || "✦ Obra Comunitaria"}
          </span>
          {sealStamp && (
            <span className="font-inter text-[9px] uppercase font-bold text-arena/60 hidden sm:inline">
              {sealStamp}
            </span>
          )}
        </div>

        {/* TÍTULO */}
        <h3 className="font-cinzel text-blanco-lunar text-sm sm:text-base md:text-lg font-bold leading-snug group-hover:text-amber-300 transition-colors">
          {title}
        </h3>

        {/* DESCRIPCIÓN COMPLETA DE LA EXPERIENCIA / EVENTO */}
        {description && (
          <p className="font-inter text-arena/85 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
            {description}
          </p>
        )}

        {/* IMPACT METRICS & TAGS */}
        {impactMetrics && impactMetrics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {impactMetrics.map((m: string, idx: number) => (
              <span
                key={idx}
                className="font-inter text-[10px] sm:text-[11px] text-amber-300 font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. FOOTER CON BOTÓN DIRECTO A LINKEDIN */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <span className="font-inter text-[10px] sm:text-xs text-arena/60">
          Comunidad Tequio ✦
        </span>

        {linkedinPostUrl && (
          <a
            href={linkedinPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-inter font-bold text-[11px] sm:text-xs bg-amber-500 hover:bg-amber-400 text-azul-noche px-3.5 sm:px-4 py-2 rounded-xl shadow-lg transition-all hover:scale-105 inline-flex items-center gap-1.5"
          >
            <span>Ver en LinkedIn</span>
            <span>↗</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}


