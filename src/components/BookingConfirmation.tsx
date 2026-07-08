"use client";

import { useBookingStore } from "@/lib/booking-store";

export default function BookingConfirmation() {
  const { booking, reset } = useBookingStore();

  if (!booking) return null;

  return (
    <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6 text-center">
      <div className="w-16 h-16 bg-[var(--color-primary-tint)] rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)] mb-2">Booking Confirmed!</h2>
      <p className="text-[var(--color-neutral-500)] mb-6">Your Eurostar tickets have been booked successfully.</p>

      <div className="bg-[var(--color-primary-tint)] rounded-[var(--radius-card)] p-4 mb-6 inline-block">
        <p className="text-sm text-[var(--color-primary)]">Booking Reference</p>
        <p className="text-3xl font-mono font-semibold text-[var(--color-primary-hover)]">{booking.reference}</p>
      </div>

      <div className="text-left max-w-md mx-auto space-y-3 mb-8">
        <h3 className="font-semibold text-[var(--color-neutral-900)]">Passengers:</h3>
        {booking.passengers.map((p) => (
          <div key={p.id} className="flex justify-between text-sm">
            <span className="text-[var(--color-neutral-700)]">{p.firstName} {p.lastName}</span>
            <span className="text-[var(--color-neutral-500)]">{p.email}</span>
          </div>
        ))}

        {booking.fulfillmentMethod?.map((fm) => (
          <div key={fm.code} className="text-sm text-[var(--color-neutral-700)] mt-4">
            <strong>Ticket delivery:</strong> {fm.name}
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Book Another Trip
        </button>
      </div>
    </div>
  );
}
