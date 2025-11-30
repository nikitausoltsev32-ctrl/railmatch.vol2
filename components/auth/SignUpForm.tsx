'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserRole } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

interface SignUpFormProps {
  onSuccess?: () => void
  onToggleMode?: () => void
}

export default function SignUpForm({ onSuccess, onToggleMode }: SignUpFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'shipper' as UserRole,
    companyName: '',
    phone: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { signUp } = useAuth()

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam && ['shipper', 'carrier', 'admin'].includes(roleParam)) {
      setFormData(prev => ({ ...prev, role: roleParam as UserRole }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email адрес'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Имя обязательно'
    }

    if (formData.role === 'shipper' || formData.role === 'carrier') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Название компании обязательно'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        companyName: formData.companyName || undefined,
        phone: formData.phone || undefined,
      })

      if (result.error) {
        setErrors({ general: result.error })
      } else {
        setSuccessMessage('Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения аккаунта.')
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          } else {
            router.push('/auth/signin')
          }
        }, 3000)
      }
    } catch (error) {
      setErrors({ general: 'Произошла непредвиденная ошибка' })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleLabel = (role: UserRole) => {
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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Регистрация
        </h2>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {successMessage}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Минимум 6 символов"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Подтвердите пароль *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="Повторите пароль"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Полное имя *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`input ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="Иван Иванов"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Тип пользователя *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`input ${errors.role ? 'border-red-500' : ''}`}
            disabled={isLoading}
          >
            <option value="shipper">Заказчик</option>
            <option value="carrier">Исполнитель</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {(formData.role === 'shipper' || formData.role === 'carrier') && (
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Название компании *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`input ${errors.companyName ? 'border-red-500' : ''}`}
              placeholder="ООО «ТрансЛогистик»"
              disabled={isLoading}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input"
            placeholder="+7 (999) 123-45-67"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full py-2"
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        {onToggleMode && (
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
            </span>
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Войти
            </button>
          </div>
        )}
      </form>
    </div>
  )
}