'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

export default function OnboardingPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState<'OWNER' | 'EXECUTOR'>('EXECUTOR')

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/auth')
        return
      }

      // Create user profile
      const { error } = await supabase
        .from('users')
        .insert({
          id: session.user.id,
          email: session.user.email!,
          name: name || null,
          role,
        })

      if (error) throw error

      router.push('/')
    } catch (error: any) {
      console.error('Error completing onboarding:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tell us about yourself to get started with RailMatch
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleComplete} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name (optional)
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  I am a...
                </label>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'OWNER' | 'EXECUTOR')}
                >
                  <option value="EXECUTOR">Executor - I transport goods</option>
                  <option value="OWNER">Owner - I need goods transported</option>
                </Select>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">What's the difference?</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <strong>Executor:</strong> You provide transportation services and can bid on requests
                  </div>
                  <div>
                    <strong>Owner:</strong> You have goods that need to be transported and can create requests
                  </div>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Profile...' : 'Complete Setup'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}