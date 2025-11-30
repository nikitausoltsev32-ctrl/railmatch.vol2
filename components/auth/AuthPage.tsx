'use client'

import { useState } from 'react'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import ForgotPasswordForm from './ForgotPasswordForm'

type AuthMode = 'signin' | 'signup' | 'forgot'

interface AuthPageProps {
  initialMode?: AuthMode
  onSuccess?: () => void
}

export default function AuthPage({ initialMode = 'signin', onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)

  const handleToggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  const handleForgotPassword = () => {
    setMode('forgot')
  }

  const handleBackToSignIn = () => {
    setMode('signin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {mode === 'signin' && (
            <SignInForm
              onSuccess={onSuccess}
              onToggleMode={handleToggleMode}
              onForgotPassword={handleForgotPassword}
            />
          )}
          
          {mode === 'signup' && (
            <SignUpForm
              onSuccess={onSuccess}
              onToggleMode={handleToggleMode}
            />
          )}
          
          {mode === 'forgot' && (
            <ForgotPasswordForm
              onSuccess={onSuccess}
              onBackToSignIn={handleBackToSignIn}
            />
          )}
        </div>
      </div>
    </div>
  )
}