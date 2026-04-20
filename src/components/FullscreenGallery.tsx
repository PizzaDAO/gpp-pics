"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Slideshow from "./Slideshow";
import Flag from "./Flag";

interface FullscreenGalleryProps {
  photos: { src: string }[];
  cityName: string;
  countryCode?: string;
  year: number;
  onClose: () => void;
  onDownload?: (src: string) => void;
}

export default function FullscreenGallery({
  photos,
  cityName,
  countryCode,
  year,
  onClose,
  onDownload,
}: FullscreenGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollToRef = useRef<((index: number) => void) | null>(null);
  const currentIndexRef = useRef(0);

  // Keep ref in sync for use in keydown handler
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const len = photos.length;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const next = (currentIndexRef.current - 1 + len) % len;
        scrollToRef.current?.(next);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (currentIndexRef.current + 1) % len;
        scrollToRef.current?.(next);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = (currentIndexRef.current - 5 + len) % len;
        scrollToRef.current?.(next);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (currentIndexRef.current + 5) % len;
        scrollToRef.current?.(next);
      }
    },
    [onClose, photos.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-white font-black text-2xl">
          {countryCode && (
            <>
              <Flag countryCode={countryCode} /> {" "}
            </>
          )}
          {cityName}{" "}
          <span className="text-pizza-yellow">{year}</span>
        </h2>
        <div className="flex items-center gap-2">
          {onDownload && (
            <button
              type="button"
              onClick={() => onDownload(photos[currentIndex].src)}
              className="bg-pizza-yellow text-bg-dark font-bold text-sm rounded-lg px-4 py-2 hover:brightness-110 transition-colors cursor-pointer"
            >
              Download
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-pizza-yellow transition-colors cursor-pointer p-2"
            aria-label="Close gallery"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-5xl">
          <Slideshow
            photos={photos.map((p) => ({ src: p.src }))}
            autoplay={false}
            onSlideChange={setCurrentIndex}
            scrollToRef={scrollToRef}
          />
        </div>
      </div>

      {/* Photo count */}
      <div className="text-center pb-4 text-text-secondary text-sm">
        {currentIndex + 1} / {photos.length} photo{photos.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
