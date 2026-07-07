import { createClient } from '@/utils/supabase/server'
import BookingForm from './BookingForm'
import Link from 'next/link'

export default async function BookPage() {
  const supabase = await createClient()
  const { data: services, error } = await supabase
    .from('services')
    .select('id, name, duration_minutes, price')
    .eq('is_active', true)

  if (error) {
    console.error('Unable to load services:', error)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg-noir)] text-[var(--ivory)]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-noir)] via-[var(--bg-noir)]/95 to-[var(--bg-noir-soft)]/90" />
      <div className="absolute inset-0 bg-[var(--copper)] mix-blend-color opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06]" />
      <div className="absolute -right-28 top-20 h-[360px] w-[360px] rounded-full bg-[var(--copper)]/15 blur-[130px]" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-7 sm:px-8 lg:px-16">
        <Link
          href="/"
          className="font-[var(--font-display)] text-2xl italic tracking-wide text-[var(--ivory)] transition-colors duration-300 hover:text-[var(--copper-light)] sm:text-3xl"
        >
          Lumiere
        </Link>

        <Link
          href="/#services"
          className="rounded-full border border-[var(--ivory)]/15 bg-[var(--ivory)]/[0.06] px-5 py-2.5 text-sm font-medium text-[var(--ivory)] backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--copper)] hover:bg-[var(--copper)] hover:text-[var(--bg-noir)] sm:px-6 sm:py-3"
        >
          View Services
        </Link>
      </nav>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 px-6 pb-16 pt-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:pb-24">
        <div className="max-w-xl">
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--copper-light)]">
            <span className="h-px w-8 bg-[var(--copper-light)]" />
            Reserve Your Chair
          </p>

          <h1 className="font-[var(--font-display)] text-5xl font-medium italic leading-[1] text-[var(--ivory)] sm:text-6xl lg:text-7xl">
            Book your color, cut, or style.
          </h1>

          <p className="mt-8 max-w-md text-base leading-8 text-[var(--ivory-dim)] sm:text-lg">
            Choose a service and a time that fits. We will keep the appointment
            focused, conversational, and tailored to how you wear your hair.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 border-y border-[var(--ivory)]/10 py-6 text-sm text-[var(--ivory-dim)]">
            <div>
              <span className="block font-[var(--font-display)] text-2xl text-[var(--copper-light)]">
                01
              </span>
              Service
            </div>
            <div>
              <span className="block font-[var(--font-display)] text-2xl text-[var(--copper-light)]">
                02
              </span>
              Time
            </div>
            <div>
              <span className="block font-[var(--font-display)] text-2xl text-[var(--copper-light)]">
                03
              </span>
              Details
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-full bg-[var(--tone-copper)]/30 blur-3xl sm:block" />
          <BookingForm services={services ?? []} />
        </div>
      </section>
    </main>
  )
}
