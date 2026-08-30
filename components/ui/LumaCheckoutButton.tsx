"use client";
import { useEffect } from "react";

interface LumaCheckoutButtonProps {
  lumaUrl: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "compact";
  disabled?: boolean;
}

export function extractLumaEventId(url: string): string {
  if (!url) return "";
  try {
    const clean = url.trim();
    const evtMatch = clean.match(/evt-[a-zA-Z0-9_-]+/i);
    if (evtMatch) return evtMatch[0];
    
    const parsed = new URL(clean.startsWith("http") ? clean : `https://${clean}`);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      return segments[segments.length - 1];
    }
  } catch {
    // fallback
  }
  return "";
}

export default function LumaCheckoutButton({
  lumaUrl,
  className = "",
  children,
  variant = "primary",
  disabled = false,
}: LumaCheckoutButtonProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("luma-checkout")) {
      const script = document.createElement("script");
      script.id = "luma-checkout";
      script.src = "https://embed.lu.ma/checkout-button.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const eventId = extractLumaEventId(lumaUrl);
  const href = lumaUrl?.trim() || "#";

  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-inter font-bold transition-all duration-300 select-none";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-terracota via-orange-600 to-amber-500 text-blanco-lunar px-8 py-4 rounded-2xl shadow-[0_10px_28px_rgba(193,91,58,0.45)] hover:shadow-[0_14px_35px_rgba(245,166,35,0.6)] hover:scale-105 active:scale-95 text-base md:text-lg border border-amber-400/40",
    secondary:
      "bg-amber-500 hover:bg-amber-400 text-azul-noche px-6 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 text-sm md:text-base font-extrabold",
    compact:
      "bg-terracota hover:bg-orange-600 text-blanco-lunar px-4 py-2 rounded-xl text-xs md:text-sm shadow-md hover:scale-105 active:scale-95",
  }[variant];

  if (disabled) {
    return (
      <button
        disabled
        className={`${baseStyles} opacity-50 cursor-not-allowed bg-white/10 text-arena/60 px-6 py-3 rounded-xl text-sm ${className}`}
      >
        <span>Evento Finalizado</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      className={`luma-checkout--button ${baseStyles} ${variantStyles} ${className}`}
      data-luma-action="checkout"
      data-luma-event-id={eventId || undefined}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children || (
        <>
          <span>Ver evento en Luma</span>
          <span className="text-xl">→</span>
        </>
      )}
    </a>
  );
}
