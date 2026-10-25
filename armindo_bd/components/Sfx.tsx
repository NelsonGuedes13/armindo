"use client";

import type { Sfx as SfxData } from "@/data/story";
import { useLang } from "./LangContext";

// Pequenas variações por carácter para parecer letragem desenhada à mão.
const JITTER = [-7, 5, -3, 8, -5, 4, -8, 6];

export default function Sfx({ sfx }: { sfx: SfxData }) {
  const { t } = useLang();
  const chars = Array.from(sfx.text);

  return (
    <div
      className={`sfx sfx--${sfx.style} ${sfx.vertical ? "sfx--vertical" : ""}`}
      style={
        {
          "--x": `${sfx.x}%`,
          "--y": `${sfx.y}%`,
          "--r": `${sfx.rotate}deg`,
          "--s": sfx.size ?? 1,
        } as React.CSSProperties
      }
      aria-label={`${sfx.romaji} (${t(sfx.meaning)})`}
    >
      <span className="sfx-text" aria-hidden="true">
        {chars.map((char, i) => (
          <span
            key={i}
            className="sfx-char"
            style={{ "--j": `${JITTER[i % JITTER.length]}deg`, "--d": `${i * -0.11}s` } as React.CSSProperties}
          >
            <i>{char}</i>
          </span>
        ))}
      </span>
      <span className="sfx-romaji" aria-hidden="true">
        {sfx.romaji}
        <small>{t(sfx.meaning)}</small>
      </span>
    </div>
  );
}
