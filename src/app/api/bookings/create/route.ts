import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

function isValidPHPhone(phone: string) {
  return /^(09|\+639)\d{9}$/.test(phone)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { phone, serviceId, date, timeSlot, name, email } = body

  if (!isValidPHPhone(phone)) {
    return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })
  }

  const supabase = await createClient()

  // rate limit: max 3 bookings per phone per 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('customer_phone', phone)
    .gte('created_at', oneDayAgo)

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: 'Daily booking limit reached. Please contact us directly.' }, { status: 429 })
  }

  const { error } = await supabase.from('bookings').insert({
    service_id: serviceId,
    customer_name: name,
    customer_phone: phone,
    customer_email: email || null,
    booking_date: date,
    time_slot: timeSlot,
  })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slot just taken.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Booking failed.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}