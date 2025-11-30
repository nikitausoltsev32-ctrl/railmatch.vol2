'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
  onBackToSignIn?: () => void
}

export default function ForgotPasswordForm({ onSuccess, onBackToSignIn }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { resetPassword } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Некорректный email адрес'
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
    setSuccessMessage('')

    try {
      const result = await resetPassword(email)

      if (result.error) {
        setErrors({ general: result.error })
      } else {
        setSuccessMessage('Инструкции по сбросу пароля отправлены на ваш email')
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          } else if (onBackToSignIn) {
            onBackToSignIn()
          }
        }, 3000)
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
          Сброс пароля
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          Введите ваш email, и мы отправим вам инструкции по сбросу пароля
        </p>

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
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
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

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full py-2"
        >
          {isLoading ? 'Отправка...' : 'Отправить инструкции'}
        </button>

        {onBackToSignIn && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onBackToSignIn}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Вернуться к входу
            </button>
          </div>
        )}
      </form>
    </div>
  )
}