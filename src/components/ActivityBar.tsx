"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconBrandInstagram,
  IconBrandYoutube,
  IconCheck,
  IconDice5,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { VideoModal } from "@/components/VideoModal";
import type { OriginalItem } from "@/lib/content";

type StageBar = {
  eyebrow: string;
  shuffleLabel: string;
  messageLabel: string;
  listenLabel: string;
  messageHref: string;
  messageText: string;
  listenHref: string;
};

export function ActivityBar({
  stageBar,
  originals,
  year,
}: {
  stageBar: StageBar;
  originals: OriginalItem[];
  year: number;
}) {
  const tracks = useMemo(() => originals, [originals]);
  const [trackIdx, setTrackIdx] = useState(0);
  const [fade, setFade] = useState(1);
  const [activeTrack, setActiveTrack] = useState<OriginalItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (tracks.length <= 1 || modalOpen) return;

    let hide: number;
    const timer = window.setInterval(() => {
      setFade(0);
      hide = window.setTimeout(() => {
        setTrackIdx((i) => (i + 1) % tracks.length);
        setFade(1);
      }, 320);
    }, 4000);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(hide);
    };
  }, [tracks.length, modalOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const current = tracks[trackIdx] ?? tracks[0];

  const openTrack = useCallback((track: OriginalItem) => {
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx >= 0) {
      setTrackIdx(idx);
      setFade(1);
    }
    setActiveTrack(track);
    setModalOpen(true);
  }, [tracks]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setActiveTrack(null);
  }, []);

  const playCurrent = () => {
    if (!current) return;
    openTrack(current);
  };

  const surpriseMe = () => {
    if (!tracks.length) return;
    const pick = tracks[Math.floor(Math.random() * tracks.length)];
    openTrack(pick);
  };

  const openFavSongDm = async () => {
    const text = stageBar.messageText;
    let copied = false;

    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      try {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        copied = document.execCommand("copy");
        document.body.removeChild(area);
      } catch {
        copied = false;
      }
    }

    // Also try native text param (works on some Instagram app versions)
    const dmUrl = `${stageBar.messageHref}?text=${encodeURIComponent(text)}`;
    window.open(dmUrl, "_blank", "noopener,noreferrer");

    setToast(
      copied
        ? "Message copied — paste it in Instagram chat"
        : "Instagram opened — paste your favorite song message"
    );
  };

  return (
    <>
      <div className="pk-dock">
        <div className="pk-dock-glow" aria-hidden />

        <button
          type="button"
          className="pk-dock-now"
          onClick={playCurrent}
          aria-label={current ? `Play ${current.title}` : "Play"}
        >
          <span className="pk-dock-eq" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="pk-dock-now-copy">
            <span className="pk-dock-eyebrow">{stageBar.eyebrow}</span>
            <span className="pk-dock-track" style={{ opacity: fade }}>
              {current?.title ?? "Priyanka Kher"}
            </span>
          </span>
          <span className="pk-dock-play">
            <IconPlayerPlayFilled size={12} />
          </span>
        </button>

        <div className="pk-dock-actions">
          <button
            type="button"
            className="pk-dock-chip pk-dock-chip--primary"
            onClick={surpriseMe}
          >
            <IconDice5 size={14} stroke={1.6} />
            <span>{stageBar.shuffleLabel}</span>
          </button>
          <button
            type="button"
            className="pk-dock-chip"
            onClick={openFavSongDm}
          >
            <IconBrandInstagram size={14} stroke={1.6} />
            <span>{stageBar.messageLabel}</span>
          </button>
          <a
            href={stageBar.listenHref}
            target="_blank"
            rel="noopener noreferrer"
            className="pk-dock-chip"
          >
            <IconBrandYoutube size={14} stroke={1.6} />
            <span>{stageBar.listenLabel}</span>
          </a>
        </div>

        <span className="pk-dock-copy">© {year} Priyanka Kher</span>
      </div>

      {toast ? (
        <div className="pk-toast" role="status" aria-live="polite">
          <IconCheck size={14} stroke={2} />
          <span>{toast}</span>
        </div>
      ) : null}

      <VideoModal track={activeTrack} open={modalOpen} onClose={closeModal} />
    </>
  );
}
