"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Slideshow from "./Slideshow";

interface HeroPhoto {
  src: string;
  label: string;
  countryCode?: string;
}

export default function HeroSection({ photos }: { photos: HeroPhoto[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlug = photos[currentIndex]?.src.split("/")[2] || "";

  function handleRandom() {
    const slugs = [...new Set(photos.map((p) => p.src.split("/")[2]))];
    const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`/compose?city=${randomSlug}`);
  }

  function handleCompose() {
    if (currentSlug) {
      router.push(`/compose?city=${currentSlug}`);
    }
  }

  return (
    <div>
      <Slideshow
        photos={photos}
        autoplay={true}
        onSlideChange={setCurrentIndex}
      />
      <div className="flex justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={handleRandom}
          className="bg-bg-card border border-white/10 text-text-primary font-bold rounded-lg px-5 py-2.5 hover:bg-white/5 transition-all active:scale-95"
        >
          🎲 Random
        </button>
        <button
          type="button"
          onClick={handleCompose}
          className="bg-pizza-yellow text-bg-dark font-bold rounded-lg px-5 py-2.5 hover:brightness-110 transition-all active:scale-95"
        >
          ✍️ Compose
        </button>
      </div>
    </div>
  );
}
