import { Download, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FeaturedCard } from "./components/FeaturedCard";
import { GameCard } from "./components/GameCard";
import { GameModal } from "./components/GameModal";
import { CATEGORIES, type Game, type GameCategory, games } from "./data/games";
import { buildApkBlob } from "./utils/apkBuilder";

function formatYear() {
  return new Date().getFullYear();
}

function downloadHX1App() {
  const blob = buildApkBlob(
    "com.hx1mod.app",
    "HX1 App",
    "1.0",
    1,
    18 * 1024 * 1024,
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "HX1_App_v1.0.apk";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | GameCategory>(
    "All",
  );
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setActiveCategory("All");
  }, []);

  const handleCategorySelect = useCallback((cat: "All" | GameCategory) => {
    setActiveCategory(cat);
    setSearchQuery("");
  }, []);

  const handleOpenGame = useCallback((game: Game) => {
    setSelectedGame(game);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedGame(null);
  }, []);

  const featured = useMemo(() => {
    return [...games].sort((a, b) => b.downloads - a.downloads).slice(0, 8);
  }, []);

  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q && activeCategory === "All") return games;
    return games.filter((g) => {
      const matchCat =
        activeCategory === "All" || g.category === activeCategory;
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.modFeatures.some((f) => f.toLowerCase().includes(q)) ||
        g.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  const totalGames = games.length;

  return (
    <div
      className="min-h-screen flex flex-col grid-bg"
      style={{ background: "oklch(0.1 0.015 270)" }}
    >
      {/* Skip link */}
      <a
        href="#game-grid"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-semibold"
        style={{ background: "oklch(0.62 0.24 305)", color: "white" }}
      >
        Skip to games
      </a>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "oklch(0.1 0.015 270 / 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid oklch(0.25 0.04 305 / 0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/assets/generated/hx1-app-icon-transparent.dim_512x512.png"
              alt="HX1 App Icon"
              className="w-8 h-8 rounded-lg object-cover"
              style={{
                boxShadow: "0 0 10px oklch(0.62 0.24 305 / 0.5)",
              }}
            />
            <h1
              className="logo-gradient font-display font-black tracking-wider"
              style={{ fontSize: "1.3rem", letterSpacing: "0.06em" }}
            >
              HX1.mod
            </h1>
          </div>

          {/* Desktop search */}
          <div className="search-bar hidden sm:flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-lg">
            <Search size={15} style={{ color: "oklch(0.55 0.15 305)" }} />
            <input
              type="search"
              placeholder="Search 1000+ games, mods, categories..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              style={{ fontSize: "0.82rem" }}
              data-ocid="search.input"
              aria-label="Search games"
            />
          </div>

          {/* Download HX1 App Button */}
          <button
            type="button"
            onClick={downloadHX1App}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-rajdhani font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.24 305), oklch(0.5 0.22 260))",
              boxShadow: "0 0 14px oklch(0.62 0.24 305 / 0.45)",
              color: "white",
              fontSize: "0.72rem",
              letterSpacing: "0.06em",
              border: "1px solid oklch(0.65 0.22 305 / 0.4)",
            }}
            data-ocid="header.download_hx1_button"
            aria-label="Download HX1 App"
          >
            <Download size={13} />
            <span className="hidden xs:inline">GET HX1 APP</span>
            <span className="xs:hidden">GET APP</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.18 0.06 305 / 0.5) 0%, transparent 70%), oklch(0.1 0.015 270)",
            borderBottom: "1px solid oklch(0.2 0.04 305 / 0.3)",
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url('/assets/generated/hx1-hero-bg.dim_1200x400.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 text-center">
            <div
              className="inline-block px-3 py-1 rounded-full mb-4 font-rajdhani font-bold tracking-widest"
              style={{
                background: "oklch(0.18 0.04 305 / 0.5)",
                border: "1px solid oklch(0.4 0.16 305 / 0.4)",
                color: "oklch(0.78 0.2 305)",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
              }}
            >
              ⚡ 1000+ GAMES · 100% FREE · UNLIMITED EVERYTHING
            </div>

            {/* App Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src="/assets/generated/hx1-app-icon-transparent.dim_512x512.png"
                alt="HX1.mod"
                className="w-14 h-14 rounded-2xl"
                style={{
                  boxShadow:
                    "0 0 24px oklch(0.62 0.24 305 / 0.6), 0 0 60px oklch(0.55 0.22 305 / 0.3)",
                }}
              />
              <h2
                className="logo-gradient font-display font-black"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  letterSpacing: "0.06em",
                  lineHeight: 1.1,
                }}
              >
                HX1.mod
              </h2>
            </div>

            <p
              className="text-muted-foreground max-w-md mx-auto mb-5"
              style={{ fontSize: "clamp(0.82rem, 2vw, 1rem)" }}
            >
              Free MOD APKs — Unlimited Money, Coins &amp; Gems for every game
            </p>

            {/* Download HX1 App CTA */}
            <div className="mb-5">
              <button
                type="button"
                onClick={downloadHX1App}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold tracking-wider transition-all hover:scale-105 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.24 305), oklch(0.55 0.2 200))",
                  boxShadow:
                    "0 0 24px oklch(0.62 0.24 305 / 0.5), 0 4px 16px oklch(0.04 0.01 270 / 0.5)",
                  color: "white",
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  border: "1px solid oklch(0.7 0.22 305 / 0.3)",
                }}
              >
                <Download size={18} />
                DOWNLOAD HX1 APP
              </button>
              <p
                className="mt-1.5 text-muted-foreground"
                style={{ fontSize: "0.65rem" }}
              >
                Free · v1.0 · 18 MB · Android
              </p>
            </div>

            {/* Mobile search */}
            <div className="search-bar sm:hidden flex items-center gap-2 px-3 py-2.5 rounded-lg max-w-sm mx-auto mb-4">
              <Search size={15} style={{ color: "oklch(0.55 0.15 305)" }} />
              <input
                type="search"
                placeholder="Search 1000+ games..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                style={{ fontSize: "0.9rem" }}
                data-ocid="search.input"
                aria-label="Search games"
              />
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                { label: "Games", value: `${totalGames.toLocaleString()}+` },
                { label: "All Free", value: "100%" },
                { label: "MOD Features", value: "500+" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p
                    className="font-display font-black"
                    style={{ color: "oklch(0.8 0.2 305)", fontSize: "1.2rem" }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
                  >
                    {s.label.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED / POPULAR ── */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-1 h-5 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.8 0.22 305), oklch(0.72 0.18 200))",
              }}
            />
            <h2
              className="font-display font-bold tracking-wider"
              style={{ fontSize: "0.85rem", letterSpacing: "0.1em" }}
            >
              POPULAR GAMES
            </h2>
            <span
              className="px-2 py-0.5 rounded-full font-rajdhani font-bold"
              style={{
                background: "oklch(0.18 0.04 305 / 0.4)",
                border: "1px solid oklch(0.35 0.12 305 / 0.4)",
                color: "oklch(0.72 0.18 305)",
                fontSize: "0.65rem",
              }}
            >
              TOP PICKS
            </span>
          </div>

          <div
            className="featured-scroll flex gap-3 overflow-x-auto pb-2"
            aria-label="Popular games"
          >
            {featured.map((game) => (
              <FeaturedCard key={game.id} game={game} onOpen={handleOpenGame} />
            ))}
          </div>
        </section>

        {/* ── CATEGORY TABS ── */}
        <section className="max-w-7xl mx-auto px-4 pb-4">
          <div
            className="featured-scroll flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Game categories"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => handleCategorySelect(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full font-rajdhani font-bold transition-all ${
                  activeCategory === cat ? "tab-active" : "tab-inactive"
                }`}
                style={{ fontSize: "0.75rem" }}
                data-ocid={`category.${cat.toLowerCase().replace(/\s+/g, "_")}.tab`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── GAME GRID ── */}
        <section id="game-grid" className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-1 h-5 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.72 0.18 200), oklch(0.62 0.22 142))",
              }}
            />
            <h2
              className="font-display font-bold tracking-wider"
              style={{ fontSize: "0.85rem", letterSpacing: "0.1em" }}
            >
              {searchQuery
                ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`
                : activeCategory === "All"
                  ? "ALL GAMES"
                  : activeCategory.toUpperCase()}
            </h2>
            <span
              className="px-2 py-0.5 rounded-full font-rajdhani font-bold"
              style={{
                background: "oklch(0.16 0.02 270)",
                border: "1px solid oklch(0.28 0.04 270)",
                color: "oklch(0.6 0.04 270)",
                fontSize: "0.65rem",
              }}
            >
              {filteredGames.length.toLocaleString()} apps
            </span>
          </div>

          {filteredGames.length === 0 ? (
            <div className="text-center py-16" data-ocid="game.empty_state">
              <p
                className="font-display font-bold mb-2"
                style={{ color: "oklch(0.4 0.06 305)", fontSize: "1.2rem" }}
              >
                NO RESULTS
              </p>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.82rem" }}
              >
                Try a different search or category
              </p>
            </div>
          ) : (
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
              }}
            >
              {filteredGames.map((game, i) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={i + 1}
                  onOpen={handleOpenGame}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="text-center py-5 px-4"
        style={{
          background: "oklch(0.08 0.012 270)",
          borderTop: "1px solid oklch(0.2 0.03 305 / 0.4)",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <img
            src="/assets/generated/hx1-app-icon-transparent.dim_512x512.png"
            alt="HX1"
            className="w-5 h-5 rounded-md"
          />
          <p
            className="font-display font-bold logo-gradient"
            style={{ fontSize: "0.9rem", letterSpacing: "0.08em" }}
          >
            HX1.mod
          </p>
        </div>
        <p
          className="text-muted-foreground mb-2"
          style={{ fontSize: "0.7rem" }}
        >
          {totalGames.toLocaleString()}+ Free MOD APKs · All mods include
          Unlimited Money/Coins
        </p>
        <p className="text-muted-foreground" style={{ fontSize: "0.65rem" }}>
          HX1.mod © {formatYear()} ·{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.6 0.1 305)" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>

      {/* ── MODAL ── */}
      <GameModal game={selectedGame} onClose={handleCloseModal} />
    </div>
  );
}
