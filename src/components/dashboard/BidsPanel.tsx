'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Bid, Request } from '@/types'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { DollarSign, Edit2, Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react'

interface BidsPanelProps {
  userId: string
  userRole?: 'OWNER' | 'EXECUTOR'
}

export function BidsPanel({ userId, userRole = 'EXECUTOR' }: BidsPanelProps) {
  const supabase = useSupabase()
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBid, setEditingBid] = useState<Bid | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [bidMessage, setBidMessage] = useState('')

  useEffect(() => {
    fetchBids()
  }, [])

  const fetchBids = async () => {
    try {
      let query = supabase
        .from('bids')
        .select(`
          *,
          request:requests(id, title, description, wagon_type, origin, destination, date, status, created_by),
          created_by:users(id, name, email)
        `)

      if (userRole === 'EXECUTOR') {
        // Executors see their own bids
        query = query.eq('created_by_id', userId)
      } else {
        // Owners see bids on their requests
        query = query.eq('request.created_by', userId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setBids(data || [])
    } catch (error) {
      console.error('Error fetching bids:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitBid = async (requestId: string) => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      alert('Please enter a valid bid amount')
      return
    }

    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          request_id: requestId,
          created_by_id: userId,
          amount: parseFloat(bidAmount),
          message: bidMessage || null,
        })

      if (error) throw error

      setBidAmount('')
      setBidMessage('')
      fetchBids()
      alert('Bid submitted successfully!')
    } catch (error) {
      console.error('Error submitting bid:', error)
      alert('Failed to submit bid')
    }
  }

  const handleUpdateBid = async () => {
    if (!editingBid || !bidAmount || parseFloat(bidAmount) <= 0) {
      alert('Please enter a valid bid amount')
      return
    }

    try {
      const { error } = await supabase
        .from('bids')
        .update({
          amount: parseFloat(bidAmount),
          message: bidMessage || null,
        })
        .eq('id', editingBid.id)

      if (error) throw error

      setEditingBid(null)
      setBidAmount('')
      setBidMessage('')
      fetchBids()
      alert('Bid updated successfully!')
    } catch (error) {
      console.error('Error updating bid:', error)
      alert('Failed to update bid')
    }
  }

  const handleCancelBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to cancel this bid?')) return

    try {
      const { error } = await supabase
        .from('bids')
        .update({ status: 'CANCELLED' })
        .eq('id', bidId)

      if (error) throw error
      fetchBids()
    } catch (error) {
      console.error('Error cancelling bid:', error)
      alert('Failed to cancel bid')
    }
  }

  const handleAcceptBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to accept this bid? This will create a chat thread and update the request status.')) return

    try {
      const response = await fetch(`/api/bids/${bidId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'accept' }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to accept bid')
      }

      fetchBids()
      alert('Bid accepted successfully! Chat thread created.')
    } catch (error: any) {
      console.error('Error accepting bid:', error)
      alert(error.message || 'Failed to accept bid')
    }
  }

  const handleRejectBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to reject this bid?')) return

    try {
      const response = await fetch(`/api/bids/${bidId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject' }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reject bid')
      }

      fetchBids()
      alert('Bid rejected successfully!')
    } catch (error: any) {
      console.error('Error rejecting bid:', error)
      alert(error.message || 'Failed to reject bid')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading your bids...</div>
  }

  return (
    <div className="space-y-4">
      {bids.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't placed any bids yet
        </div>
      ) : (
        bids.map((bid) => (
          <Card key={bid.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{bid.request?.title}</CardTitle>
                  <p className="text-gray-600 mt-1">{bid.request?.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(bid.status)}>
                    {bid.status}
                  </Badge>
                  {bid.status === 'ACCEPTED' && bid.chat && (
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Bid Amount:</span>
                    <span className="text-green-600 font-bold">${bid.amount.toFixed(2)}</span>
                  </div>
                  {bid.message && (
                    <div className="text-sm text-gray-600">
                      <strong>Message:</strong> {bid.message}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div><strong>Route:</strong> {bid.request?.origin} → {bid.request?.destination}</div>
                  <div><strong>Date:</strong> {bid.request?.date && format(new Date(bid.request.date), 'MMM d, yyyy')}</div>
                  <div><strong>Wagon Type:</strong> {bid.request?.wagon_type}</div>
                  <div><strong>Posted:</strong> {format(new Date(bid.created_at), 'MMM d, yyyy')}</div>
                </div>
              </div>
              
              {bid.status === 'PENDING' && (
                <div className="flex space-x-2">
                  {userRole === 'EXECUTOR' ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingBid(bid)
                              setBidAmount(bid.amount.toString())
                              setBidMessage(bid.message || '')
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Bid</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bid Amount ($)
                              </label>
                              <Input
                                type="number"
                                step="0.01"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder="Enter amount"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message (optional)
                              </label>
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows={3}
                                value={bidMessage}
                                onChange={(e) => setBidMessage(e.target.value)}
                                placeholder="Add a message for the request owner..."
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={handleUpdateBid}>
                                Update Bid
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setEditingBid(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleCancelBid(bid.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptBid(bid.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRejectBid(bid.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}