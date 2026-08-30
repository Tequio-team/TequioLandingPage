"use client";
import { useState } from "react";
import Image from "next/image";

interface LinkedInEmbedCardProps {
  id: string;
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
  
  // If already an embed URL
  if (url.includes("/embed/feed/update/")) return url;

  // Extract URN activity/share ID from full URLs
  const match = url.match(/urn:li:(activity|share):([0-9]+)/);
  if (match) {
    const type = match[1];
    const id = match[2];
    return `https://www.linkedin.com/embed/feed/update/urn:li:${type}:${id}`;
  }

  // Short link (lnkd.in/p/...) or generic post URL
  return url;
}

export default function LinkedInEmbedCard({
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
  const isShortLink = linkedinPostUrl.includes("lnkd.in");

  return (
    <div className="rounded-3xl overflow-hidden bg-white/[0.035] border-2 border-amber-500/40 flex flex-col justify-between shadow-2xl relative group hover:border-amber-400 transition-all duration-300">
      
      {/* SELLO CEREMONIAL FLOTANTE (CERA ANCESTRAL DORADA) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <span className="font-inter text-[10px] uppercase font-bold px-3.5 py-1.5 rounded-full bg-amber-500 text-azul-noche shadow-[0_0_20px_#F5A623] border border-amber-300 tracking-wider flex items-center gap-1.5">
          <span>✦</span>
          <span>{sealStamp || "✦ SELLO DE MAYORDOMÍA ✦"}</span>
        </span>
      </div>

      {/* CONTENEDOR CON SKELETON SHIMMER LOADER & TRANSICIÓN JS/CSS */}
      <div className="relative w-full bg-black/60 min-h-[420px] flex items-center justify-center overflow-hidden border-b border-white/10">
        
        {/* SKELETON SHIMMER LOADER (SE MUESTRA MIENTRAS CARGA EL IFRAME) */}
        {!iframeLoaded && !isShortLink && (
          <div className="absolute inset-0 bg-gradient-to-r from-azul-noche via-white/10 to-azul-noche animate-pulse flex flex-col justify-between p-8 z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-20 bg-white/10 rounded-2xl animate-pulse" />
              <div className="h-32 bg-white/10 rounded-2xl animate-pulse" />
            </div>
            <span className="font-inter text-xs text-amber-400 font-bold text-center animate-bounce">
              ⚡ Cargando publicación viva de LinkedIn...
            </span>
          </div>
        )}

        {/* IFRAME O VISTA PREVIA SI ES ENLACE CORTO */}
        {embedUrl && !isShortLink ? (
          <iframe
            src={embedUrl}
            height="450"
            width="100%"
            frameBorder="0"
            allowFullScreen={false}
            title={title}
            onLoad={() => setIframeLoaded(true)}
            className={`w-full h-[450px] rounded-t-2xl transition-opacity duration-700 ease-in-out ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          /* VISTA PREVIA SI ES ENLACE CORTO LNKD.IN */
          <div className="relative h-72 w-full flex flex-col items-center justify-center p-6 text-center bg-white/5 space-y-4">
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 space-y-2">
              <span className="font-inter text-xs text-amber-400 font-bold uppercase tracking-widest block">
                🔗 Publicación compartida por la tribu
              </span>
              <p className="font-cinzel text-blanco-lunar text-lg font-bold">
                {title}
              </p>
              <a
                href={linkedinPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer font-inter font-bold text-xs bg-amber-500 text-azul-noche px-6 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg hover:bg-amber-400 transition-all hover:scale-105"
              >
                <span>Ver Post Oficial en LinkedIn</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* METADATOS Y MÉTRICAS DE IMPACTO */}
      <div className="p-6 space-y-4 bg-azul-noche/90 backdrop-blur-md flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs text-amber-400 font-bold">
              {guardianTag}
            </span>
            <span className="font-inter text-xs text-arena/60">
              📅 {date}
            </span>
          </div>

          <h3 className="font-cinzel text-blanco-lunar text-xl font-bold">
            {title}
          </h3>

          {authorName && (
            <span className="font-inter text-xs text-arena/80 block italic">
              ✍️ Publicado por: <strong>{authorName}</strong>
            </span>
          )}

          {description && (
            <p className="font-inter text-arena text-xs opacity-85 leading-relaxed">
              {description}
            </p>
          )}

          {impactMetrics && impactMetrics.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 mt-3">
              {impactMetrics.map((m: string, idx: number) => (
                <p key={idx} className="font-inter text-xs text-amber-300 font-semibold">
                  {m}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-inter">
          <span className="text-amber-400 font-bold">LinkedIn Feed Verified ✓</span>
          {linkedinPostUrl && (
            <a
              href={linkedinPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blanco-lunar underline hover:text-amber-300 font-bold"
            >
              Abrir en LinkedIn ↗
            </a>
          )}
        </div>
      </div>

    </div>
  );
}
