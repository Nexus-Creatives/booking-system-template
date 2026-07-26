import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const ALLOWED_STATUSES = ['confirmed', 'cancelled', 'completed'] as const
type BookingStatus = (typeof ALLOWED_STATUSES)[number]

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character]!)
}

async function sendConfirmationEmail(booking: {
  customer_name: string
  customer_email: string
  booking_date: string
  time_slot: string
  services: { name: string; price: number } | { name: string; price: number }[] | null
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.BOOKING_EMAIL_FROM

  if (!apiKey || !from) return { sent: false, configured: false }

  const service = Array.isArray(booking.services) ? booking.services[0] : booking.services
  const serviceDetails = service
    ? `${service.name} — PHP ${service.price.toLocaleString('en-PH')}`
    : 'Your selected service'
  const customerName = escapeHtml(booking.customer_name)

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [booking.customer_email],
      subject: 'Your Lumiere salon booking is confirmed',
      html: `
        <h1>Your booking is confirmed</h1>
        <p>Hi ${customerName},</p>
        <p>We look forward to seeing you at Lumiere.</p>
        <ul>
          <li><strong>Service:</strong> ${escapeHtml(serviceDetails)}</li>
          <li><strong>Date:</strong> ${escapeHtml(booking.booking_date)}</li>
          <li><strong>Time:</strong> ${escapeHtml(booking.time_slot.slice(0, 5))}</li>
        </ul>
        <p>If you need to reschedule or cancel, please contact the salon.</p>
      `,
    }),
  })

  return {
    sent: response.ok,
    configured: true,
    error: response.ok
      ? undefined
      : 'Resend rejected the message. Verify the domain in BOOKING_EMAIL_FROM is verified in Resend.',
  }
}

export async function PATCH(request: NextRequest) {
  const { id, status } = await request.json() as { id?: string; status?: BookingStatus }

  if (!id || !ALLOWED_STATUSES.includes(status as BookingStatus)) {
    return NextResponse.json({ error: 'Invalid booking update.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('customer_name, customer_email, booking_date, time_slot, services ( name, price )')
    .eq('id', id)
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
  }

  const { error: updateError } = await supabase.from('bookings').update({ status }).eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Could not update the booking.' }, { status: 500 })
  }

  if (status !== 'confirmed' || !booking.customer_email) {
    return NextResponse.json({ success: true, emailSent: false })
  }

  try {
    const email = await sendConfirmationEmail(booking)
    return NextResponse.json({
      success: true,
      emailSent: email.sent,
      emailConfigured: email.configured,
      emailError: email.error,
    })
  } catch {
    return NextResponse.json({ success: true, emailSent: false, emailConfigured: true })
  }
}
