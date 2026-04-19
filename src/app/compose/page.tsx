"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import photosData from "@/data/photos.json";
import { COUNTRY_NAMES } from "@/components/Flag";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a 2-letter country code to its emoji flag (regional-indicator pair). */
function emojiFlag(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

/** Days remaining until the target date (May 22 2026). */
function daysUntilGPP(): number {
  const target = new Date("2026-05-22T00:00:00");
  const now = new Date();
  // Zero-out time portion for a clean day diff
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = target.getTime() - todayMidnight.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ---------------------------------------------------------------------------
// Types derived from photos.json
// ---------------------------------------------------------------------------

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
  countryCode: string;
}

// Sort cities alphabetically for the dropdown
const sortedCities: City[] = [...(photosData.cities as City[])].sort((a, b) =>
  a.name.localeCompare(b.name)
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ComposePage() {
  // --- state ----------------------------------------------------------------
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [host, setHost] = useState("");
  const [hostError, setHostError] = useState("");
  const [tweetText, setTweetText] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const days = useMemo(() => daysUntilGPP(), []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // --- derived values -------------------------------------------------------
  const filteredCities = useMemo(() => {
    if (!search) return sortedCities;
    const q = search.toLowerCase();
    return sortedCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (COUNTRY_NAMES[c.countryCode] || "").toLowerCase().includes(q)
    );
  }, [search]);

  const countryName = selectedCity
    ? COUNTRY_NAMES[selectedCity.countryCode] || selectedCity.countryCode.toUpperCase()
    : "";

  const allPhotos = useMemo(() => {
    if (!selectedCity) return [];
    return selectedCity.years.flatMap((y) => y.photos);
  }, [selectedCity]);

  // --- build tweet whenever inputs change -----------------------------------
  useEffect(() => {
    if (!selectedCity) {
      setTweetText(
        `${days} days until the Global Pizza Party on Friday, May 22!`
      );
      return;
    }

    const flag = emojiFlag(selectedCity.countryCode);
    const handle = host ? `@${host}` : "@handle";

    setTweetText(
      `${days} days until the Global Pizza Party on Friday, May 22!\n\n${flag} Last year's party in ${selectedCity.name}, ${countryName}. Hosted by ${handle}:`
    );
  }, [days, selectedCity, countryName, host]);

  // --- handlers -------------------------------------------------------------
  function selectCity(city: City) {
    setSelectedCity(city);
    setSearch(city.name);
    setDropdownOpen(false);
    setSelectedPhoto(null);
  }

  function handleHostChange(value: string) {
    const stripped = value.replace(/^@/, "");
    setHost(stripped);
    if (stripped && !/^[A-Za-z0-9_]{1,15}$/.test(stripped)) {
      setHostError("Handle must be 1-15 characters: letters, numbers, or underscores.");
    } else {
      setHostError("");
    }
  }

  async function copyTweet() {
    try {
      await navigator.clipboard.writeText(tweetText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = tweetText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function postOnX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, "_blank", "noopener");
  }

  function downloadPhoto(src: string) {
    const a = document.createElement("a");
    a.href = src;
    a.download = src.split("/").pop() || "photo.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // --- character counter styling -------------------------------------------
  const charCount = tweetText.length;
  const overLimit = charCount > 280;

  // --- render ---------------------------------------------------------------
  return (
    <main className="flex-1">
      <header className="text-center py-8 px-4">
        <h1 className="text-3xl md:text-5xl font-black">
          <span className="text-pizza-yellow">Compose</span> a Tweet
        </h1>
        <p className="mt-2 text-text-secondary text-lg">
          {days} days until the Global Pizza Party on Friday, May 22!
        </p>
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
        {/* ---- City selector ---- */}
        <section>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            City
          </label>
          <div ref={dropdownRef} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setDropdownOpen(true);
                if (selectedCity && e.target.value !== selectedCity.name) {
                  setSelectedCity(null);
                }
              }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search for a city..."
              className="w-full rounded-lg bg-bg-card border border-white/10 px-4 py-2.5 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-pizza-yellow/60"
            />
            {dropdownOpen && filteredCities.length > 0 && (
              <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg bg-bg-card border border-white/10 shadow-lg">
                {filteredCities.map((city) => (
                  <li key={city.slug}>
                    <button
                      type="button"
                      onClick={() => selectCity(city)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-white/5 transition-colors"
                    >
                      <span
                        className={`fi fi-${city.countryCode}`}
                        style={{ display: "inline-block", width: "1.2em", height: "0.9em" }}
                      />
                      <span className="text-text-primary">{city.name}</span>
                      <span className="ml-auto text-xs text-text-secondary">
                        {COUNTRY_NAMES[city.countryCode] || city.countryCode.toUpperCase()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {dropdownOpen && filteredCities.length === 0 && search && (
              <div className="absolute z-50 mt-1 w-full rounded-lg bg-bg-card border border-white/10 px-4 py-3 text-text-secondary text-sm">
                No cities found.
              </div>
            )}
          </div>
          {selectedCity && (
            <p className="mt-1 text-sm text-text-secondary">
              {emojiFlag(selectedCity.countryCode)} {selectedCity.name}, {countryName}
            </p>
          )}
        </section>

        {/* ---- Host handle ---- */}
        <section>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Host Twitter Handle
          </label>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-lg">@</span>
            <input
              type="text"
              value={host}
              onChange={(e) => handleHostChange(e.target.value)}
              placeholder="handle"
              maxLength={16}
              className="flex-1 rounded-lg bg-bg-card border border-white/10 px-4 py-2.5 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-pizza-yellow/60"
            />
          </div>
          {hostError && (
            <p className="mt-1 text-sm text-pizza-red">{hostError}</p>
          )}
        </section>

        {/* ---- Tweet preview ---- */}
        <section>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Tweet Preview
          </label>
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            rows={5}
            className="w-full rounded-lg bg-bg-card border border-white/10 px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-pizza-yellow/60 resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-sm font-medium ${
                overLimit ? "text-pizza-red" : "text-text-secondary"
              }`}
            >
              {charCount}/280
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyTweet}
                className="rounded-lg bg-bg-card border border-white/10 px-4 py-2 text-sm font-medium text-text-primary hover:bg-white/5 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                onClick={postOnX}
                className="rounded-lg bg-pizza-yellow px-4 py-2 text-sm font-bold text-bg-dark hover:brightness-110 transition-colors"
              >
                Post on X
              </button>
            </div>
          </div>
        </section>

        {/* ---- Photo picker ---- */}
        {selectedCity && allPhotos.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">
              Photos from {selectedCity.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allPhotos.map((photo) => (
                <div
                  key={photo.src}
                  className={`relative group rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    selectedPhoto === photo.src
                      ? "border-pizza-yellow"
                      : "border-transparent hover:border-white/20"
                  }`}
                  onClick={() => setSelectedPhoto(photo.src)}
                >
                  <img
                    src={photo.src}
                    alt={`${selectedCity.name} pizza party`}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  {/* Download overlay */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(photo.src);
                    }}
                    className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedCity && allPhotos.length === 0 && (
          <p className="text-text-secondary text-sm">
            No photos available for {selectedCity.name}.
          </p>
        )}
      </div>
    </main>
  );
}
