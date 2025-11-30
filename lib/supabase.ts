import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'shipper' | 'carrier' | 'admin'
          company_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: 'shipper' | 'carrier' | 'admin'
          company_name?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'shipper' | 'carrier' | 'admin'
          company_name?: string | null
          phone?: string | null
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          shipper_id: string
          route_from: string
          route_to: string
          cargo_description: string
          cargo_weight: number | null
          wagon_type: string
          wagon_count: number
          loading_date: string
          unloading_date: string | null
          target_price: number | null
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          additional_requirements: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shipper_id: string
          route_from: string
          route_to: string
          cargo_description: string
          cargo_weight?: number | null
          wagon_type: string
          wagon_count?: number
          loading_date: string
          unloading_date?: string | null
          target_price?: number | null
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          additional_requirements?: string | null
        }
        Update: {
          id?: string
          shipper_id?: string
          route_from?: string
          route_to?: string
          cargo_description?: string
          cargo_weight?: number | null
          wagon_type?: string
          wagon_count?: number
          loading_date?: string
          unloading_date?: string | null
          target_price?: number | null
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          additional_requirements?: string | null
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          request_id: string
          owner_id: string
          amount: number
          notes: string | null
          status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          valid_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          owner_id: string
          amount: number
          notes?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          valid_until?: string | null
        }
        Update: {
          id?: string
          request_id?: string
          owner_id?: string
          amount?: number
          notes?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          valid_until?: string | null
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          bid_id: string | null
          request_id: string | null
          sender_id: string
          body: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bid_id?: string | null
          request_id?: string | null
          sender_id: string
          body: string
          read_at?: string | null
        }
        Update: {
          id?: string
          bid_id?: string | null
          request_id?: string | null
          sender_id?: string
          body?: string
          read_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'shipper' | 'carrier' | 'admin'
      request_status: 'open' | 'in_progress' | 'completed' | 'cancelled'
      bid_status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for commonly used joins
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Request = Database['public']['Tables']['requests']['Row']
export type Bid = Database['public']['Tables']['bids']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

// User role type
export type UserRole = 'shipper' | 'carrier' | 'admin'

export type RequestWithShipper = Request & {
  profiles: Profile
}

export type BidWithOwnerAndRequest = Bid & {
  profiles: Profile
  requests: Request
}

export type MessageWithSender = Message & {
  profiles: Profile
}