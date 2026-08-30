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
  description?: string;
  impactMetrics?: string[];
  authorName?: string;
  tags?: string[];
  onOpenDetail?: (item: any) => void;
}

export function formatLinkedInEmbedUrl(url?: string): string | null {
  if (!url) return null;
  
  const cleanUrl = url.trim();

  // Already formatted embed URL
  if (cleanUrl.includes("/embed/feed/update/")) return cleanUrl;

  // Extract activity, share, or ugcPost URN with digits or codes
  const urnMatch = cleanUrl.match(/urn:li:(activity|share|ugcPost):([a-zA-Z0-9_-]+)/i);
  if (urnMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:${urnMatch[1].toLowerCase()}:${urnMatch[2]}`;
  }

  // Extract 18-20 digit activity ID from URLs (e.g. 7493522800209661952)
  const digitMatch = cleanUrl.match(/([0-9]{18,20})/);
  if (digitMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${digitMatch[1]}`;
  }

  // Extract shortcode from short links (e.g. https://lnkd.in/p/g4_eGX8s or lnkd.in/g4_eGX8s)
  const shortMatch = cleanUrl.match(/lnkd\.in\/(?:p\/)?([a-zA-Z0-9_-]+)/i);
  if (shortMatch) {
    const code = shortMatch[1];
    return `https://www.linkedin.com/embed/feed/update/urn:li:share:${code}`;
  }

  return cleanUrl;
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
  imgSrc = "/jpg/moment1.jpg",
  description,
  impactMetrics = [],
  authorName,
  tags = [],
  onOpenDetail,
}: LinkedInEmbedCardProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const embedUrl = formatLinkedInEmbedUrl(linkedinPostUrl);

  // Responsive Height mapping for 2-column mobile Pinterest and desktop
  const heightMap: Record<CardSizeVariant, { mediaH: string; pxVal: number }> = {
    tall: { mediaH: "h-[220px] sm:h-[380px]", pxVal: 380 },
    medium: { mediaH: "h-[180px] sm:h-[310px]", pxVal: 310 },
    standard: { mediaH: "h-[150px] sm:h-[260px]", pxVal: 260 },
    compact: { mediaH: "h-[120px] sm:h-[210px]", pxVal: 210 },
  };

  const currentSize = heightMap[sizeVariant] || heightMap.standard;

  // Derive initials for avatar
  const initials = (authorName || "Tequio Tribu")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

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
        imgSrc,
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
      className="break-inside-avoid mb-3.5 sm:mb-6 rounded-2xl sm:rounded-3xl overflow-hidden bg-white/[0.035] border border-amber-500/20 flex flex-col justify-between shadow-xl relative group hover:border-amber-400 hover:shadow-[0_20px_45px_rgba(245,166,35,0.25)] transition-all duration-300 backdrop-blur-xl cursor-pointer select-none"
    >
      {/* 1. MEDIA CONTAINER (FOTO / IFRAME CON OVERLAY FLOTANTE ESTILO PINTEREST) */}
      <div className={`relative w-full bg-black/60 overflow-hidden ${currentSize.mediaH}`}>
        
        {/* SKELETON LOADER IF USING EMBED */}
        {embedUrl && !iframeLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-azul-noche via-white/10 to-azul-noche animate-pulse flex flex-col justify-between p-4 z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
              <div className="space-y-1 flex-1">
                <div className="h-2.5 bg-white/10 rounded w-2/3 animate-pulse" />
              </div>
            </div>
            <span className="font-inter text-[9px] text-amber-400 font-bold text-center">
              ⚡ Cargando post...
            </span>
          </div>
        )}

        {/* IMAGE PREVIEW OR LIVE EMBED */}
        {embedUrl ? (
          <iframe
            src={embedUrl}
            height={currentSize.pxVal}
            width="100%"
            frameBorder="0"
            allowFullScreen={false}
            title={title}
            onLoad={() => setIframeLoaded(true)}
            className={`w-full ${currentSize.mediaH} transition-opacity duration-500 ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-azul-noche via-black/20 to-black/10 group-hover:opacity-75 transition-opacity duration-300" />
          </div>
        )}

        {/* PINTEREST FLOATING ACTION BUTTONS (VISIBLE EN MOBILE Y EN DESKTOP AL HOVER) */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 p-2 sm:p-3.5 flex flex-col justify-between z-20 ${
            isHovered ? "opacity-100" : "opacity-90 sm:opacity-0"
          }`}
        >
          {/* TOP BAR: GUARDIAN PILL (LEFT) + SAVE / LINK BUTTON (RIGHT) */}
          <div className="flex items-center justify-between gap-1.5 pointer-events-auto">
            <span className="font-inter text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-azul-noche/90 text-amber-300 border border-amber-400/40 shadow-lg backdrop-blur-md truncate max-w-[65%] sm:max-w-none">
              {guardianTag || "✦ Tequio"}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyLink}
                title="Copiar enlace"
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-azul-noche/90 hover:bg-white/20 text-blanco-lunar border border-white/20 flex items-center justify-center text-[10px] sm:text-xs transition-all shadow-lg backdrop-blur-md"
              >
                {copied ? "✓" : "🔗"}
              </button>

              {linkedinPostUrl && (
                <a
                  href={linkedinPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-inter font-bold text-[10px] sm:text-xs bg-amber-500 hover:bg-amber-400 text-azul-noche px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-xl transition-all hover:scale-105 inline-flex items-center gap-0.5 sm:gap-1"
                >
                  <span className="hidden sm:inline">LinkedIn</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>

          {/* BOTTOM BAR: QUICK EXPAND HINT */}
          <div className="pointer-events-auto flex items-center justify-between">
            <span className="font-inter text-[9px] sm:text-[11px] font-bold text-blanco-lunar bg-black/70 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 flex items-center gap-1">
              <span>🔍</span>
              <span className="hidden sm:inline">Ver detalle</span>
            </span>

            {sealStamp && (
              <span className="font-inter text-[8px] sm:text-[9px] uppercase font-bold text-amber-300 bg-amber-500/20 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded border border-amber-400/30 truncate max-w-[80px] sm:max-w-none">
                {sealStamp}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. PIN METADATA & CREATOR DETAILS */}
      <div className="p-3 sm:p-5 space-y-2 sm:space-y-3 bg-azul-noche/90 backdrop-blur-md flex-1 flex flex-col justify-between">
        <div className="space-y-1.5 sm:space-y-2">
          
          {/* CREATOR PROFILE ROW (AVATAR + NAME + DATE) */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-terracota via-amber-500 to-amber-300 text-azul-noche font-inter font-extrabold text-[9px] sm:text-[11px] flex items-center justify-center shadow-md flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <span className="font-inter text-[11px] sm:text-xs font-bold text-blanco-lunar truncate">
                {authorName || "Tribu Tequio"}
              </span>
              <span className="font-inter text-[9px] sm:text-[10px] text-arena/60 ml-1 whitespace-nowrap">
                {date}
              </span>
            </div>
          </div>

          {/* PIN TITLE */}
          <h3 className="font-cinzel text-blanco-lunar text-xs sm:text-base md:text-lg font-bold leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* DESCRIPTION EXCERPT */}
          {description && (
            <p className="font-inter text-arena/80 text-[10px] sm:text-xs leading-relaxed line-clamp-2 hidden sm:block">
              {description}
            </p>
          )}

          {/* TAGS OR IMPACT METRICS */}
          {impactMetrics && impactMetrics.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {impactMetrics.slice(0, 1).map((m: string, idx: number) => (
                <span
                  key={idx}
                  className="font-inter text-[9px] sm:text-[10px] text-amber-300 font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 truncate"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER ROW */}
        <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[11px] font-inter text-arena/70">
          <span className="flex items-center gap-0.5 sm:gap-1 text-amber-400 font-semibold text-[9px] sm:text-[10px]">
            <span>✦</span>
            <span>Tequio</span>
          </span>

          <span className="text-amber-400/90 group-hover:text-amber-300 font-bold group-hover:translate-x-0.5 transition-all inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
            <span>Ver</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

