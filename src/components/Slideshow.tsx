"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Flag from "./Flag";

interface SlideshowProps {
  photos: { src: string; label?: string; countryCode?: string }[];
  autoplay?: boolean;
  className?: string;
}

export default function Slideshow({
  photos,
  autoplay = true,
  className = "",
}: SlideshowProps) {
  const plugins = autoplay
    ? [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
    : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    const autoplayPlugin = emblaApi.plugins()?.autoplay;
    if (autoplayPlugin) autoplayPlugin.stop();
    emblaApi.scrollPrev();
    if (autoplayPlugin) autoplayPlugin.play();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    const autoplayPlugin = emblaApi.plugins()?.autoplay;
    if (autoplayPlugin) autoplayPlugin.stop();
    emblaApi.scrollNext();
    if (autoplayPlugin) autoplayPlugin.play();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (photos.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] bg-black"
            >
              <img
                src={photo.src}
                alt={photo.label || `Pizza party photo ${i + 1}`}
                className="w-full h-full object-contain"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {photo.label && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                  <p className="text-white font-bold text-lg">
                    {photo.countryCode && <><Flag countryCode={photo.countryCode} /> </>}
                    {photo.label}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next arrows - always visible */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pizza-yellow hover:text-black text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Previous photo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pizza-yellow hover:text-black text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Next photo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </>
      )}

      {/* Dots */}
      {photos.length > 1 && photos.length <= 20 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {photos.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === selectedIndex
                  ? "bg-pizza-yellow w-6"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter for large sets */}
      {photos.length > 20 && (
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full z-10">
          {selectedIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
