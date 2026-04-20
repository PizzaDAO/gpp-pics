"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Slideshow from "./Slideshow";
import Flag from "./Flag";
import FullscreenGallery from "./FullscreenGallery";

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
  countryCode?: string;
  lat: number;
  lng: number;
  years: YearGroup[];
}

// Custom pizza pin icon
const pizzaIcon = new L.Icon({
  iconUrl: "/pin.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
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
  const [fullscreen, setFullscreen] = useState(false);
  const allYears = city.years.map((y) => y.year).sort((a, b) => b - a);
  const activeYear = selectedYear ?? allYears[0];
  const activePhotos =
    city.years.find((y) => y.year === activeYear)?.photos ?? [];

  return (
    <>
      <div className="w-[320px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-black text-lg" style={{ color: "#FFE135" }}>
            {city.countryCode && <><Flag countryCode={city.countryCode} /> </>}{city.name}
          </h3>
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/10"
            style={{ color: "#FFE135" }}
            aria-label="Open fullscreen gallery"
            title="Fullscreen gallery"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </button>
        </div>

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

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs" style={{ color: "#a0a0a0" }}>
            {activePhotos.length} photo{activePhotos.length !== 1 ? "s" : ""} from{" "}
            {activeYear}
          </p>
          <a
            href={`/compose?city=${city.slug}`}
            className="text-xs font-bold px-2.5 py-1 rounded-md transition-colors no-underline"
            style={{ background: "#FFE135", color: "#0a0a0a" }}
          >
            ✍️ Compose
          </a>
        </div>
      </div>

      {fullscreen &&
        createPortal(
          <FullscreenGallery
            photos={activePhotos}
            cityName={city.name}
            countryCode={city.countryCode}
            year={activeYear}
            onClose={() => setFullscreen(false)}
          />,
          document.body
        )}
    </>
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
