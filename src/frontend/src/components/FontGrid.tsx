import { motion } from "motion/react";
import { useMemo } from "react";
import type { FontCategory, FontItem } from "../data/fonts";
import { fonts } from "../data/fonts";
import { FontCard } from "./FontCard";

interface FontGridProps {
  searchQuery: string;
  selectedCategory: FontCategory | "All";
  onOpenDetail: (font: FontItem) => void;
}

export function FontGrid({
  searchQuery,
  selectedCategory,
  onOpenDetail,
}: FontGridProps) {
  const filteredFonts = useMemo(() => {
    let result = fonts;

    if (selectedCategory !== "All") {
      result = result.filter((f) => f.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q)) ||
          f.designer.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q),
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <section className="max-w-[1300px] mx-auto px-6 py-10" id="font-grid">
      <div className="flex items-center justify-between mb-6">
        <motion.div
          key={`${searchQuery}-${selectedCategory}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-[14px]" style={{ color: "oklch(0.62 0.03 230)" }}>
            <span
              className="font-semibold"
              style={{ color: "oklch(0.82 0.07 235)" }}
            >
              Showing {filteredFonts.length}
            </span>{" "}
            of {fonts.length}+ fonts
            {searchQuery && (
              <span>
                {" "}
                for{" "}
                <em style={{ color: "oklch(0.78 0.1 240)" }}>
                  "{searchQuery}"
                </em>
              </span>
            )}
            {selectedCategory !== "All" && (
              <span>
                {" "}
                in{" "}
                <em style={{ color: "oklch(0.78 0.1 240)" }}>
                  {selectedCategory}
                </em>
              </span>
            )}
          </p>
        </motion.div>
        <div className="text-[12px]" style={{ color: "oklch(0.45 0.03 235)" }}>
          Sorted by popularity
        </div>
      </div>

      {filteredFonts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFonts.map((font, i) => (
            <FontCard
              key={font.id}
              font={font}
              index={i}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
          data-ocid="fonts.empty_state"
        >
          <div className="text-4xl mb-4">\uD83D\uDD0D</div>
          <h3
            className="text-[18px] font-semibold mb-2"
            style={{ color: "oklch(0.75 0.02 240)" }}
          >
            No fonts found
          </h3>
          <p className="text-[14px]" style={{ color: "oklch(0.5 0.03 235)" }}>
            Try a different search term or category filter.
          </p>
        </motion.div>
      )}
    </section>
  );
}
