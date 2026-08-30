"use client";
import { useState } from "react";
import Image from "next/image";
import StarField from "@/components/ui/StarField";

const GUARDIANS_FOOTER = [
  { id: "tochtli", name: "Tochtli — El Conejo Lunar", src: "/png/tochtli.png", color: "#F5A623" },
  { id: "tlacu", name: "Tlacu — El Tlacuache-Jaguar", src: "/png/tlacu.png", color: "#C15B3A" },
  { id: "kuku", name: "Kuku — El Colibrí-Quetzal", src: "/png/kuku.png", color: "#10b981" },
];

const FOOTER_LINKS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Discord / Comunidad", href: "https://discord.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Manifiesto en PDF", href: "#" },
];

export default function FooterSection() {
  const [activeGuardianHover, setActiveGuardianHover] = useState<string | null>(null);

  return (
    <footer
      id="footer"
      className="relative py-24 overflow-hidden bg-azul-noche"
      style={{
        background: "radial-gradient(ellipse at center, #151D32 0%, #080C18 100%)",
      }}
    >
      <StarField count={34} isMitlaShape={true} className="opacity-60" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Top Footer Content */}
        <div className="flex flex-col items-center text-center pb-16 border-b border-white/10">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/png/logo.png"
              alt="Tequio Logo"
              width={56}
              height={56}
              className="object-contain"
            />
            <span className="font-cinzel text-blanco-lunar text-2xl tracking-widest font-bold">TEQUIO</span>
          </div>

          {/* Mensaje de Cierre */}
          <h3 className="font-cinzel text-blanco-lunar text-3xl md:text-4xl mb-4 tracking-wide font-bold">
            &quot;Tequio no es un destino — es el caminar juntos.&quot;
          </h3>

          {/* Enlaces Esenciales */}
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="font-inter text-arena/80 text-sm relative group py-1"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-ambar transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Los Tres Guardianes */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Firma Comunitaria */}
          <p className="font-inter text-arena/60 text-xs tracking-wider text-center md:text-left">
            © 2026 Comunidad Tequio · Construido en colectivo.
          </p>

          {/* Los 3 Guardianes */}
          <div className="flex items-center gap-5 relative">
            {GUARDIANS_FOOTER.map((g) => (
              <div
                key={g.id}
                onMouseEnter={() => setActiveGuardianHover(g.name)}
                onMouseLeave={() => setActiveGuardianHover(null)}
                className="relative cursor-pointer hover:-translate-y-1 hover:scale-105 transition-all duration-200"
              >
                <Image
                  src={g.src}
                  alt={g.name}
                  width={48}
                  height={58}
                  className={`object-contain ${g.id === "kuku" ? "scale-125" : ""}`}
                />

                {/* Tooltip */}
                {activeGuardianHover === g.name && (
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded-md text-[10px] font-inter text-blanco-lunar whitespace-nowrap pointer-events-none z-30"
                    style={{
                      background: "rgba(11, 16, 32, 0.95)",
                      border: `1px solid ${g.color}55`,
                      boxShadow: `0 0 10px ${g.color}33`,
                    }}
                  >
                    {g.name}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}
