import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  const seo = getSeo();
  return {
    name: "Priyanka Kher",
    short_name: "Priyanka Kher",
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#faf6f0",
    theme_color: "#4a2218",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
