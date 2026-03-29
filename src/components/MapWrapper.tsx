"use client";

import dynamic from "next/dynamic";

const PizzaMap = dynamic(() => import("@/components/PizzaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] rounded-xl bg-bg-card animate-pulse flex items-center justify-center">
      <span className="text-text-secondary">Loading map...</span>
    </div>
  ),
});

interface Photo {
  src: string;
}

interface YearGroup {
  year: number;
  photos: Photo[];
}

interface City {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  years: YearGroup[];
}

export default function MapWrapper({ cities }: { cities: City[] }) {
  return <PizzaMap cities={cities} />;
}
