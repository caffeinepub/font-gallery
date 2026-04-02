import { Download, Star } from "lucide-react";
import type { Game } from "../data/games";
import { formatDownloads, formatSize } from "../data/games";

interface GameCardProps {
  game: Game;
  index: number;
  onOpen: (game: Game) => void;
}

export function GameCard({ game, index, onOpen }: GameCardProps) {
  const stars = Math.round(game.rating);

  return (
    <button
      type="button"
      className="card-game rounded-lg overflow-hidden cursor-pointer text-left w-full"
      onClick={() => onOpen(game)}
      data-ocid={`game.item.${index}`}
      aria-label={`${game.name} — ${game.category}`}
    >
      {/* Game Image / Icon */}
      <div className="relative">
        <div
          className="w-full h-28 flex items-center justify-center"
          style={{ background: game.iconBg }}
        >
          {/* Decorative shimmer overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(255,255,255,0.35) 0%, transparent 70%)",
            }}
          />
          <span
            className="relative z-10 select-none"
            style={{
              fontSize: "2.8rem",
              filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.4))",
            }}
          >
            {game.icon}
          </span>
        </div>
        <span className="badge-mod absolute top-2 right-2 px-1.5 py-0.5 rounded-sm uppercase font-sans">
          MOD
        </span>
        <span className="badge-category absolute top-2 left-2 px-1.5 py-0.5 rounded-sm font-sans truncate max-w-[80px]">
          {game.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3
          className="font-rajdhani font-bold text-sm text-foreground truncate mb-1"
          style={{ fontSize: "0.88rem" }}
        >
          {game.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={s <= stars ? "star-filled" : "star-empty"}
              size={10}
              fill={s <= stars ? "currentColor" : "none"}
            />
          ))}
          <span
            className="text-muted-foreground ml-1"
            style={{ fontSize: "0.65rem" }}
          >
            {game.rating}
          </span>
        </div>

        {/* Meta */}
        <div
          className="flex items-center justify-between text-muted-foreground mb-3"
          style={{ fontSize: "0.65rem" }}
        >
          <span className="flex items-center gap-1">
            <span className="neon-text-cyan" style={{ fontSize: "0.7rem" }}>
              ◼
            </span>
            {formatSize(game.sizeMB)}
          </span>
          <span className="flex items-center gap-1">
            <Download size={9} />
            {formatDownloads(game.downloads)}
          </span>
        </div>

        {/* Download label */}
        <div
          className="btn-download w-full py-1.5 rounded-sm text-white font-rajdhani font-bold tracking-wide flex items-center justify-center gap-1.5"
          style={{ fontSize: "0.75rem" }}
          data-ocid={`game.download_button.${index}`}
        >
          <Download size={12} />
          FREE DOWNLOAD
        </div>
      </div>
    </button>
  );
}
