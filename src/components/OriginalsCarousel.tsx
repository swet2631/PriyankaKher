"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPlayFilled,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { OriginalItem } from "@/lib/content";

type Props = {
  heading: string;
  items: OriginalItem[];
  viewAll: { label: string; href: string };
};

export function OriginalsCarousel({ heading, items, viewAll }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(syncEdges, 100);
    window.addEventListener("resize", syncEdges);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  const onDown = (e: React.MouseEvent) => {
    const el = rowRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.pageX,
      scrollLeft: el.scrollLeft,
    };
  };

  const onMove = (e: React.MouseEvent) => {
    if (!drag.current.down || !rowRef.current) return;
    e.preventDefault();
    rowRef.current.scrollLeft =
      drag.current.scrollLeft - (e.pageX - drag.current.startX);
  };

  const onUp = () => {
    drag.current.down = false;
  };

  const scrollBy = (delta: number) => {
    rowRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-2.5 flex items-baseline gap-2.5">
        <span className="pk-section-label">{heading}</span>
        <span className="pk-section-line" />
        <div className="flex shrink-0 gap-1.5">
          <Button
            type="button"
            variant="icon"
            aria-label="Scroll left"
            disabled={atStart}
            style={{ opacity: atStart ? 0.3 : 1 }}
            onClick={() => scrollBy(-260)}
          >
            <IconChevronLeft size={12} stroke={2.2} />
          </Button>
          <Button
            type="button"
            variant="icon"
            aria-label="Scroll right"
            disabled={atEnd}
            style={{ opacity: atEnd ? 0.3 : 1 }}
            onClick={() => scrollBy(260)}
          >
            <IconChevronRight size={12} stroke={2.2} />
          </Button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="pk-originals-row"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onScroll={syncEdges}
      >
        {items.map((v) => (
          <a
            key={v.id}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pk-original-card"
            draggable={false}
          >
            <div
              className="pk-original-thumb"
              style={{ backgroundImage: `url(${v.thumb})` }}
            >
              <div className="pk-original-play">
                <div className="pk-original-play-btn">
                  <IconPlayerPlayFilled size={12} />
                </div>
              </div>
            </div>
            <div className="pk-original-title">{v.title}</div>
          </a>
        ))}

        <a
          href={viewAll.href}
          target="_blank"
          rel="noopener noreferrer"
          className="pk-original-card"
          draggable={false}
        >
          <div className="pk-view-all-thumb">
            <div className="pk-view-all-inner">
              <IconArrowRight size={16} stroke={1.8} />
              <span className="pk-view-all-label">{viewAll.label}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
