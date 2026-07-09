"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import StationMap from "@/components/StationMap";
import SearchForm from "@/components/SearchForm";
import JourneyResults from "@/components/JourneyResults";
import PassengerForm from "@/components/PassengerForm";
import PaymentForm from "@/components/PaymentForm";
import BookingConfirmation from "@/components/BookingConfirmation";
import { useBookingStore } from "@/lib/booking-store";

const STEPS = [
  { key: "search", label: "Search", mobileLabel: "Search", short: "1" },
  { key: "select", label: "Select Train", mobileLabel: "Train", short: "2" },
  { key: "passengers", label: "Passengers", mobileLabel: "Info", short: "3" },
  { key: "payment", label: "Payment", mobileLabel: "Pay", short: "4" },
  { key: "done", label: "Confirmed", mobileLabel: "Done", short: "5" },
] as const;

export default function Home() {
  const { bookingStep, setStep, reset } = useBookingStore();
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const pathname = usePathname();

  const currentIndex = STEPS.findIndex(
    (s) => s.key === (bookingStep === "confirm" ? "payment" : bookingStep)
  );

  const isHome = pathname === "/" || pathname === "/eurostar-booking" || pathname === "/eurostar-booking/";

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col pb-bottomnav md:pb-0">
      {/* Desktop Header — hidden on mobile */}
      <header className="hidden md:block bg-white/80 backdrop-blur-lg border-b border-[var(--color-neutral-200)]/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

      {/* Mobile Header — compact, app-like */}
      <header className="md:hidden bg-white/90 backdrop-blur-xl border-b border-[var(--color-neutral-200)]/40 sticky top-0 z-50 safe-top">
        <div className="px-4 py-2.5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--color-primary)] rounded-[6px] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 15.5L8 4h3l-2 7h5l-6 9h-3l2-5H4z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[15px] font-bold text-[var(--color-neutral-900)] tracking-tight">Eurostar</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== SEARCH STEP ===== */}
        {bookingStep === "search" && (
          <>
            {/* Hero — shorter on mobile */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1f28] via-[#242a35] to-[#2c3340] text-white">
              {/* Decorative train — desktop only */}
              <div className="absolute right-0 bottom-0 opacity-[0.06] pointer-events-none hidden sm:block">
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

              {/* Gradient transition */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-neutral-50)] to-transparent" />

              <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-16 pb-10 sm:pb-20">
                <div className="max-w-xl">
                  <p className="text-xs sm:text-sm font-medium text-[var(--color-primary)] mb-0.5 sm:mb-2 tracking-wide uppercase">High-Speed Rail</p>
                  <h2 className="text-xl sm:text-5xl font-bold tracking-tight mb-1.5 sm:mb-3 leading-tight">
                    Travel across<br />Europe by train
                  </h2>
                  <p className="text-xs sm:text-lg text-white/60 max-w-md">
                    London, Paris, Brussels, Amsterdam &amp; more.
                  </p>
                </div>
              </div>
            </div>

            {/* Map + Form */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10 relative z-10 pb-4 sm:pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
                {/* Map — desktop only */}
                <div className="hidden md:block bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-4 shadow-sm">
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Compact Progress */}
            <div className="mb-6 sm:mb-8">
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
                        <span className="sm:hidden">{step.mobileLabel}</span>
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

            {bookingStep !== "done" && (
              <button
                onClick={() => {
                  const prev: Record<string, string> = {
                    select: "search",
                    passengers: "select",
                    payment: "passengers",
                    confirm: "payment",
                  };
                  const target = prev[bookingStep];
                  if (target === "search") {
                    reset();
                  } else if (target) {
                    setStep(target as "select" | "passengers" | "payment");
                  }
                }}
                className="flex items-center gap-1.5 text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] mb-4 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}

            {bookingStep === "select" && <JourneyResults />}
            {bookingStep === "passengers" && <PassengerForm />}
            {(bookingStep === "payment" || bookingStep === "confirm") && <PaymentForm />}
            {bookingStep === "done" && <BookingConfirmation />}
          </div>
        )}
      </main>

      {/* Desktop Footer — hidden on mobile (bottom nav replaces it) */}
      <footer className="hidden md:block border-t border-[var(--color-neutral-200)] bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
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
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-neutral-900)] uppercase tracking-wider mb-2">Popular Routes</h4>
              <ul className="space-y-1 text-xs text-[var(--color-neutral-500)]">
                <li>London &rarr; Paris &middot; 2h 15m</li>
                <li>London &rarr; Brussels &middot; 1h 55m</li>
                <li>London &rarr; Amsterdam &middot; 3h 52m</li>
                <li>Paris &rarr; Brussels &middot; 1h 22m</li>
              </ul>
            </div>
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

      {/* ===== Mobile Bottom Navigation ===== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[var(--color-neutral-200)]/60 safe-bottom">
        <div className="flex items-stretch">
          <Link
            href="/"
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 tap-scale min-h-[52px] ${
              isHome
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-neutral-400)]"
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isHome ? 2.5 : 1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span className="text-[10px] font-semibold">Book</span>
          </Link>

          <Link
            href="/manage"
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 tap-scale min-h-[52px] ${
              !isHome
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-neutral-400)]"
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={!isHome ? 2.5 : 1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
            <span className="text-[10px] font-semibold">Tickets</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
