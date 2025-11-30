import { revalidatePath } from 'next/cache'
import { supabase, Database } from './supabase'
import { createRequestSchema, CreateRequestInput } from './validations'

export async function createRequest(data: CreateRequestInput) {
  try {
    const validatedData = createRequestSchema.parse(data)
    
    const { data: request, error } = await supabase
      .from('requests')
      .insert({
        ...validatedData,
        shipper_id: 'current-user-id', // TODO: Get from auth
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating request:', error)
      return { success: false, error: 'Не удалось создать заявку' }
    }

    revalidatePath('/shipper')
    return { success: true, data: request }
  } catch (error) {
    console.error('Validation error:', error)
    return { success: false, error: 'Ошибка валидации данных' }
  }
}

export async function getRequests(shipperId: string) {
  try {
    const { data: requests, error } = await supabase
      .from('requests')
      .select(`
        *,
        bids (
          id,
          price,
          status,
          created_at
        )
      `)
      .eq('shipper_id', shipperId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching requests:', error)
      return { success: false, error: 'Не удалось загрузить заявки' }
    }

    return { success: true, data: requests }
  } catch (error) {
    console.error('Error fetching requests:', error)
    return { success: false, error: 'Произошла ошибка' }
  }
}

export async function getRequestWithBids(requestId: string) {
  try {
    const { data: request, error } = await supabase
      .from('requests')
      .select(`
        *,
        bids (
          id,
          owner_id,
          price,
          comment,
          status,
          created_at
        )
      `)
      .eq('id', requestId)
      .single()

    if (error) {
      console.error('Error fetching request:', error)
      return { success: false, error: 'Не удалось загрузить заявку' }
    }

    return { success: true, data: request }
  } catch (error) {
    console.error('Error fetching request:', error)
    return { success: false, error: 'Произошла ошибка' }
  }
}

export async function acceptBid(bidId: string, requestId: string) {
  try {
    // Start a transaction-like operation
    const { error: bidError } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bidId)

    if (bidError) {
      console.error('Error updating bid:', bidError)
      return { success: false, error: 'Не удалось принять ставку' }
    }

    // Reject other bids for this request
    const { error: rejectError } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('request_id', requestId)
      .neq('id', bidId)

    if (rejectError) {
      console.error('Error rejecting other bids:', rejectError)
      return { success: false, error: 'Не удалось отклонить другие ставки' }
    }

    // Get the owner_id from the accepted bid
    const { data: bid, error: getBidError } = await supabase
      .from('bids')
      .select('owner_id')
      .eq('id', bidId)
      .single()

    if (getBidError || !bid) {
      console.error('Error getting bid:', getBidError)
      return { success: false, error: 'Не удалось получить информацию о ставке' }
    }

    // Update request status and accepted_owner_id
    const { error: requestError } = await supabase
      .from('requests')
      .update({ 
        status: 'closed',
        accepted_owner_id: bid.owner_id
      })
      .eq('id', requestId)

    if (requestError) {
      console.error('Error updating request:', requestError)
      return { success: false, error: 'Не удалось обновить заявку' }
    }

    revalidatePath('/shipper')
    revalidatePath(`/shipper/requests/${requestId}`)
    return { success: true }
  } catch (error) {
    console.error('Error accepting bid:', error)
    return { success: false, error: 'Произошла ошибка' }
  }
}