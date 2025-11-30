import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookies().getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies().set(name, value, options)
          )
        },
      },
    }
  )
  
  try {
    const { action } = await request.json()
    
    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get bid details
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select(`
        *,
        request:requests(created_by)
      `)
      .eq('id', params.id)
      .single()

    if (bidError || !bid) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 })
    }

    // Check if user is the request owner
    if (bid.request?.created_by !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (action === 'accept') {
      // Update bid status to ACCEPTED
      const { error: updateError } = await supabase
        .from('bids')
        .update({ status: 'ACCEPTED' })
        .eq('id', params.id)

      if (updateError) throw updateError

      // Update request status to IN_PROGRESS
      const { error: requestError } = await supabase
        .from('requests')
        .update({ status: 'IN_PROGRESS' })
        .eq('id', bid.request_id)

      if (requestError) throw requestError

      // Create chat (this will be handled by the database trigger)
      return NextResponse.json({ success: true, message: 'Bid accepted and chat created' })

    } else if (action === 'reject') {
      // Update bid status to REJECTED
      const { error: updateError } = await supabase
        .from('bids')
        .update({ status: 'REJECTED' })
        .eq('id', params.id)

      if (updateError) throw updateError

      return NextResponse.json({ success: true, message: 'Bid rejected' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error: any) {
    console.error('Error updating bid:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}