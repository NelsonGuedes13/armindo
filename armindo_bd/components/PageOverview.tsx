"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PAGE, PANELS, STORY } from "@/data/story";
import { asset } from "@/lib/asset";
import { useLang } from "./LangContext";

type Box = [number, number, number, number];

const FULL_PAGE: Box = [0, 0, PAGE.width, PAGE.height];

/** Transformação (origem 0 0) que enquadra uma caixa da página no centro do ecrã. */
function frame(box: Box, fill: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const [x1, y1, x2, y2] = box;
  const w = x2 - x1;
  const h = y2 - y1;
  const scale = Math.min((vw * fill) / w, (vh * fill * 0.85) / h);
  return {
    scale,
    x: vw / 2 - (x1 + w / 2) * scale,
    y: vh / 2 - (y1 + h / 2) * scale,
  };
}

const spot = ([x1, y1, x2, y2]: Box) => ({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 });

export default function PageOverview() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);
  const labelRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(
    () => {
      const camera = ".overview-camera";
      const fit = (box: Box, fill: number, prop: "x" | "y" | "scale") => () => frame(box, fill)[prop];

      gsap.set(camera, { transformOrigin: "0 0" });
      gsap.set(".overview-spot", { ...spot(FULL_PAGE), opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Página inteira a entrar em cena
      tl.fromTo(
        camera,
        {
          x: fit(FULL_PAGE, 0.6, "x"),
          y: fit(FULL_PAGE, 0.6, "y"),
          scale: fit(FULL_PAGE, 0.6, "scale"),
          rotate: -4,
          opacity: 0.4,
        },
        {
          x: fit(FULL_PAGE, 0.92, "x"),
          y: fit(FULL_PAGE, 0.92, "y"),
          scale: fit(FULL_PAGE, 0.92, "scale"),
          rotate: 0,
          opacity: 1,
          duration: 1,
        },
      )
        .from(".overview-intro", { opacity: 0, y: 30, duration: 0.5 }, 0.3)
        .to(".overview-intro", { opacity: 0, y: -30, duration: 0.4 }, 1.2)
        .to(".overview-spot", { opacity: 1, duration: 0.4 }, 1.2);

      // A câmara visita cada quadro
      PANELS.forEach((panel, i) => {
        const at = 1.5 + i * 1.2;
        tl.to(
          camera,
          {
            x: fit(panel.box, 0.9, "x"),
            y: fit(panel.box, 0.9, "y"),
            scale: fit(panel.box, 0.9, "scale"),
            duration: 0.9,
          },
          at,
        )
          .to(".overview-spot", { ...spot(panel.box), duration: 0.9 }, at)
          .fromTo(
            labelRefs.current[i],
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
            at + 0.5,
          )
          .to(labelRefs.current[i], { opacity: 0, x: 40, duration: 0.25, ease: "power2.in" }, at + 1.05);
      });

      // Recuo final e mergulho no primeiro quadro
      const end = 1.5 + PANELS.length * 1.2;
      tl.to(
        camera,
        {
          x: fit(FULL_PAGE, 0.92, "x"),
          y: fit(FULL_PAGE, 0.92, "y"),
          scale: fit(FULL_PAGE, 0.92, "scale"),
          duration: 1,
        },
        end,
      )
        .to(".overview-spot", { ...spot(FULL_PAGE), opacity: 0, duration: 1 }, end)
        .fromTo(".overview-outro", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 }, end + 0.6)
        .to(
          camera,
          {
            x: fit(PANELS[0].box, 2.2, "x"),
            y: fit(PANELS[0].box, 2.2, "y"),
            scale: fit(PANELS[0].box, 2.2, "scale"),
            opacity: 0,
            duration: 1,
            ease: "power3.in",
          },
          end + 1.4,
        )
        .to(".overview-outro", { opacity: 0, scale: 1.4, duration: 0.6, ease: "power2.in" }, end + 1.6);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overview" aria-label={t(STORY.overviewIntro)}>
      <div className="overview-stage">
        <div className="speedlines" />
        <div className="overview-camera" style={{ width: PAGE.width, height: PAGE.height }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(PAGE.src)} alt="" width={PAGE.width} height={PAGE.height} draggable={false} />
          <div className="overview-spot" />
        </div>

        <p className="overview-intro overview-caption">{t(STORY.overviewIntro)}</p>
        {PANELS.map((panel, i) => (
          <p
            key={panel.id}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="overview-label"
          >
            <span className="overview-label-num">{String(panel.id).padStart(2, "0")}</span>
            {t(panel.title)}
          </p>
        ))}
        <p className="overview-outro overview-caption">{t(STORY.overviewOutro)}</p>
      </div>
    </section>
  );
}
