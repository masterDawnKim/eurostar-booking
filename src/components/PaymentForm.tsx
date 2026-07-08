"use client";

import { useState } from "react";
import { useBookingStore } from "@/lib/booking-store";

export default function PaymentForm() {
  const { booking, submitPayment, confirmBooking } = useBookingStore();
  const [isPaying, setIsPaying] = useState(false);

  if (!booking) return null;

  const balance = booking.balance;

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const paymentRef = `PAY-${Date.now()}`;
      await submitPayment(paymentRef);
      await confirmBooking();
    } catch (e) {
      console.error("Payment failed:", e);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6">
      <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Payment Summary</h2>

      <div className="bg-[var(--color-neutral-50)] rounded-[var(--radius-card)] p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-[var(--color-neutral-700)]">Booking Reference</span>
          <span className="font-mono font-semibold text-[var(--color-neutral-900)]">{booking.reference}</span>
        </div>
        {balance && (
          <>
            <div className="flex justify-between mb-2">
              <span className="text-[var(--color-neutral-700)]">Total Amount</span>
              <span className="text-[var(--color-neutral-900)]">{balance.currency} {balance.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[var(--color-neutral-700)]">Paid</span>
              <span className="text-[var(--color-success)]">{balance.currency} {balance.paidAmount.toFixed(2)}</span>
            </div>
            <hr className="my-2 border-[var(--color-neutral-200)]" />
            <div className="flex justify-between">
              <span className="font-semibold text-[var(--color-neutral-900)]">Amount Due</span>
              <span className="text-xl font-semibold text-[var(--color-primary)]">
                {balance.currency} {balance.remainingBalance.toFixed(2)}
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
      <div className="mb-6 p-4 border border-dashed border-[var(--color-neutral-300)] rounded-[var(--radius-card)] text-center text-[var(--color-neutral-500)]">
        <p className="text-sm">Payment gateway integration (Stripe/PG)</p>
        <p className="text-xs mt-1">Card details will be collected here in production</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={isPaying}
        className="w-full py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-neutral-100)] disabled:text-[var(--color-neutral-500)] transition-colors"
      >
        {isPaying ? "Processing..." : "Pay & Confirm Booking"}
      </button>
    </div>
  );
}
