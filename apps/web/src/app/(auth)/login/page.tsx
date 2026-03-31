'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/auth-service'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await authService.login(data)
      // Redirect to dashboard
      router.replace('/today')
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } }
      const errorMessage = axiosError.response?.data?.error ||
        'La connexion a échoué. Vérifiez vos identifiants.'
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-dark">Se connecter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              Pas encore de compte?{' '}
              <Link href="/register" className="text-dark font-medium hover:underline">
                S&apos;inscrire
              </Link>
            </p>

            {/* Forgot Password Link */}
            <p className="text-center text-sm">
              <Link href="/forgot-password" className="text-gray-600 hover:underline">
                Mot de passe oublié?
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
