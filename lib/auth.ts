import { supabase } from './supabase'
import { Profile } from './supabase'

export type UserRole = 'shipper' | 'carrier' | 'admin'

export interface AuthUser {
  id: string
  email: string
  profile?: Profile
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  role: UserRole
  companyName?: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

// Server-side auth helpers
export async function createProfile(userId: string, data: {
  email: string
  full_name: string
  role: UserRole
  company_name?: string
  phone?: string
}): Promise<{ error?: string; success?: boolean }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        company_name: data.company_name,
        phone: data.phone,
      })

    if (error) {
      console.error('Profile creation error:', error)
      return { error: 'Не удалось создать профиль пользователя' }
    }

    return { success: true }
  } catch (error) {
    console.error('Profile creation error:', error)
    return { error: 'Произошла непредвиденная ошибка' }
  }
}

export async function getUserProfile(userId: string): Promise<{ profile?: Profile; error?: string }> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile not found
        return { error: 'Профиль не найден' }
      }
      console.error('Profile fetch error:', error)
      return { error: 'Не удалось загрузить профиль' }
    }

    return { profile }
  } catch (error) {
    console.error('Profile fetch error:', error)
    return { error: 'Произошла непредвиденная ошибка' }
  }
}

export async function updateUserProfile(userId: string, data: {
  full_name?: string
  company_name?: string
  phone?: string
}): Promise<{ error?: string; success?: boolean }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        company_name: data.company_name,
        phone: data.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) {
      console.error('Profile update error:', error)
      return { error: 'Не удалось обновить профиль' }
    }

    return { success: true }
  } catch (error) {
    console.error('Profile update error:', error)
    return { error: 'Произошла непредвиденная ошибка' }
  }
}

// Client-side auth actions
export async function signUp(data: SignUpData): Promise<{ error?: string; success?: boolean }> {
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
      // Create profile immediately
      const profileResult = await createProfile(authData.user.id, {
        email: data.email,
        full_name: data.fullName,
        role: data.role,
        company_name: data.companyName,
        phone: data.phone,
      })

      if (profileResult.error) {
        return { error: profileResult.error }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Sign up error:', error)
    return { error: 'Произошла непредвиденная ошибка при регистрации' }
  }
}

export async function signIn(data: SignInData): Promise<{ error?: string; success?: boolean }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
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

export async function signOut(): Promise<{ error?: string; success?: boolean }> {
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

export async function resetPassword(email: string): Promise<{ error?: string; success?: boolean }> {
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

export async function updatePassword(newPassword: string): Promise<{ error?: string; success?: boolean }> {
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