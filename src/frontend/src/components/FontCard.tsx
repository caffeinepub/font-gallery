import { ExternalLink, Heart, Star, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { FontItem } from "../data/fonts";
import { categoryColors } from "../data/fonts";

interface FontCardProps {
  font: FontItem;
  index: number;
  onOpenDetail: (font: FontItem) => void;
}

export function FontCard({ font, index, onOpenDetail }: FontCardProps) {
  const [liked, setLiked] = useState(false);
  const colors = categoryColors[font.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
      className="card-hover rounded-2xl overflow-hidden cursor-pointer relative"
      style={{
        background: "oklch(0.19 0.025 235)",
        border: "1px solid oklch(0.26 0.03 235)",
        boxShadow: "0 4px 16px oklch(0.08 0.02 240 / 0.6)",
      }}
      onClick={() => onOpenDetail(font)}
      onKeyDown={(e) => e.key === "Enter" && onOpenDetail(font)}
      tabIndex={0}
      aria-label={`View details for ${font.name}`}
      data-ocid={`fonts.item.${index + 1}`}
    >
      {font.popularity > 70 && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium z-10"
          style={{
            background: "oklch(0.55 0.15 50 / 0.2)",
            border: "1px solid oklch(0.65 0.15 50 / 0.4)",
            color: "oklch(0.8 0.15 55)",
          }}
        >
          <Users className="w-2.5 h-2.5" />
          {font.usedBy}M+ sites
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-1.5">
          <h3
            className="font-semibold text-[15px] leading-snug truncate flex-1 min-w-0 pr-2"
            style={{ color: "oklch(0.92 0.01 240)" }}
          >
            {font.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {font.category}
          </span>
          <span
            className="text-[12px]"
            style={{ color: "oklch(0.5 0.03 235)" }}
          >
            {font.variants} styles
          </span>
        </div>

        <p
          className="text-[12px] mb-3"
          style={{ color: "oklch(0.55 0.03 235)" }}
        >
          by {font.designer}
        </p>

        <div
          className="font-preview-text py-4 px-3 rounded-xl mb-4 min-h-[72px] flex items-center"
          style={{
            fontFamily: `'${font.googleFontFamily}', serif`,
            background: "oklch(0.15 0.02 238)",
            border: "1px solid oklch(0.22 0.025 235)",
          }}
        >
          {font.previewText}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[11px]"
              style={{ color: "oklch(0.5 0.03 235)" }}
            >
              Popularity
            </span>
            <div className="flex items-center gap-1">
              <Star
                className="w-3 h-3"
                style={{ color: "oklch(0.75 0.15 70)" }}
              />
              <span
                className="text-[12px] font-medium"
                style={{ color: "oklch(0.8 0.05 235)" }}
              >
                {font.popularity}/100
              </span>
            </div>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "oklch(0.24 0.025 235)" }}
          >
            <div
              className="popularity-bar h-full rounded-full"
              style={{ width: `${font.popularity}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {font.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[11px]"
              style={{
                background: "oklch(0.22 0.025 235)",
                color: "oklch(0.55 0.04 235)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid oklch(0.22 0.025 235)" }}
        >
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12px] font-medium hover:brightness-125 transition-all"
            style={{ color: "oklch(0.68 0.15 245)" }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(font);
            }}
            aria-label={`Explore ${font.name}`}
            data-ocid={`fonts.button.${index + 1}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Explore
          </button>

          <button
            type="button"
            className={`flex items-center gap-1.5 text-[12px] transition-all ${liked ? "scale-110" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setLiked((prev) => !prev);
            }}
            aria-label={liked ? `Unlike ${font.name}` : `Like ${font.name}`}
            aria-pressed={liked}
            data-ocid={`fonts.toggle.${index + 1}`}
          >
            <Heart
              className="w-4 h-4 transition-all"
              style={{
                color: liked ? "oklch(0.65 0.22 15)" : "oklch(0.5 0.03 235)",
                fill: liked ? "oklch(0.65 0.22 15)" : "transparent",
              }}
            />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
