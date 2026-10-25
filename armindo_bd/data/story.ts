// Guião da BD: quadros, balões e onomatopeias.
// Todas as coordenadas são percentagens. Para editar falas basta mudar este ficheiro.

export type Lang = "pt" | "en";
export type Text = Record<Lang, string>;

export type BalloonKind = "speech" | "shout" | "thought" | "caption";
export type Tail = "left" | "right" | "bottom-left" | "bottom-right" | "top-left" | "top-right" | "none";

export interface Balloon {
  kind: BalloonKind;
  speaker?: "alfaiate" | "agricultor";
  text: Text;
  /** posição (canto superior esquerdo) relativa ao quadro, em % — pode sair do quadro */
  x: number;
  y: number;
  tail?: Tail;
  /** momento de entrada na timeline do quadro (0–1) */
  at: number;
}

export type SfxStyle = "impact" | "menace" | "motion";

/** Onomatopeia: as letras entram uma a uma com o estilo escolhido. */
export interface Sfx {
  text: string;
  /** impact = golpe seco; menace = tensão a tremer; motion = movimento rápido */
  style: SfxStyle;
  x: number;
  y: number;
  rotate: number;
  size?: number;
  at: number;
}

export interface Panel {
  id: number;
  src: string;
  /** proporção largura/altura do recorte */
  ratio: number;
  title: Text;
  /** posição horizontal da imagem (object-position %) no início e fim — usado sobretudo em mobile */
  pan: [number, number];
  zoom: [number, number];
  tilt: number;
  action?: boolean;
  balloons: Balloon[];
  sfx?: Sfx[];
}

export const PAGE = { width: 1536, height: 1024, src: "/bd-pagina.jpg" };

export const STORY = {
  title: { pt: "A Linha Vermelha", en: "The Red Thread" } as Text,
  subtitle: { pt: "O Alfaiate contra o Agricultor", en: "The Tailor versus the Farmer" } as Text,
  chapter: { pt: "Capítulo I", en: "Chapter I" } as Text,
  scrollHint: { pt: "Faz scroll para começar", en: "Scroll to begin" } as Text,
  end: { pt: "Fim", en: "The End" } as Text,
  endSub: { pt: "…ou apenas o primeiro ponto da costura?", en: "…or just the first stitch?" } as Text,
  restart: { pt: "Voltar ao início", en: "Back to the start" } as Text,
  speakers: {
    alfaiate: { pt: "O Alfaiate", en: "The Tailor" } as Text,
    agricultor: { pt: "O Agricultor", en: "The Farmer" } as Text,
  },
};

export const PANELS: Panel[] = [
  {
    id: 1,
    src: "/panels/painel-1.jpg",
    ratio: 4.47,
    title: { pt: "O Desafio", en: "The Challenge" },
    pan: [0, 100],
    zoom: [1.35, 1.05],
    tilt: -1.5,
    balloons: [
      {
        kind: "caption",
        text: { pt: "Vila de Monte Cipreste. Meio-dia em ponto.", en: "Cypress Hill village. High noon." },
        x: 1, y: -16, at: 0.12,
      },
      {
        kind: "speech", speaker: "alfaiate", tail: "bottom-left",
        text: {
          pt: "Esta vila deve-me uma dívida, agricultor. E eu cobro-a com linha vermelha.",
          en: "This village owes me a debt, farmer. And I collect it in red thread.",
        },
        x: 14, y: 62, at: 0.3,
      },
      {
        kind: "speech", speaker: "agricultor", tail: "bottom-right",
        text: {
          pt: "Aqui só se colhe o que se semeia. Vieste colher a tua derrota.",
          en: "Here you only reap what you sow. You came to reap your defeat.",
        },
        x: 60, y: 66, at: 0.5,
      },
    ],
    sfx: [
      { text: "RUMBLE", style: "menace", x: 40, y: -14, rotate: -4, size: 0.75, at: 0.08 },
    ],
  },
  {
    id: 2,
    src: "/panels/painel-2.jpg",
    ratio: 5.85,
    title: { pt: "O Olho de Botão", en: "The Button Eye" },
    pan: [25, 60],
    zoom: [1.5, 1.1],
    tilt: 1,
    balloons: [
      {
        kind: "thought", speaker: "alfaiate", tail: "bottom-left",
        text: {
          pt: "Troquei um olho por um botão… e mesmo assim vejo tudo.",
          en: "I traded an eye for a button… and still I see everything.",
        },
        x: 40, y: -38, at: 0.25,
      },
      {
        kind: "speech", speaker: "alfaiate", tail: "top-left",
        text: { pt: "Até o medo que tentas esconder.", en: "Even the fear you try to hide." },
        x: 6, y: 92, at: 0.5,
      },
    ],
    sfx: [
      { text: "GLARE!", style: "impact", x: 72, y: 4, rotate: -8, size: 0.7, at: 0.12 },
    ],
  },
  {
    id: 3,
    src: "/panels/painel-3.jpg",
    ratio: 5.41,
    title: { pt: "Olhos de Terra", en: "Eyes of Soil" },
    pan: [70, 45],
    zoom: [1.5, 1.1],
    tilt: -1,
    balloons: [
      {
        kind: "speech", speaker: "agricultor", tail: "bottom-right",
        text: {
          pt: "Medo? Já enterrei sementes mais duras do que tu.",
          en: "Fear? I've buried seeds tougher than you.",
        },
        x: 48, y: -40, at: 0.3,
      },
    ],
    sfx: [
      { text: "RUMBLE", style: "menace", x: 2, y: 8, rotate: -4, size: 0.6, at: 0.1 },
    ],
  },
  {
    id: 4,
    src: "/panels/painel-4.jpg",
    ratio: 2.61,
    title: { pt: "Ponto Cruz", en: "Cross-Stitch" },
    pan: [20, 70],
    zoom: [1.3, 1.05],
    tilt: -2,
    action: true,
    balloons: [
      {
        kind: "shout", speaker: "alfaiate", tail: "bottom-right",
        text: { pt: "PONTO CRUZ! Ninguém escapa à minha costura!", en: "CROSS-STITCH! No one escapes my seams!" },
        x: 52, y: -14, at: 0.2,
      },
    ],
    sfx: [
      { text: "WHIP!", style: "motion", x: 2, y: 58, rotate: -12, size: 0.9, at: 0.4 },
      { text: "SLASH!", style: "impact", x: 62, y: 44, rotate: 10, size: 1, at: 0.55 },
    ],
  },
  {
    id: 5,
    src: "/panels/painel-5.jpg",
    ratio: 2.01,
    title: { pt: "Três Dentes de Aço", en: "Three Steel Teeth" },
    pan: [30, 70],
    zoom: [1.3, 1.05],
    tilt: 2,
    action: true,
    balloons: [
      {
        kind: "shout", speaker: "agricultor", tail: "bottom-right",
        text: {
          pt: "Três dentes de aço — um por cada mentira tua!",
          en: "Three steel teeth — one for every lie you've told!",
        },
        x: 48, y: -12, at: 0.2,
      },
    ],
    sfx: [
      { text: "WHOOSH!", style: "motion", x: 2, y: 6, rotate: 8, size: 1, at: 0.42 },
    ],
  },
  {
    id: 6,
    src: "/panels/painel-6.jpg",
    ratio: 1.84,
    title: { pt: "O Choque", en: "The Clash" },
    pan: [40, 65],
    zoom: [1.4, 1.05],
    tilt: -1.5,
    action: true,
    balloons: [
      {
        kind: "caption",
        text: {
          pt: "Por um instante, o céu de Monte Cipreste parou para ver.",
          en: "For an instant, the sky over Cypress Hill stood still to watch.",
        },
        x: 54, y: 84, at: 0.55,
      },
    ],
    sfx: [
      { text: "CLANG!!", style: "impact", x: 18, y: 18, rotate: -8, size: 1.3, at: 0.25 },
      { text: "BOOM!", style: "impact", x: 70, y: -8, rotate: 8, size: 0.8, at: 0.35 },
    ],
  },
  {
    id: 7,
    src: "/panels/painel-7.jpg",
    ratio: 1.35,
    title: { pt: "A Agulha Não Treme", en: "The Needle Does Not Waver" },
    pan: [50, 50],
    zoom: [1.4, 1.1],
    tilt: 1.5,
    balloons: [
      {
        kind: "caption",
        text: { pt: "A agulha não treme.", en: "The needle does not waver." },
        x: -12, y: -8, at: 0.15,
      },
      {
        kind: "thought", speaker: "alfaiate", tail: "bottom-left",
        text: { pt: "Mais um ponto… só mais um.", en: "One more stitch… just one more." },
        x: 62, y: 72, at: 0.4,
      },
    ],
    sfx: [
      { text: "GRIP…", style: "menace", x: 4, y: 30, rotate: -6, size: 0.75, at: 0.3 },
    ],
  },
  {
    id: 8,
    src: "/panels/painel-8.jpg",
    ratio: 1.98,
    title: { pt: "A Terra Também Não", en: "Nor Does the Soil" },
    pan: [35, 65],
    zoom: [1.35, 1.05],
    tilt: -1,
    balloons: [
      {
        kind: "caption",
        text: { pt: "A terra também não.", en: "Nor does the soil." },
        x: -6, y: -8, at: 0.15,
      },
      {
        kind: "speech", speaker: "agricultor", tail: "bottom-right",
        text: {
          pt: "Os calos destas mãos são a minha armadura.",
          en: "The calluses on these hands are my armour.",
        },
        x: 56, y: 76, at: 0.4,
      },
    ],
    sfx: [
      { text: "CLENCH!", style: "impact", x: 4, y: 50, rotate: -6, size: 0.85, at: 0.55 },
    ],
  },
  {
    id: 9,
    src: "/panels/painel-9.jpg",
    ratio: 2.68,
    title: { pt: "Quando a Poeira Assentou", en: "When the Dust Settled" },
    pan: [20, 55],
    zoom: [1.6, 1.05],
    tilt: 0,
    balloons: [
      {
        kind: "caption",
        text: {
          pt: "Quando a poeira assentou, só um homem ficou de pé…",
          en: "When the dust settled, only one man was left standing…",
        },
        x: -4, y: -14, at: 0.2,
      },
      {
        kind: "speech", speaker: "alfaiate", tail: "top-left",
        text: { pt: "A costura… ainda não acabou.", en: "The stitching… isn't finished yet." },
        x: 50, y: 88, at: 0.5,
      },
    ],
    sfx: [
      { text: "FWOOO…", style: "motion", x: 4, y: 40, rotate: -6, size: 0.7, at: 0.3 },
      { text: "DOOM", style: "menace", x: 70, y: -8, rotate: 4, size: 0.9, at: 0.4 },
    ],
  },
];
