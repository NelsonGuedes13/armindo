"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Panel } from "@/data/story";
import { asset } from "@/lib/asset";
import Balloon from "./Balloon";
import Sfx from "./Sfx";
import { useLang } from "./LangContext";

export default function PanelScene({ panel, index }: { panel: Panel; index: number }) {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fromLeft = index % 2 === 0;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top 65%",
          end: "bottom bottom",
          scrub: 0.7,
        },
      });

      // Entrada do quadro: recorte que se abre + rotação até à inclinação final
      tl.fromTo(
        ".scene-frame",
        {
          clipPath: fromLeft ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          rotate: panel.tilt * 4,
          scale: 0.82,
          xPercent: fromLeft ? -8 : 8,
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          rotate: panel.tilt,
          scale: 1,
          xPercent: 0,
          duration: 0.2,
          ease: "power3.out",
        },
        0,
      )
        .fromTo(".scene-shadow", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.05)
        .fromTo(".scene-number", { yPercent: 40, opacity: 0 }, { yPercent: -40, opacity: 1, duration: 1 }, 0)
        .fromTo(".scene-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.12, ease: "power2.out" }, 0.1)

        // Movimento de câmara dentro do quadro (Ken Burns)
        .fromTo(
          ".scene-img",
          { scale: panel.zoom[0], objectPosition: `${panel.pan[0]}% 50%` },
          { scale: panel.zoom[1], objectPosition: `${panel.pan[1]}% 50%`, duration: 1 },
          0,
        );

      if (panel.action) {
        tl.fromTo(".speedlines", { opacity: 0, rotate: 0 }, { opacity: 0.55, rotate: 25, duration: 0.8 }, 0.1);
      }

      // Balões entram em sequência
      gsap.utils.toArray<HTMLElement>(".balloon", root.current).forEach((el, i) => {
        const at = panel.balloons[i]?.at ?? 0.3;
        tl.fromTo(
          el,
          { scale: 0, opacity: 0, rotate: i % 2 ? 8 : -8 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.07, ease: "back.out(2.4)" },
          at,
        );
      });

      // Onomatopeias: cada carácter entra com impacto, depois flash e tremor do quadro
      gsap.utils.toArray<HTMLElement>(".sfx", root.current).forEach((el, i) => {
        const sfx = panel.sfx?.[i];
        if (!sfx) return;
        const chars = el.querySelectorAll(".sfx-char");
        const romaji = el.querySelector(".sfx-romaji");

        tl.set(el, { opacity: 1 }, sfx.at);

        if (sfx.style === "impact") {
          tl.fromTo(
            chars,
            { scale: 3, opacity: 0, y: -30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.05, stagger: 0.015, ease: "back.out(2.5)" },
            sfx.at,
          ).fromTo(".scene-flash", { opacity: 0.85 }, { opacity: 0, duration: 0.08, immediateRender: false }, sfx.at + 0.03);

          if (!reduced) {
            tl.to(
              ".scene-frame",
              { keyframes: { x: [0, -14, 12, -8, 6, 0], y: [0, 6, -8, 4, -2, 0] }, duration: 0.08 },
              sfx.at + 0.03,
            );
          }
        } else if (sfx.style === "motion") {
          tl.fromTo(
            chars,
            { xPercent: -160, skewX: -35, opacity: 0 },
            { xPercent: 0, skewX: 0, opacity: 1, duration: 0.07, stagger: 0.012, ease: "power4.out" },
            sfx.at,
          );
        } else {
          tl.fromTo(
            chars,
            { scale: 0.4, opacity: 0, filter: "blur(6px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.08, stagger: 0.02, ease: "power2.out" },
            sfx.at,
          );
        }

        tl.fromTo(romaji, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.05 }, sfx.at + 0.06);
      });

      // Saída: tudo recua para dar lugar ao próximo quadro
      tl.to(".scene-content", { opacity: 0, scale: 0.9, y: -60, duration: 0.12, ease: "power2.in" }, 0.88);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={`painel-${panel.id}`}
      className={`scene ${panel.action ? "scene--action" : ""}`}
      aria-label={`${panel.id}. ${t(panel.title)}`}
    >
      <div className="scene-stage">
        <div className="speedlines" />
        <span className="scene-number" aria-hidden="true">
          {String(panel.id).padStart(2, "0")}
        </span>

        <div className="scene-content">
          <p className="scene-title">
            <span>{String(panel.id).padStart(2, "0")}</span> {t(panel.title)}
          </p>

          <div className="scene-frame-wrap" style={{ "--ar": panel.ratio } as React.CSSProperties}>
            <div className="scene-shadow" />
            <div className="scene-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="scene-img" src={asset(panel.src)} alt={t(panel.title)} loading="lazy" draggable={false} />
              <div className="scene-flash" />
            </div>

            {panel.sfx?.map((sfx) => (
              <Sfx key={sfx.text} sfx={sfx} />
            ))}

            <div className="balloons">
              {panel.balloons.map((balloon, i) => (
                <Balloon key={i} balloon={balloon} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
