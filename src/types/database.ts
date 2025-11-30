export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'OWNER' | 'EXECUTOR'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'OWNER' | 'EXECUTOR'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'OWNER' | 'EXECUTOR'
          created_at?: string
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          title: string
          description: string
          wagon_type: string
          origin: string
          destination: string
          date: string
          status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          wagon_type: string
          origin: string
          destination: string
          date: string
          status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          wagon_type?: string
          origin?: string
          destination?: string
          date?: string
          status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          amount: number
          message: string | null
          status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
          request_id: string
          created_by_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          message?: string | null
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
          request_id: string
          created_by_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          message?: string | null
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
          request_id?: string
          created_by_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          bid_id: string | null
          request_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bid_id?: string | null
          request_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bid_id?: string | null
          request_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_participants: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          last_read_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          last_read_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          last_read_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          content: string
          sender_id: string
          chat_id: string
          status: 'SENT' | 'DELIVERED' | 'READ'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          sender_id: string
          chat_id: string
          status?: 'SENT' | 'DELIVERED' | 'READ'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          sender_id?: string
          chat_id?: string
          status?: 'SENT' | 'DELIVERED' | 'READ'
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}