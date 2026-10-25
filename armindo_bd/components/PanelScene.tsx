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
      const vh = (n: number) => () => (window.innerHeight * n) / 100;
      // Em mobile os balões ficam por baixo do quadro: menos amplitude para não se sobreporem.
      const depth = () => (window.innerWidth < 760 ? 0.25 : 1);

      // O palco é fixo: a cena vive enquanto a secção atravessa o ecrã (entrada → pausa → saída)
      // e o quadro seguinte entra por cima enquanto este sai, sem ecrãs vazios entre eles.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
          invalidateOnRefresh: true,
          toggleClass: { targets: root.current?.querySelector(".scene-stage") ?? [], className: "is-live" },
        },
      });

      // Parallax em camadas: [entrada, início da pausa, fim da pausa, saída] em vh.
      // Quanto maior a amplitude, mais "perto" do leitor parece a camada.
      const layer = (target: string, [a, b, c, d]: number[], factor: () => number = () => 1) => {
        const v = (n: number) => () => vh(n)() * factor();
        tl.fromTo(target, { y: v(a) }, { y: v(b), duration: 0.3 }, 0)
          .to(target, { y: v(c), duration: 0.4 }, 0.3)
          .to(target, { y: v(d), duration: 0.3 }, 0.7);
      };
      layer(".scene-number", [25, 5, -5, -25]);
      layer(".scene-title", [50, 6, -6, -50]);
      layer(".scene-frame-wrap", [45, 5, -5, -45]);
      // balões e onomatopeias estão dentro do quadro: estes valores somam-se ao movimento dele
      layer(".balloons", [22, 4, -4, -22], depth);
      layer(".sfx-layer", [35, 8, -8, -35]);

      tl.fromTo(".scene-content", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.04)
        .fromTo(".scene-number", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0)

        // Entrada do quadro: recorte que se abre + rotação até à inclinação final
        .fromTo(
          ".scene-frame",
          {
            clipPath: fromLeft ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            rotate: panel.tilt * 4,
            scale: 0.88,
            xPercent: fromLeft ? -6 : 6,
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            rotate: panel.tilt,
            scale: 1,
            xPercent: 0,
            duration: 0.26,
            ease: "power2.out",
          },
          0.04,
        )
        .fromTo(".scene-shadow", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.12)

        // Câmara dentro do quadro: zoom + deslize + contra-parallax vertical
        .fromTo(
          ".scene-img",
          { scale: panel.zoom[0], objectPosition: `${panel.pan[0]}% 50%`, yPercent: -3 },
          { scale: panel.zoom[1], objectPosition: `${panel.pan[1]}% 50%`, yPercent: 3, duration: 1 },
          0,
        );

      // Os momentos do guião (0–1) são distribuídos pela pausa da cena
      const beat = (at: number) => 0.24 + at * 0.6;

      if (panel.action) {
        tl.fromTo(".speedlines", { opacity: 0, rotate: 0 }, { opacity: 0.55, rotate: 25, duration: 0.6 }, 0.15)
          .fromTo(".scene-tint", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.1);
      }

      // Balões e onomatopeias não são "arrastados" pelo scroll: ao passar o seu momento
      // tocam a animação completa (e invertem-na ao voltar atrás), para nunca ficarem a meio.
      const cue = (at: number, anim: gsap.core.Timeline) => {
        tl.call(
          () => {
            if ((tl.scrollTrigger?.direction ?? 1) > 0) anim.play();
            else anim.reverse();
          },
          undefined,
          at,
        );
      };

      // O quadro escurece ligeiramente quando chega o primeiro balão
      const firstAt = beat(Math.min(...panel.balloons.map((b) => b.at)));
      cue(firstAt, gsap.timeline({ paused: true }).fromTo(".scene-dim", { opacity: 0 }, { opacity: 1, duration: 0.5 }));

      gsap.utils.toArray<HTMLElement>(".balloon", root.current).forEach((el, i) => {
        const anim = gsap.timeline({ paused: true }).fromTo(
          el,
          { scale: 0.2, opacity: 0, y: 50, rotate: i % 2 ? 10 : -10 },
          { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 0.55, ease: "back.out(2.2)" },
        );
        cue(beat(panel.balloons[i]?.at ?? 0.3), anim);
      });

      // Onomatopeias: cada letra entra com impacto; nos golpes há flash e tremor do quadro
      gsap.utils.toArray<HTMLElement>(".sfx", root.current).forEach((el, i) => {
        const sfx = panel.sfx?.[i];
        if (!sfx) return;
        const chars = el.querySelectorAll(".sfx-char");
        const anim = gsap.timeline({ paused: true }).set(el, { opacity: 1 });

        if (sfx.style === "impact") {
          anim
            .fromTo(
              chars,
              { scale: 3, opacity: 0, y: -30 },
              { scale: 1, opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "back.out(2.5)" },
            )
            .fromTo(".scene-flash", { opacity: 0.85 }, { opacity: 0, duration: 0.45, immediateRender: false }, 0.12);

          if (!reduced) {
            anim.to(
              ".scene-frame",
              { keyframes: { x: [0, -14, 12, -8, 6, 0], y: [0, 6, -8, 4, -2, 0] }, duration: 0.4 },
              0.12,
            );
          }
        } else if (sfx.style === "motion") {
          anim.fromTo(
            chars,
            { xPercent: -160, skewX: -35, opacity: 0 },
            { xPercent: 0, skewX: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power4.out" },
          );
        } else {
          anim.fromTo(
            chars,
            { scale: 0.4, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" },
          );
        }
        cue(beat(sfx.at), anim);
      });

      // Saída suave: o conteúdo sobe e desvanece enquanto o próximo quadro já está a entrar
      tl.to(".scene-content", { opacity: 0, scale: 0.95, duration: 0.2, ease: "power1.in" }, 0.76)
        .to(".scene-number", { opacity: 0, duration: 0.2 }, 0.78);
      if (panel.action) tl.to(".scene-tint, .speedlines", { opacity: 0, duration: 0.2 }, 0.76);
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
        {panel.action && <div className="scene-tint" />}
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
              <div className="scene-dim" />
              <div className="scene-flash" />
            </div>

            <div className="sfx-layer">
              {panel.sfx?.map((sfx) => (
                <Sfx key={sfx.text} sfx={sfx} />
              ))}
            </div>

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
