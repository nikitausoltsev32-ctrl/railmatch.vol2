'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'

interface SignInFormProps {
  onSuccess?: () => void
  onToggleMode?: () => void
  onForgotPassword?: () => void
}

export default function SignInForm({ onSuccess, onToggleMode, onForgotPassword }: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const result = await signIn(formData.email, formData.password)

      if (result.error) {
        setErrors({ general: result.error })
      } else {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setErrors({ general: 'Произошла непредвиденная ошибка' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Вход в систему
        </h2>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
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
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Ваш пароль"
            disabled={isLoading}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full py-2"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        {onForgotPassword && (
          <div className="text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Забыли пароль?
            </button>
          </div>
        )}

        {onToggleMode && (
          <div className="text-center mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600">
              Нет аккаунта?{' '}
            </span>
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Зарегистрироваться
            </button>
          </div>
        )}
      </form>
    </div>
  )
}