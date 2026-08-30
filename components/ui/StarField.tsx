"use client";
import { useMemo } from "react";

interface ConstellationStar {
  id: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
  size: number;
  layer: 1 | 2 | 3;
  isMainNode?: boolean;
}

interface StarFieldProps {
  count?: number;
  className?: string;
  isMitlaShape?: boolean;
}

// Rabbit Constellation Coordinates (percentage)
const RABBIT_CONSTELLATION = [
  { top: "14%", left: "18%" }, // Ear tip 1
  { top: "18%", left: "24%" }, // Ear tip 2
  { top: "28%", left: "20%" }, // Head
  { top: "38%", left: "16%" }, // Back
  { top: "48%", left: "22%" }, // Tail
  { top: "42%", left: "28%" }, // Body center
  { top: "32%", left: "26%" }, // Front leg
];

export default function StarField({ count = 28, className = "", isMitlaShape = true }: StarFieldProps) {
  const stars = useMemo<ConstellationStar[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = (i + 1) * 137.508;
      const top = ((seed * 7.3) % 90) + 5;
      const left = ((seed * 3.7) % 90) + 5;
      const delay = (seed * 0.017) % 6;
      const duration = 5 + (seed * 0.013) % 5;
      const size = 8 + (seed * 0.011) % 8;
      const layer = ((i % 3) + 1) as 1 | 2 | 3;
      return {
        id: i,
        top: `${top.toFixed(1)}%`,
        left: `${left.toFixed(1)}%`,
        delay: `${delay.toFixed(2)}s`,
        duration: `${duration.toFixed(2)}s`,
        size: Math.round(size),
        layer,
        isMainNode: i < 3,
      };
    });
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      
      {/* Códice Celestial Map Lines connecting Rabbit Constellation */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <polyline
          points="
            180,90
            240,120
            200,180
            160,240
            220,300
            280,260
            260,200
            200,180
          "
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* Subtle connecting line to manifesto */}
        <path
          d="M 280,260 Q 400,280 550,240"
          fill="none"
          stroke="#FFD56B"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      </svg>

      {/* Rabbit Constellation Fixed Star Nodes */}
      {RABBIT_CONSTELLATION.map((pt, i) => (
        <div
          key={`rabbit-${i}`}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-twinkle"
          style={{
            top: pt.top,
            left: pt.left,
            animationDelay: `${i * 0.4}s`,
            animationDuration: "4s",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_10px_#F5A623]">
            <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="#FFD56B" opacity="0.9" />
            <circle cx="12" cy="12" r="3" fill="#F5A623" />
          </svg>
        </div>
      ))}

      {/* General Distributed Stars (3 Layers) */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.layer === 1 ? 0.3 : star.layer === 2 ? 0.6 : 0.85,
          }}
        >
          {isMitlaShape ? (
            <svg
              width={star.size}
              height={star.size}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2 L22 12 L12 22 L2 12 Z M12 6 L18 12 L12 18 L6 12 Z"
                fill={star.isMainNode ? "#F5A623" : "#FFD56B"}
                opacity="0.85"
              />
            </svg>
          ) : (
            <div
              className="rounded-full"
              style={{
                width: `${star.size / 4}px`,
                height: `${star.size / 4}px`,
                background: "radial-gradient(circle, #FFD56B, #F5A623)",
                boxShadow: "0 0 6px 2px rgba(245,166,35,0.5)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
