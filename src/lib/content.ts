import content from "@/data/content.json";
import seo from "@/data/seo.json";

export type OriginalItem = {
  title: string;
  id: string;
  url: string;
  thumb: string;
};

export function getContent() {
  return content;
}

export function getSeo() {
  return seo;
}

export function getOriginals(): OriginalItem[] {
  return content.originals.items.map((v) => ({
    ...v,
    url: `https://youtu.be/${v.id}`,
    thumb: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
  }));
}

export function getPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.artist.name,
    jobTitle: content.artist.roles,
    homeLocation: {
      "@type": "Place",
      name: content.artist.location,
    },
    sameAs: content.sameAs,
    url: seo.siteUrl,
    image: `${seo.siteUrl}${content.ogImage}`,
  };
}
