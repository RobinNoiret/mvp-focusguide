'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/auth-service'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await authService.register({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      // Redirect to email verification prompt
      router.push('/verify-email')
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } }
      setApiError(
        axiosError.response?.data?.error ||
        "L'inscription a échoué. Veuillez réessayer."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-dark">Créer un compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
              <div className="mt-2">
                <PasswordStrengthIndicator password={password || ''} />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="rounded bg-red-50 p-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-chartreuse text-dark hover:bg-chartreuse/90"
              disabled={isLoading}
            >
              {isLoading ? 'Création du compte...' : "S'inscrire"}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Vous avez déjà un compte?{' '}
              <Link href="/login" className="text-dark font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
