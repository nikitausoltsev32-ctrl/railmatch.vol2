import Link from 'next/link'
import { PlusCircle, Package } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RailMatch</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/shipper" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Заказчик
              </Link>
              <Link 
                href="/owner" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Владелец
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Платформа для железнодорожных перевозок
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Соединяем заказчиков и владельцев вагонов
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link 
              href="/shipper"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center">
                <Package className="h-12 w-12 text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Я заказчик</h2>
                <p className="text-gray-600 text-center mb-4">
                  Разместите заявку на перевозку груза и получите ставки от владельцев вагонов
                </p>
                <span className="inline-flex items-center text-blue-600 font-medium">
                  Перейти в кабинет
                  <PlusCircle className="ml-2 h-5 w-5" />
                </span>
              </div>
            </Link>

            <Link 
              href="/owner"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center">
                <Package className="h-12 w-12 text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Я владелец</h2>
                <p className="text-gray-600 text-center mb-4">
                  Найдите заявки и предложите свои вагоны для перевозки
                </p>
                <span className="inline-flex items-center text-green-600 font-medium">
                  Перейти в кабинет
                  <PlusCircle className="ml-2 h-5 w-5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}