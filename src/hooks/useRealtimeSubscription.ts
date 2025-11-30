import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useSupabase } from '@/components/providers/SupabaseProvider'

export function useRealtimeSubscription<T>(
  table: string,
  filter?: string,
  callback?: (payload: any) => void
) {
  const supabase = useSupabase()
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const channelName = filter ? `${table}:${filter}` : table
    
    const newChannel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table,
          ...(filter && { filter })
        }, 
        (payload: any) => {
          callback?.(payload)
        }
      )
      .subscribe()

    setChannel(newChannel)

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [table, filter, callback])

  return channel
}