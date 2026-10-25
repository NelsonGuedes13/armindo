"use client";

import { LangProvider } from "./LangContext";
import SmoothScroll from "./SmoothScroll";
import Hud from "./Hud";
import Backdrop from "./Backdrop";
import TitleScreen from "./TitleScreen";
import PanelScene from "./PanelScene";
import EndScreen from "./EndScreen";
import { PANELS } from "@/data/story";

export default function Experience() {
  return (
    <LangProvider>
      <SmoothScroll />
      <Backdrop />
      <Hud />
      <main>
        <TitleScreen />
        {PANELS.map((panel, index) => (
          <PanelScene key={panel.id} panel={panel} index={index} />
        ))}
        <EndScreen />
      </main>
    </LangProvider>
  );
}
