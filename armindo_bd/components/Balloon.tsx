"use client";

import type { Balloon as BalloonData } from "@/data/story";
import { STORY } from "@/data/story";
import { useLang } from "./LangContext";

export default function Balloon({ balloon }: { balloon: BalloonData }) {
  const { t } = useLang();
  const { kind, speaker, tail = "none", x, y } = balloon;

  return (
    <div
      className={`balloon balloon--${kind} tail--${tail} ${speaker ? `speaker--${speaker}` : ""}`}
      style={{ "--x": `${x}%`, "--y": `${y}%` } as React.CSSProperties}
    >
      {speaker && kind !== "caption" && <span className="balloon-speaker">{t(STORY.speakers[speaker])}</span>}
      <p>{t(balloon.text)}</p>
      {kind === "thought" && (
        <span className="thought-dots" aria-hidden="true">
          <i />
          <i />
        </span>
      )}
    </div>
  );
}
