'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Profile, UserRole } from '@/lib/supabase'
import { getUserProfile } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  role: UserRole | null
  signIn: (email: string, password: string) => Promise<{ error?: string; success?: boolean }>
  signUp: (data: {
    email: string
    password: string
    fullName: string
    role: UserRole
    companyName?: string
    phone?: string
  }) => Promise<{ error?: string; success?: boolean }>
  signOut: () => Promise<{ error?: string; success?: boolean }>
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>
  updatePassword: (newPassword: string) => Promise<{ error?: string; success?: boolean }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      const { profile: userProfile, error } = await getUserProfile(userId)
      
      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } else {
        setProfile(userProfile || null)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        let errorMessage = 'Ошибка входа'
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Неверный email или пароль'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email не подтвержден. Проверьте вашу почту'
        }
        
        return { error: errorMessage }
      }

      return { success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: 'Произошла непредвиденная ошибка при входе' }
    }
  }

  const signUp = async (data: {
    email: string
    password: string
    fullName: string
    role: UserRole
    companyName?: string
    phone?: string
  }) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
            company_name: data.companyName,
            phone: data.phone,
          }
        }
      })

      if (signUpError) {
        let errorMessage = 'Ошибка регистрации'
        
        if (signUpError.message.includes('User already registered')) {
          errorMessage = 'Пользователь с таким email уже зарегистрирован'
        } else if (signUpError.message.includes('Password should be')) {
          errorMessage = 'Пароль должен содержать минимум 6 символов'
        } else if (signUpError.message.includes('Invalid email')) {
          errorMessage = 'Некорректный email адрес'
        }
        
        return { error: errorMessage }
      }

      if (authData.user) {
        // Create profile using server action
        const response = await fetch('/api/auth/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            role: data.role,
            company_name: data.companyName,
            phone: data.phone,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          return { error: errorData.error || 'Не удалось создать профиль' }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: 'Произошла непредвиденная ошибка при регистрации' }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        return { error: 'Ошибка при выходе из системы' }
      }

      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: 'Произошла непредвиденная ошибка при выходе' }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        let errorMessage = 'Ошибка сброса пароля'
        
        if (error.message.includes('User not found')) {
          errorMessage = 'Пользователь с таким email не найден'
        }
        
        return { error: errorMessage }
      }

      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: 'Произошла непредвиденная ошибка при сбросе пароля' }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        let errorMessage = 'Ошибка обновления пароля'
        
        if (error.message.includes('Password should be')) {
          errorMessage = 'Пароль должен содержать минимум 6 символов'
        }
        
        return { error: errorMessage }
      }

      return { success: true }
    } catch (error) {
      console.error('Update password error:', error)
      return { error: 'Произошла непредвиденная ошибка при обновлении пароля' }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    role: profile?.role || null,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}