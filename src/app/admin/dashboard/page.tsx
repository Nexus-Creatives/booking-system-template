import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BookingsTable from './BookingsTable'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      customer_name,
      customer_phone,
      customer_email,
      booking_date,
      time_slot,
      status,
      services ( name, duration_minutes, price )
    `)
    .order('booking_date', { ascending: true })
    .order('time_slot', { ascending: true })

  const bookingCounts = {
    total: bookings?.length ?? 0,
    pending: bookings?.filter((booking) => booking.status === 'pending').length ?? 0,
    confirmed: bookings?.filter((booking) => booking.status === 'confirmed').length ?? 0,
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg-noir)] text-[var(--ivory)]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-noir)] via-[var(--bg-noir)]/95 to-[var(--bg-noir-soft)]/90" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.05]" />
      <div className="absolute -right-28 top-20 h-[360px] w-[360px] rounded-full bg-[var(--copper)]/12 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-16">
        <header className="flex flex-col gap-6 border-b border-[var(--ivory)]/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="font-[var(--font-display)] text-2xl italic tracking-wide text-[var(--ivory)] transition-colors duration-300 hover:text-[var(--copper-light)] sm:text-3xl"
            >
              Lumiere
            </Link>
            <p className="mt-2 text-sm text-[var(--ivory-dim)]">{user.email}</p>
          </div>
          <LogoutButton />
        </header>

        <section className="py-10">
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--copper-light)]">
            <span className="h-px w-8 bg-[var(--copper-light)]" />
            Admin Dashboard
          </p>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-[var(--font-display)] text-5xl font-medium italic leading-[1] text-[var(--ivory)] sm:text-6xl">
                Bookings
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-[var(--ivory-dim)]">
                Review upcoming appointments, confirm pending requests, and
                keep the chair schedule current.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
              <div className="rounded-2xl border border-[var(--ivory)]/10 bg-[var(--ivory)]/[0.04] p-4">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--ivory-dim)]">
                  Total
                </span>
                <p className="mt-2 font-[var(--font-display)] text-3xl text-[var(--copper-light)]">
                  {bookingCounts.total}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--ivory)]/10 bg-[var(--ivory)]/[0.04] p-4">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--ivory-dim)]">
                  Pending
                </span>
                <p className="mt-2 font-[var(--font-display)] text-3xl text-[var(--copper-light)]">
                  {bookingCounts.pending}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--ivory)]/10 bg-[var(--ivory)]/[0.04] p-4">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--ivory-dim)]">
                  Set
                </span>
                <p className="mt-2 font-[var(--font-display)] text-3xl text-[var(--copper-light)]">
                  {bookingCounts.confirmed}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--ivory)]/10 bg-[var(--bg-noir-soft)]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04]" />
          <BookingsTable initialBookings={bookings ?? []} />
        </div>
      </div>
    </main>
  )
}
