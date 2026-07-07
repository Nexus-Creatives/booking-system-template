'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const fieldClass =
  'w-full rounded-2xl border border-[var(--ivory)]/10 bg-[var(--bg-noir)]/65 px-4 py-3.5 text-[var(--ivory)] shadow-inner shadow-black/10 transition duration-300 placeholder:text-[var(--ivory-dim)]/45 focus:border-[var(--copper-light)] focus:bg-[var(--bg-noir)] focus:outline-none'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-noir)] px-6 py-12 text-[var(--ivory)]">
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

      <Link
        href="/"
        className="absolute left-6 top-7 z-10 font-[var(--font-display)] text-2xl italic tracking-wide text-[var(--ivory)] transition-colors duration-300 hover:text-[var(--copper-light)] sm:left-8 sm:text-3xl lg:left-16"
      >
        Lumiere
      </Link>

      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[var(--ivory)]/10 bg-[var(--bg-noir-soft)]/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--copper)]/10 blur-[90px]" />

        <div className="relative border-b border-[var(--ivory)]/10 pb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--copper-light)]">
            Studio Admin
          </p>
          <h1 className="mt-2 font-[var(--font-display)] text-4xl italic text-[var(--ivory)]">
            Sign in
          </h1>
          <p className="mt-3 leading-7 text-[var(--ivory-dim)]">
            Manage chair reservations, confirmations, and appointment status.
          </p>
        </div>

        <div className="relative mt-7 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            required
          />

          {error && (
            <p className="rounded-2xl border border-red-300/20 bg-red-950/25 px-4 py-3 text-sm leading-6 text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--copper)] px-8 py-4 font-semibold text-[var(--bg-noir)] transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--copper-light)] hover:shadow-[0_20px_40px_-15px_rgba(193,112,60,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[var(--copper)] disabled:hover:shadow-none"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
    </main>
  )
}
