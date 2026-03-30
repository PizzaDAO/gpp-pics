"use client";

import { useCallback, useEffect } from "react";
import Slideshow from "./Slideshow";
import Flag from "./Flag";

interface FullscreenGalleryProps {
  photos: { src: string }[];
  cityName: string;
  countryCode?: string;
  year: number;
  onClose: () => void;
}

export default function FullscreenGallery({
  photos,
  cityName,
  countryCode,
  year,
  onClose,
}: FullscreenGalleryProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
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

      {/* Gallery */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-5xl">
          <Slideshow
            photos={photos.map((p) => ({ src: p.src }))}
            autoplay={false}
          />
        </div>
      </div>

      {/* Photo count */}
      <div className="text-center pb-4 text-text-secondary text-sm">
        {photos.length} photo{photos.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
