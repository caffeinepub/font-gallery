import { motion } from "motion/react";
import type { FontCategory } from "../data/fonts";

const CATEGORIES: Array<FontCategory | "All"> = [
  "All",
  "Serif",
  "Sans-Serif",
  "Monospace",
  "Script",
  "Display",
  "Handwriting",
];

const CATEGORY_ICONS: Record<string, string> = {
  All: "\u2726",
  Serif: "T",
  "Sans-Serif": "A",
  Monospace: "</>",
  Script: "\u2712",
  Display: "\u25c6",
  Handwriting: "\u270d",
};

interface FilterChipsProps {
  selected: FontCategory | "All";
  onChange: (cat: FontCategory | "All") => void;
  counts: Record<FontCategory | "All", number>;
}

export function FilterChips({ selected, onChange, counts }: FilterChipsProps) {
  return (
    <div
      className="sticky top-16 z-40 py-4"
      style={{
        background: "oklch(0.14 0.02 240)",
        borderBottom: "1px solid oklch(0.22 0.025 235)",
      }}
    >
      <div className="max-w-[1300px] mx-auto px-6">
        <fieldset
          className="flex items-center gap-2 overflow-x-auto pb-1 border-0 p-0 m-0"
          style={{ scrollbarWidth: "none" }}
        >
          <legend className="sr-only">Filter by category</legend>
          <span
            className="text-[12px] font-medium flex-shrink-0 mr-1"
            style={{ color: "oklch(0.5 0.03 235)" }}
          >
            Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selected === cat;
            return (
              <motion.button
                key={cat}
                type="button"
                onClick={() => onChange(cat)}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium flex-shrink-0 transition-all"
                style={{
                  background: isActive
                    ? "oklch(0.68 0.15 245 / 0.2)"
                    : "oklch(0.22 0.025 235)",
                  border: isActive
                    ? "1px solid oklch(0.68 0.15 245 / 0.5)"
                    : "1px solid oklch(0.28 0.03 235)",
                  color: isActive
                    ? "oklch(0.82 0.1 240)"
                    : "oklch(0.62 0.03 230)",
                  boxShadow: isActive
                    ? "0 0 12px oklch(0.68 0.15 245 / 0.15)"
                    : "none",
                }}
                aria-pressed={isActive}
                data-ocid="filter.tab"
              >
                <span className="text-[11px]">{CATEGORY_ICONS[cat]}</span>
                {cat}
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive
                      ? "oklch(0.68 0.15 245 / 0.2)"
                      : "oklch(0.18 0.02 235)",
                    color: isActive
                      ? "oklch(0.78 0.1 240)"
                      : "oklch(0.5 0.03 235)",
                  }}
                >
                  {counts[cat]}
                </span>
              </motion.button>
            );
          })}
        </fieldset>
      </div>
    </div>
  );
}
