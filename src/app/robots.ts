import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const seo = getSeo();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
