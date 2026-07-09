"use client";

import { useState } from "react";
import { useBookingStore } from "@/lib/booking-store";

export default function PaymentForm() {
  const { booking, searchParams, selectedOutbound, selectedInbound, submitPayment, confirmBooking } = useBookingStore();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!booking) return null;

  const balance = booking.balance;
  const cur = balance?.currency || searchParams.currency || "GBP";
  const currencySymbol = cur === "EUR" ? "\u20AC" : cur === "USD" ? "$" : "\u00A3";

  const outboundLeg = selectedOutbound?.fare.legs[selectedOutbound.legIndex];
  const inboundLeg = selectedInbound?.fare.legs[selectedInbound.legIndex];

  const handlePayment = async () => {
    setIsPaying(true);
    setError(null);
    try {
      const paymentRef = `PAY-${Date.now()}`;
      await submitPayment(paymentRef);
      await confirmBooking();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Payment Summary</h2>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-4">
          {outboundLeg && (
            <div>
              <div className="text-sm font-medium text-[var(--color-neutral-700)] mb-1.5">
                Outbound: {outboundLeg.origin.shortName} &rarr; {outboundLeg.destination.shortName}
              </div>
              <div className="space-y-1 pl-3">
                {outboundLeg.products.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm text-[var(--color-neutral-600)]">
                    <span>{p.name} &middot; {p.passengerId}</span>
                    <span>{currencySymbol}{p.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {inboundLeg && (
            <div>
              <div className="text-sm font-medium text-[var(--color-neutral-700)] mb-1.5">
                Return: {inboundLeg.origin.shortName} &rarr; {inboundLeg.destination.shortName}
              </div>
              <div className="space-y-1 pl-3">
                {inboundLeg.products.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm text-[var(--color-neutral-600)]">
                    <span>{p.name} &middot; {p.passengerId}</span>
                    <span>{currencySymbol}{p.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[var(--color-neutral-50)] rounded-[var(--radius-card)] p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-[var(--color-neutral-700)]">Booking Reference</span>
            <span className="font-mono font-semibold text-[var(--color-neutral-900)]">{booking.reference}</span>
          </div>
          {balance && (
            <>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--color-neutral-700)]">Total Amount</span>
                <span className="text-[var(--color-neutral-900)]">{currencySymbol}{balance.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--color-neutral-700)]">Paid</span>
                <span className="text-[var(--color-success)]">{currencySymbol}{balance.paidAmount.toFixed(2)}</span>
              </div>
              <hr className="my-2 border-[var(--color-neutral-200)]" />
              <div className="flex justify-between">
                <span className="font-semibold text-[var(--color-neutral-900)]">Amount Due</span>
                <span className="text-xl font-semibold text-[var(--color-primary)]">
                  {currencySymbol}{balance.remainingBalance.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Passengers */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[var(--color-neutral-700)] mb-2">Passengers</h3>
          {booking.passengers.map((p) => (
            <div key={p.id} className="flex justify-between text-sm text-[var(--color-neutral-700)] py-1">
              <span>{p.firstName} {p.lastName}</span>
              <span className="text-[var(--color-neutral-500)]">
                {p.type === "AD" ? "Adult" : p.type === "CH" ? "Child" : p.type === "SR" ? "Senior" : "Youth"}
              </span>
            </div>
          ))}
        </div>

        {/* Payment placeholder */}
        <div className="mb-6 p-4 border border-dashed border-[var(--color-neutral-300)] rounded-[var(--radius-card)]">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-5 h-5 text-[var(--color-neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            <span className="text-sm font-medium text-[var(--color-neutral-600)]">Payment Gateway</span>
          </div>
          <p className="text-xs text-[var(--color-neutral-500)]">Card payment will be processed via secure payment gateway in production.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-error)] bg-red-50 px-4 py-3 rounded-[var(--radius-card)] mb-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={isPaying}
          className="w-full py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-500)] transition-colors"
        >
          {isPaying ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing Payment...
            </span>
          ) : `Pay ${currencySymbol}${balance?.remainingBalance.toFixed(2) ?? "0.00"} & Confirm`}
        </button>
      </div>
    </div>
  );
}
