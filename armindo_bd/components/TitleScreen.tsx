"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { STORY, PAGE } from "@/data/story";
import { asset } from "@/lib/asset";
import { useLang } from "./LangContext";

export default function TitleScreen() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".title-bg", { scale: 1.3, opacity: 0, duration: 2.2 })
        .from(".title-chapter", { y: -30, opacity: 0, duration: 0.8 }, 0.4)
        .from(".title-word", { yPercent: 120, rotate: 8, opacity: 0, stagger: 0.12, duration: 1, ease: "back.out(1.8)" }, 0.6)
        .from(".title-thread path", { strokeDashoffset: 1200, duration: 1.8, ease: "power2.inOut" }, 0.9)
        .from(".title-sub", { opacity: 0, letterSpacing: "0.6em", duration: 1.2 }, 1.3)
        .from(".title-hint", { opacity: 0, y: 20, duration: 0.8 }, 1.8);

      gsap.to(".title-content", {
        yPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".title-bg", {
        scale: 1.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  const words = t(STORY.title).split(" ");

  return (
    <section ref={root} className="title-screen" id="inicio">
      <div className="title-bg" style={{ backgroundImage: `url(${asset(PAGE.src)})` }} />
      <div className="halftone" />
      <div className="title-content">
        <p className="title-chapter">{t(STORY.chapter)}</p>
        <h1 className="title-main">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="title-word-mask">
              <span className="title-word">{word}</span>
            </span>
          ))}
        </h1>
        <svg className="title-thread" viewBox="0 0 600 60" aria-hidden="true">
          <path d="M5 40 C 120 0, 200 70, 300 30 S 480 0, 595 35" pathLength={1200} />
        </svg>
        <p className="title-sub">{t(STORY.subtitle)}</p>
        <p className="title-hint">
          {t(STORY.scrollHint)}
          <span className="title-hint-arrow">↓</span>
        </p>
      </div>
    </section>
  );
}
