# armindo_bd — A Linha Vermelha

Banda desenhada em página única com scroll imersivo: **O Alfaiate contra o Agricultor**.
Feita com Next.js (React) + GSAP ScrollTrigger + Lenis, em português e inglês.

## Experiência

1. **Ecrã de título** — o título entra animado e a linha vermelha desenha-se.
2. **Visão geral da página** — uma "câmara" percorre a página original completa e destaca os 9 quadros, um a um.
3. **Quadro a quadro** — cada quadro tem a sua cena: abre com um recorte, a câmara desliza sobre a imagem (Ken Burns) e os balões surgem em sequência. Nos quadros de ação, as onomatopeias (ZIIING!, SWOOSH!, CLANG!!) aparecem com flash e tremor.
4. **Ecrã final** — "FIM" e a página completa.

A interface inclui uma barra de progresso (a linha vermelha), um seletor PT/EN e navegação rápida entre quadros.

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # exportação estática para out/
```

Para publicar no GitHub Pages em `/<repo>`: `NEXT_PUBLIC_BASE_PATH=/armindo npm run build`.

## Editar a história

Todas as falas, legendas, onomatopeias e posições estão em `data/story.ts` (em PT e EN).
Os recortes dos quadros estão em `public/panels/` e a página original é `public/bd-pagina.jpg`.
