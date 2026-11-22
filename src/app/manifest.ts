import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cozinha Inteligente",
    short_name: "Cozinha",
    description: "Receitas personalizadas com os ingredientes que você tem em casa.",
    start_url: "/inicio",
    display: "standalone",
    background_color: "#faf5ee",
    theme_color: "#e8862a",
    lang: "pt-BR",
    icons: [
      { src: "/icone.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
