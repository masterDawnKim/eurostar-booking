"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BookingResponse, BookingDirectionDetail, JourneySearchResponse } from "@/types/eurostar";

type ManageTab = "lookup" | "details" | "exchange" | "cancel";

export default function ManagePage() {
  const [tab, setTab] = useState<ManageTab>("lookup");
  const [reference, setReference] = useState("");
  const [lastName, setLastName] = useState("");
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();

  const isManage = pathname === "/manage" || pathname === "/eurostar-booking/manage";

  const lookupBooking = async () => {
    if (!reference.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/eurostar/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hold", bookingReference: reference.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking not found");
      setBooking(data);
      setTab("details");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (itemRefs?: string[]) => {
    if (!booking) return;
    setLoading(true);
    setError("");
    try {
      const cancelRes = await fetch("/api/eurostar/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", bookingReference: booking.reference, ...(itemRefs ? { itemRefs } : {}) }),
      });
      const cancelData = await cancelRes.json();
      if (!cancelRes.ok) throw new Error(cancelData.error);

      const confirmRes = await fetch("/api/eurostar/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirmCancel", bookingReference: booking.reference }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) throw new Error(confirmData.error);

      setBooking(confirmData);
      setTab("details");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancellation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async () => {
    if (!booking) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/eurostar/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revert", bookingReference: booking.reference }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revert failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] pb-bottomnav md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:block bg-white/80 backdrop-blur-lg border-b border-[var(--color-neutral-200)]/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
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
            <Link href="/"
              className="px-3 py-1.5 text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] rounded-[var(--radius-action)] transition-colors"
            >New Booking</Link>
            <span className="px-3 py-1.5 text-sm text-[var(--color-primary)] font-medium">My Bookings</span>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white/90 backdrop-blur-xl border-b border-[var(--color-neutral-200)]/40 sticky top-0 z-50 safe-top">
        <div className="px-4 py-2.5 flex items-center justify-center">
          <span className="text-[15px] font-bold text-[var(--color-neutral-900)]">My Bookings</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {error && (
          <div className="mb-6 bg-[var(--color-primary-tint)] border border-[var(--color-primary)] rounded-[var(--radius-card)] p-4 text-[var(--color-primary-hover)] text-sm">
            {error}
            <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {tab === "lookup" && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)] mb-2">Manage Booking</h2>
            <p className="text-[var(--color-neutral-500)] mb-6">Enter your booking reference to view or modify your trip.</p>

            <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">Booking Reference</label>
                <input type="text" value={reference} onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC123" maxLength={10}
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-neutral-300)] px-3 py-3 text-lg font-mono tracking-wider text-center uppercase focus:border-[var(--color-neutral-700)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  placeholder="Customer last name"
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-neutral-300)] px-3 py-3 focus:border-[var(--color-neutral-700)]"
                />
              </div>
              <button onClick={lookupBooking} disabled={loading || !reference.trim()}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-[var(--radius-action)] text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-neutral-100)] disabled:text-[var(--color-neutral-500)] transition-colors"
              >
                {loading ? "Searching..." : "Find Booking"}
              </button>
            </div>
          </div>
        )}

        {tab === "details" && booking && (
          <BookingDetails booking={booking}
            onExchange={() => setTab("exchange")}
            onCancel={() => setTab("cancel")}
            onBack={() => { setTab("lookup"); setBooking(null); }}
          />
        )}

        {tab === "exchange" && booking && (
          <ExchangeFlow booking={booking}
            onBookingUpdate={(b) => { setBooking(b); setTab("details"); }}
            onBack={() => setTab("details")}
            onError={setError}
          />
        )}

        {tab === "cancel" && booking && (
          <CancelFlow booking={booking}
            onConfirmCancel={handleCancel}
            onRevert={handleRevert}
            onBack={() => setTab("details")}
            loading={loading}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[var(--color-neutral-200)]/60 safe-bottom">
        <div className="flex items-stretch">
          <Link
            href="/"
            className="flex-1 flex flex-col items-center justify-center py-2 pt-2.5 gap-0.5 tap-scale text-[var(--color-neutral-400)]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span className="text-[10px] font-semibold">Book</span>
          </Link>
          <Link
            href="/manage"
            className="flex-1 flex flex-col items-center justify-center py-2 pt-2.5 gap-0.5 tap-scale text-[var(--color-primary)]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
            <span className="text-[10px] font-semibold">Tickets</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function BookingDetails({ booking, onExchange, onCancel, onBack }: {
  booking: BookingResponse; onExchange: () => void; onCancel: () => void; onBack: () => void;
}) {
  const hasActiveItems = (direction?: BookingDirectionDetail[]) =>
    direction?.some((d) => d.products.some((p) => p.isActive && !p.isCancelled));
  const isConfirmed = booking.balance?.remainingBalance === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] mb-1">&larr; Back</button>
          <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Booking {booking.reference}</h2>
        </div>
        <div className="flex gap-2">
          {isConfirmed && hasActiveItems(booking.outbound) && (
            <>
              <button onClick={onExchange}
                className="px-4 py-2 bg-[var(--color-neutral-900)] text-white rounded-[var(--radius-action)] text-sm font-semibold hover:opacity-90"
              >Change Journey</button>
              <button onClick={onCancel}
                className="px-4 py-2 bg-[var(--color-error)] text-white rounded-[var(--radius-action)] text-sm font-semibold hover:opacity-90"
              >Cancel / Refund</button>
            </>
          )}
        </div>
      </div>

      {booking.balance && (
        <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-5">
          <h3 className="font-semibold text-[var(--color-neutral-900)] mb-3">Payment Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-[var(--color-neutral-500)]">Total</span>
              <p className="font-semibold text-lg">{booking.balance.currency} {booking.balance.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-[var(--color-neutral-500)]">Paid</span>
              <p className="font-semibold text-lg text-[var(--color-success)]">{booking.balance.currency} {booking.balance.paidAmount.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-[var(--color-neutral-500)]">Remaining</span>
              <p className={`font-semibold text-lg ${booking.balance.remainingBalance > 0 ? "text-[var(--color-error)]" : "text-[var(--color-neutral-500)]"}`}>
                {booking.balance.currency} {booking.balance.remainingBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      <DirectionCard label="Outbound" segments={booking.outbound} />
      <DirectionCard label="Inbound" segments={booking.inbound} />

      <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-5">
        <h3 className="font-semibold text-[var(--color-neutral-900)] mb-3">Passengers</h3>
        <div className="divide-y divide-[var(--color-neutral-200)]">
          {booking.passengers.map((p) => (
            <div key={p.id} className="py-2 flex justify-between items-center text-sm">
              <div>
                <span className="font-medium">{p.firstName} {p.lastName}</span>
                {p.email && <span className="text-[var(--color-neutral-500)] ml-2">{p.email}</span>}
              </div>
              <span className="text-xs bg-[var(--color-neutral-100)] px-2 py-0.5 rounded-[var(--radius-pill)]">{p.type}</span>
            </div>
          ))}
        </div>
      </div>

      {booking.customer && (
        <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-5">
          <h3 className="font-semibold text-[var(--color-neutral-900)] mb-3">Customer Contact</h3>
          <p className="text-sm">{booking.customer.firstName} {booking.customer.lastName} &middot; {booking.customer.email}</p>
        </div>
      )}
    </div>
  );
}

function DirectionCard({ label, segments }: { label: string; segments?: BookingDirectionDetail[] }) {
  if (!segments || segments.length === 0) return null;
  return (
    <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-5">
      <h3 className="font-semibold text-[var(--color-neutral-900)] mb-3">{label}</h3>
      {segments.map((seg, i) => (
        <div key={i} className="mb-4 last:mb-0">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-mono bg-[var(--color-primary-tint)] text-[var(--color-primary)] px-2 py-0.5 rounded-[var(--radius-action)]">{seg.serviceName}</span>
            <span>{seg.origin.shortName}</span>
            <span className="text-[var(--color-neutral-500)]">&rarr;</span>
            <span>{seg.destination.shortName}</span>
          </div>
          <div className="text-xs text-[var(--color-neutral-500)] mt-1">
            {seg.timing.departs} &ndash; {seg.timing.arrives} ({seg.timing.duration} min)
          </div>
          <div className="mt-2 space-y-1">
            {seg.products.map((p) => (
              <div key={p.itemRef}
                className={`text-xs flex justify-between items-center px-2 py-1 rounded-[var(--radius-action)] ${
                  p.isCancelled ? "bg-red-50 text-[var(--color-error)] line-through"
                  : p.isActive ? "bg-[var(--color-primary-tint)] text-[var(--color-primary-hover)]"
                  : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-500)]"
                }`}
              >
                <span>{p.name} &middot; {p.passengerId}</span>
                <span>{p.price > 0 ? `${p.price.toFixed(2)}` : "Included"}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExchangeFlow({ booking, onBookingUpdate, onBack, onError }: {
  booking: BookingResponse; onBookingUpdate: (b: BookingResponse) => void; onBack: () => void; onError: (msg: string) => void;
}) {
  const [newDate, setNewDate] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<JourneySearchResponse | null>(null);

  const searchExchange = async () => {
    if (!newDate || !booking.outbound?.[0]) return;
    setSearching(true);
    try {
      const seg = booking.outbound[0];
      const res = await fetch("/api/eurostar/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", bookingReference: booking.reference, origin: seg.origin.uic, destination: seg.destination.uic, outboundDate: newDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Exchange search failed");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] mb-1">&larr; Back to details</button>
        <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Change Journey</h2>
        <p className="text-[var(--color-neutral-500)] text-sm">Search for an alternative train for booking {booking.reference}</p>
      </div>

      <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">New Travel Date</label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-neutral-300)] px-3 py-3 focus:border-[var(--color-neutral-700)]"
            />
          </div>
          <button onClick={searchExchange} disabled={searching || !newDate}
            className="px-6 py-3 bg-[var(--color-neutral-900)] text-white rounded-[var(--radius-action)] font-semibold hover:opacity-90 disabled:bg-[var(--color-neutral-100)] disabled:text-[var(--color-neutral-500)]"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6">
          <h3 className="font-semibold text-[var(--color-neutral-900)] mb-3">Available Trains</h3>
          <p className="text-sm text-[var(--color-neutral-500)]">Exchange results loaded. Select a new journey to rebook.</p>
          <pre className="mt-4 bg-[var(--color-neutral-50)] rounded-[var(--radius-card)] p-4 text-xs overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function CancelFlow({ booking, onConfirmCancel, onRevert, onBack, loading }: {
  booking: BookingResponse; onConfirmCancel: (itemRefs?: string[]) => void; onRevert: () => void; onBack: () => void; loading: boolean;
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const allItems = [
    ...(booking.outbound?.flatMap((s) => s.products) ?? []),
    ...(booking.inbound?.flatMap((s) => s.products) ?? []),
  ].filter((p) => p.isActive && !p.isCancelled);

  const toggleItem = (ref: string) => {
    setSelectedItems((prev) => prev.includes(ref) ? prev.filter((r) => r !== ref) : [...prev, ref]);
  };

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] mb-1">&larr; Back to details</button>
        <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Cancel / Refund</h2>
        <p className="text-[var(--color-neutral-500)] text-sm">Select items to cancel for booking {booking.reference}</p>
      </div>

      <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--color-neutral-200)] p-6">
        <h3 className="font-semibold text-[var(--color-neutral-900)] mb-3">Active Items</h3>
        {allItems.length === 0 ? (
          <p className="text-[var(--color-neutral-500)] text-sm">No active items to cancel.</p>
        ) : (
          <div className="space-y-2">
            {allItems.map((item) => (
              <label key={item.itemRef}
                className={`flex items-center gap-3 p-3 rounded-[var(--radius-card)] border cursor-pointer transition-colors ${
                  selectedItems.includes(item.itemRef)
                    ? "border-[var(--color-error)] bg-red-50"
                    : "border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)]"
                }`}
              >
                <input type="checkbox" checked={selectedItems.includes(item.itemRef)}
                  onChange={() => toggleItem(item.itemRef)}
                  className="rounded text-[var(--color-error)]"
                />
                <div className="flex-1 text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-[var(--color-neutral-500)] ml-2">{item.passengerId}</span>
                </div>
                <span className="text-sm font-medium">{item.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button onClick={() => onConfirmCancel(selectedItems.length > 0 ? selectedItems : undefined)}
            disabled={loading}
            className="flex-1 bg-[var(--color-error)] text-white py-3 rounded-[var(--radius-action)] font-semibold hover:opacity-90 disabled:bg-[var(--color-neutral-100)] disabled:text-[var(--color-neutral-500)]"
          >
            {loading ? "Processing..."
              : selectedItems.length > 0 ? `Cancel ${selectedItems.length} Item${selectedItems.length > 1 ? "s" : ""}`
              : "Cancel Entire Booking"}
          </button>
          <button onClick={onRevert} disabled={loading}
            className="px-6 py-3 border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] rounded-[var(--radius-action)] font-semibold hover:bg-[var(--color-neutral-50)] disabled:opacity-50"
          >
            Revert
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary-tint)] rounded-[var(--radius-card)] p-4 text-sm text-[var(--color-primary-hover)]">
        <strong>Note:</strong> Refund amounts depend on your fare conditions. Standard/Standard Premier fares may have cancellation fees. Non-flexible tickets may not be refundable.
      </div>
    </div>
  );
}
