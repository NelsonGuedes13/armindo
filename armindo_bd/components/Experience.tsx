"use client";

import { LangProvider } from "./LangContext";
import SmoothScroll from "./SmoothScroll";
import Hud from "./Hud";
import TitleScreen from "./TitleScreen";
import PageOverview from "./PageOverview";
import PanelScene from "./PanelScene";
import EndScreen from "./EndScreen";
import { PANELS } from "@/data/story";

export default function Experience() {
  return (
    <LangProvider>
      <SmoothScroll />
      <Hud />
      <main>
        <TitleScreen />
        <PageOverview />
        {PANELS.map((panel, index) => (
          <PanelScene key={panel.id} panel={panel} index={index} />
        ))}
        <EndScreen />
      </main>
    </LangProvider>
  );
}
