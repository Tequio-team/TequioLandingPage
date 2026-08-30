"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "días",    value: timeLeft.days },
    { label: "horas",   value: timeLeft.hours },
    { label: "minutos", value: timeLeft.minutes },
  ];

  return (
    <div className="flex items-center gap-6 justify-center md:justify-start">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-6">
          <div className="text-center">
            <div
              className="font-cinzel text-4xl font-bold text-terracota tabular-nums"
              style={{ minWidth: "3ch", display: "inline-block" }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div className="font-inter text-sm text-gris-pizarra mt-1 uppercase tracking-widest">
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="font-cinzel text-3xl text-terracota opacity-50 mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
