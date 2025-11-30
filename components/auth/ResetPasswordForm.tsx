'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from './AuthProvider'

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { updatePassword } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

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
      const result = await updatePassword(formData.password)

      if (result.error) {
        setErrors({ general: result.error })
      } else {
        setSuccessMessage('Пароль успешно обновлен! Перенаправление на страницу входа...')
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
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
          Новый пароль
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          Введите ваш новый пароль
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Новый пароль *
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
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Подтвердите новый пароль *
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
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full py-2"
        >
          {isLoading ? 'Обновление...' : 'Обновить пароль'}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => router.push('/auth/signin')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Вернуться к входу
          </button>
        </div>
      </form>
    </div>
  )
}