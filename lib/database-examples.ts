// Example usage of the Supabase client
// This file demonstrates common database operations

import { supabase, Profile, Request, Bid, Message } from '@/lib/supabase'

// PROFILE EXAMPLES
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// REQUEST EXAMPLES
export async function getOpenRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      profiles (
        id,
        company_name,
        full_name
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getUserRequests(userId: string) {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('shipper_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function createRequest(requestData: Omit<Request, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('requests')
    .insert(requestData)
    .select()
    .single()
  
  return { data, error }
}

// BID EXAMPLES
export async function getBidsForRequest(requestId: string) {
  const { data, error } = await supabase
    .from('bids')
    .select(`
      *,
      profiles (
        id,
        company_name,
        full_name,
        phone
      )
    `)
    .eq('request_id', requestId)
    .eq('status', 'pending')
    .order('amount', { ascending: true })
  
  return { data, error }
}

export async function getUserBids(userId: string) {
  const { data, error } = await supabase
    .from('bids')
    .select(`
      *,
      requests (
        id,
        route_from,
        route_to,
        cargo_description,
        loading_date,
        status
      )
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function createBid(bidData: Omit<Bid, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('bids')
    .insert(bidData)
    .select()
    .single()
  
  return { data, error }
}

export async function acceptBid(bidId: string) {
  const { data, error } = await supabase
    .from('bids')
    .update({ status: 'accepted' })
    .eq('id', bidId)
    .select()
    .single()
  
  return { data, error }
}

// MESSAGE EXAMPLES
export async function getMessagesForBid(bidId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      profiles (
        id,
        full_name,
        company_name
      )
    `)
    .eq('bid_id', bidId)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export async function getMessagesForRequest(requestId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      profiles (
        id,
        full_name,
        company_name
      )
    `)
    .eq('request_id', requestId)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export async function sendMessage(messageData: Omit<Message, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single()
  
  return { data, error }
}

export async function markMessageAsRead(messageId: string) {
  const { data, error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId)
    .select()
    .single()
  
  return { data, error }
}

// REAL-TIME SUBSCRIPTION EXAMPLES
export function subscribeToRequestUpdates(requestId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`request-${requestId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'requests',
        filter: `id=eq.${requestId}`
      }, 
      callback
    )
    .subscribe()
}

export function subscribeToBidUpdates(requestId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`bids-${requestId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'bids',
        filter: `request_id=eq.${requestId}`
      }, 
      callback
    )
    .subscribe()
}

export function subscribeToMessages(bidId: string | null, requestId: string | null, callback: (payload: any) => void) {
  const filter = bidId 
    ? `bid_id=eq.${bidId}`
    : `request_id=eq.${requestId}`
    
  return supabase
    .channel(`messages-${bidId || requestId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter
      }, 
      callback
    )
    .subscribe()
}