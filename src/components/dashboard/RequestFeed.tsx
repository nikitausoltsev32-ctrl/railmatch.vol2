'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Request, RequestFilters } from '@/types'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MapPin, Calendar, Package, DollarSign } from 'lucide-react'
import { BidDialog } from './BidDialog'

interface RequestFeedProps {
  onSelectRequest: (requestId: string) => void
  userId: string
  refreshTrigger?: boolean
}

export function RequestFeed({ onSelectRequest, userId, refreshTrigger }: RequestFeedProps) {
  const supabase = useSupabase()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<RequestFilters>({})
  const [bidDialogOpen, setBidDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [filters, refreshTrigger])

  const fetchRequests = async () => {
    try {
      let query = supabase
        .from('requests')
        .select(`
          *,
          creator:users(id, name, email)
        `)
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.wagonType) {
        query = query.eq('wagon_type', filters.wagonType)
      }
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo)
      }

      const { data, error } = await query

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBid = (request: Request) => {
    setSelectedRequest(request)
    setBidDialogOpen(true)
  }

  const handleBidSubmit = () => {
    fetchRequests()
    onSelectRequest(selectedRequest?.id || '')
  }

  const wagonTypes = [
    'Covered wagon',
    'Open wagon',
    'Flat wagon',
    'Tank wagon',
    'Hopper wagon',
    'Refrigerated wagon'
  ]

  if (loading) {
    return <div className="flex justify-center py-8">Loading requests...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wagon Type
            </label>
            <Select
              value={filters.wagonType || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, wagonType: e.target.value }))}
              options={[
                { value: '', label: 'All types' },
                ...wagonTypes.map(type => ({ value: type, label: type }))
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({})}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No requests found matching your criteria
          </div>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{request.description}</p>
                  </div>
                  <Badge variant="outline">{request.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{request.wagon_type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{request.origin} → {request.destination}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{format(new Date(request.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-green-600 font-medium">
                      {request.creator?.name || request.creator?.email}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Posted {format(new Date(request.created_at), 'MMM d, yyyy')}
                  </div>
                  <Button onClick={() => handleBid(request)}>
                    Place Bid
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <BidDialog
        request={selectedRequest}
        isOpen={bidDialogOpen}
        onClose={() => setBidDialogOpen(false)}
        onSubmit={handleBidSubmit}
        userId={userId}
      />
    </div>
  )
}