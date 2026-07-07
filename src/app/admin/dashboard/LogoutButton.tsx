'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-[var(--ivory)]/15 bg-[var(--ivory)]/[0.06] px-5 py-2.5 text-sm font-medium text-[var(--ivory)] backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--copper)] hover:bg-[var(--copper)] hover:text-[var(--bg-noir)]"
    >
      Log out
    </button>
  )
}
