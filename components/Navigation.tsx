'use client'

import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile, signOut } = useAuth()

  const publicNavItems = [
    { label: 'Главная', href: '/' },
    { label: 'О платформе', href: '#about' },
    { label: 'Возможности', href: '#features' },
    { label: 'Контакты', href: '#contact' },
  ]

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      window.location.href = '/'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'shipper':
        return 'Заказчик'
      case 'carrier':
        return 'Исполнитель'
      case 'admin':
        return 'Администратор'
      default:
        return role
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              RailMatch
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {profile?.full_name || profile?.email}
                  {profile?.role && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getRoleLabel(profile.role)}
                    </span>
                  )}
                </span>
                <Link
                  href="/dashboard"
                  className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Панель управления
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors font-medium text-sm"
                >
                  <LogOut size={16} />
                  Выйти
                </button>
              </>
            ) : (
              <>
                {publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/auth/signin"
                  className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Войти
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} className="text-slate-700" />
            ) : (
              <Menu size={24} className="text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-200">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600 border-b border-slate-200">
                  <div>{profile?.full_name || profile?.email}</div>
                  {profile?.role && (
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {getRoleLabel(profile.role)}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Панель управления
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                {publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Войти
                </Link>
                <Link
                  href="/auth/signup"
                  className="block mx-4 mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}