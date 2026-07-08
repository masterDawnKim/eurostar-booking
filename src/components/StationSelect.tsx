"use client";

import { useState, useRef, useEffect } from "react";
import { EUROSTAR_STATIONS, type StationWithCoords } from "@/lib/stations";

const COUNTRY_META: Record<string, { flag: string; name: string; order: number }> = {
  GB: { flag: "\uD83C\uDDEC\uD83C\uDDE7", name: "United Kingdom", order: 0 },
  FR: { flag: "\uD83C\uDDEB\uD83C\uDDF7", name: "France", order: 1 },
  BE: { flag: "\uD83C\uDDE7\uD83C\uDDEA", name: "Belgium", order: 2 },
  NL: { flag: "\uD83C\uDDF3\uD83C\uDDF1", name: "Netherlands", order: 3 },
  DE: { flag: "\uD83C\uDDE9\uD83C\uDDEA", name: "Germany", order: 4 },
};

interface StationSelectProps {
  value: string;
  onChange: (uic: string) => void;
  label: string;
  accentColor?: string;
}

export default function StationSelect({ value, onChange, label, accentColor = "var(--color-primary)" }: StationSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = EUROSTAR_STATIONS.find((s) => s.uic === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = query
    ? EUROSTAR_STATIONS.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.country.toLowerCase().includes(query.toLowerCase()) ||
        (COUNTRY_META[s.country]?.name || "").toLowerCase().includes(query.toLowerCase())
      )
    : EUROSTAR_STATIONS;

  const grouped = filtered.reduce<Record<string, StationWithCoords[]>>((acc, s) => {
    (acc[s.country] = acc[s.country] || []).push(s);
    return acc;
  }, {});

  const sortedCountries = Object.keys(grouped).sort(
    (a, b) => (COUNTRY_META[a]?.order ?? 99) - (COUNTRY_META[b]?.order ?? 99)
  );

  const handleSelect = (station: StationWithCoords) => {
    onChange(station.uic);
    setOpen(false);
    setQuery("");
  };

  const shortName = (name: string) =>
    name.replace(/ (International|St Pancras|Gare du Nord|Part-Dieu|St Charles|Europe|Station|TGV|Midi\/Zuid|Centraal|Hbf|St Exupery|Champagne-Ardenne|-Fréthun|Montparnasse).*/, "");

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 border rounded-[var(--radius-input)] bg-white text-left transition-all outline-none ${
          open
            ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
            : "border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)]"
        }`}
      >
        {selected ? (
          <>
            <span className="text-lg leading-none">{COUNTRY_META[selected.country]?.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-medium text-[var(--color-neutral-900)] truncate">{shortName(selected.name)}</div>
              <div className="text-[11px] text-[var(--color-neutral-500)] truncate">{selected.name}</div>
            </div>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accentColor }} />
          </>
        ) : (
          <>
            <span className="text-lg leading-none opacity-30">🚄</span>
            <span className="text-[15px] text-[var(--color-neutral-400)] flex-1">Select station</span>
          </>
        )}
        <svg className={`w-4 h-4 text-[var(--color-neutral-400)] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[var(--color-neutral-200)] rounded-[var(--radius-card)] shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-[var(--color-neutral-100)]">
            <div className="flex items-center gap-2 px-2.5 py-2 bg-[var(--color-neutral-50)] rounded-[var(--radius-input)]">
              <svg className="w-4 h-4 text-[var(--color-neutral-400)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search station or city..."
                className="flex-1 bg-transparent text-sm text-[var(--color-neutral-900)] outline-none placeholder:text-[var(--color-neutral-400)]"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Station list */}
          <div className="max-h-[280px] overflow-y-auto">
            {sortedCountries.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-[var(--color-neutral-500)]">No stations found</div>
            )}
            {sortedCountries.map((country) => (
              <div key={country}>
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-neutral-500)] bg-[var(--color-neutral-50)] sticky top-0">
                  {COUNTRY_META[country]?.flag} {COUNTRY_META[country]?.name || country}
                </div>
                {grouped[country].map((station) => {
                  const isSelected = station.uic === value;
                  return (
                    <button
                      key={station.uic}
                      onClick={() => handleSelect(station)}
                      className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                        isSelected
                          ? "bg-[var(--color-primary-tint)]"
                          : "hover:bg-[var(--color-neutral-50)]"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${isSelected ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-neutral-900)]"}`}>
                          {shortName(station.name)}
                        </div>
                        <div className="text-[11px] text-[var(--color-neutral-500)] truncate">{station.name}</div>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--color-neutral-400)]">{station.shortCode}</span>
                      {isSelected && (
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
