'use client'

import { useState } from 'react'
import { User } from '@/types'
import { RequestFeed } from './RequestFeed'
import { BidsPanel } from './BidsPanel'
import { ChatPanel } from './ChatPanel'
import { RequestForm } from './RequestForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ExecutorDashboardProps {
  user: User
}

export function ExecutorDashboard({ user }: ExecutorDashboardProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [requestFormOpen, setRequestFormOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Executor Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user.name || user.email}
        </p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Requests Feed</TabsTrigger>
          <TabsTrigger value="bids">My Bids</TabsTrigger>
          <TabsTrigger value="chats">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Open Requests</CardTitle>
                {user.role === 'OWNER' && (
                  <Button onClick={() => setRequestFormOpen(true)}>
                    Create Request
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <RequestFeed 
                onSelectRequest={setSelectedRequestId}
                userId={user.id}
                refreshTrigger={requestFormOpen}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <BidsPanel userId={user.id} userRole={user.role} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatPanel 
                userId={user.id}
                selectedChatId={selectedChatId}
                onSelectChat={setSelectedChatId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RequestForm
        userId={user.id}
        isOpen={requestFormOpen}
        onClose={() => setRequestFormOpen(false)}
        onSubmit={() => {
          setRequestFormOpen(false)
          // This will trigger the refresh in RequestFeed
        }}
      />
    </div>
  )
}