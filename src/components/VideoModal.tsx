"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconExternalLink, IconX } from "@tabler/icons-react";
import type { OriginalItem } from "@/lib/content";

type Props = {
  track: OriginalItem | null;
  open: boolean;
  onClose: () => void;
};

export function VideoModal({ track, open, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open || !track) return null;

  const embedSrc = `https://www.youtube.com/embed/${track.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return createPortal(
    <div
      className="pk-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="pk-modal-backdrop"
        aria-label="Close video"
        onClick={onClose}
      />

      <div className="pk-modal-panel">
        <div className="pk-modal-head">
          <div className="pk-modal-titles">
            <span className="pk-modal-eyebrow">Now playing</span>
            <h2 id={titleId} className="pk-modal-title">
              {track.title}
            </h2>
          </div>
          <div className="pk-modal-head-actions">
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pk-modal-link"
              aria-label="Open on YouTube"
            >
              <IconExternalLink size={16} stroke={1.6} />
            </a>
            <button
              ref={closeRef}
              type="button"
              className="pk-modal-close"
              aria-label="Close"
              onClick={onClose}
            >
              <IconX size={18} stroke={1.8} />
            </button>
          </div>
        </div>

        <div className="pk-modal-frame">
          <iframe
            key={track.id}
            src={embedSrc}
            title={track.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="pk-modal-iframe"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
