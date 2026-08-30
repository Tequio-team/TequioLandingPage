import HeroSection       from "@/components/sections/HeroSection";
import WhatIsTequioSection from "@/components/sections/WhatIsTequioSection";
import PillarsSection      from "@/components/sections/PillarsSection";
import GuardiansSection    from "@/components/sections/GuardiansSection";
import CommitmentSection   from "@/components/sections/CommitmentSection";
import FooterSection       from "@/components/sections/FooterSection";
import Navbar              from "@/components/ui/Navbar";
import BrasaCursor         from "@/components/ui/BrasaCursor";

export default function Home() {
  return (
    <main>
      <BrasaCursor />
      <Navbar />

      {/* Acto 1: El Umbral (Hero de Bienvenida) */}
      <HeroSection />

      {/* Acto 2: La Faena (Declaración de Propósito) */}
      <WhatIsTequioSection />

      {/* Acto 3: Los Cuatro Pilares (Losas de Saber) */}
      <PillarsSection />

      {/* Acto 4: Los Tres Guardianes (El Encuentro con los Alebrijes) */}
      <GuardiansSection />

      {/* Acto 5: Unificación — Nuestras Actividades & Nuestro Compromiso con Fuego Ceremonial y Brasas */}
      <CommitmentSection />

      {/* Cierre: El Camino Continúa (Pie de Página) */}
      <FooterSection />
    </main>
  );
}
