'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, PlusCircle, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

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
  bids: Array<{
    id: string
    price: number
    status: string
    created_at: string
  }>
}

interface Alert {
  type: 'success' | 'error'
  message: string
}

export default function ShipperDashboard() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
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
        { id: '1', price: 48000, status: 'pending', created_at: '2024-01-02T00:00:00Z' },
        { id: '2', price: 52000, status: 'pending', created_at: '2024-01-03T00:00:00Z' }
      ]
    },
    {
      id: '2',
      shipper_id: 'current-user-id',
      route_from: 'Казань',
      route_to: 'Екатеринбург',
      cargo_description: 'Строительные материалы',
      wagon_type: 'крытый',
      wagon_count: 3,
      loading_date: '2024-01-20',
      target_price: 75000,
      status: 'closed',
      accepted_owner_id: 'owner-123',
      created_at: '2023-12-15T00:00:00Z',
      bids: [
        { id: '3', price: 75000, status: 'accepted', created_at: '2023-12-16T00:00:00Z' }
      ]
    }
  ])
  
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<Alert | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setAlert(null)
    
    try {
      const shipperId = 'current-user-id'
      const newRequest: Request = {
        id: Date.now().toString(),
        shipper_id: shipperId,
        route_from: formData.get('route_from') as string,
        route_to: formData.get('route_to') as string,
        cargo_description: formData.get('cargo_description') as string,
        wagon_type: formData.get('wagon_type') as string,
        wagon_count: Number(formData.get('wagon_count')),
        loading_date: formData.get('loading_date') as string,
        target_price: Number(formData.get('target_price')),
        status: 'active',
        accepted_owner_id: null,
        created_at: new Date().toISOString(),
        bids: []
      }
      
      setRequests([newRequest, ...requests])
      setShowForm(false)
      setAlert({ type: 'success', message: 'Заявка успешно создана' })
    } catch (error) {
      setAlert({ type: 'error', message: 'Не удалось создать заявку' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
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

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Мои заявки</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Создать заявку
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Новая заявка</h2>
            <form action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="route_from" className="block text-sm font-medium text-gray-700 mb-1">
                    Откуда *
                  </label>
                  <input
                    type="text"
                    id="route_from"
                    name="route_from"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Город отправления"
                  />
                </div>
                <div>
                  <label htmlFor="route_to" className="block text-sm font-medium text-gray-700 mb-1">
                    Куда *
                  </label>
                  <input
                    type="text"
                    id="route_to"
                    name="route_to"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Город назначения"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cargo_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Описание груза *
                </label>
                <textarea
                  id="cargo_description"
                  name="cargo_description"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Опишите груз, вес, габариты"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="wagon_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Тип вагона *
                  </label>
                  <select
                    id="wagon_type"
                    name="wagon_type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите тип</option>
                    <option value="крытый">Крытый</option>
                    <option value="полувагон">Полувагон</option>
                    <option value="платформа">Платформа</option>
                    <option value="цистерна">Цистерна</option>
                    <option value="хоппер">Хоппер</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="wagon_count" className="block text-sm font-medium text-gray-700 mb-1">
                    Количество вагонов *
                  </label>
                  <input
                    type="number"
                    id="wagon_count"
                    name="wagon_count"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label htmlFor="loading_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Дата погрузки *
                  </label>
                  <input
                    type="date"
                    id="loading_date"
                    name="loading_date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="target_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Целевая цена (руб.) *
                </label>
                <input
                  type="number"
                  id="target_price"
                  name="target_price"
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Создание...' : 'Создать заявку'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Загрузка...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Нет заявок</h3>
            <p className="mt-1 text-sm text-gray-500">
              У вас пока нет созданных заявок. Создайте первую заявку.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {requests.map((request) => (
                <li key={request.id}>
                  <div className="px-4 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/shipper/requests/${request.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate"
                          >
                            {request.route_from} → {request.route_to}
                          </Link>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="truncate">{request.cargo_description}</span>
                          <span className="flex-shrink-0">Ставок: {request.bids.length}</span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-400">
                          <span>{request.wagon_type}</span>
                          <span className="mx-2">•</span>
                          <span>{request.wagon_count} ваг.</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(request.loading_date).toLocaleDateString('ru-RU')}</span>
                          <span className="mx-2">•</span>
                          <span>{request.target_price.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          href={`/shipper/requests/${request.id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Подробнее
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}