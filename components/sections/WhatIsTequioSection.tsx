"use client";
import Image from "next/image";
import StarField from "@/components/ui/StarField";

const HIGHLIGHTED_KEYWORDS = [
  "principio ancestral mesoamericano",
  "estudiantes con hambre de aprender",
  "profesionales activos",
  "herramienta de transformación social y empatía",
  "albergues",
  "refugios de animales",
  "causas comunitarias",
];

const PARAGRAPHS = [
  "Tequio nace del principio ancestral mesoamericano donde cada persona aporta su esfuerzo, tiempo y talento en beneficio de la comunidad.",
  "Somos un colectivo híbrido que une a estudiantes con hambre de aprender y profesionales activos en la industria. No entendemos la tecnología únicamente como líneas de código, certificaciones o métricas de negocio, sino como una herramienta de transformación social y empatía.",
  "Nos encontramos en eventos y hackathons para aprender y crecer juntos, pero también salimos a la calle para poner el cuerpo y el código al servicio de quienes más lo necesitan: albergues, refugios de animales, centros de adultos mayores y causas comunitarias.",
];

export default function WhatIsTequioSection() {
  const renderHighlightedText = (text: string) => {
    let parts: React.ReactNode[] = [text];
    HIGHLIGHTED_KEYWORDS.forEach((kw) => {
      parts = parts.flatMap((node) => {
        if (typeof node !== "string") return [node];
        const sub = node.split(kw);
        return sub.flatMap((s, idx) =>
          idx < sub.length - 1
            ? [
                s,
                <span
                  key={`${kw}-${idx}`}
                  className="relative font-semibold px-0.5 text-blanco-lunar inline-block border-b-2 border-terracota"
                >
                  {kw}
                </span>,
              ]
            : [s]
        );
      });
    });
    return parts;
  };

  return (
    <section
      id="que-es-tequio"
      className="relative py-16 md:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #0B1020 0%, #151D32 50%, #0B1020 100%)",
      }}
    >
      {/* Textura de papel amate */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, transparent 40%, black 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 40%, black 90%)",
        }}
      >
        <svg className="w-full h-full">
          <filter id="amateSideTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#amateSideTexture)" />
        </svg>
      </div>

      <StarField count={14} isMitlaShape={true} className="opacity-20" />

      <div className="container mx-auto px-5 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start lg:items-center">
          
          {/* Main Text Content */}
          <div className="flex-1 relative pl-5 sm:pl-8">
            <div className="absolute left-0 top-0 h-full w-[3px] sm:w-[4px] bg-terracota rounded-full opacity-80" />

            <h2 className="font-cinzel text-blanco-lunar text-3xl sm:text-4xl md:text-5xl mb-5 tracking-wide font-bold">
              Qué es Tequio
            </h2>

            {PARAGRAPHS.map((para, i) => (
              <p
                key={i}
                className="font-inter text-arena text-sm sm:text-base md:text-lg leading-[1.8] mb-4 opacity-90"
              >
                {renderHighlightedText(para)}
              </p>
            ))}

            <blockquote className="my-7 pl-4 sm:pl-6 border-l-[4px] border-terracota bg-white/[0.04] py-4 sm:py-5 pr-4 sm:pr-6 rounded-r-2xl shadow-xl">
              <p className="font-cinzel text-amber-300 text-base sm:text-xl md:text-2xl leading-relaxed italic font-bold">
                &quot;El conocimiento que no se comparte se apaga. Quien hoy recibe guía, mañana lidera y acompaña a otros.&quot;
              </p>
            </blockquote>
          </div>

          {/* Right Visual Image — hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block w-full lg:w-[380px] xl:w-[420px] h-[400px] xl:h-[460px] relative rounded-3xl overflow-hidden border-2 border-terracota/30 shadow-2xl flex-shrink-0">
            <Image
              src="/jpg/moment1.jpg"
              alt="Comunidad Tequio en faena"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-azul-noche via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-5 left-5 right-5">
              <span className="font-inter text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
                ✦ Faena Colectiva ✦
              </span>
              <p className="font-cinzel text-blanco-lunar text-lg font-bold">
                Aprender en tribu, construir en comunidad.
              </p>
            </div>
          </div>

          {/* Mobile-only image: compact banner */}
          <div className="lg:hidden w-full h-48 sm:h-56 relative rounded-2xl overflow-hidden border border-terracota/30 shadow-xl">
            <Image
              src="/jpg/moment1.jpg"
              alt="Comunidad Tequio en faena"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-azul-noche/90 via-azul-noche/40 to-transparent" />
            <div className="absolute bottom-3 left-4">
              <p className="font-cinzel text-blanco-lunar text-sm font-bold">
                Aprender en tribu, construir en comunidad.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
