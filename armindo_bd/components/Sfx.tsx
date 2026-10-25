"use client";

import type { Sfx as SfxData } from "@/data/story";

// Pequenas variações por letra para parecer letragem desenhada à mão.
const JITTER = [-7, 5, -3, 8, -5, 4, -8, 6];

export default function Sfx({ sfx }: { sfx: SfxData }) {
  return (
    <div
      className={`sfx sfx--${sfx.style}`}
      style={
        {
          "--x": `${sfx.x}%`,
          "--y": `${sfx.y}%`,
          "--r": `${sfx.rotate}deg`,
          "--s": sfx.size ?? 1,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {Array.from(sfx.text).map((char, i) => (
        <span
          key={i}
          className="sfx-char"
          style={{ "--j": `${JITTER[i % JITTER.length]}deg`, "--d": `${i * -0.11}s` } as React.CSSProperties}
        >
          <i>{char}</i>
        </span>
      ))}
    </div>
  );
}
