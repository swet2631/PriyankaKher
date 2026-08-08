import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const seo = getSeo();
  return [
    {
      url: seo.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
