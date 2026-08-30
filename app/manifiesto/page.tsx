"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import BrasaCursor from "@/components/ui/BrasaCursor";
import StarField from "@/components/ui/StarField";
import Modal from "@/components/ui/Modal";

const SECTIONS_INDEX = [
  { id: "declaracion", label: "1. Declaración de Propósito" },
  { id: "pilares", label: "2. Los Pilares de Nuestra Faena" },
  { id: "guardianes", label: "3. Los Tres Guardianes" },
  { id: "compromiso", label: "4. Nuestro Compromiso" },
];

export default function ManifiestoPage() {
  const [activeSection, setActiveSection] = useState("declaracion");
  const [codexModalOpen, setCodexModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-azul-noche text-blanco-lunar relative overflow-hidden">
      <BrasaCursor />
      <Navbar />

      {/* Header Sanctuary Banner */}
      <section className="relative pt-36 pb-16 px-6 text-center border-b border-white/10">
        <StarField count={28} isMitlaShape={true} />

        <div className="container mx-auto max-w-4xl relative z-10">
          <span className="font-inter text-ambar text-xs md:text-sm uppercase tracking-[0.25em] font-semibold mb-3 block">
            ✦ Reliquia Digital ✦
          </span>
          <h1 className="font-cinzel text-blanco-lunar text-4xl md:text-6xl font-bold tracking-wide mb-6">
            El Manifiesto de Tequio
          </h1>
          <p className="font-inter text-arena text-lg leading-relaxed max-w-2xl mx-auto opacity-85">
            Documento fundacional que rige la ética, la filosofía comunitaria y el propósito de nuestra tribu.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setCodexModalOpen(true)}
              className="cursor-pointer inline-flex items-center gap-2 font-inter font-bold bg-ambar text-azul-noche px-6 py-3 rounded-xl shadow-xl hover:bg-ambar-light transition-all hover:scale-105"
            >
              <span>📜 Ver Códice Pergamino Coleccionable</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Editorial Layout (Sticky Left Index + Right Full Text) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Sticky Index (4 Cols) */}
          <div className="lg:col-span-4 sticky top-28 space-y-3 bg-white/[0.02] p-6 rounded-2xl border border-white/10">
            <span className="font-inter text-xs uppercase tracking-widest text-ambar font-semibold block mb-4">
              Índice del Santuario
            </span>
            {SECTIONS_INDEX.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSection(sec.id)}
                className={`block font-cinzel text-sm p-3 rounded-xl transition-all duration-300 ${
                  activeSection === sec.id
                    ? "bg-terracota/20 text-blanco-lunar border-l-4 border-terracota font-bold"
                    : "text-arena/70 hover:text-blanco-lunar hover:bg-white/5"
                }`}
              >
                {sec.label}
              </a>
            ))}
          </div>

          {/* Right Full Text Body (8 Cols) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Section 1 */}
            <motion.section
              id="declaracion"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 border-b border-white/10 pb-12"
            >
              <h2 className="font-cinzel text-ambar text-3xl font-bold">
                1. Declaración de Propósito
              </h2>
              <p className="font-inter text-arena text-base leading-[1.85]">
                Tequio nace del principio ancestral mesoamericano donde cada persona aporta su esfuerzo, tiempo y talento en beneficio de la comunidad.
              </p>
              <p className="font-inter text-arena text-base leading-[1.85]">
                Somos un colectivo híbrido que une a estudiantes con hambre de aprender y profesionales activos en la industria. No entendemos la tecnología únicamente como líneas de código, certificaciones o métricas de negocio, sino como una herramienta de transformación social y empatía.
              </p>
              <blockquote className="my-6 pl-6 border-l-4 border-terracota bg-terracota/10 py-4 pr-6 rounded-r-xl italic font-cinzel text-blanco-lunar text-lg">
                &quot;El conocimiento que no se comparte se apaga. Quien hoy recibe guía, mañana lidera y acompaña a otros.&quot;
              </blockquote>
            </motion.section>

            {/* Section 2 */}
            <motion.section
              id="pilares"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 border-b border-white/10 pb-12"
            >
              <h2 className="font-cinzel text-ambar text-3xl font-bold">
                2. Los Pilares de Nuestra Faena
              </h2>

              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white/[0.03] border-l-4 border-[#F5A623]">
                  <h3 className="font-cinzel text-blanco-lunar text-xl font-bold mb-2">Nadie camina solo</h3>
                  <p className="font-inter text-arena text-sm leading-relaxed">
                    Derribamos la barrera entre la universidad y la industria. El profesional comparte camino y mentoría; el estudiante aporta energía, curiosidad y perspectiva fresca.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border-l-4 border-[#C15B3A]">
                  <h3 className="font-cinzel text-blanco-lunar text-xl font-bold mb-2">Tecnología con Alma</h3>
                  <p className="font-inter text-arena text-sm leading-relaxed">
                    Donamos tiempo y habilidades técnicas para resolver problemas reales del entorno antes que proyectos de juguete.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border-l-4 border-[#14b8a6]">
                  <h3 className="font-cinzel text-blanco-lunar text-xl font-bold mb-2">Aprender y Devolver</h3>
                  <p className="font-inter text-arena text-sm leading-relaxed">
                    El conocimiento no se acumula; se comparte. Quien aprende hoy, guía mañana.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border-l-4 border-[#10b981]">
                  <h3 className="font-cinzel text-blanco-lunar text-xl font-bold mb-2">Comunidad en Movimiento</h3>
                  <p className="font-inter text-arena text-sm leading-relaxed">
                    Asistimos en bloque a eventos y conferencias tech, creando espacios seguros, accesibles y libres de intimidación.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section
              id="guardianes"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 border-b border-white/10 pb-12"
            >
              <h2 className="font-cinzel text-ambar text-3xl font-bold">
                3. Los Tres Guardianes de Tequio
              </h2>
              <p className="font-inter text-arena text-base leading-[1.85]">
                La identidad y el espíritu de Tequio se representan a través de tres criaturas míticas, inspiradas en nuestras raíces prehispánicas y adaptadas como alebrijes contemporáneos:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="p-4 rounded-xl bg-white/[0.03] text-center">
                  <Image src="/png/tochtli.png" alt="Tochtli, el sabio Conejo Lunar con orejas de Mitla" width={100} height={120} className="mx-auto object-contain mb-2" />
                  <h4 className="font-cinzel text-blanco-lunar font-bold">Tochtli</h4>
                  <span className="font-inter text-[11px] text-[#F5A623] font-semibold block">Conejo Lunar · Mentoría</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] text-center">
                  <Image src="/png/tlacu.png" alt="Tlacu, el intrépido Tlacuache-Jaguar que porta el fuego" width={100} height={120} className="mx-auto object-contain mb-2" />
                  <h4 className="font-cinzel text-blanco-lunar font-bold">Tlacu</h4>
                  <span className="font-inter text-[11px] text-[#C15B3A] font-semibold block">Tlacuache-Jaguar · Constructor</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] text-center">
                  <Image src="/png/kuku.png" alt="Kuku, el veloz Colibrí-Quetzal mensajero" width={100} height={120} className="mx-auto object-contain scale-125 mb-2" />
                  <h4 className="font-cinzel text-blanco-lunar font-bold">Kuku</h4>
                  <span className="font-inter text-[11px] text-[#10b981] font-semibold block">Colibrí-Quetzal · Explorador</span>
                </div>
              </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section
              id="compromiso"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-cinzel text-ambar text-3xl font-bold">
                4. Nuestro Compromiso
              </h2>
              <p className="font-inter text-arena text-base leading-[1.85]">
                Quien entra a Tequio no solo busca crecer profesionalmente; asume el compromiso de poner su piedra en la obra colectiva. Aquí construimos tecnología con causa, aprendemos en tribu y dejamos huella.
              </p>
            </motion.section>

          </div>
        </div>
      </section>

      {/* Códice Pergamino Modal */}
      <Modal
        isOpen={codexModalOpen}
        onClose={() => setCodexModalOpen(false)}
        title="📜 Códice Pergamino Coleccionable — Tequio"
      >
        <div className="p-6 rounded-2xl bg-[#E8DFD1] text-[#1A2332] font-inter space-y-6 border-4 border-[#C15B3A] shadow-2xl relative overflow-hidden">
          <div className="text-center pb-4 border-b-2 border-[#C15B3A]/40">
            <Image src="/png/logo.png" alt="Sello Tequio" width={100} height={30} className="mx-auto mb-2" />
            <h3 className="font-cinzel text-2xl font-bold text-[#C15B3A]">CÓDICE OFICIAL TEQUIO</h3>
            <span className="text-xs uppercase tracking-widest text-[#4A5568] font-bold">Documento de Mayordomía</span>
          </div>

          <p className="text-sm leading-relaxed italic text-center font-cinzel text-[#1A2332] font-bold">
            &quot;El camino no se recorre en solitario; el conocimiento y el futuro se construyen en colectivo.&quot;
          </p>

          <div className="space-y-3 text-xs leading-relaxed">
            <p><strong>I. LA FAENA:</strong> Todo conocimiento es patrimonio de la comunidad. Aportamos tiempo y talento sin reservas.</p>
            <p><strong>II. LA TRIBU:</strong> Nadie camina solo. El profesional abre puertas, el estudiante aporta empuje.</p>
            <p><strong>III. EL FUEGO:</strong> Llevamos tecnología con causa a refugios, asilos y comunidades vulnerables.</p>
          </div>

          <div className="pt-4 border-t border-[#C15B3A]/40 text-center">
            <button
              onClick={() => alert("¡Descargando Pergamino de Arte Coleccionable en PDF!")}
              className="font-inter font-bold bg-[#C15B3A] text-white px-6 py-2.5 rounded-xl hover:bg-[#9a4225] transition-colors text-xs uppercase tracking-wider"
            >
              Descargar Pergamino Códice (PDF)
            </button>
          </div>
        </div>
      </Modal>

      <FooterSection />
    </main>
  );
}
