const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefixa caminhos de /public com o basePath (necessário no GitHub Pages). */
export const asset = (path: string) => `${base}${path}`;
