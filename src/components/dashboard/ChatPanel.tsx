'use client'

import { useState, useEffect, useRef } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Chat, Message, User } from '@/types'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Send, MessageCircle, DollarSign } from 'lucide-react'

interface ChatPanelProps {
  userId: string
  selectedChatId: string | null
  onSelectChat: (chatId: string) => void
}

export function ChatPanel({ userId, selectedChatId, onSelectChat }: ChatPanelProps) {
  const supabase = useSupabase()
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId)
      
      // Set up real-time subscription for messages
      const channel = supabase
        .channel(`messages:${selectedChatId}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `chat_id=eq.${selectedChatId}`
          }, 
          (payload: any) => {
            setMessages(prev => [...prev, payload.new as Message])
            scrollToBottom()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedChatId])

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_participants')
        .select(`
          chat:chats(
            *,
            request:requests(id, title, origin, destination),
            bid:bids(id, amount)
          )
        `)
        .eq('user_id', userId)

      if (error) throw error
      setChats(data?.map((item: any) => item.chat).filter(Boolean) || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users(id, name, email)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
      
      // Update last read timestamp
      await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('user_id', userId)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChatId) return

    setSending(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: selectedChatId,
          sender_id: userId,
          content: newMessage.trim(),
        })

      if (error) throw error

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const getUnreadCount = (chat: Chat) => {
    // This would need to be calculated based on last_read_at
    // For now, returning 0
    return 0
  }

  const selectedChat = chats.find(chat => chat.id === selectedChatId)

  if (loading) {
    return <div className="flex justify-center py-8">Loading chats...</div>
  }

  return (
    <div className="flex h-[600px]">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Conversations</h3>
        </div>
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedChatId === chat.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <p className="font-medium truncate">
                        {chat.request?.title || 'Chat'}
                      </p>
                      {chat.bid && (
                        <span className="text-sm text-green-600 font-medium">
                          ${chat.bid.amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {chat.request?.origin} → {chat.request?.destination}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {chat.created_at && format(new Date(chat.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {getUnreadCount(chat) > 0 && (
                    <Badge className="ml-2">
                      {getUnreadCount(chat)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-semibold">
                    {selectedChat.request?.title || 'Chat'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.bid ? (
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Bid: ${selectedChat.bid.amount.toFixed(2)}
                      </span>
                    ) : (
                      'Direct message'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === userId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === userId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.sender?.name && (
                      <p className={`text-xs font-medium mb-1 ${
                        message.sender_id === userId ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.sender.name}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === userId ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.created_at && format(new Date(message.created_at), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  disabled={sending}
                />
                <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}