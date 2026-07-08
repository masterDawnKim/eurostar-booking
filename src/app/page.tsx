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
  { key: "search", label: "Search", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { key: "select", label: "Select", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { key: "passengers", label: "Passengers", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { key: "payment", label: "Payment", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { key: "done", label: "Confirmed", icon: "M5 13l4 4L19 7" },
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
      <header className="bg-white border-b border-[var(--color-neutral-200)] sticky top-0 z-50">
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
        {/* Hero + Search area */}
        {bookingStep === "search" && (
          <>
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-[var(--color-neutral-900)] via-[#2a2f38] to-[#1a1f28] text-white">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                  Travel across Europe
                </h2>
                <p className="text-[var(--color-neutral-300)] text-base sm:text-lg max-w-lg">
                  Book high-speed trains connecting London, Paris, Brussels, Amsterdam and beyond.
                </p>
              </div>
            </div>

            {/* Map + Form */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-4 shadow-sm">
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

            {/* Quick stats */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: "22", label: "Stations", sub: "across Europe" },
                  { value: "300", label: "km/h", sub: "top speed" },
                  { value: "2h15", label: "London", sub: "to Paris" },
                  { value: "3h52", label: "London", sub: "to Amsterdam" },
                ].map((stat) => (
                  <div key={stat.label + stat.sub} className="bg-white rounded-[var(--radius-card)] border border-[var(--color-neutral-200)] p-4 text-center">
                    <div className="text-2xl font-bold text-[var(--color-primary)]">{stat.value}</div>
                    <div className="text-sm font-medium text-[var(--color-neutral-900)]">{stat.label}</div>
                    <div className="text-xs text-[var(--color-neutral-500)]">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Non-search steps */}
        {bookingStep !== "search" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Progress Steps */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex items-center min-w-[480px]">
                {STEPS.map((step, i) => (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          i < currentIndex
                            ? "bg-[var(--color-primary)] text-white"
                            : i === currentIndex
                            ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary-tint)]"
                            : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-500)]"
                        }`}
                      >
                        {i < currentIndex ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`mt-1.5 text-xs whitespace-nowrap ${
                          i <= currentIndex ? "text-[var(--color-neutral-900)] font-medium" : "text-[var(--color-neutral-500)]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-3 mt-[-18px] rounded-full ${
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

      <footer className="border-t border-[var(--color-neutral-200)] bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--color-neutral-500)]">
          <span>Powered by Diplat Korea</span>
          <span className="text-xs">Eurostar API Integration Demo</span>
        </div>
      </footer>
    </div>
  );
}
