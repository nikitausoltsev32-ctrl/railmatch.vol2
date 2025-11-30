export type User = {
  id: string
  email: string
  name: string | null
  role: 'OWNER' | 'EXECUTOR'
  created_at: string
  updated_at: string
}

export type Request = {
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
  creator?: User
  bids?: Bid[]
}

export type Bid = {
  id: string
  amount: number
  message: string | null
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
  request_id: string
  created_by_id: string
  created_at: string
  updated_at: string
  request?: Request
  created_by?: User
  chat?: Chat
}

export type Chat = {
  id: string
  bid_id: string | null
  request_id: string
  created_at: string
  updated_at: string
  bid?: Bid
  request?: Request
  messages?: Message[]
  participants?: ChatParticipant[]
}

export type ChatParticipant = {
  id: string
  chat_id: string
  user_id: string
  last_read_at: string
  chat?: Chat
  user?: User
}

export type Message = {
  id: string
  content: string
  sender_id: string
  chat_id: string
  status: 'SENT' | 'DELIVERED' | 'READ'
  created_at: string
  updated_at: string
  sender?: User
  chat?: Chat
}

export type RequestFilters = {
  wagonType?: string
  dateFrom?: string
  dateTo?: string
  status?: string
}