'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'

type Service = {
  id: string
  name: string
  duration_minutes: number
  price: number
}

const ALL_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
]

const fieldClass =
  'w-full rounded-2xl border border-[var(--ivory)]/10 bg-[var(--bg-noir)]/65 px-4 py-3.5 text-[var(--ivory)] shadow-inner shadow-black/10 transition duration-300 placeholder:text-[var(--ivory-dim)]/45 focus:border-[var(--copper-light)] focus:bg-[var(--bg-noir)] focus:outline-none'

const labelClass =
  'mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-[var(--copper-light)]'

function isValidPHPhone(phone: string) {
  return /^(09|\+639)\d{9}$/.test(phone)
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const rem = minutes % 60
  return rem === 0 ? `${hrs} hr` : `${hrs} hr ${rem} min`
}

function formatPrice(price: number) {
  return `PHP ${price.toLocaleString('en-PH')}`
}

export default function BookingForm({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  const supabase = useMemo(() => createClient(), [])
  const selectedService = services.find((service) => service.id === serviceId)

  useEffect(() => {
    if (!date) return

    supabase
      .rpc('get_booked_slots', { check_date: date })
      .then(({ data, error }) => {
        if (!error && data) {
          setBookedSlots(data.map((row: { time_slot: string }) => row.time_slot.slice(0, 5)))
        }
        setLoadingSlots(false)
      })

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings', filter: `booking_date=eq.${date}` },
        (payload) => {
          const newSlot = (payload.new.time_slot as string).slice(0, 5)
          setBookedSlots((prev) => [...prev, newSlot])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [date, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (honeypot) {
      setSuccess(true)
      return
    }

    if (!isValidPHPhone(phone)) {
      setError('Enter a valid PH mobile number (e.g. 09171234567).')
      return
    }

    setSubmitting(true)

    const res = await fetch('/api/bookings/create', {
      method: 'POST',
      body: JSON.stringify({ phone, serviceId, date, timeSlot, name, email }),
    })
    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      if (res.status === 409) {
        setError('Sorry, this time slot was just booked. Please pick another.')
        setBookedSlots((prev) => [...prev, timeSlot])
        setTimeSlot('')
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--ivory)]/10 bg-[var(--bg-noir-soft)]/80 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.05]" />
        <div className="relative mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--copper)] text-2xl font-semibold text-[var(--bg-noir)]">
          OK
        </div>
        <h2 className="relative font-[var(--font-display)] text-4xl italic text-[var(--ivory)]">
          Booking confirmed
        </h2>
        <p className="relative mt-4 leading-7 text-[var(--ivory-dim)]">
          {"We'll"} see you on {date} at {timeSlot}. A fresh chair is reserved for
          {name ? ` ${name}` : ' you'}.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[2rem] border border-[var(--ivory)]/10 bg-[var(--bg-noir-soft)]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--copper)]/10 blur-[90px]" />

      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px]"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="relative space-y-8">
        <div className="border-b border-[var(--ivory)]/10 pb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--ivory-dim)]">
            Appointment
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl italic text-[var(--ivory)]">
            Select your chair time
          </h2>
        </div>

        <div>
          <label className={labelClass} htmlFor="service">
            Service
          </label>
          <select
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
            className={fieldClass}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {formatPrice(service.price)} ({formatDuration(service.duration_minutes)})
              </option>
            ))}
          </select>

          {selectedService && (
            <div className="mt-4 flex items-baseline gap-3 rounded-2xl border border-[var(--ivory)]/10 bg-[var(--ivory)]/[0.04] px-4 py-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--copper-light)]" />
              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-display)] text-xl text-[var(--ivory)]">
                  {selectedService.name}
                </p>
                <p className="mt-1 text-sm text-[var(--ivory-dim)]">
                  {formatDuration(selectedService.duration_minutes)} appointment
                </p>
              </div>
              <span className="shrink-0 font-[var(--font-display)] text-xl text-[var(--copper-light)]">
                {formatPrice(selectedService.price)}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="booking-date">
            Date
          </label>
          <input
            id="booking-date"
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setDate(e.target.value)
              setTimeSlot('')
              setLoadingSlots(Boolean(e.target.value))
            }}
            required
            className={fieldClass}
          />
        </div>

        {date && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--copper-light)]">
                Time
              </label>
              <span className="text-xs text-[var(--ivory-dim)]">
                {loadingSlots ? 'Checking availability' : 'Live availability'}
              </span>
            </div>

            {loadingSlots ? (
              <div className="rounded-2xl border border-[var(--ivory)]/10 bg-[var(--ivory)]/[0.04] px-4 py-5 text-sm text-[var(--ivory-dim)]">
                Checking availability...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ALL_SLOTS.map((slot) => {
                  const isBooked = bookedSlots.includes(slot)
                  const isSelected = timeSlot === slot

                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setTimeSlot(slot)}
                      className={`min-h-12 rounded-full border px-3 text-sm font-medium transition duration-300 ${
                        isBooked
                          ? 'cursor-not-allowed border-[var(--ivory)]/5 bg-[var(--ivory)]/[0.03] text-[var(--ivory-dim)]/35 line-through'
                          : 'border-[var(--ivory)]/10 bg-[var(--ivory)]/[0.05] text-[var(--ivory)] hover:-translate-y-0.5 hover:border-[var(--copper-light)] hover:text-[var(--copper-light)]'
                      } ${
                        isSelected
                          ? 'border-[var(--copper)] bg-[var(--copper)] text-[var(--bg-noir)] shadow-[0_16px_30px_-18px_rgba(193,112,60,0.8)] hover:text-[var(--bg-noir)]'
                          : ''
                      }`}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {timeSlot && (
          <div className="space-y-4 border-t border-[var(--ivory)]/10 pt-7">
            <div>
              <label className={labelClass} htmlFor="full-name">
                Guest Details
              </label>
              <input
                id="full-name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={fieldClass}
              />
            </div>
            <input
              type="tel"
              placeholder="09XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={fieldClass}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>
        )}

        {error && (
          <p className="rounded-2xl border border-red-300/20 bg-red-950/25 px-4 py-3 text-sm leading-6 text-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!timeSlot || submitting}
          className="w-full rounded-full bg-[var(--copper)] px-8 py-4 font-semibold text-[var(--bg-noir)] transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--copper-light)] hover:shadow-[0_20px_40px_-15px_rgba(193,112,60,0.6)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-[var(--copper)] disabled:hover:shadow-none"
        >
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  )
}
