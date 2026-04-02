import { useCallback, useState } from "react";
import { FilterChips } from "./components/FilterChips";
import { FontDetailModal } from "./components/FontDetailModal";
import { FontGrid } from "./components/FontGrid";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import type { FontCategory, FontItem } from "./data/fonts";
import { fonts } from "./data/fonts";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    FontCategory | "All"
  >("All");
  const [selectedFont, setSelectedFont] = useState<FontItem | null>(null);
  const [darkMode] = useState(true);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleBrowse = useCallback(() => {
    const grid = document.getElementById("font-grid");
    if (grid) {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleToggleDark = useCallback(() => {
    // Dark-only design
  }, []);

  const counts = (
    [
      "All",
      "Serif",
      "Sans-Serif",
      "Monospace",
      "Script",
      "Display",
      "Handwriting",
    ] as const
  ).reduce(
    (acc, cat) => {
      acc[cat] =
        cat === "All"
          ? fonts.length
          : fonts.filter((f) => f.category === cat).length;
      return acc;
    },
    {} as Record<FontCategory | "All", number>,
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.14 0.02 240)" }}
    >
      <a
        href="#font-grid"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        style={{
          background: "oklch(0.68 0.15 245)",
          color: "oklch(0.12 0.02 240)",
        }}
      >
        Skip to font gallery
      </a>

      <Navbar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        darkMode={darkMode}
        onToggleDark={handleToggleDark}
      />

      <main className="flex-1">
        <Hero onSearch={handleSearch} onBrowse={handleBrowse} />
        <FilterChips
          selected={selectedCategory}
          onChange={setSelectedCategory}
          counts={counts}
        />
        <FontGrid
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onOpenDetail={setSelectedFont}
        />
      </main>

      <Footer />

      <FontDetailModal
        font={selectedFont}
        onClose={() => setSelectedFont(null)}
      />
    </div>
  );
}
