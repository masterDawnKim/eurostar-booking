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

const STEPS = ["Search", "Select", "Passengers", "Payment", "Done"] as const;
const STEP_KEYS = ["search", "select", "passengers", "payment", "done"] as const;

export default function Home() {
  const { bookingStep } = useBookingStore();
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const currentIndex = STEP_KEYS.indexOf(
    bookingStep === "confirm" ? "payment" : (bookingStep as typeof STEP_KEYS[number])
  );

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <header className="bg-white border-b border-[var(--color-neutral-200)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[var(--radius-action)] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[var(--color-neutral-900)]">Eurostar</h1>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/manage" className="text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-900)] transition-colors">
              My Bookings
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i <= currentIndex
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-500)]"
                }`}>
                  {i + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  i <= currentIndex ? "text-[var(--color-neutral-900)] font-medium" : "text-[var(--color-neutral-500)]"
                }`}>
                  {step}
                </span>
                {i < 4 && (
                  <div className={`w-12 h-px mx-2 ${
                    i < currentIndex ? "bg-[var(--color-primary)]" : "bg-[var(--color-neutral-300)]"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {bookingStep === "search" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <StationMap
              onSelectOrigin={(s) => setSelectedOrigin(s.uic)}
              onSelectDestination={(s) => setSelectedDestination(s.uic)}
              selectedOrigin={selectedOrigin}
              selectedDestination={selectedDestination}
            />
            <SearchForm
              selectedOrigin={selectedOrigin}
              selectedDestination={selectedDestination}
              onOriginChange={setSelectedOrigin}
              onDestinationChange={setSelectedDestination}
            />
          </div>
        )}

        {bookingStep === "select" && <JourneyResults />}
        {bookingStep === "passengers" && <PassengerForm />}
        {(bookingStep === "payment" || bookingStep === "confirm") && <PaymentForm />}
        {bookingStep === "done" && <BookingConfirmation />}
      </main>

      <footer className="border-t border-[var(--color-neutral-200)] bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-[var(--color-neutral-500)]">
          Powered by Diplat Korea &middot; Eurostar API Integration
        </div>
      </footer>
    </div>
  );
}
