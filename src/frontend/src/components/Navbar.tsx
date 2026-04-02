import { Moon, Search, Sun, Type, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export function Navbar({
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDark,
}: NavbarProps) {
  const [navSearchActive, setNavSearchActive] = useState(false);

  return (
    <nav
      className="glass-nav fixed top-0 left-0 right-0 z-50 h-16"
      aria-label="Main navigation"
    >
      <div className="max-w-[1300px] mx-auto h-full flex items-center gap-4 px-6">
        <a
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          aria-label="TypeFlow home"
          data-ocid="nav.link"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "oklch(0.68 0.15 245 / 0.2)",
              border: "1px solid oklch(0.68 0.15 245 / 0.4)",
            }}
          >
            <Type
              className="w-4 h-4"
              style={{ color: "oklch(0.78 0.1 240)" }}
            />
          </div>
          <span
            className="font-semibold text-[15px] tracking-tight hidden sm:block"
            style={{ color: "oklch(0.93 0.01 240)" }}
          >
            TypeFlow
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {["Discover", "Categories", "Trends", "About"].map((item, i) => (
            <a
              key={item}
              href="/"
              className="relative px-3 py-1.5 text-[14px] font-medium rounded-md transition-colors"
              style={{
                color: i === 0 ? "oklch(0.78 0.1 240)" : "oklch(0.62 0.03 230)",
              }}
              data-ocid="nav.link"
            >
              {item}
              {i === 0 && (
                <span
                  className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: "oklch(0.68 0.15 245)" }}
                />
              )}
            </a>
          ))}
        </div>

        <div className="flex-1" />

        <div
          className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{
            background: "oklch(0.22 0.03 235)",
            border: navSearchActive
              ? "1px solid oklch(0.55 0.1 245)"
              : "1px solid oklch(0.32 0.04 235)",
            minWidth: "220px",
          }}
        >
          <Search
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: "oklch(0.55 0.04 235)" }}
          />
          <input
            type="text"
            placeholder="Search fonts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setNavSearchActive(true)}
            onBlur={() => setNavSearchActive(false)}
            className="bg-transparent outline-none w-full text-[13px]"
            style={{ color: "oklch(0.93 0.01 240)" }}
            aria-label="Search fonts"
            data-ocid="nav.search_input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="flex-shrink-0"
              style={{ color: "oklch(0.55 0.04 235)" }}
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDark}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            style={{ color: "oklch(0.62 0.03 230)" }}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            data-ocid="nav.toggle"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            className="px-4 py-1.5 rounded-full text-[13px] font-semibold hover:brightness-110 transition-all"
            style={{
              background: "oklch(0.82 0.07 235)",
              color: "oklch(0.13 0.02 242)",
            }}
            data-ocid="nav.primary_button"
          >
            Log in
          </button>
        </div>
      </div>
    </nav>
  );
}
