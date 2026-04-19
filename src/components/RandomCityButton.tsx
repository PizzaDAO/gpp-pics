"use client";

import { useRouter } from "next/navigation";
import photosData from "@/data/photos.json";

export default function RandomCityButton() {
  const router = useRouter();

  function handleClick() {
    const cities = photosData.cities;
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    router.push(`/compose?city=${randomCity.slug}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-pizza-yellow text-bg-dark font-bold rounded-lg px-6 py-3 hover:brightness-110 transition-all active:scale-95"
    >
      🎲 Surprise Me
    </button>
  );
}
