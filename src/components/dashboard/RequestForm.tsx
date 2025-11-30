'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'

interface RequestFormProps {
  userId: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export function RequestForm({ userId, isOpen, onClose, onSubmit }: RequestFormProps) {
  const supabase = useSupabase()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wagon_type: '',
    origin: '',
    destination: '',
    date: ''
  })

  const wagonTypes = [
    'Covered wagon',
    'Open wagon',
    'Flat wagon',
    'Tank wagon',
    'Hopper wagon',
    'Refrigerated wagon'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('requests')
        .insert({
          title: formData.title,
          description: formData.description,
          wagon_type: formData.wagon_type,
          origin: formData.origin,
          destination: formData.destination,
          date: new Date(formData.date).toISOString(),
          created_by: userId,
        })

      if (error) throw error

      setFormData({
        title: '',
        description: '',
        wagon_type: '',
        origin: '',
        destination: '',
        date: ''
      })
      onClose()
      onSubmit()
      alert('Request created successfully!')
    } catch (error: any) {
      console.error('Error creating request:', error)
      alert('Failed to create request')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter request title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wagon Type
              </label>
              <Select
                value={formData.wagon_type}
                onChange={(e) => handleChange('wagon_type', e.target.value)}
                required
              >
                <option value="">Select wagon type</option>
                {wagonTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your transportation request..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origin
              </label>
              <Input
                value={formData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                placeholder="Origin city/station"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <Input
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
                placeholder="Destination city/station"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Request'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}