"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IconMusic } from "@tabler/icons-react";

type SplashProps = {
  name: string;
  tagline: string;
  onComplete?: () => void;
};

export function SplashScreen({ name, tagline, onComplete }: SplashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      setDone(true);
      document.body.style.overflow = "";
      onComplete?.();
    };

    document.body.style.overflow = "hidden";

    if (reduceMotion) {
      const t = window.setTimeout(finish, 600);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }

    const ctx = gsap.context(() => {
      const letters = root.querySelectorAll(".pk-splash-letter");

      gsap.set(letters, { yPercent: 110, opacity: 0 });
      gsap.set(".pk-splash-rule", { scaleX: 0 });
      gsap.set(".pk-splash-tag", { opacity: 0, y: 12 });
      gsap.set(".pk-splash-mark", { opacity: 0, scale: 0.72 });
      gsap.set(".pk-splash-hint", { opacity: 0 });
      gsap.set(".pk-splash-ripple", { scale: 0.55, opacity: 0 });
      gsap.set(".pk-splash-orb", { opacity: 0, scale: 0.4 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.to(root, {
            yPercent: -110,
            duration: 1.05,
            ease: "power4.inOut",
            onComplete: finish,
          });
        },
      });

      tl.to(".pk-splash-mark", {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "back.out(1.6)",
      })
        .to(
          ".pk-splash-orb",
          {
            opacity: 0.85,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "back.out(1.8)",
          },
          "-=0.35"
        )
        .to(
          letters,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.035,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .to(
          ".pk-splash-rule",
          { scaleX: 1, duration: 0.55, ease: "power2.out" },
          "-=0.35"
        )
        .to(".pk-splash-tag", { opacity: 1, y: 0, duration: 0.55 }, "-=0.25")
        .to(".pk-splash-hint", { opacity: 0.55, duration: 0.4 }, "-=0.2")
        .to({}, { duration: 0.85 });

      gsap.to(".pk-splash-disc", {
        rotate: -360,
        duration: 14,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".pk-splash-ripple", {
        scale: 1.55,
        opacity: 0,
        duration: 2.4,
        ease: "power1.out",
        stagger: {
          each: 0.8,
          repeat: -1,
        },
      });

      gsap.to(".pk-splash-orb", {
        y: "+=10",
        duration: 2.2,
        ease: "sine.inOut",
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
      });
    }, rootRef);

    const skip = () => {
      ctx.revert();
      gsap.to(root, {
        yPercent: -110,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: finish,
      });
    };

    root.addEventListener("click", skip);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      ctx.revert();
      root.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (done) return null;

  const parts = name.split(" ");

  return (
    <div
      ref={rootRef}
      className="pk-splash"
      role="dialog"
      aria-label={`${name} introduction`}
    >
      <div className="pk-splash-bg" aria-hidden />
      <div className="pk-splash-grain" aria-hidden />

      <div className="pk-splash-orbs" aria-hidden>
        <span className="pk-splash-orb pk-splash-orb--1" />
        <span className="pk-splash-orb pk-splash-orb--2" />
        <span className="pk-splash-orb pk-splash-orb--3" />
        <span className="pk-splash-orb pk-splash-orb--4" />
        <span className="pk-splash-orb pk-splash-orb--5" />
      </div>

      <div className="pk-splash-inner">
        <div className="pk-splash-mark" aria-hidden>
          <div className="pk-splash-halo">
            <span className="pk-splash-ripple" />
            <span className="pk-splash-ripple" />
            <span className="pk-splash-ripple" />
            <div className="pk-splash-disc">
              <span className="pk-splash-disc-core" />
              <IconMusic className="pk-splash-disc-icon" size={22} stroke={1.6} />
            </div>
          </div>
        </div>

        <h1 className="pk-splash-name" aria-label={name}>
          {parts.map((word, wi) => (
            <span key={`${word}-${wi}`} className="pk-splash-word">
              {word.split("").map((ch, ci) => (
                <span key={`${ch}-${ci}`} className="pk-splash-letter-wrap">
                  <span className="pk-splash-letter">{ch}</span>
                </span>
              ))}
              {wi < parts.length - 1 ? (
                <span className="pk-splash-letter-wrap pk-splash-space">
                  <span className="pk-splash-letter">&nbsp;</span>
                </span>
              ) : null}
            </span>
          ))}
        </h1>

        <span className="pk-splash-rule" aria-hidden />
        <p className="pk-splash-tag">{tagline}</p>
        <span className="pk-splash-hint">Tap to enter</span>
      </div>
    </div>
  );
}
