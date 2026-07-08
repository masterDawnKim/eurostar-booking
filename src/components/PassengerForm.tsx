"use client";

import { useBookingStore } from "@/lib/booking-store";

export default function PassengerForm() {
  const { booking, passengerDetails, customerDetails, setPassengerDetails, setCustomerDetails, submitPassengers, submitCustomer } = useBookingStore();

  if (!booking) return null;

  const updatePassenger = (index: number, field: string, value: string) => {
    const updated = [...passengerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerDetails(updated);
  };

  const handleSubmit = async () => {
    try {
      await submitPassengers();
      await submitCustomer();
    } catch (e) {
      console.error("Failed to update passenger details:", e);
    }
  };

  const inputClass = "w-full px-3 py-3 border border-[var(--color-neutral-300)] rounded-[var(--radius-input)] text-[var(--color-neutral-900)] text-[16px] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-neutral-700)]";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-1">
          Booking: {booking.reference}
        </h2>
        <p className="text-sm text-[var(--color-neutral-500)] mb-6">
          Please complete the booking within 30 minutes
        </p>

        {/* Customer */}
        <div className="mb-8">
          <h3 className="text-[16px] font-semibold text-[var(--color-neutral-900)] mb-4">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-neutral-700)] mb-1">First Name</label>
              <input type="text" value={customerDetails.firstName}
                onChange={(e) => setCustomerDetails({ ...customerDetails, firstName: e.target.value })}
                className={inputClass} placeholder="John" />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Last Name</label>
              <input type="text" value={customerDetails.lastName}
                onChange={(e) => setCustomerDetails({ ...customerDetails, lastName: e.target.value })}
                className={inputClass} placeholder="Doe" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Email</label>
              <input type="email" value={customerDetails.email}
                onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                className={inputClass} placeholder="john@example.com" />
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--color-neutral-700)] mb-1">First Name</label>
                <input type="text" value={passenger.firstName}
                  onChange={(e) => updatePassenger(i, "firstName", e.target.value)}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Last Name</label>
                <input type="text" value={passenger.lastName}
                  onChange={(e) => updatePassenger(i, "lastName", e.target.value)}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Email (optional)</label>
                <input type="email" value={passenger.email || ""}
                  onChange={(e) => updatePassenger(i, "email", e.target.value)}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-neutral-700)] mb-1">Phone (optional)</label>
                <input type="tel" value={passenger.phoneNumber || ""}
                  onChange={(e) => updatePassenger(i, "phoneNumber", e.target.value)}
                  className={inputClass} placeholder="+44 7..." />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
