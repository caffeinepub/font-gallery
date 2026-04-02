import {
  CheckCircle2,
  Download,
  HardDrive,
  Lightbulb,
  Star,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Game } from "../data/games";
import { formatDownloads, formatSize } from "../data/games";
import { buildApkBlob } from "../utils/apkBuilder";

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
}

type DownloadState = "idle" | "downloading" | "done";

const DOWNLOAD_SECONDS = 10;
// Cap generated file at 100MB to avoid crashing low-memory devices
const MAX_GENERATED_BYTES = 100 * 1024 * 1024;

function triggerApkDownload(game: Game) {
  const packageName = `com.hx1mod.${game.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const targetBytes = Math.min(
    Math.round(game.sizeMB * 1024 * 1024),
    MAX_GENERATED_BYTES,
  );
  const blob = buildApkBlob(packageName, game.name, "1.0", 1, targetBytes);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${game.name.replace(/[^a-z0-9]/gi, "_")}_MOD_HX1.apk`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function GameModal({ game, onClose }: GameModalProps) {
  const [dlState, setDlState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset state when game changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only on game id change
  useEffect(() => {
    setDlState("idle");
    setProgress(0);
    setTipIndex(0);
  }, [game?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (dlState !== "downloading") onClose();
      }
    };
    if (game) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [game, onClose, dlState]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!game) return null;

  const stars = Math.round(game.rating);
  const tips = game.tips ?? [];

  const handleStartDownload = () => {
    setDlState("downloading");
    setProgress(0);
    setTipIndex(0);
    let elapsed = 0;
    const tick = 100; // ms
    const total = DOWNLOAD_SECONDS * 1000;
    intervalRef.current = setInterval(() => {
      elapsed += tick;
      const pct = Math.min(100, Math.round((elapsed / total) * 100));
      setProgress(pct);
      // Rotate tip every 2.5s
      if (tips.length > 0) {
        setTipIndex(Math.floor((elapsed / 2500) % tips.length));
      }
      if (elapsed >= total) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        // Generate and trigger real APK file download
        triggerApkDownload(game);
        setDlState("done");
      }
    }, tick);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && dlState !== "downloading") onClose();
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && dlState !== "downloading") onClose();
  };

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in w-full h-full max-w-none max-h-none m-0"
      style={{
        background: "oklch(0.04 0.01 270 / 0.88)",
        backdropFilter: "blur(10px)",
      }}
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      data-ocid="game.modal"
      aria-label={`${game.name} details`}
    >
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl animate-slide-up"
        style={{
          background: "oklch(0.12 0.018 270)",
          border: "1px solid oklch(0.4 0.16 305 / 0.4)",
          boxShadow:
            "0 0 40px oklch(0.62 0.24 305 / 0.2), 0 24px 64px oklch(0.04 0.01 270 / 0.8)",
        }}
      >
        {/* Close */}
        {dlState !== "downloading" && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full"
            style={{
              background: "oklch(0.2 0.025 270)",
              border: "1px solid oklch(0.3 0.04 270)",
            }}
            data-ocid="game.close_button"
            aria-label="Close dialog"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        )}

        {/* Header Banner */}
        <div
          className="h-36 flex items-center justify-center relative overflow-hidden"
          style={{ background: game.iconBg }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, oklch(0.12 0.018 270) 100%)",
            }}
          />
          <span
            className="relative z-10 select-none"
            style={{
              fontSize: "4.5rem",
              filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
            }}
          >
            {game.icon}
          </span>
        </div>

        {/* Content */}
        <div className="px-5 pb-6">
          {/* ── DOWNLOAD IN PROGRESS ── */}
          {dlState === "downloading" && (
            <div className="py-4">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="font-display font-bold text-foreground"
                  style={{ fontSize: "1rem" }}
                >
                  {game.name}
                </h2>
                <span
                  className="font-rajdhani font-bold"
                  style={{ color: "oklch(0.8 0.2 200)", fontSize: "0.85rem" }}
                >
                  {progress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full h-3 rounded-full overflow-hidden mb-2"
                style={{ background: "oklch(0.18 0.04 270)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, oklch(0.55 0.24 305), oklch(0.7 0.2 200), oklch(0.78 0.22 142))",
                    boxShadow: "0 0 8px oklch(0.62 0.24 305 / 0.6)",
                    transition: "width 0.1s linear",
                  }}
                />
              </div>

              {/* Status */}
              <div
                className="flex items-center justify-between mb-5"
                style={{ fontSize: "0.7rem" }}
              >
                <span className="text-muted-foreground flex items-center gap-1">
                  <HardDrive size={11} />
                  Downloading {formatSize(game.sizeMB)}...
                </span>
                <span style={{ color: "oklch(0.78 0.22 142)" }}>
                  HX1 Download Platform
                </span>
              </div>

              {/* Tips during download */}
              {tips.length > 0 && (
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: "oklch(0.15 0.04 305 / 0.4)",
                    border: "1px solid oklch(0.35 0.14 305 / 0.3)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 mb-2"
                    style={{
                      color: "oklch(0.8 0.18 305)",
                      fontSize: "0.72rem",
                    }}
                  >
                    <Lightbulb size={13} />
                    <span className="font-rajdhani font-bold tracking-wider">
                      PRO TIP WHILE YOU WAIT
                    </span>
                  </div>
                  <p
                    className="text-foreground leading-relaxed"
                    style={{ fontSize: "0.82rem" }}
                  >
                    {tips[tipIndex]}
                  </p>
                </div>
              )}

              <p
                className="text-center mt-4"
                style={{ fontSize: "0.65rem", color: "oklch(0.4 0.04 270)" }}
              >
                Please wait {DOWNLOAD_SECONDS} seconds... Do not close
              </p>
            </div>
          )}

          {/* ── DOWNLOAD COMPLETE ── */}
          {dlState === "done" && (
            <div className="py-4 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "oklch(0.18 0.06 142 / 0.4)",
                  border: "2px solid oklch(0.6 0.22 142)",
                  boxShadow: "0 0 24px oklch(0.62 0.22 142 / 0.3)",
                }}
              >
                <CheckCircle2
                  size={32}
                  style={{ color: "oklch(0.82 0.22 142)" }}
                />
              </div>
              <h3
                className="font-display font-bold mb-1"
                style={{ color: "oklch(0.82 0.22 142)", fontSize: "1.1rem" }}
              >
                DOWNLOAD COMPLETE!
              </h3>
              <p
                className="text-muted-foreground mb-5"
                style={{ fontSize: "0.82rem" }}
              >
                {game.name} MOD APK is ready to install
              </p>

              {/* Install instructions */}
              <div
                className="text-left p-4 rounded-lg mb-5"
                style={{
                  background: "oklch(0.16 0.02 270)",
                  border: "1px solid oklch(0.28 0.04 270)",
                }}
              >
                <p
                  className="font-rajdhani font-bold mb-3 tracking-wider"
                  style={{ color: "oklch(0.78 0.18 305)", fontSize: "0.75rem" }}
                >
                  ⚡ HOW TO INSTALL
                </p>
                {[
                  "Open Settings → Security → Enable 'Unknown Sources'",
                  "Go to your Downloads folder",
                  `Tap on ${game.name}_MOD_HX1.apk to install`,
                  "Open the game and enjoy unlimited everything!",
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-2 mb-2">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold mt-0.5"
                      style={{
                        background: "oklch(0.55 0.24 305)",
                        color: "white",
                        fontSize: "0.65rem",
                      }}
                    >
                      {i + 1}
                    </span>
                    <p
                      className="text-foreground"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Game tips */}
              {tips.length > 0 && (
                <div
                  className="text-left p-3 rounded-lg mb-5"
                  style={{
                    background: "oklch(0.14 0.04 142 / 0.3)",
                    border: "1px solid oklch(0.4 0.14 142 / 0.3)",
                  }}
                >
                  <p
                    className="font-rajdhani font-bold mb-2 tracking-wider"
                    style={{
                      color: "oklch(0.72 0.18 142)",
                      fontSize: "0.72rem",
                    }}
                  >
                    💡 EXPERT TIPS FOR {game.name.toUpperCase()}
                  </p>
                  {tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-2 mb-2">
                      <span
                        style={{
                          color: "oklch(0.72 0.18 142)",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        ▶
                      </span>
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="btn-download-big w-full py-3 rounded-lg text-white font-display font-bold tracking-widest flex items-center justify-center gap-2"
                style={{ fontSize: "0.9rem", letterSpacing: "0.1em" }}
              >
                CLOSE
              </button>
            </div>
          )}

          {/* ── IDLE (game details) ── */}
          {dlState === "idle" && (
            <>
              {/* Title row */}
              <div className="flex items-start justify-between gap-2 mb-1 mt-1">
                <h2
                  className="font-display font-bold text-foreground"
                  style={{ fontSize: "1.2rem" }}
                >
                  {game.name}
                </h2>
                <span className="badge-mod px-2 py-1 rounded-sm uppercase font-sans flex-shrink-0 mt-0.5">
                  MOD
                </span>
              </div>

              {/* Category & version */}
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-category px-2 py-0.5 rounded-sm font-sans">
                  {game.category}
                </span>
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "0.72rem" }}
                >
                  v{game.version}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={s <= stars ? "star-filled" : "star-empty"}
                    size={14}
                    fill={s <= stars ? "currentColor" : "none"}
                  />
                ))}
                <span
                  className="font-semibold ml-1"
                  style={{ fontSize: "0.85rem", color: "oklch(0.82 0.18 70)" }}
                >
                  {game.rating}
                </span>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg"
                style={{
                  background: "oklch(0.16 0.02 270)",
                  border: "1px solid oklch(0.25 0.03 270)",
                }}
              >
                <div className="text-center">
                  <p
                    className="font-display font-bold mb-0.5"
                    style={{ color: "oklch(0.8 0.2 200)", fontSize: "1.1rem" }}
                  >
                    {formatSize(game.sizeMB)}
                  </p>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.65rem" }}
                  >
                    FILE SIZE
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="font-display font-bold mb-0.5"
                    style={{ color: "oklch(0.8 0.22 305)", fontSize: "1.1rem" }}
                  >
                    {formatDownloads(game.downloads)}
                  </p>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.65rem" }}
                  >
                    DOWNLOADS
                  </p>
                </div>
              </div>

              {/* MOD Features */}
              <div className="mb-4">
                <h3
                  className="font-rajdhani font-bold mb-2 tracking-wider"
                  style={{
                    fontSize: "0.75rem",
                    color: "oklch(0.7 0.18 142)",
                    letterSpacing: "0.1em",
                  }}
                >
                  ⬡ MOD FEATURES — UNLIMITED EVERYTHING
                </h3>
                <ul className="space-y-1.5">
                  {game.modFeatures.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2 px-3 py-2 rounded-md"
                      style={{
                        background: "oklch(0.15 0.03 142 / 0.3)",
                        border: "1px solid oklch(0.4 0.12 142 / 0.3)",
                      }}
                    >
                      <CheckCircle2
                        size={14}
                        style={{ color: "oklch(0.82 0.22 142)", flexShrink: 0 }}
                      />
                      <span
                        className="font-semibold text-foreground"
                        style={{ fontSize: "0.82rem" }}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Game Tips */}
              {tips.length > 0 && (
                <div
                  className="p-3 rounded-lg mb-4"
                  style={{
                    background: "oklch(0.14 0.04 305 / 0.3)",
                    border: "1px solid oklch(0.35 0.14 305 / 0.3)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 mb-2"
                    style={{
                      color: "oklch(0.8 0.18 305)",
                      fontSize: "0.72rem",
                    }}
                  >
                    <Lightbulb size={13} />
                    <span className="font-rajdhani font-bold tracking-wider">
                      EXPERT TIPS
                    </span>
                  </div>
                  {tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-2 mb-1.5">
                      <span
                        style={{
                          color: "oklch(0.75 0.18 305)",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        ▶
                      </span>
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <p
                className="text-muted-foreground mb-5 leading-relaxed"
                style={{ fontSize: "0.82rem" }}
              >
                {game.description}
              </p>

              {/* Download button */}
              <button
                type="button"
                onClick={handleStartDownload}
                className="btn-download-big w-full py-4 rounded-lg text-white font-display font-bold tracking-widest flex items-center justify-center gap-2"
                style={{ fontSize: "1rem", letterSpacing: "0.12em" }}
                data-ocid="game.download_button"
                aria-label={`Download ${game.name} APK`}
              >
                <Download size={20} />
                DOWNLOAD APK FREE
              </button>
              <p
                className="text-center mt-2"
                style={{ fontSize: "0.65rem", color: "oklch(0.45 0.04 270)" }}
              >
                Free · All features unlocked · {formatSize(game.sizeMB)} · HX1
                Platform
              </p>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
