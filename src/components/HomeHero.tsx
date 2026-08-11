"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PortraitCarousel } from "@/components/PortraitCarousel";
import { OriginalsCarousel } from "@/components/OriginalsCarousel";
import { ActivityBar } from "@/components/ActivityBar";
import { SocialIcon } from "@/components/SocialIcon";
import type { OriginalItem } from "@/lib/content";
import { buildMailtoLink } from "@/lib/mailto";

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
    messageText: string;
    listenHref: string;
  };
};

export function HomeHero({
  content,
  originals,
  year,
}: {
  content: Content;
  originals: OriginalItem[];
  year: number;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const quotes = content.quotes;
  const canRotateQuotes = quotes.length > 1;
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteOpacity, setQuoteOpacity] = useState(1);
  const [quoteShift, setQuoteShift] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pk-gsap-block", {
        opacity: 0,
        y: 18,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.35,
      });

      gsap.from(".pk-gsap-social", {
        opacity: 0,
        scale: 0.7,
        duration: 0.5,
        stagger: 0.06,
        ease: "back.out(1.6)",
        delay: 0.9,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!canRotateQuotes) return;

    let fade: number | undefined;
    const timer = window.setInterval(() => {
      setQuoteOpacity(0);
      setQuoteShift(8);
      fade = window.setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % quotes.length);
        setQuoteOpacity(1);
        setQuoteShift(0);
      }, 550);
    }, 4800);

    return () => {
      window.clearInterval(timer);
      if (fade !== undefined) window.clearTimeout(fade);
    };
  }, [canRotateQuotes, quotes.length]);

  return (
    <main ref={heroRef} className="pk-hero">
      <PortraitCarousel
        portraits={content.portraits}
        badge={content.artist.badge}
      />

      <div className="pk-left">
        <div className="flex flex-col gap-2">
          <span className="pk-eyebrow-rule pk-anim-rule" />
          <span className="pk-eyebrow">{content.artist.tagline}</span>
        </div>

        <h1 className="pk-name pk-anim-name">{content.artist.name}</h1>

        <p
          className={`pk-quote${canRotateQuotes ? " pk-quote--rotating" : ""}`}
          style={
            canRotateQuotes
              ? {
                  opacity: quoteOpacity,
                  transform: `translateY(${quoteShift}px)`,
                }
              : undefined
          }
        >
          &ldquo;{quotes[canRotateQuotes ? quoteIdx : 0]}&rdquo;
        </p>

        <div className="pk-actions pk-gsap-block">
          <a
            href={content.actions.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="pk-btn-primary"
          >
            {content.actions.primary.label}
          </a>
          <a
            href={buildMailtoLink(
              content.actions.secondary.email,
              content.actions.secondary.subject,
              content.actions.secondary.body
            )}
            className="pk-btn-secondary"
            onClick={(e) => {
              const href = buildMailtoLink(
                content.actions.secondary.email,
                content.actions.secondary.subject,
                content.actions.secondary.body
              );
              // Ensure mail client opens even if the long mailto attr is ignored
              e.preventDefault();
              window.location.href = href;
            }}
          >
            {content.actions.secondary.label}
          </a>
        </div>

        <div className="pk-gsap-block mt-2">
          <OriginalsCarousel
            heading={content.originals.heading}
            items={originals}
            viewAll={content.originals.viewAll}
          />
        </div>

        <div className="pk-gsap-block">
          <div className="mb-2.5 flex items-baseline gap-2.5">
            <span className="pk-section-label">{content.socials.heading}</span>
            <span className="pk-section-line" />
          </div>
          <div className="pk-socials">
            {content.socials.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="pk-social pk-gsap-social"
              >
                <SocialIcon id={link.id} size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <ActivityBar
        stageBar={content.stageBar}
        originals={originals}
        year={year}
      />
    </main>
  );
}
