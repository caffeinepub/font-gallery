import { ArrowRight, Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

interface HeroProps {
  onSearch: (value: string) => void;
  onBrowse: () => void;
}

export function Hero({ onSearch, onBrowse }: HeroProps) {
  const [heroSearch, setHeroSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (val: string) => {
    setHeroSearch(val);
    onSearch(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(heroSearch);
    onBrowse();
  };

  return (
    <section
      className="hero-gradient mesh-bg relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden"
      aria-label="Hero section"
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="wave-animate absolute -top-16 -left-24 w-[600px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.68 0.15 245) 0%, transparent 70%)",
          }}
        />
        <div
          className="wave-animate absolute top-1/2 -right-32 w-[500px] h-[300px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.6 0.12 260) 0%, transparent 70%)",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.8 0.1 240) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.1 240) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative max-w-[1300px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium mb-6"
          style={{
            background: "oklch(0.68 0.15 245 / 0.12)",
            border: "1px solid oklch(0.68 0.15 245 / 0.3)",
            color: "oklch(0.75 0.1 240)",
          }}
        >
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          44+ Premium Font Families
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight mb-4"
        >
          <span className="text-gradient">Discover Beautiful</span>
          <br />
          <span style={{ color: "oklch(0.93 0.01 240)" }}>Typography</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[clamp(1rem,2vw,1.125rem)] max-w-xl mx-auto mb-8 leading-relaxed"
          style={{ color: "oklch(0.62 0.03 230)" }}
        >
          Search and explore fonts across Serif, Sans-Serif, Monospace, Script,
          Display, and Handwriting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-full max-w-[620px] p-2 rounded-full"
            style={{
              background: "oklch(0.98 0.005 240)",
              boxShadow:
                "0 20px 60px oklch(0.08 0.02 240 / 0.8), 0 4px 12px oklch(0.08 0.02 240 / 0.5)",
            }}
          >
            <div className="flex items-center gap-3 flex-1 pl-4">
              <Search
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "oklch(0.55 0.04 235)" }}
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by name, style, or category..."
                value={heroSearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[15px] py-1"
                style={{ color: "oklch(0.2 0.02 240)" }}
                aria-label="Search fonts"
                data-ocid="hero.search_input"
              />
              {heroSearch && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="flex-shrink-0"
                  style={{ color: "oklch(0.55 0.04 235)" }}
                  aria-label="Clear search"
                >
                  <span aria-hidden="true">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <title>Clear</title>
                      <path
                        d="M2 2l10 10M12 2L2 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold hover:brightness-110 transition-all flex-shrink-0"
              style={{
                background: "oklch(0.22 0.035 240)",
                color: "oklch(0.93 0.01 240)",
              }}
              data-ocid="hero.primary_button"
            >
              Browse Collection
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-8 mt-10"
        >
          {[
            { label: "Font Families", value: "44+" },
            { label: "Categories", value: "6" },
            { label: "Monthly Users", value: "2M+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-[18px] font-bold"
                style={{ color: "oklch(0.82 0.07 235)" }}
              >
                {stat.value}
              </div>
              <div
                className="text-[12px]"
                style={{ color: "oklch(0.5 0.03 235)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
