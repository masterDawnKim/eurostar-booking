"use client";

import { useState } from "react";
import { useBookingStore } from "@/lib/booking-store";

export default function PassengerForm() {
  const { booking, passengerDetails, customerDetails, setPassengerDetails, setCustomerDetails, submitPassengers, submitCustomer } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!booking) return null;

  const updatePassenger = (index: number, field: string, value: string) => {
    const updated = [...passengerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerDetails(updated);
    setErrors((prev) => { const next = { ...prev }; delete next[`p${index}.${field}`]; return next; });
  };

  const updateCustomer = (field: string, value: string) => {
    setCustomerDetails({ ...customerDetails, [field]: value });
    setErrors((prev) => { const next = { ...prev }; delete next[`c.${field}`]; return next; });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerDetails.firstName.trim()) errs["c.firstName"] = "Required";
    if (!customerDetails.lastName.trim()) errs["c.lastName"] = "Required";
    if (!customerDetails.email.trim()) {
      errs["c.email"] = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      errs["c.email"] = "Invalid email";
    }
    passengerDetails.forEach((p, i) => {
      if (!p.firstName?.trim()) errs[`p${i}.firstName`] = "Required";
      if (!p.lastName?.trim()) errs[`p${i}.lastName`] = "Required";
      if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
        errs[`p${i}.email`] = "Invalid email";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await submitPassengers();
      await submitCustomer();
    } catch (e) {
      setErrors({ _form: e instanceof Error ? e.message : "Failed to update passenger details" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (errKey: string) =>
    `w-full px-3 py-3 border rounded-[var(--radius-input)] text-[var(--color-neutral-900)] text-[16px] placeholder:text-[var(--color-neutral-500)] transition-colors outline-none ${
      errors[errKey]
        ? "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-1 focus:ring-[var(--color-error)]"
        : "border-[var(--color-neutral-300)] focus:border-[var(--color-neutral-700)]"
    }`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-1">
          Booking: {booking.reference}
        </h2>
        <p className="text-sm text-[var(--color-neutral-500)] mb-6">
          Please complete the booking within 30 minutes
        </p>

        {errors._form && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-error)] bg-red-50 px-4 py-3 rounded-[var(--radius-card)] mb-6">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {errors._form}
          </div>
        )}

        {/* Customer */}
        <div className="mb-8">
          <h3 className="text-[16px] font-semibold text-[var(--color-neutral-900)] mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-neutral-700)] mb-1">First Name</label>
              <input type="text" value={customerDetails.firstName}
                onChange={(e) => updateCustomer("firstName", e.target.value)}
                className={inputClass("c.firstName")} placeholder="John" />
              {errors["c.firstName"] && <p className="text-xs text-[var(--color-error)] mt-1">{errors["c.firstName"]}</p>}
            </div>
            <div>
              <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Last Name</label>
              <input type="text" value={customerDetails.lastName}
                onChange={(e) => updateCustomer("lastName", e.target.value)}
                className={inputClass("c.lastName")} placeholder="Doe" />
              {errors["c.lastName"] && <p className="text-xs text-[var(--color-error)] mt-1">{errors["c.lastName"]}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Email</label>
              <input type="email" value={customerDetails.email}
                onChange={(e) => updateCustomer("email", e.target.value)}
                className={inputClass("c.email")} placeholder="john@example.com" />
              {errors["c.email"] && <p className="text-xs text-[var(--color-error)] mt-1">{errors["c.email"]}</p>}
            </div>
          </div>
        </div>

        {/* Passengers */}
        {passengerDetails.map((passenger, i) => (
          <div key={passenger.id} className="mb-6 pt-6 border-t border-[var(--color-neutral-200)]">
            <h3 className="text-[16px] font-semibold text-[var(--color-neutral-900)] mb-4">
              Passenger {i + 1}{" "}
              <span className="text-sm text-[var(--color-neutral-500)] font-normal">
                ({booking.passengers[i]?.type === "AD" ? "Adult"
                  : booking.passengers[i]?.type === "CH" ? "Child"
                  : booking.passengers[i]?.type === "SR" ? "Senior"
                  : "Youth"})
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--color-neutral-700)] mb-1">First Name</label>
                <input type="text" value={passenger.firstName}
                  onChange={(e) => updatePassenger(i, "firstName", e.target.value)}
                  className={inputClass(`p${i}.firstName`)} />
                {errors[`p${i}.firstName`] && <p className="text-xs text-[var(--color-error)] mt-1">{errors[`p${i}.firstName`]}</p>}
              </div>
              <div>
                <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Last Name</label>
                <input type="text" value={passenger.lastName}
                  onChange={(e) => updatePassenger(i, "lastName", e.target.value)}
                  className={inputClass(`p${i}.lastName`)} />
                {errors[`p${i}.lastName`] && <p className="text-xs text-[var(--color-error)] mt-1">{errors[`p${i}.lastName`]}</p>}
              </div>
              <div>
                <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Email (optional)</label>
                <input type="email" value={passenger.email || ""}
                  onChange={(e) => updatePassenger(i, "email", e.target.value)}
                  className={inputClass(`p${i}.email`)} />
                {errors[`p${i}.email`] && <p className="text-xs text-[var(--color-error)] mt-1">{errors[`p${i}.email`]}</p>}
              </div>
              <div>
                <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Phone (optional)</label>
                <input type="tel" value={passenger.phoneNumber || ""}
                  onChange={(e) => updatePassenger(i, "phoneNumber", e.target.value)}
                  className={inputClass(`p${i}.phoneNumber`)} placeholder="+44 7..." />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-500)] transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
}
