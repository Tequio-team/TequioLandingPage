"use client";
import { useEffect, useState, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export default function BrasaCursor() {
  const [enabled, setEnabled] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const posRef = useRef({ x: -100, y: -100 });
  const mouseRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef<Particle[]>([
    { x: -100, y: -100, scale: 1, rotation: 0 },
    { x: -100, y: -100, scale: 0.85, rotation: 15 },
    { x: -100, y: -100, scale: 0.7, rotation: 30 },
  ]);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setEnabled(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      
      // Smoke/Ember Lerp Inertia (0.18 factor)
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.18;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x - 6}px, ${posRef.current.y - 6}px, 0)`;
      }

      // Update trail particles with organic scale oscillation and float
      trailRef.current.forEach((p, index) => {
        const factor = 0.12 - index * 0.03;
        p.x += (posRef.current.x - p.x) * factor;
        p.y += (posRef.current.y - p.y) * factor;
        p.scale = 0.8 + Math.sin(time + index) * 0.2;
        p.rotation = Math.sin(time * 0.5 + index) * 20;

        const elem = particlesRef.current[index];
        if (elem) {
          elem.style.transform = `translate3d(${p.x - 4}px, ${p.y - 4}px, 0) scale(${p.scale}) rotate(${p.rotation}deg)`;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Main Cursor Pointer */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-ambar pointer-events-none z-50 mix-blend-screen shadow-[0_0_12px_#F5A623]"
        style={{ willChange: "transform" }}
      />
      {/* 3 Ceremonial Ember Trail Particles */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el;
          }}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-40"
          style={{
            width: 8 - i * 1.5,
            height: 8 - i * 1.5,
            background: i === 0 ? "#FFD56B" : i === 1 ? "#F5A623" : "#C15B3A",
            opacity: 0.65 - i * 0.18,
            boxShadow: `0 0 ${8 - i * 2}px ${i === 0 ? "#FFD56B" : "#F5A623"}`,
            willChange: "transform",
          }}
        />
      ))}
    </>
  );
}
