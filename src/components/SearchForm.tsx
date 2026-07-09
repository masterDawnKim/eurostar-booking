"use client";

import { useState } from "react";
import { useBookingStore } from "@/lib/booking-store";
import StationSelect from "@/components/StationSelect";

interface SearchFormProps {
  selectedOrigin?: string;
  selectedDestination?: string;
  onOriginChange: (uic: string) => void;
  onDestinationChange: (uic: string) => void;
}

export default function SearchForm({
  selectedOrigin,
  selectedDestination,
  onOriginChange,
  onDestinationChange,
}: SearchFormProps) {
  const { searchParams, setSearchParams, search, isSearching } = useBookingStore();
  const [tripType, setTripType] = useState<"single" | "return">("return");
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSearch = async () => {
    if (!selectedOrigin || !selectedDestination) {
      setError("Please select departure and arrival stations");
      return;
    }
    if (!searchParams.outboundDate) {
      setError("Please select a departure date");
      return;
    }
    if (tripType === "return" && !searchParams.inboundDate) {
      setError("Please select a return date");
      return;
    }
    setError(null);
    setSearchParams({ origin: selectedOrigin, destination: selectedDestination });
    try { await search(); } catch (e) { setError(String(e)); }
  };

  const swapStations = () => {
    if (selectedOrigin && selectedDestination) {
      onOriginChange(selectedDestination);
      onDestinationChange(selectedOrigin);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-neutral-200)] rounded-[var(--radius-input)] bg-white text-[var(--color-neutral-900)] text-[16px] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors";

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[var(--color-neutral-900)]">Search Trains</h3>
        </div>
        <div className="flex gap-1 p-0.5 bg-[var(--color-neutral-100)] rounded-full w-fit">
          {(["single", "return"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                tripType === type
                  ? "bg-white text-[var(--color-neutral-900)] shadow-sm"
                  : "text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
              }`}
            >
              {type === "single" ? "One Way" : "Return"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 space-y-3 flex-1">
        {/* Stations */}
        <div className="space-y-1">
          <StationSelect
            value={selectedOrigin || ""}
            onChange={onOriginChange}
            label="From"
            accentColor="var(--color-primary)"
          />

          <div className="flex justify-center -my-1 relative z-10">
            <button onClick={swapStations} title="Swap stations"
              className="p-1.5 rounded-full border border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <StationSelect
            value={selectedDestination || ""}
            onChange={onDestinationChange}
            label="To"
            accentColor="var(--color-neutral-900)"
          />
        </div>

        {/* Dates */}
        <div className={`grid gap-3 ${tripType === "return" ? "grid-cols-2" : "grid-cols-1"}`}>
          <div>
            <label className="block text-[13px] font-medium text-[var(--color-neutral-600)] mb-1">Departure</label>
            <input type="date" value={searchParams.outboundDate || ""}
              onChange={(e) => setSearchParams({ outboundDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </div>
          {tripType === "return" && (
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-neutral-600)] mb-1">Return</label>
              <input type="date" value={searchParams.inboundDate || ""}
                onChange={(e) => setSearchParams({ inboundDate: e.target.value })}
                min={searchParams.outboundDate || new Date().toISOString().split("T")[0]}
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* Passengers - stepper style */}
        <div>
          <label className="block text-[13px] font-medium text-[var(--color-neutral-600)] mb-2">Passengers</label>
          <div className="space-y-2">
            {[
              { label: "Adults", sub: "26+", key: "adults" as const, min: 1, max: 9, fallback: 1 },
              { label: "Youth", sub: "12-25", key: "youths" as const, min: 0, max: 4, fallback: 0 },
              { label: "Children", sub: "4-11", key: "children" as const, min: 0, max: 4, fallback: 0 },
            ].map(({ label, sub, key, min, max, fallback }) => {
              const val = searchParams[key] ?? fallback;
              return (
                <div key={key} className="flex items-center justify-between py-1.5">
                  <div>
                    <span className="text-sm text-[var(--color-neutral-900)]">{label}</span>
                    <span className="text-xs text-[var(--color-neutral-400)] ml-1.5">{sub}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => val > min && setSearchParams({ [key]: val - 1 })}
                      disabled={val <= min}
                      aria-label={`Decrease ${label}`}
                      className="w-8 h-8 rounded-full border border-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-[var(--color-neutral-900)]" aria-live="polite">{val}</span>
                    <button
                      onClick={() => val < max && setSearchParams({ [key]: val + 1 })}
                      disabled={val >= max}
                      aria-label={`Increase ${label}`}
                      className="w-8 h-8 rounded-full border border-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" d="M12 5v14m-7-7h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Options toggle */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-1.5 text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] transition-colors"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${showOptions ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          More options
        </button>

        {showOptions && (
          <div className="pl-5 space-y-3">
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-neutral-600)] mb-1">Currency</label>
              <select value={searchParams.currency || "GBP"}
                onChange={(e) => setSearchParams({ currency: e.target.value })}
                className={inputClass}
              >
                <option value="GBP">GBP - British Pound</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 pt-2">
        {error && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-error)] mb-3 bg-red-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:bg-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-500)] transition-all shadow-sm hover:shadow-md"
        >
          {isSearching ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Trains
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
