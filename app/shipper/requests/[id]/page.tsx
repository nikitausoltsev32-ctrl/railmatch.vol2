'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Package, ArrowLeft, CheckCircle, AlertCircle, Check, X } from 'lucide-react'

interface Bid {
  id: string
  request_id: string
  owner_id: string
  price: number
  comment: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

interface Request {
  id: string
  shipper_id: string
  route_from: string
  route_to: string
  cargo_description: string
  wagon_type: string
  wagon_count: number
  loading_date: string
  target_price: number
  status: 'active' | 'closed'
  accepted_owner_id: string | null
  created_at: string
  bids: Bid[]
}

interface Alert {
  type: 'success' | 'error'
  message: string
}

export default function RequestDetailPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState<Request | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [alert, setAlert] = useState<Alert | null>(null)

  useEffect(() => {
    // Mock data for now
    const mockRequest: Request = {
      id: params.id as string,
      shipper_id: 'current-user-id',
      route_from: 'Москва',
      route_to: 'Санкт-Петербург',
      cargo_description: 'Стальные трубы',
      wagon_type: 'полувагон',
      wagon_count: 5,
      loading_date: '2024-01-15',
      target_price: 50000,
      status: 'active',
      accepted_owner_id: null,
      created_at: '2024-01-01T00:00:00Z',
      bids: [
        {
          id: '1',
          request_id: '1',
          owner_id: 'owner-1',
          price: 48000,
          comment: 'Готовы выполнить перевозку в указанные сроки',
          status: 'pending',
          created_at: '2024-01-02T00:00:00Z'
        },
        {
          id: '2',
          request_id: '1',
          owner_id: 'owner-2',
          price: 52000,
          comment: 'Дополнительное страхование включено',
          status: 'pending',
          created_at: '2024-01-03T00:00:00Z'
        }
      ]
    }
    
    setRequest(mockRequest)
    setBids(mockRequest.bids || [])
    setLoading(false)
  }, [params.id])

  const handleAcceptBid = async (bidId: string, requestId: string) => {
    const newBids = bids.map(bid => {
      if (bid.id === bidId) {
        return { ...bid, status: 'accepted' as const }
      } else {
        return { ...bid, status: 'rejected' as const }
      }
    })
    
    setBids(newBids)
    setRequest(request ? {
      ...request,
      status: 'closed',
      accepted_owner_id: bids.find(b => b.id === bidId)?.owner_id || null,
      bids: newBids
    } : null)
    
    setAlert({ type: 'success', message: 'Ставка принята' })
  }

  const handleRejectBid = async (bidId: string, requestId: string) => {
    setBids(bids.filter(bid => bid.id !== bidId))
    setAlert({ type: 'success', message: 'Ставка отклонена' })
  }

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 mr-1 bg-green-400 rounded-full"></span>
            Активна
          </span>
        )
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <span className="w-1.5 h-1.5 mr-1 bg-gray-400 rounded-full"></span>
            Закрыта
          </span>
        )
      default:
        return null
    }
  }

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <span className="w-1.5 h-1.5 mr-1 bg-yellow-400 rounded-full"></span>
            В ожидании
          </span>
        )
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 mr-1 bg-green-400 rounded-full"></span>
            Принята
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 mr-1 bg-red-400 rounded-full"></span>
            Отклонена
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">RailMatch</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/shipper" className="text-gray-900 font-medium">
                Заказчик
              </Link>
              <Link href="/owner" className="text-gray-700 hover:text-gray-900">
                Владелец
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <div className={`mb-6 p-4 rounded-md ${
            alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {alert.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <Link
            href="/shipper"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Вернуться к заявкам
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Загрузка заявки...</p>
          </div>
        ) : !request ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Заявка не найдена</h3>
            <p className="mt-1 text-sm text-gray-500">
              Заявка с указанным ID не существует или была удалена.
            </p>
            <div className="mt-6">
              <Link
                href="/shipper"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Вернуться к заявкам
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {request.route_from} → {request.route_to}
                </h1>
                {getRequestStatusBadge(request.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Информация о перевозке</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Груз:</dt>
                      <dd className="text-sm font-medium text-gray-900">{request.cargo_description}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Тип вагона:</dt>
                      <dd className="text-sm font-medium text-gray-900">{request.wagon_type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Количество вагонов:</dt>
                      <dd className="text-sm font-medium text-gray-900">{request.wagon_count}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Дата погрузки:</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {new Date(request.loading_date).toLocaleDateString('ru-RU')}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Финансовая информация</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Целевая цена:</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {request.target_price.toLocaleString('ru-RU')} ₽
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Ставок получено:</dt>
                      <dd className="text-sm font-medium text-gray-900">{bids.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Дата создания:</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {new Date(request.created_at).toLocaleDateString('ru-RU')}
                      </dd>
                    </div>
                    {request.accepted_owner_id && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Исполнитель:</dt>
                        <dd className="text-sm font-medium text-green-600">Выбран</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Полученные ставки</h2>
              
              {bids.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Нет ставок</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    По этой заявке пока не поступило ставок от владельцев вагонов.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids
                    .sort((a, b) => {
                      if (a.status === 'accepted') return -1
                      if (b.status === 'accepted') return 1
                      if (a.status === 'rejected') return 1
                      if (b.status === 'rejected') return -1
                      return a.price - b.price
                    })
                    .map((bid) => (
                      <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-semibold text-gray-900">
                                {bid.price.toLocaleString('ru-RU')} ₽
                              </span>
                              {getBidStatusBadge(bid.status)}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{bid.comment}</p>
                            <p className="mt-1 text-xs text-gray-400">
                              Поступила {new Date(bid.created_at).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          
                          <div className="flex-shrink-0 ml-4">
                            {bid.status === 'pending' && request.status === 'active' && (
                              <div className="space-x-2">
                                <button
                                  onClick={() => handleAcceptBid(bid.id, request.id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Принять
                                </button>
                                <button
                                  onClick={() => handleRejectBid(bid.id, request.id)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Отклонить
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}