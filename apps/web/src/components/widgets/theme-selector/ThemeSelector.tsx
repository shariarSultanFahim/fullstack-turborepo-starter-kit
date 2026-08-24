"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Check, ChevronDown, Search, Shuffle } from "lucide-react";

import { Button, Input } from "@/ui";
import { useThemePreset } from "@/providers";

export function ThemeSelector() {
  const { currentTheme, themes, setThemeId, randomTheme } = useThemePreset();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) return themes;
    return themes.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));
  }, [themes, searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="border-border/80 bg-background/80 hover:bg-accent hover:text-accent-foreground flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium shadow-xs backdrop-blur-xs"
      >
        <div className="flex items-center gap-1">
          {currentTheme.swatches.map((color, idx) => (
            <span
              key={idx}
              className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs dark:border-white/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="max-w-[100px] truncate sm:max-w-[130px]">{currentTheme.name}</span>
        <ChevronDown
          className={`text-muted-foreground h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="border-border bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border shadow-2xl">
          {/* Search Bar */}
          <div className="border-border border-b p-2">
            <div className="relative flex items-center">
              <Search className="text-muted-foreground absolute left-2.5 h-4 w-4" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted/50 focus-visible:ring-ring h-8 w-full border-none pl-8 text-xs shadow-none focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Subheader with Theme Count & Shuffle Button */}
          <div className="border-border/60 text-muted-foreground flex items-center justify-between border-b px-3 py-1.5 text-xs">
            <span>
              {filteredThemes.length} {filteredThemes.length === 1 ? "theme" : "themes"}
            </span>
            <button
              type="button"
              onClick={randomTheme}
              className="hover:bg-muted hover:text-foreground flex cursor-pointer items-center gap-1 rounded-md p-1 transition-colors"
              title="Shuffle Random Theme"
            >
              <Shuffle className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Theme Items List */}
          <div className="max-h-72 space-y-0.5 overflow-y-auto p-1.5">
            {filteredThemes.length > 0 ? (
              filteredThemes.map((theme) => {
                const isSelected = theme.id === currentTheme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setThemeId(theme.id);
                      setIsOpen(false);
                    }}
                    className={`group flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "hover:bg-muted/70 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {/* 4 Swatch Dots */}
                      <div className="flex shrink-0 items-center gap-1">
                        {theme.swatches.map((color, idx) => (
                          <span
                            key={idx}
                            className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs dark:border-white/10"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="truncate">{theme.name}</span>
                    </div>

                    {isSelected && (
                      <Check className="text-primary animate-in fade-in h-4 w-4 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-muted-foreground py-6 text-center text-xs">
                No themes found matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
