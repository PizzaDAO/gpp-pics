"use client";

import Slideshow from "./Slideshow";

interface UncategorizedPhoto {
  src: string;
  year: number;
}

interface UncategorizedGroup {
  slug: string;
  name: string;
  flag?: string;
  photos: UncategorizedPhoto[];
}

export default function UncategorizedSection({
  groups,
}: {
  groups: UncategorizedGroup[];
}) {
  if (groups.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-black text-pizza-yellow mb-2">
        Uncategorized
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        These photos need to be assigned to a specific city.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group.slug}
            className="bg-bg-card rounded-xl p-4 border border-white/10"
          >
            <h3 className="font-bold text-lg mb-3">{group.flag && <span>{group.flag} </span>}{group.name}</h3>
            <Slideshow
              photos={group.photos.map((p) => ({
                src: p.src,
                label: `${p.year}`,
              }))}
              autoplay={false}
            />
            <p className="text-xs text-text-secondary mt-2">
              {group.photos.length} photo{group.photos.length !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
