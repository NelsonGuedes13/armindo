"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { PANELS } from "@/data/story";
import { useLang } from "./LangContext";

export default function Hud() {
  const { lang, setLang, t } = useLang();
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      },
    );

    PANELS.forEach((panel) => {
      ScrollTrigger.create({
        trigger: `#painel-${panel.id}`,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActive(panel.id);
          else setActive((current) => (current === panel.id ? 0 : current));
        },
      });
    });
  });

  return (
    <div className="hud">
      <div className="hud-progress" aria-hidden="true">
        <div ref={barRef} className="hud-progress-bar" />
      </div>

      <div className="hud-top">
        <span className={`hud-counter ${active ? "is-visible" : ""}`}>
          {String(active || 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}
        </span>
        <div className="lang-toggle" role="group" aria-label="Idioma / Language">
          {(["pt", "en"] as const).map((code) => (
            <button
              key={code}
              type="button"
              className={lang === code ? "is-active" : ""}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <nav className="hud-dots" aria-label={lang === "pt" ? "Quadros" : "Panels"}>
        {PANELS.map((panel) => (
          <button
            key={panel.id}
            type="button"
            className={active === panel.id ? "is-active" : ""}
            onClick={() => scrollToTarget(`#painel-${panel.id}`)}
            aria-label={`${panel.id}. ${t(panel.title)}`}
          >
            <span className="hud-dot" />
            <span className="hud-dot-label">
              {panel.id}. {t(panel.title)}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
