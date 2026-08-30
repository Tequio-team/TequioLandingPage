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

const GUARDIAN_CONFIG = {
  tochtli: {
    name: "Tochtli",
    avatarSrc: "/png/tochtli.png",
    color: "#F5A623",
    badgeEmoji: "🐰",
    gradient: "from-amber-500/15 to-transparent",
    borderColor: "rgba(245,166,35,0.25)",
    borderHoverColor: "rgba(245,166,35,0.5)",
  },
  tlacu: {
    name: "Tlacu",
    avatarSrc: "/png/tlacu.png",
    color: "#C15B3A",
    badgeEmoji: "🦝",
    gradient: "from-terracota/15 to-transparent",
    borderColor: "rgba(193,91,58,0.25)",
    borderHoverColor: "rgba(193,91,58,0.5)",
  },
  kuku: {
    name: "Kuku",
    avatarSrc: "/png/kuku.png",
    color: "#10b981",
    badgeEmoji: "🪶",
    gradient: "from-emerald-500/15 to-transparent",
    borderColor: "rgba(16,185,129,0.25)",
    borderHoverColor: "rgba(16,185,129,0.5)",
  },
};

export default function LinkedInEmbedCard({
  id,
  index = 0,
  authorName,
  eventTitle,
  quote,
  linkedinPostUrl,
  guardian = "tlacu",
}: LinkedInEmbedCardProps) {
  const [copied, setCopied] = useState(false);

  const gKey = (guardian?.toLowerCase() || "tlacu") as keyof typeof GUARDIAN_CONFIG;
  const gInfo = GUARDIAN_CONFIG[gKey] ?? GUARDIAN_CONFIG.tlacu;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkedinPostUrl) {
      navigator.clipboard?.writeText(linkedinPostUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Stagger entrance: alternating from left/right
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -28 : 28, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        // Use spring for entrance — feels natural
        type: "spring",
        stiffness: 80,
        damping: 18,
        mass: 0.9,
        delay: Math.min((index % 6) * 0.07, 0.35),
      }}
      whileHover={{ y: -5, scale: 1.015 }}
      // Keep whileHover transition separate and snappy
      // @ts-ignore — custom transition per gesture is valid in Framer Motion
      hoverTransition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl relative group select-none p-5 sm:p-6 space-y-4"
      style={{
        background: "rgba(15, 23, 42, 0.88)",
        border: `1px solid ${gInfo.borderColor}`,
        // Only animate border-color and box-shadow with CSS — transform via FM
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
      // Dynamic border glow on hover via CSS custom properties approach
      onHoverStart={(e) => {
        const target = e.target as HTMLElement;
        const card = target.closest("[data-card]") as HTMLElement | null;
        if (card) {
          card.style.borderColor = gInfo.borderHoverColor;
          card.style.boxShadow = `0 18px 40px rgba(0,0,0,0.3), 0 0 0 1px ${gInfo.borderHoverColor}`;
        }
      }}
      onHoverEnd={(e) => {
        const target = e.target as HTMLElement;
        const card = target.closest("[data-card]") as HTMLElement | null;
        if (card) {
          card.style.borderColor = gInfo.borderColor;
          card.style.boxShadow = "";
        }
      }}
      data-card=""
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center p-1 shadow-md flex-shrink-0"
            style={{
              background: `radial-gradient(circle, ${gInfo.color}25 0%, rgba(255,255,255,0.04) 100%)`,
              border: `1px solid ${gInfo.color}50`,
            }}
          >
            <Image
              src={gInfo.avatarSrc}
              alt={gInfo.name}
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
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-blanco-lunar border border-white/15 flex items-center justify-center text-[10px] transition-colors shadow flex-shrink-0"
        >
          {copied ? "✓" : "🔗"}
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-inter text-[10px] uppercase font-bold text-terracota bg-terracota/12 px-2.5 py-1 rounded-full border border-terracota/25 truncate max-w-full">
            📍 {eventTitle || "Faena Comunitaria"}
          </span>
        </div>

        <p className="font-inter text-blanco-lunar text-sm sm:text-base leading-relaxed italic font-medium">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* FOOTER */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <span className="font-inter text-[11px] text-arena/55">
          Memoria Viva ✦
        </span>

        {linkedinPostUrl && (
          <a
            href={linkedinPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter font-bold text-xs bg-gradient-to-r from-amber-500 to-terracota hover:from-amber-400 hover:to-orange-500 text-blanco-lunar px-4 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-1.5"
          >
            <span>Ver en LinkedIn</span>
            <span className="text-sm">↗</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
