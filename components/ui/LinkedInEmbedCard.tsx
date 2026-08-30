"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export type CardSizeVariant = "tall" | "compact" | "medium" | "standard";

interface LinkedInEmbedCardProps {
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
}: LinkedInEmbedCardProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const embedUrl = formatLinkedInEmbedUrl(linkedinPostUrl);

  // Dynamic IFrame height mapping according to sizeVariant requested by user
  const heightMap: Record<CardSizeVariant, { iframeH: string; pxVal: number }> = {
    tall: { iframeH: "h-[420px]", pxVal: 420 },
    medium: { iframeH: "h-[350px]", pxVal: 350 },
    standard: { iframeH: "h-[300px]", pxVal: 300 },
    compact: { iframeH: "h-[250px]", pxVal: 250 },
  };

  const currentSize = heightMap[sizeVariant] || heightMap.standard;

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.14,
        ease: [0.22, 1, 0.36, 1], // Soft natural rise easing
      }}
      whileHover={{
        y: -6,
        opacity: 1,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      className="break-inside-avoid mb-6 rounded-2xl overflow-hidden bg-white/[0.03] border border-amber-500/25 flex flex-col justify-between shadow-xl relative group hover:border-amber-400 hover:shadow-[0_15px_35px_rgba(245,166,35,0.22)] transition-all duration-300 backdrop-blur-xl"
    >
      {/* SELLO CEREMONIAL FLOTANTE */}
      <div className="absolute right-2 bottom-2 sm:right-28 sm:bottom-4 w-28 h-28 opacity-25 pointer-events-none z-0">
        <span className="font-inter text-[9px] uppercase font-bold px-2.5 py-1 rounded-full bg-amber-500/90 text-azul-noche shadow-[0_0_12px_#F5A623] border border-amber-300 tracking-wider flex items-center gap-1">
          <span>✦</span>
          <span>{sealStamp || "✦ SELLO TEQUIO ✦"}</span>
        </span>
      </div>

      {/* CONTENEDOR CON ALTURA VARIABLE Y SKELETON LOADER */}
      <div
        className={`relative w-full bg-black/60 flex items-center justify-center overflow-hidden border-b border-white/10 ${currentSize.iframeH}`}
      >
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-azul-noche via-white/10 to-azul-noche animate-pulse flex flex-col justify-between p-6 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
              <div className="space-y-1 flex-1">
                <div className="h-3 bg-white/10 rounded w-2/3 animate-pulse" />
                <div className="h-2 bg-white/10 rounded w-1/3 animate-pulse" />
              </div>
            </div>
            <span className="font-inter text-[10px] text-amber-400 font-bold text-center animate-bounce">
              ⚡ Cargando post en vivo...
            </span>
          </div>
        )}

        {embedUrl ? (
          <iframe
            src={embedUrl}
            height={currentSize.pxVal}
            width="100%"
            frameBorder="0"
            allowFullScreen={false}
            title={title}
            onLoad={() => setIframeLoaded(true)}
            className={`w-full ${currentSize.iframeH} rounded-t-xl transition-opacity duration-700 ease-in-out ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 relative h-full w-full flex flex-col items-center justify-center p-5 text-center bg-white/5 space-y-2">
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 space-y-2">
              <span className="font-inter text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                🔗 Publicación compartida por la tribu
              </span>
              <p className="font-cinzel text-blanco-lunar text-sm font-bold line-clamp-2">
                {title}
              </p>
              <a
                href={linkedinPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer font-inter font-bold text-[11px] bg-amber-500 text-azul-noche px-4 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-md hover:bg-amber-400 transition-all hover:scale-105"
              >
                <span>Ver Post en LinkedIn</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* METADATOS Y MÉTRICAS COMPACTAS */}
      <div className="p-4 space-y-2.5 bg-azul-noche/90 backdrop-blur-md flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-inter text-[10px] text-amber-400 font-bold">
              {guardianTag}
            </span>
            <span className="font-inter text-[10px] text-arena/60">
              📅 {date}
            </span>
          </div>

          <h3 className="font-cinzel text-blanco-lunar text-base font-bold leading-snug">
            {title}
          </h3>

          {authorName && (
            <span className="font-inter text-[11px] text-arena/80 block italic">
              ✍️ Publicado por: <strong>{authorName}</strong>
            </span>
          )}

          {description && (
            <p className="font-inter text-arena text-[11px] opacity-85 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          {impactMetrics && impactMetrics.length > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5 mt-2">
              {impactMetrics.map((m: string, idx: number) => (
                <p key={idx} className="font-inter text-[10px] text-amber-300 font-semibold">
                  {m}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-inter">
          <span className="text-amber-400 font-bold">LinkedIn Feed Verified ✓</span>
          {linkedinPostUrl && (
            <a
              href={linkedinPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blanco-lunar underline hover:text-amber-300 font-bold"
            >
              Abrir ↗
            </a>
          )}
        </div>
      </div>

    </motion.div>
  );
}
