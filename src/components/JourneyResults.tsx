"use client";

import { useState } from "react";
import { useBookingStore } from "@/lib/booking-store";
import type { Fare } from "@/types/eurostar";

export default function JourneyResults() {
  const { searchResults, searchParams, selectedOutbound, selectedInbound, selectOutbound, selectInbound, createBooking } = useBookingStore();
  const currency = searchParams.currency || "GBP";
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!searchResults) return null;

  const needsInbound = !!searchResults.inbound;
  const canProceed = selectedOutbound && (!needsInbound || selectedInbound);

  const handleProceed = async () => {
    if (!canProceed) return;
    setIsCreating(true);
    setError(null);
    try {
      await createBooking();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setIsCreating(false);
    }
  };

  const outboundJourneys = searchResults.outbound.journeys.flatMap((journey, ji) =>
    journey.fares.map((fare, fi) => ({ fare, ji, fi }))
  );
  const inboundJourneys = searchResults.inbound?.journeys.flatMap((journey, ji) =>
    journey.fares.map((fare, fi) => ({ fare, ji, fi }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-3">
          Outbound: {searchResults.outbound.origin.shortName} &rarr; {searchResults.outbound.destination.shortName}
        </h2>
        {outboundJourneys.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-[var(--radius-card)] border border-[var(--color-neutral-200)]">
            <svg className="w-12 h-12 mx-auto text-[var(--color-neutral-300)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-[var(--color-neutral-500)] text-sm">No trains found for this date.</p>
            <p className="text-[var(--color-neutral-400)] text-xs mt-1">Try a different date or route.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {outboundJourneys.map(({ fare, ji, fi }) => (
              <FareCard
                key={`out-${ji}-${fi}`}
                fare={fare}
                legIndex={0}
                currency={currency}
                isSelected={selectedOutbound?.fare === fare && selectedOutbound?.legIndex === 0}
                onSelect={() => selectOutbound(fare, 0)}
              />
            ))}
          </div>
        )}
      </div>

      {searchResults.inbound && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-3">
            Return: {searchResults.inbound.origin.shortName} &rarr; {searchResults.inbound.destination.shortName}
          </h2>
          {!inboundJourneys || inboundJourneys.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-[var(--radius-card)] border border-[var(--color-neutral-200)]">
              <svg className="w-12 h-12 mx-auto text-[var(--color-neutral-300)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-[var(--color-neutral-500)] text-sm">No return trains found for this date.</p>
              <p className="text-[var(--color-neutral-400)] text-xs mt-1">Try a different return date.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {inboundJourneys.map(({ fare, ji, fi }) => (
                <FareCard
                  key={`in-${ji}-${fi}`}
                  fare={fare}
                  legIndex={0}
                  currency={currency}
                  isSelected={selectedInbound?.fare === fare && selectedInbound?.legIndex === 0}
                  onSelect={() => selectInbound(fare, 0)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-error)] bg-red-50 px-4 py-3 rounded-[var(--radius-card)]">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {selectedOutbound && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white rounded-[var(--radius-card)] border border-[var(--color-neutral-200)] p-4">
          <div className="text-sm text-[var(--color-neutral-600)]">
            {needsInbound && !selectedInbound && (
              <span className="text-[var(--color-warning)] font-medium">Please select a return journey to continue</span>
            )}
            {(!needsInbound || selectedInbound) && (
              <span>Ready to continue</span>
            )}
          </div>
          <button
            onClick={handleProceed}
            disabled={!canProceed || isCreating}
            className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-500)] transition-colors"
          >
            {isCreating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Booking...
              </span>
            ) : "Continue to Passenger Details"}
          </button>
        </div>
      )}
    </div>
  );
}

function FareCard({
  fare,
  legIndex,
  currency,
  isSelected,
  onSelect,
}: {
  fare: Fare;
  legIndex: number;
  currency?: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const leg = fare.legs[legIndex];
  if (!leg) return null;

  const totalPrice = leg.products.reduce((sum, p) => sum + p.price, 0);
  const productName = leg.products[0]?.name || "Standard";
  const flexLabels: Record<number, string> = { 1: "Standard", 2: "Semi-Flex", 3: "Flex" };
  const currencySymbol = currency === "EUR" ? "\u20AC" : currency === "USD" ? "$" : "\u00A3";

  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`w-full p-4 rounded-[var(--radius-card)] border text-left transition-all ${
        isSelected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)] shadow-sm"
          : "border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)] bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="text-center shrink-0">
            <div className="text-lg sm:text-xl font-semibold text-[var(--color-neutral-900)]">{leg.timing.departs}</div>
            <div className="text-[11px] sm:text-xs text-[var(--color-neutral-500)]">{leg.origin.shortName}</div>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="text-[11px] sm:text-xs text-[var(--color-neutral-500)]">
              {Math.floor(leg.timing.duration / 60)}h {leg.timing.duration % 60}m
            </div>
            <div className="w-16 sm:w-20 h-px bg-[var(--color-neutral-300)] my-1" />
            <div className="text-[11px] sm:text-xs text-[var(--color-neutral-500)] truncate max-w-[80px] sm:max-w-none">
              {leg.serviceType.name} {leg.serviceName}
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-lg sm:text-xl font-semibold text-[var(--color-neutral-900)]">{leg.timing.arrives}</div>
            <div className="text-[11px] sm:text-xs text-[var(--color-neutral-500)]">{leg.destination.shortName}</div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg sm:text-xl font-semibold text-[var(--color-primary)]">{currencySymbol}{totalPrice.toFixed(0)}</div>
          <div className="text-[11px] sm:text-xs text-[var(--color-neutral-500)]">{flexLabels[fare.flexibilityLevel] || productName}</div>
          <div className="text-[11px] sm:text-xs text-[var(--color-neutral-500)]">
            {fare.seats <= 5 ? (
              <span className="text-[var(--color-warning)]">{fare.seats} seats left</span>
            ) : (
              <>{fare.seats} seats left</>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
