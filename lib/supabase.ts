import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      requests: {
        Row: {
          id: string
          shipper_id: string
          route_from: string
          route_to: string
          cargo_description: string
          wagon_type: string
          wagon_count: number
          loading_date: string
          target_price: number
          status: 'active' | 'closed'
          accepted_owner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shipper_id: string
          route_from: string
          route_to: string
          cargo_description: string
          wagon_type: string
          wagon_count: number
          loading_date: string
          target_price: number
          status?: 'active' | 'closed'
          accepted_owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shipper_id?: string
          route_from?: string
          route_to?: string
          cargo_description?: string
          wagon_type?: string
          wagon_count?: number
          loading_date?: string
          target_price?: number
          status?: 'active' | 'closed'
          accepted_owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          request_id: string
          owner_id: string
          price: number
          comment: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          owner_id: string
          price: number
          comment: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          owner_id?: string
          price?: number
          comment?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}