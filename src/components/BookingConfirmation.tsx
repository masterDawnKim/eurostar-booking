"use client";

import { useBookingStore } from "@/lib/booking-store";

export default function BookingConfirmation() {
  const { booking, reset } = useBookingStore();

  if (!booking) return null;

  return (
    <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-5 sm:p-6 text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--color-primary-tint)] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-neutral-900)] mb-1.5 sm:mb-2">Booking Confirmed!</h2>
      <p className="text-sm text-[var(--color-neutral-500)] mb-5 sm:mb-6">Your Eurostar tickets have been booked successfully.</p>

      <div className="bg-[var(--color-primary-tint)] rounded-[var(--radius-card)] p-4 mb-5 sm:mb-6">
        <p className="text-xs sm:text-sm text-[var(--color-primary)]">Booking Reference</p>
        <p className="text-2xl sm:text-3xl font-mono font-semibold text-[var(--color-primary-hover)] mt-0.5">{booking.reference}</p>
      </div>

      {/* Journey Details */}
      <div className="text-left max-w-md mx-auto space-y-4 mb-6 sm:mb-8">
        {booking.outbound && booking.outbound.length > 0 && (
          <div className="bg-[var(--color-neutral-50)] rounded-[var(--radius-card)] p-4">
            <h3 className="font-semibold text-[var(--color-neutral-900)] text-sm mb-2">Outbound</h3>
            {booking.outbound.map((seg, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-[var(--color-neutral-900)]">{seg.origin.shortName}</span>
                  <span className="text-[var(--color-neutral-400)] mx-1.5">&rarr;</span>
                  <span className="font-medium text-[var(--color-neutral-900)]">{seg.destination.shortName}</span>
                </div>
                <div className="text-right text-xs text-[var(--color-neutral-500)]">
                  <div>{seg.timing.departs} &ndash; {seg.timing.arrives}</div>
                  <div className="font-mono text-[var(--color-primary)]">{seg.serviceName}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {booking.inbound && booking.inbound.length > 0 && (
          <div className="bg-[var(--color-neutral-50)] rounded-[var(--radius-card)] p-4">
            <h3 className="font-semibold text-[var(--color-neutral-900)] text-sm mb-2">Return</h3>
            {booking.inbound.map((seg, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-[var(--color-neutral-900)]">{seg.origin.shortName}</span>
                  <span className="text-[var(--color-neutral-400)] mx-1.5">&rarr;</span>
                  <span className="font-medium text-[var(--color-neutral-900)]">{seg.destination.shortName}</span>
                </div>
                <div className="text-right text-xs text-[var(--color-neutral-500)]">
                  <div>{seg.timing.departs} &ndash; {seg.timing.arrives}</div>
                  <div className="font-mono text-[var(--color-primary)]">{seg.serviceName}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-[var(--color-neutral-900)] text-sm sm:text-base">Passengers:</h3>
          <div className="space-y-1 mt-2">
            {booking.passengers.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5">
                <span className="text-[var(--color-neutral-700)] font-medium">{p.firstName} {p.lastName}</span>
                <span className="text-[var(--color-neutral-500)] text-xs sm:text-sm">{p.email}</span>
              </div>
            ))}
          </div>
        </div>

        {booking.fulfillmentMethod?.map((fm) => (
          <div key={fm.code} className="text-sm text-[var(--color-neutral-700)] pt-3 border-t border-[var(--color-neutral-200)]">
            <strong>Ticket delivery:</strong> {fm.name}
          </div>
        ))}
      </div>

      <button
        onClick={reset}
        className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
      >
        Book Another Trip
      </button>
    </div>
  );
}
