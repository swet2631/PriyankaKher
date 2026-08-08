"use client";

import { useState } from "react";
import { HomeHero } from "@/components/HomeHero";
import { SplashScreen } from "@/components/SplashScreen";
import type { OriginalItem } from "@/lib/content";

type Content = {
  artist: {
    name: string;
    tagline: string;
    badge: string;
  };
  quotes: string[];
  portraits: {
    src: string;
    alt: string;
    objectPosition: string;
  }[];
  actions: {
    primary: { label: string; href: string };
    secondary: {
      label: string;
      email: string;
      subject: string;
      body: string;
    };
  };
  originals: {
    heading: string;
    viewAll: { label: string; href: string };
  };
  socials: {
    heading: string;
    links: { id: string; label: string; href: string }[];
  };
  stageBar: {
    eyebrow: string;
    shuffleLabel: string;
    messageLabel: string;
    listenLabel: string;
    messageHref: string;
    listenHref: string;
  };
};

export function HomeShell({
  content,
  originals,
  year,
}: {
  content: Content;
  originals: OriginalItem[];
  year: number;
}) {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && (
        <SplashScreen
          name={content.artist.name}
          tagline={content.artist.tagline}
          onComplete={() => setSplashDone(true)}
        />
      )}
      <div className={splashDone ? "pk-home-reveal" : "pk-home-wait"}>
        <HomeHero content={content} originals={originals} year={year} />
      </div>
    </>
  );
}
