'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Request } from '@/types'

interface BidDialogProps {
  request: Request | null
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  userId: string
}

export function BidDialog({ request, isOpen, onClose, onSubmit, userId }: BidDialogProps) {
  const supabase = useSupabase()
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!request || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid bid amount')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          request_id: request.id,
          created_by_id: userId,
          amount: parseFloat(amount),
          message: message || null,
        })

      if (error) throw error

      setAmount('')
      setMessage('')
      onClose()
      onSubmit()
      alert('Bid submitted successfully!')
    } catch (error) {
      console.error('Error submitting bid:', error)
      alert('Failed to submit bid')
    } finally {
      setLoading(false)
    }
  }

  if (!request) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Bid - {request.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Request Details:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Route:</strong> {request.origin} → {request.destination}</div>
              <div><strong>Wagon Type:</strong> {request.wagon_type}</div>
              <div><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bid Amount ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter your bid amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (optional)
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message for the request owner..."
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Bid'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}