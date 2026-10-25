"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PAGE, STORY } from "@/data/story";
import { asset } from "@/lib/asset";
import { scrollToTarget } from "@/lib/scroll";
import { useLang } from "./LangContext";

export default function EndScreen() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "center center", scrub: 0.8 },
      });
      tl.fromTo(".end-page", { scale: 0.6, rotate: -6, opacity: 0 }, { scale: 1, rotate: -2, opacity: 1, ease: "power3.out" })
        .fromTo(".end-thread path", { strokeDashoffset: 1200 }, { strokeDashoffset: 0, ease: "none" }, 0.2)
        .fromTo(".end-title", { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, ease: "back.out(1.6)" }, 0.4)
        .fromTo(".end-sub, .end-restart", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 }, 0.7);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="end-screen" id="fim">
      <div className="halftone" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="end-page" src={asset(PAGE.src)} alt={t(STORY.title)} loading="lazy" />
      <svg className="end-thread" viewBox="0 0 600 60" aria-hidden="true">
        <path d="M5 30 C 150 70, 220 -10, 320 30 S 500 60, 595 20" pathLength={1200} />
      </svg>
      <h2 className="end-title">{t(STORY.end)}</h2>
      <p className="end-sub">{t(STORY.endSub)}</p>
      <button type="button" className="end-restart" onClick={() => scrollToTarget(0)}>
        ↑ {t(STORY.restart)}
      </button>
    </section>
  );
}
