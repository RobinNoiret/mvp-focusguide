'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/auth-service'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'prompt' | 'loading' | 'success' | 'error'>(
    token ? 'loading' : 'prompt'
  )
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!token) return

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus('success')
      } catch (error: unknown) {
        setStatus('error')
        const axiosError = error as { response?: { data?: { error?: string } } }
        setErrorMessage(
          axiosError.response?.data?.error ||
          'La vérification a échoué. Le lien a peut-être expiré.'
        )
      }
    }

    verifyToken()
  }, [token])

  // Prompt screen (no token - user just registered)
  if (status === 'prompt') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-dark">Vérifiez votre email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Un email de vérification a été envoyé à votre adresse email.
          </p>
          <p className="text-gray-600">
            Veuillez cliquer sur le lien dans l&apos;email pour activer votre compte.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Loading screen
  if (status === 'loading') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-dark">Vérification en cours...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Vérification de votre adresse email en cours...
          </p>
        </CardContent>
      </Card>
    )
  }

  // Success screen
  if (status === 'success') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-dark">Email vérifié !</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Votre adresse email a été vérifiée avec succès ! Vous pouvez maintenant
            accéder à toutes les fonctionnalités de Focus Guide.
          </p>
          <Button
            className="w-full bg-chartreuse text-dark hover:bg-chartreuse/90"
            onClick={() => router.push('/login')}
          >
            Se connecter
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Error screen
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-dark">Erreur de vérification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-red-600">{errorMessage}</p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/register')}
        >
          Retour à l&apos;inscription
        </Button>
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-gray-600">Chargement...</p>
          </CardContent>
        </Card>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
