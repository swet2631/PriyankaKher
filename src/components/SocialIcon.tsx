import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandSpotify,
  IconBrandYoutube,
  IconMusic,
} from "@tabler/icons-react";

const iconMap = {
  spotify: IconBrandSpotify,
  "youtube-music": IconMusic,
  youtube: IconBrandYoutube,
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
} as const;

export type SocialId = keyof typeof iconMap;

export function SocialIcon({
  id,
  size = 14,
}: {
  id: string;
  size?: number;
}) {
  const Icon = iconMap[id as SocialId] ?? IconMusic;
  return <Icon size={size} stroke={1.5} aria-hidden />;
}
