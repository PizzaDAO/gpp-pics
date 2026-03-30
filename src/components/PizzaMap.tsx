"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Slideshow from "./Slideshow";

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
  flag?: string;
  lat: number;
  lng: number;
  years: YearGroup[];
}

// Custom pizza pin icon
const pizzaIcon = new L.DivIcon({
  html: `<div style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); cursor: pointer;">&#127829;</div>`,
  className: "pizza-marker",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});

function FitBounds({ cities }: { cities: City[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || cities.length === 0) return;
    const bounds = L.latLngBounds(cities.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4 });
    fitted.current = true;
  }, [map, cities]);

  return null;
}

function CityPopup({ city }: { city: City }) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const allYears = city.years.map((y) => y.year).sort((a, b) => b - a);
  const activeYear = selectedYear ?? allYears[0];
  const activePhotos =
    city.years.find((y) => y.year === activeYear)?.photos ?? [];

  return (
    <div className="w-[320px]">
      <h3 className="font-black text-lg mb-2" style={{ color: "#FFE135" }}>
        {city.flag && <span>{city.flag} </span>}{city.name}
      </h3>

      {allYears.length > 1 && (
        <div className="flex gap-1 mb-2">
          {allYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className="px-2 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer"
              style={{
                background: year === activeYear ? "#FFE135" : "#333",
                color: year === activeYear ? "#000" : "#fff",
              }}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      <Slideshow
        photos={activePhotos.map((p) => ({ src: p.src }))}
        autoplay={false}
      />

      <p className="text-xs mt-2" style={{ color: "#a0a0a0" }}>
        {activePhotos.length} photo{activePhotos.length !== 1 ? "s" : ""} from{" "}
        {activeYear}
      </p>
    </div>
  );
}

export default function PizzaMap({ cities }: { cities: City[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] rounded-xl bg-bg-card animate-pulse flex items-center justify-center">
        <span className="text-text-secondary">Loading map...</span>
      </div>
    );
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "600px", borderRadius: "12px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds cities={cities} />
      {cities.map((city) => (
        <Marker key={city.slug} position={[city.lat, city.lng]} icon={pizzaIcon}>
          <Popup maxWidth={360} minWidth={320}>
            <CityPopup city={city} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
