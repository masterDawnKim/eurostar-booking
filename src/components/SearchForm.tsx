"use client";

import { useState } from "react";
import { EUROSTAR_STATIONS } from "@/lib/stations";
import { useBookingStore } from "@/lib/booking-store";

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

  return (
    <div className="bg-white rounded-[var(--radius-card)] border border-[var(--color-neutral-200)] p-6 space-y-4">
      {/* Trip type - pill tabs */}
      <div className="flex gap-2">
        {(["single", "return"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            className={`px-4 py-2 rounded-[9999px] text-[15px] transition-colors ${
              tripType === type
                ? "bg-[var(--color-neutral-900)] text-white"
                : "bg-white text-[var(--color-neutral-700)] border border-[var(--color-neutral-300)]"
            }`}
          >
            {type === "single" ? "One Way" : "Return"}
          </button>
        ))}
      </div>

      {/* Stations */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">From</label>
          <select
            value={selectedOrigin || ""}
            onChange={(e) => onOriginChange(e.target.value)}
            className="w-full px-3 py-3 border border-[var(--color-neutral-300)] rounded-[var(--radius-input)] bg-white text-[var(--color-neutral-900)] text-[16px] focus:border-[var(--color-neutral-700)]"
          >
            <option value="">Select station</option>
            {EUROSTAR_STATIONS.map((s) => (
              <option key={s.uic} value={s.uic}>{s.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={swapStations}
          className="p-3 rounded-[var(--radius-input)] border border-[var(--color-neutral-300)] text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)] transition-colors"
          title="Swap stations"
        >
          &#8644;
        </button>

        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">To</label>
          <select
            value={selectedDestination || ""}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full px-3 py-3 border border-[var(--color-neutral-300)] rounded-[var(--radius-input)] bg-white text-[var(--color-neutral-900)] text-[16px] focus:border-[var(--color-neutral-700)]"
          >
            <option value="">Select station</option>
            {EUROSTAR_STATIONS.map((s) => (
              <option key={s.uic} value={s.uic}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">Departure</label>
          <input
            type="date"
            value={searchParams.outboundDate || ""}
            onChange={(e) => setSearchParams({ outboundDate: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-3 border border-[var(--color-neutral-300)] rounded-[var(--radius-input)] text-[var(--color-neutral-900)] focus:border-[var(--color-neutral-700)]"
          />
        </div>
        {tripType === "return" && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">Return</label>
            <input
              type="date"
              value={searchParams.inboundDate || ""}
              onChange={(e) => setSearchParams({ inboundDate: e.target.value })}
              min={searchParams.outboundDate || new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-3 border border-[var(--color-neutral-300)] rounded-[var(--radius-input)] text-[var(--color-neutral-900)] focus:border-[var(--color-neutral-700)]"
            />
          </div>
        )}
      </div>

      {/* Passengers */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Adults", key: "adults" as const, options: [1,2,3,4,5,6,7,8,9], fallback: 1 },
          { label: "Youth (12-25)", key: "youths" as const, options: [0,1,2,3,4], fallback: 0 },
          { label: "Children (4-11)", key: "children" as const, options: [0,1,2,3,4], fallback: 0 },
        ].map(({ label, key, options, fallback }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">{label}</label>
            <select
              value={searchParams[key] ?? fallback}
              onChange={(e) => setSearchParams({ [key]: parseInt(e.target.value) })}
              className="w-full px-3 py-3 border border-[var(--color-neutral-300)] rounded-[var(--radius-input)] text-[var(--color-neutral-900)] focus:border-[var(--color-neutral-700)]"
            >
              {options.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Currency */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">Currency</label>
        <select
          value={searchParams.currency || "GBP"}
          onChange={(e) => setSearchParams({ currency: e.target.value })}
          className="w-full px-3 py-3 border border-[var(--color-neutral-300)] rounded-[var(--radius-input)] text-[var(--color-neutral-900)] focus:border-[var(--color-neutral-700)]"
        >
          <option value="GBP">GBP (British Pound)</option>
          <option value="EUR">EUR (Euro)</option>
          <option value="USD">USD (US Dollar)</option>
        </select>
      </div>

      {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}

      <button
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-neutral-100)] disabled:text-[var(--color-neutral-500)] transition-colors"
      >
        {isSearching ? "Searching..." : "Search Trains"}
      </button>
    </div>
  );
}
