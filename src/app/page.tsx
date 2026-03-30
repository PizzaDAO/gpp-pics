import Slideshow from "@/components/Slideshow";
import MapWrapper from "@/components/MapWrapper";
import UncategorizedSection from "@/components/UncategorizedSection";
import photosData from "@/data/photos.json";

// Gather all photos for the hero slideshow
function getAllPhotos() {
  const photos: { src: string; label: string; countryCode?: string }[] = [];
  for (const city of photosData.cities) {
    const cc = (city as { countryCode?: string }).countryCode || "";
    for (const yearGroup of city.years) {
      for (const photo of yearGroup.photos) {
        photos.push({
          src: photo.src,
          label: `${city.name} ${yearGroup.year}`,
          countryCode: cc,
        });
      }
    }
  }
  return photos;
}

export default function Home() {
  const heroPhotos = getAllPhotos();
  const totalPhotos =
    heroPhotos.length +
    photosData.uncategorized.reduce((sum, g) => sum + g.photos.length, 0);
  const totalCities = photosData.cities.length;

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-6xl font-black">
          <span className="text-pizza-yellow">PizzaDAO&apos;s</span> Global Pizza
          Party
        </h1>
      </header>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Hero Slideshow */}
        <section className="mb-12">
          <Slideshow photos={heroPhotos} autoplay={true} />
        </section>

        {/* Map */}
        <section>
          <h2 className="text-2xl font-black text-pizza-yellow mb-4">
            Explore by City
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            Click a pin to see photos from that city.
          </p>
          <MapWrapper cities={photosData.cities} />
        </section>

        {/* Uncategorized */}
        <UncategorizedSection groups={photosData.uncategorized} />
      </div>
    </main>
  );
}
