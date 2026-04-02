import { Download } from "lucide-react";
import type { Game } from "../data/games";
import { formatDownloads, formatSize } from "../data/games";

interface FeaturedCardProps {
  game: Game;
  onOpen: (game: Game) => void;
}

export function FeaturedCard({ game, onOpen }: FeaturedCardProps) {
  return (
    <button
      type="button"
      className="flex-shrink-0 w-44 card-game rounded-lg overflow-hidden cursor-pointer text-left"
      onClick={() => onOpen(game)}
      aria-label={`Featured: ${game.name}`}
    >
      <div
        className="w-full h-28 flex items-center justify-center relative"
        style={{ background: game.iconBg }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 70%)",
          }}
        />
        <span
          className="relative z-10 select-none"
          style={{
            fontSize: "3rem",
            filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.4))",
          }}
        >
          {game.icon}
        </span>
        <span className="badge-mod absolute top-2 right-2 px-1.5 py-0.5 rounded-sm uppercase font-sans">
          MOD
        </span>
      </div>

      <div className="p-3">
        <h3
          className="font-rajdhani font-bold text-foreground truncate"
          style={{ fontSize: "0.85rem" }}
        >
          {game.name}
        </h3>
        <p
          className="mb-1"
          style={{
            fontSize: "0.62rem",
            color: "oklch(0.7 0.18 142)",
            fontWeight: 600,
          }}
        >
          ✦ {game.modFeatures[0]}
        </p>
        <div
          className="flex items-center justify-between text-muted-foreground mb-2"
          style={{ fontSize: "0.6rem" }}
        >
          <span>{formatSize(game.sizeMB)}</span>
          <span className="flex items-center gap-0.5">
            <Download size={8} />
            {formatDownloads(game.downloads)}
          </span>
        </div>
        <div
          className="btn-download w-full py-1 rounded-sm text-white font-rajdhani font-semibold flex items-center justify-center gap-1"
          style={{ fontSize: "0.7rem" }}
        >
          <Download size={10} />
          DOWNLOAD
        </div>
      </div>
    </button>
  );
}
