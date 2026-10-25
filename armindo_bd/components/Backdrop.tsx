"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Fundo fixo partilhado por todas as cenas: camadas de poeira que se movem a velocidades diferentes.
export default function Backdrop() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const layers: [string, number][] = [
        [".backdrop-dust--far", -900],
        [".backdrop-dust--mid", -2200],
        [".backdrop-dust--near", -4200],
      ];
      layers.forEach(([selector, distance]) => {
        gsap.fromTo(
          selector,
          { backgroundPositionY: 0 },
          {
            backgroundPositionY: distance,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 1.5 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="backdrop" aria-hidden="true">
      <div className="backdrop-glow" />
      <div className="backdrop-dust backdrop-dust--far" />
      <div className="backdrop-dust backdrop-dust--mid" />
      <div className="backdrop-dust backdrop-dust--near" />
    </div>
  );
}
