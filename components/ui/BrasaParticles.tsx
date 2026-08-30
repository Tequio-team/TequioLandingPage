"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  speed: number;
}

interface BrasaParticlesProps {
  count?: number;
  color1?: string;
  color2?: string;
  speedMultiplier?: number;
  direction?: "up" | "diagonal";
  className?: string;
}

export default function BrasaParticles({
  count = 40,
  color1 = "#FFD56B",
  color2 = "#F5A623",
  speedMultiplier = 1,
  direction = "up",
  className = "",
}: BrasaParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const multiplierRef = useRef(speedMultiplier);

  useEffect(() => {
    multiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: count }, () => createParticle(canvas));

    function createParticle(c: HTMLCanvasElement): Particle {
      const speed = (Math.random() * 0.4 + 0.2);
      return {
        x: Math.random() * c.width,
        y: c.height + Math.random() * c.height,
        vx: direction === "diagonal" ? (Math.random() * 0.5 + 0.2) : (Math.random() - 0.5) * 0.3,
        vy: -(speed),
        opacity: Math.random() * 0.4 + 0.3,
        size: Math.random() * 3 + 2,
        speed,
      };
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx * multiplierRef.current;
        p.y += p.vy * multiplierRef.current;

        if (p.y < -10) {
          particlesRef.current[i] = createParticle(canvas);
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, color1 + "ff");
        grad.addColorStop(0.5, color2 + "aa");
        grad.addColorStop(1, color2 + "00");

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [count, color1, color2, direction]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
