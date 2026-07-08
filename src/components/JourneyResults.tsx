"use client";

import { useBookingStore } from "@/lib/booking-store";
import type { Fare } from "@/types/eurostar";

export default function JourneyResults() {
  const { searchResults, selectedOutbound, selectedInbound, selectOutbound, selectInbound, createBooking } = useBookingStore();

  if (!searchResults) return null;

  const handleProceed = async () => {
    if (!selectedOutbound) return;
    try { await createBooking(); } catch (e) { console.error("Failed to create booking:", e); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-3">
          Outbound: {searchResults.outbound.origin.shortName} &rarr; {searchResults.outbound.destination.shortName}
        </h2>
        <div className="space-y-2">
          {searchResults.outbound.journeys.map((journey, ji) =>
            journey.fares.map((fare, fi) => (
              <FareCard
                key={`out-${ji}-${fi}`}
                fare={fare}
                legIndex={0}
                isSelected={selectedOutbound?.fare === fare && selectedOutbound?.legIndex === 0}
                onSelect={() => selectOutbound(fare, 0)}
              />
            ))
          )}
        </div>
      </div>

      {searchResults.inbound && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-3">
            Return: {searchResults.inbound.origin.shortName} &rarr; {searchResults.inbound.destination.shortName}
          </h2>
          <div className="space-y-2">
            {searchResults.inbound.journeys.map((journey, ji) =>
              journey.fares.map((fare, fi) => (
                <FareCard
                  key={`in-${ji}-${fi}`}
                  fare={fare}
                  legIndex={0}
                  isSelected={selectedInbound?.fare === fare && selectedInbound?.legIndex === 0}
                  onSelect={() => selectInbound(fare, 0)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {selectedOutbound && (
        <div className="flex justify-end">
          <button
            onClick={handleProceed}
            className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Continue to Passenger Details
          </button>
        </div>
      )}
    </div>
  );
}

function FareCard({
  fare,
  legIndex,
  isSelected,
  onSelect,
}: {
  fare: Fare;
  legIndex: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const leg = fare.legs[legIndex];
  if (!leg) return null;

  const totalPrice = leg.products.reduce((sum, p) => sum + p.price, 0);
  const productName = leg.products[0]?.name || "Standard";
  const flexLabels: Record<number, string> = { 1: "Standard", 2: "Semi-Flex", 3: "Flex" };

  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-[var(--radius-card)] border text-left transition-all ${
        isSelected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)]"
          : "border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)] bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-[var(--color-neutral-900)]">{leg.timing.departs}</div>
            <div className="text-xs text-[var(--color-neutral-500)]">{leg.origin.shortName}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs text-[var(--color-neutral-500)]">
              {Math.floor(leg.timing.duration / 60)}h {leg.timing.duration % 60}m
            </div>
            <div className="w-20 h-px bg-[var(--color-neutral-300)] my-1" />
            <div className="text-xs text-[var(--color-neutral-500)]">
              {leg.serviceType.name} {leg.serviceName}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-[var(--color-neutral-900)]">{leg.timing.arrives}</div>
            <div className="text-xs text-[var(--color-neutral-500)]">{leg.destination.shortName}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold text-[var(--color-primary)]">{totalPrice.toFixed(0)}</div>
          <div className="text-xs text-[var(--color-neutral-500)]">{flexLabels[fare.flexibilityLevel] || productName}</div>
          <div className="text-xs text-[var(--color-neutral-500)]">{fare.seats} seats left</div>
        </div>
      </div>
    </button>
  );
}
