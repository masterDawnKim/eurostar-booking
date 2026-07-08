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

  const selectClass = "w-full px-3 py-2.5 border border-[var(--color-neutral-200)] rounded-[var(--radius-input)] bg-white text-[var(--color-neutral-900)] text-[15px] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors";

  return (
    <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[var(--color-neutral-100)]">
        <h3 className="text-base font-semibold text-[var(--color-neutral-900)] mb-3">Search Trains</h3>
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

      <div className="px-5 py-4 space-y-3 flex-1">
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
            <label className="block text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">Depart</label>
            <input type="date" value={searchParams.outboundDate || ""}
              onChange={(e) => setSearchParams({ outboundDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className={selectClass}
            />
          </div>
          {tripType === "return" && (
            <div>
              <label className="block text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">Return</label>
              <input type="date" value={searchParams.inboundDate || ""}
                onChange={(e) => setSearchParams({ inboundDate: e.target.value })}
                min={searchParams.outboundDate || new Date().toISOString().split("T")[0]}
                className={selectClass}
              />
            </div>
          )}
        </div>

        {/* Passengers */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Adults", key: "adults" as const, options: [1,2,3,4,5,6,7,8,9], fallback: 1 },
            { label: "Youth", key: "youths" as const, options: [0,1,2,3,4], fallback: 0 },
            { label: "Child", key: "children" as const, options: [0,1,2,3,4], fallback: 0 },
          ].map(({ label, key, options, fallback }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">{label}</label>
              <select value={searchParams[key] ?? fallback}
                onChange={(e) => setSearchParams({ [key]: parseInt(e.target.value) })}
                className={selectClass}
              >
                {options.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Currency */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">Currency</label>
          <select value={searchParams.currency || "GBP"}
            onChange={(e) => setSearchParams({ currency: e.target.value })}
            className={selectClass}
          >
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        {error && <p className="text-[var(--color-error)] text-sm mb-2">{error}</p>}
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg text-[15px] font-semibold hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:bg-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-500)] transition-all shadow-sm hover:shadow-md"
        >
          {isSearching ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </span>
          ) : "Search Trains"}
        </button>
      </div>
    </div>
  );
}
