'use client'

import { useState } from 'react'

type Booking = {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  booking_date: string
  time_slot: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  services:
    | { name: string; duration_minutes: number; price: number }
    | { name: string; duration_minutes: number; price: number }[]
    | null
}

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

const STATUS_STYLES: Record<Booking['status'], string> = {
  pending: 'border-yellow-300/30 bg-yellow-300/10 text-yellow-100',
  confirmed: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100',
  cancelled: 'border-red-300/30 bg-red-300/10 text-red-100',
  completed: 'border-[var(--ivory)]/15 bg-[var(--ivory)]/[0.06] text-[var(--ivory-dim)]',
}

function formatService(booking: Booking) {
  const service = Array.isArray(booking.services) ? booking.services[0] : booking.services
  if (!service) return 'Service removed'

  return `${service.name} - PHP ${service.price.toLocaleString('en-PH')}`
}

export default function BookingsTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState<'all' | Booking['status']>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const updateStatus = async (id: string, status: Booking['status']) => {
    setUpdatingId(id)
    setNotice(null)

    const response = await fetch('/api/admin/bookings/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    const result = await response.json().catch(() => null)

    if (response.ok) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
      if (status === 'confirmed') {
        setNotice(
          result?.emailSent
            ? 'Booking confirmed and confirmation email sent.'
            : result?.emailConfigured === false
              ? 'Booking confirmed. Add email settings to send confirmation emails.'
              : `Booking confirmed, but the confirmation email could not be sent. ${result?.emailError ?? ''}`
        )
      }
    } else {
      setNotice(result?.error ?? 'Could not update the booking. Please try again.')
    }

    setUpdatingId(null)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div className="relative">
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition duration-300 ${
              filter === f
                ? 'border-[var(--copper)] bg-[var(--copper)] text-[var(--bg-noir)]'
                : 'border-[var(--ivory)]/10 bg-[var(--ivory)]/[0.04] text-[var(--ivory-dim)] hover:border-[var(--copper-light)] hover:text-[var(--copper-light)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {notice && (
        <p className="mb-4 rounded-xl border border-[var(--copper)]/30 bg-[var(--copper)]/10 px-4 py-3 text-sm text-[var(--ivory)]">
          {notice}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--ivory)]/10 bg-[var(--ivory)]/[0.04] px-5 py-8 text-center text-sm text-[var(--ivory-dim)]">
          No bookings here.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-5 rounded-2xl border border-[var(--ivory)]/10 bg-[var(--bg-noir)]/45 p-4 transition duration-300 hover:border-[var(--copper-light)]/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-[var(--font-display)] text-2xl text-[var(--ivory)]">
                    {booking.customer_name}
                  </p>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-[var(--ivory-dim)]">
                  {formatService(booking)} | {booking.booking_date} at{' '}
                  {booking.time_slot.slice(0, 5)}
                </p>

                <p className="mt-1 text-sm text-[var(--ivory-dim)]/70">
                  {booking.customer_phone}
                  {booking.customer_email ? ` | ${booking.customer_email}` : ''}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {booking.status === 'pending' && (
                  <button
                    disabled={updatingId === booking.id}
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    className="rounded-full bg-[var(--copper)] px-4 py-2 text-sm font-semibold text-[var(--bg-noir)] transition duration-300 hover:bg-[var(--copper-light)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Confirm
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    disabled={updatingId === booking.id}
                    onClick={() => updateStatus(booking.id, 'completed')}
                    className="rounded-full bg-[var(--copper)] px-4 py-2 text-sm font-semibold text-[var(--bg-noir)] transition duration-300 hover:bg-[var(--copper-light)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark Done
                  </button>
                )}
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button
                    disabled={updatingId === booking.id}
                    onClick={() => updateStatus(booking.id, 'cancelled')}
                    className="rounded-full border border-[var(--ivory)]/10 px-4 py-2 text-sm font-medium text-[var(--ivory-dim)] transition duration-300 hover:border-red-300/60 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
