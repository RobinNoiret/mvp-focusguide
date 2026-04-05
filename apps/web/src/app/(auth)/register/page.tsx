'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/auth-service'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { useTranslation } from '@/hooks/use-translation'
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)

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

      // Show success confirmation
      setIsRegistered(true)
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } }
      setApiError(
        axiosError.response?.data?.error ||
        t.auth.register.failed
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isRegistered) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-dark">{t.auth.register.success}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              <p className="font-medium">{t.auth.register.successMessage}</p>
              <p className="mt-2">{t.auth.register.successDescription}</p>
            </div>
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-chartreuse text-dark hover:bg-chartreuse/90"
            >
              {t.auth.register.backToLogin}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-dark">{t.auth.register.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">{t.auth.register.name}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t.auth.register.namePlaceholder}
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.register.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.auth.register.emailPlaceholder}
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.register.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.auth.register.passwordPlaceholder}
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
              <Label htmlFor="confirmPassword">{t.auth.register.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t.auth.register.passwordPlaceholder}
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
              {isLoading ? t.auth.register.submitting : t.auth.register.submit}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              {t.auth.register.haveAccount}{' '}
              <Link href="/login" className="text-dark font-medium hover:underline">
                {t.auth.register.login}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
