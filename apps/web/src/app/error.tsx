'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#262626'
        }}>
          Oops! Une erreur est survenue
        </h1>
        <p style={{
          marginBottom: '1rem',
          color: '#666'
        }}>
          {error.message || 'Quelque chose s\'est mal passé.'}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundColor: '#c8ff00',
            color: '#262626',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#b8ef00'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#c8ff00'
          }}
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
