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
        src: "/uploads/IMG_4279.PNG",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
