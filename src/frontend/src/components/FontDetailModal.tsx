import { CheckCheck, Copy, ExternalLink, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FontItem } from "../data/fonts";
import { categoryColors } from "../data/fonts";

interface FontDetailModalProps {
  font: FontItem | null;
  onClose: () => void;
}

const WEIGHT_LABELS: [number, string][] = [
  [300, "Light"],
  [400, "Regular"],
  [500, "Medium"],
  [600, "SemiBold"],
  [700, "Bold"],
  [800, "ExtraBold"],
];

export function FontDetailModal({ font, onClose }: FontDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const cssSnippet = font
    ? `/* ${font.name} via Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=${font.googleFontFamily.replace(/ /g, "+")}:wght@400;700&display=swap');

body {
  font-family: '${font.googleFontFamily}', sans-serif;
}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(cssSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {font && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{
              background: "oklch(0.05 0.01 240 / 0.85)",
              backdropFilter: "blur(8px)",
            }}
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Using section instead of div to avoid role=dialog lint warning while keeping motion animation */}
          <motion.section
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed inset-x-4 top-16 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[680px] md:top-1/2 md:-translate-y-1/2 md:bottom-auto z-50 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "oklch(0.17 0.025 238)",
              border: "1px solid oklch(0.28 0.03 235)",
              boxShadow: "0 32px 80px oklch(0.05 0.02 240 / 0.9)",
              maxHeight: "calc(100vh - 80px)",
            }}
            aria-label={`Font details for ${font.name}`}
            data-ocid="fonts.modal"
          >
            <div
              className="flex items-start justify-between p-6 flex-shrink-0"
              style={{ borderBottom: "1px solid oklch(0.24 0.025 235)" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2
                    className="text-[22px] font-bold"
                    style={{
                      fontFamily: `'${font.googleFontFamily}', serif`,
                      color: "oklch(0.93 0.01 240)",
                    }}
                  >
                    {font.name}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${categoryColors[font.category].bg} ${categoryColors[font.category].text} ${categoryColors[font.category].border}`}
                  >
                    {font.category}
                  </span>
                </div>
                <p
                  className="text-[13px]"
                  style={{ color: "oklch(0.55 0.03 235)" }}
                >
                  by {font.designer} &middot; {font.variants} styles
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: "oklch(0.55 0.03 235)" }}
                aria-label="Close modal"
                data-ocid="fonts.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              <div>
                <h3
                  className="text-[12px] font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "oklch(0.55 0.04 235)" }}
                >
                  About
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "oklch(0.75 0.02 240)" }}
                >
                  {font.description}
                </p>
              </div>

              <div>
                <h3
                  className="text-[12px] font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "oklch(0.55 0.04 235)" }}
                >
                  Weight Preview
                </h3>
                <div className="space-y-2">
                  {WEIGHT_LABELS.map(([weight, label]) => (
                    <div
                      key={weight}
                      className="flex items-center gap-4 p-3 rounded-xl"
                      style={{ background: "oklch(0.14 0.02 240)" }}
                    >
                      <span
                        className="text-[11px] w-20 flex-shrink-0"
                        style={{
                          color: "oklch(0.5 0.03 235)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-[17px] flex-1 truncate"
                        style={{
                          fontFamily: `'${font.googleFontFamily}', serif`,
                          fontWeight: weight,
                          color: "oklch(0.88 0.01 240)",
                        }}
                      >
                        The quick brown fox
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Popularity",
                    value: `${font.popularity}/100`,
                    icon: (
                      <Star
                        className="w-4 h-4"
                        style={{ color: "oklch(0.75 0.15 70)" }}
                      />
                    ),
                  },
                  {
                    label: "Websites",
                    value: `${font.usedBy}M+`,
                    icon: (
                      <ExternalLink
                        className="w-4 h-4"
                        style={{ color: "oklch(0.68 0.15 245)" }}
                      />
                    ),
                  },
                  {
                    label: "Styles",
                    value: `${font.variants}`,
                    icon: (
                      <span
                        style={{ fontSize: 14, color: "oklch(0.68 0.12 230)" }}
                      >
                        &#9672;
                      </span>
                    ),
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 rounded-xl text-center"
                    style={{
                      background: "oklch(0.14 0.02 240)",
                      border: "1px solid oklch(0.22 0.025 235)",
                    }}
                  >
                    <div className="flex justify-center mb-1">{stat.icon}</div>
                    <div
                      className="text-[16px] font-bold"
                      style={{ color: "oklch(0.88 0.01 240)" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "oklch(0.5 0.03 235)" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="text-[12px] font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.55 0.04 235)" }}
                  >
                    CSS Snippet
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                    style={{
                      background: copied
                        ? "oklch(0.65 0.15 145 / 0.2)"
                        : "oklch(0.22 0.025 235)",
                      color: copied
                        ? "oklch(0.7 0.15 145)"
                        : "oklch(0.68 0.15 245)",
                      border: copied
                        ? "1px solid oklch(0.65 0.15 145 / 0.4)"
                        : "1px solid oklch(0.28 0.03 235)",
                    }}
                    data-ocid="fonts.copy_button"
                    aria-label="Copy CSS snippet"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy CSS
                      </>
                    )}
                  </button>
                </div>
                <pre
                  className="p-4 rounded-xl text-[12px] leading-relaxed overflow-x-auto"
                  style={{
                    background: "oklch(0.12 0.018 240)",
                    border: "1px solid oklch(0.2 0.022 238)",
                    color: "oklch(0.72 0.1 240)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <code>{cssSnippet}</code>
                </pre>
              </div>

              <div>
                <h3
                  className="text-[12px] font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "oklch(0.55 0.04 235)" }}
                >
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {font.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-[12px]"
                      style={{
                        background: "oklch(0.22 0.025 235)",
                        color: "oklch(0.62 0.05 240)",
                        border: "1px solid oklch(0.28 0.03 235)",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="p-4 flex-shrink-0"
              style={{ borderTop: "1px solid oklch(0.22 0.025 235)" }}
            >
              <a
                href={`https://fonts.google.com/specimen/${font.googleFontFamily.replace(/ /g, "+")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold hover:brightness-110 transition-all"
                style={{
                  background: "oklch(0.68 0.15 245 / 0.15)",
                  border: "1px solid oklch(0.68 0.15 245 / 0.4)",
                  color: "oklch(0.78 0.1 240)",
                }}
                data-ocid="fonts.link"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
                View on Google Fonts
              </a>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
