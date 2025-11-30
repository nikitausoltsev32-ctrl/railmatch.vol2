'use client'

import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'

export default function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">RailMatch</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/shipper" className="text-gray-700 hover:text-gray-900">
                Заказчик
              </Link>
              <Link href="/owner" className="text-gray-900 font-medium">
                Владелец
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Кабинет владельца</h1>
          <p className="mt-2 text-lg text-gray-600">
            Раздел для владельцев вагонов находится в разработке
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Вернуться на главную
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}