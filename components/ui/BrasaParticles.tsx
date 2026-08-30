"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  life: number; // 0..1, fades in/out smoothly
  lifeSpeed: number;
  rising: boolean;
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
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Only update if size actually changed — prevents repaint flicker on scroll
      if (width === rect.width && height === rect.height) return;
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
    };

    const createParticle = (initialY?: number): Particle => {
      const speed = (Math.random() * 0.35 + 0.15) * speedMultiplier;
      return {
        x: Math.random() * width,
        y: initialY ?? height + Math.random() * 60,
        vx: direction === "diagonal"
          ? (Math.random() * 0.4 + 0.15) * speedMultiplier
          : (Math.random() - 0.5) * 0.25,
        vy: -speed,
        opacity: 0,
        size: Math.random() * 2.5 + 1.5,
        life: Math.random(), // stagger initial phases
        lifeSpeed: (Math.random() * 0.004 + 0.002) * speedMultiplier,
        rising: true,
      };
    };

    resize();
    // Scatter initial particles across the full height for instant density
    particles = Array.from({ length: count }, (_, i) =>
      createParticle(height - (height / count) * i)
    );

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        // Advance position
        p.x += p.vx;
        p.y += p.vy;

        // Life cycle: fade in then fade out smoothly
        p.life += p.lifeSpeed;
        if (p.life >= 1) {
          p.life = 1;
          p.rising = false;
        }
        p.opacity = p.rising
          ? p.life * 0.6
          : Math.max(0, (2 - p.life * 2) * 0.6);

        // Recycle when fully faded out or off-screen top
        if (p.y < -20 || (!p.rising && p.opacity <= 0)) {
          particles[i] = createParticle();
        }

        if (p.opacity <= 0.02) return;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        grad.addColorStop(0, color1 + "ff");
        grad.addColorStop(0.5, color2 + "99");
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
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  // Only re-init if these structural props change (not speedMultiplier which can be ref'd)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, color1, color2, direction]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ willChange: "contents" }}
    />
  );
}
