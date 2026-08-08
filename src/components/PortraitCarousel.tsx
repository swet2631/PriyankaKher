"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMusic,
  IconSparkles,
} from "@tabler/icons-react";

type Portrait = {
  src: string;
  alt: string;
  objectPosition: string;
};

export function PortraitCarousel({
  portraits,
  badge,
}: {
  portraits: Portrait[];
  badge: string;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const rightRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);

  const goTo = useCallback(
    (next: number) => {
      const total = portraits.length;
      const safe = ((next % total) + total) % total;
      idxRef.current = safe;
      setIdx(safe);
    },
    [portraits.length]
  );

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  useEffect(() => {
    if (paused || portraits.length <= 1) return;
    const timer = window.setInterval(() => {
      goTo(idxRef.current + 1);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, portraits.length, goTo]);

  useEffect(() => {
    const stage = stageRef.current;
    const badgeEl = badgeRef.current;
    if (!stage || !rightRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      if (badgeEl) gsap.set(badgeEl, { opacity: 1 });
      return;
    }

    let badgeCleanup: (() => void) | undefined;

    const ctx = gsap.context(() => {
      gsap.from(".pk-stage-bloom", {
        opacity: 0,
        scale: 0.7,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.15,
      });

      gsap.from(".pk-stage-ring", {
        opacity: 0,
        scale: 0.85,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.25,
      });

      gsap.from(".pk-stage-frame", {
        opacity: 0,
        y: 28,
        scale: 0.94,
        duration: 1,
        ease: "power3.out",
        delay: 0.35,
      });

      gsap.from(".pk-stage-note", {
        opacity: 0,
        y: 12,
        scale: 0.6,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.75,
      });

      gsap.from(".pk-stage-controls", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.9,
      });

      if (badgeEl) {
        const floatTween = gsap.to(badgeEl, {
          y: -2.5,
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.5,
        });

        gsap.set(badgeEl, { opacity: 0, y: -10, scale: 0.97 });
        gsap.set(".pk-badge-star", { opacity: 0.75, scale: 0.9 });

        gsap.to(badgeEl, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5,
        });

        gsap.to(".pk-badge-star", {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.7,
        });

        gsap.to(".pk-badge-star", {
          scale: 1.12,
          rotate: 8,
          duration: 1.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.6,
        });

        const shimmer = () => {
          gsap.fromTo(
            ".pk-badge-shimmer",
            { xPercent: -120 },
            { xPercent: 220, duration: 1.25, ease: "power1.inOut" }
          );
        };

        gsap.delayedCall(1.8, shimmer);
        const shimmerLoop = window.setInterval(shimmer, 4800);

        const onMove = (e: MouseEvent) => {
          const rect = badgeEl.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(badgeEl, {
            rotateY: px * 14,
            rotateX: -py * 10,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const onLeave = () => {
          gsap.to(badgeEl, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          });
          floatTween.resume();
        };

        const onEnter = () => {
          floatTween.pause();
          gsap.to(badgeEl, { scale: 1.04, duration: 0.3, ease: "power2.out" });
          shimmer();
          gsap.to(".pk-badge-star", {
            rotate: "+=180",
            duration: 0.55,
            ease: "power2.out",
          });
        };

        const burstSparks = () => {
          const sparks = badgeEl.querySelectorAll(".pk-badge-spark");
          sparks.forEach((spark, i) => {
            const angle = (i / sparks.length) * Math.PI * 2;
            gsap.fromTo(
              spark,
              { opacity: 1, x: 0, y: 0, scale: 1 },
              {
                opacity: 0,
                x: Math.cos(angle) * 22,
                y: Math.sin(angle) * 14,
                scale: 0.2,
                duration: 0.55,
                ease: "power2.out",
              }
            );
          });
        };

        const onClick = () => {
          gsap.fromTo(
            badgeEl,
            { scale: 0.96 },
            {
              scale: 1.05,
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
            }
          );
          shimmer();
          burstSparks();
        };

        badgeEl.addEventListener("mousemove", onMove);
        badgeEl.addEventListener("mouseenter", onEnter);
        badgeEl.addEventListener("mouseleave", onLeave);
        badgeEl.addEventListener("click", onClick);

        badgeCleanup = () => {
          window.clearInterval(shimmerLoop);
          badgeEl.removeEventListener("mousemove", onMove);
          badgeEl.removeEventListener("mouseenter", onEnter);
          badgeEl.removeEventListener("mouseleave", onLeave);
          badgeEl.removeEventListener("click", onClick);
        };
      }

      gsap.to(".pk-stage-ring--spin", {
        rotate: 360,
        duration: 48,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".pk-stage-ring--counter", {
        rotate: -360,
        duration: 64,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".pk-stage-note--a", {
        y: -8,
        rotate: -8,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".pk-stage-note--b", {
        y: -10,
        rotate: 10,
        duration: 3.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.4,
      });

      gsap.to(".pk-stage-bloom", {
        scale: 1.06,
        opacity: 0.85,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, rightRef);

    return () => {
      badgeCleanup?.();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const active = stageRef.current?.querySelector(
      ".pk-stage-img.is-active"
    ) as HTMLElement | null;
    if (!active) return;

    gsap.fromTo(
      active,
      { scale: 1.14, opacity: 0.35 },
      { scale: 1.08, opacity: 1, duration: 1.15, ease: "power2.out" }
    );
  }, [idx]);

  return (
    <div
      ref={rightRef}
      className="pk-right"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pk-badge-wrap">
        <div
          ref={badgeRef}
          className="pk-badge"
          role="button"
          tabIndex={0}
          aria-label={badge}
        >
          <span className="pk-badge-shimmer" aria-hidden />
          {/* <span className="pk-badge-live" aria-hidden /> */}
          <IconSparkles size={12} className="pk-badge-star" stroke={1.5} />
          <span className="pk-badge-text">{badge}</span>
          <span className="pk-badge-spark" aria-hidden />
          <span className="pk-badge-spark" aria-hidden />
          <span className="pk-badge-spark" aria-hidden />
          <span className="pk-badge-spark" aria-hidden />
          <span className="pk-badge-spark" aria-hidden />
          <span className="pk-badge-spark" aria-hidden />
        </div>
      </div>

      <div ref={stageRef} className="pk-stage">
        <div className="pk-stage-bloom" aria-hidden />
        <div className="pk-stage-ring pk-stage-ring--outer pk-stage-ring--spin" aria-hidden />
        <div className="pk-stage-ring pk-stage-ring--inner pk-stage-ring--counter" aria-hidden />
        <div className="pk-stage-arc" aria-hidden />

        <IconMusic
          className="pk-stage-note pk-stage-note--a"
          size={18}
          stroke={1.4}
          aria-hidden
        />
        <IconMusic
          className="pk-stage-note pk-stage-note--b"
          size={14}
          stroke={1.4}
          aria-hidden
        />

        <div className="pk-stage-frame">
          <div className="pk-stage-shine" aria-hidden />
          {portraits.map((p, i) => (
            <Image
              key={p.src}
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 900px) 70vw, 340px"
              priority={i === 0}
              className={`pk-stage-img${i === idx ? " is-active" : ""}`}
              style={{ objectPosition: p.objectPosition }}
            />
          ))}
          <div className="pk-stage-vignette" aria-hidden />
        </div>

        <div className="pk-stage-controls">
          <button
            type="button"
            className="pk-stage-nav"
            aria-label="Previous portrait"
            onClick={() => goTo(idx - 1)}
          >
            <IconChevronLeft size={14} stroke={2} />
          </button>

          <div className="pk-stage-progress" role="tablist" aria-label="Portraits">
            {portraits.map((p, i) => (
              <button
                key={p.src}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`Portrait ${i + 1}`}
                className={`pk-stage-pip${i === idx ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="pk-stage-nav"
            aria-label="Next portrait"
            onClick={() => goTo(idx + 1)}
          >
            <IconChevronRight size={14} stroke={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
