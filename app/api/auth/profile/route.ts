import { createClient } from '@supabase/supabase-js'
import { createProfile } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, full_name, role, company_name, phone } = body

    if (!userId || !email || !full_name || !role) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      )
    }

    // Create profile using service role to bypass RLS
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name,
        role,
        company_name,
        phone,
      })

    if (error) {
      console.error('Profile creation error:', error)
      return NextResponse.json(
        { error: 'Не удалось создать профиль пользователя' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: 'Произошла непредвиденная ошибка' },
      { status: 500 }
    )
  }
}