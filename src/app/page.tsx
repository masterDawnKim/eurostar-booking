"use client";

import { useState } from "react";
import Link from "next/link";
import StationMap from "@/components/StationMap";
import SearchForm from "@/components/SearchForm";
import JourneyResults from "@/components/JourneyResults";
import PassengerForm from "@/components/PassengerForm";
import PaymentForm from "@/components/PaymentForm";
import BookingConfirmation from "@/components/BookingConfirmation";
import { useBookingStore } from "@/lib/booking-store";

const STEPS = [
  { key: "search", label: "Search", short: "1" },
  { key: "select", label: "Select", short: "2" },
  { key: "passengers", label: "Passengers", short: "3" },
  { key: "payment", label: "Payment", short: "4" },
  { key: "done", label: "Confirmed", short: "5" },
] as const;

export default function Home() {
  const { bookingStep } = useBookingStore();
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const currentIndex = STEPS.findIndex(
    (s) => s.key === (bookingStep === "confirm" ? "payment" : bookingStep)
  );

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-[var(--color-neutral-200)]/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M4 15.5L8 4h3l-2 7h5l-6 9h-3l2-5H4z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-[var(--color-neutral-900)] tracking-tight">Eurostar</span>
              <span className="text-[10px] text-[var(--color-neutral-500)] block -mt-1 tracking-widest uppercase">by Diplat</span>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/manage"
              className="px-3 py-1.5 text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] rounded-[var(--radius-action)] transition-colors"
            >
              My Bookings
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== SEARCH STEP ===== */}
        {bookingStep === "search" && (
          <>
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1f28] via-[#242a35] to-[#2c3340] text-white">
              {/* Decorative train illustration */}
              <div className="absolute right-0 bottom-0 opacity-[0.06] pointer-events-none">
                <svg width="600" height="200" viewBox="0 0 600 200" fill="none">
                  <path d="M0 160h500c30 0 50-20 50-50V80c0-30-20-50-50-50H100L60 0H20l20 30H0v130z" fill="white" />
                  <circle cx="120" cy="170" r="25" fill="white" />
                  <circle cx="380" cy="170" r="25" fill="white" />
                  <rect x="140" y="60" width="60" height="50" rx="6" fill="white" opacity="0.5" />
                  <rect x="220" y="60" width="60" height="50" rx="6" fill="white" opacity="0.5" />
                  <rect x="300" y="60" width="60" height="50" rx="6" fill="white" opacity="0.5" />
                  <rect x="380" y="60" width="60" height="50" rx="6" fill="white" opacity="0.5" />
                </svg>
              </div>

              {/* Gradient overlay for smooth transition */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-neutral-50)] to-transparent" />

              <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-20">
                <div className="max-w-xl">
                  <p className="text-sm font-medium text-[var(--color-primary)] mb-2 tracking-wide uppercase">High-Speed Rail Booking</p>
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 leading-tight">
                    Travel across<br />Europe by train
                  </h2>
                  <p className="text-base sm:text-lg text-white/60 max-w-md">
                    London, Paris, Brussels, Amsterdam, Cologne and more. Up to 300 km/h.
                  </p>
                </div>
              </div>
            </div>

            {/* Map + Form */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
                {/* Map - hidden on mobile */}
                <div className="hidden md:block bg-white rounded-2xl border border-[var(--color-neutral-200)] p-4 shadow-sm">
                  <StationMap
                    onSelectOrigin={(s) => setSelectedOrigin(s.uic)}
                    onSelectDestination={(s) => setSelectedDestination(s.uic)}
                    selectedOrigin={selectedOrigin}
                    selectedDestination={selectedDestination}
                  />
                </div>
                <SearchForm
                  selectedOrigin={selectedOrigin}
                  selectedDestination={selectedDestination}
                  onOriginChange={setSelectedOrigin}
                  onDestinationChange={setSelectedDestination}
                />
              </div>
            </div>
          </>
        )}

        {/* ===== NON-SEARCH STEPS ===== */}
        {bookingStep !== "search" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {/* Compact Progress - mobile friendly */}
            <div className="mb-8">
              <div className="flex items-center gap-1">
                {STEPS.map((step, i) => (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          i < currentIndex
                            ? "bg-[var(--color-primary)] text-white"
                            : i === currentIndex
                            ? "bg-[var(--color-primary)] text-white ring-[3px] ring-[var(--color-primary-tint)]"
                            : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)]"
                        }`}
                      >
                        {i < currentIndex ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.short
                        )}
                      </div>
                      <span
                        className={`mt-1 text-[11px] sm:text-xs whitespace-nowrap ${
                          i <= currentIndex ? "text-[var(--color-neutral-900)] font-medium" : "text-[var(--color-neutral-400)]"
                        }`}
                      >
                        <span className="hidden sm:inline">{step.label}</span>
                        <span className="sm:hidden">{step.label.slice(0, 3)}</span>
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-[2px] mx-1.5 sm:mx-3 mt-[-18px] rounded-full transition-colors ${
                          i < currentIndex ? "bg-[var(--color-primary)]" : "bg-[var(--color-neutral-200)]"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {bookingStep === "select" && <JourneyResults />}
            {bookingStep === "passengers" && <PassengerForm />}
            {(bookingStep === "payment" || bookingStep === "confirm") && <PaymentForm />}
            {bookingStep === "done" && <BookingConfirmation />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-neutral-200)] bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[var(--color-primary)] rounded-md flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M4 15.5L8 4h3l-2 7h5l-6 9h-3l2-5H4z" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-bold text-[var(--color-neutral-900)]">Eurostar</span>
              </div>
              <p className="text-xs text-[var(--color-neutral-500)] leading-relaxed">
                Powered by Diplat Korea<br />Eurostar API Integration
              </p>
            </div>

            {/* Routes */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-neutral-900)] uppercase tracking-wider mb-2">Popular Routes</h4>
              <ul className="space-y-1 text-xs text-[var(--color-neutral-500)]">
                <li>London &rarr; Paris &middot; 2h 15m</li>
                <li>London &rarr; Brussels &middot; 1h 55m</li>
                <li>London &rarr; Amsterdam &middot; 3h 52m</li>
                <li>Paris &rarr; Brussels &middot; 1h 22m</li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-neutral-900)] uppercase tracking-wider mb-2">Information</h4>
              <ul className="space-y-1 text-xs text-[var(--color-neutral-500)]">
                <li>22 stations across 5 countries</li>
                <li>Up to 300 km/h top speed</li>
                <li>Channel Tunnel crossing</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--color-neutral-100)] text-center text-[11px] text-[var(--color-neutral-400)]">
            &copy; 2026 Diplat Korea &middot; Eurostar is a trademark of Eurostar International Ltd.
          </div>
        </div>
      </footer>
    </div>
  );
}
