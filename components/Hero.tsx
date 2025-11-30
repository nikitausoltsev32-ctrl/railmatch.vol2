'use client'

import { ArrowRight, Package, Truck, Users } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'

export default function Hero() {
  const { user } = useAuth()

  const roles = [
    {
      title: 'Заказчик',
      description: 'Размещайте заявки на перевозку грузов и получайте лучшие предложения',
      icon: Package,
      color: 'from-blue-600 to-blue-700',
      href: '/auth/signup?role=shipper',
    },
    {
      title: 'Исполнитель',
      description: 'Находите заявки и предлагайте свои услуги по перевозке',
      icon: Truck,
      color: 'from-green-600 to-green-700',
      href: '/auth/signup?role=carrier',
    },
    {
      title: 'Оператор',
      description: 'Управляйте процессами и обеспечивайте качественный сервис',
      icon: Users,
      color: 'from-purple-600 to-purple-700',
      href: '/auth/signup?role=admin',
    },
  ]

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50 -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-100">
            <span className="text-sm font-semibold text-blue-700">
              Логистическая платформа для железнодорожных перевозок
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            RailMatch Vol. 2
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Соединяем грузоотправителей и перевозчиков для эффективных железнодорожных перевозок
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                Перейти в панель управления
                <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  Начать работу
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition-colors"
                >
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {roles.map((role, index) => {
            const Icon = role.icon
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                {/* Gradient accent */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${role.color} rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300 -z-10`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center mb-4`}
                >
                  <Icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-slate-600 mb-6">{role.description}</p>

                {/* CTA */}
                <Link
                  href={role.href}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                >
                  Выбрать роль
                  <ArrowRight size={18} />
                </Link>
              </div>
            )
          })}
        </div>

        {/* Features highlight */}
        <div className="mt-20 pt-20 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Надежность', value: '100%' },
              { label: 'Безопасность', value: 'RLS' },
              { label: 'Поддержка', value: '24/7' },
              { label: 'Эффективность', value: 'A+' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}