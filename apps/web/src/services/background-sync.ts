import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { mutationQueue, QueuedMutation } from './mutation-queue'

class BackgroundSync {
  private intervalId: ReturnType<typeof setInterval> | null = null
  private readonly SYNC_INTERVAL = 30000 // 30 seconds
  private readonly MAX_ATTEMPTS = 5
  private listeners: Set<() => void> = new Set()

  start(): void {
    if (typeof window === 'undefined') return

    // Process queue immediately on start
    this.processQueue()

    // Poll every 30 seconds
    this.intervalId = setInterval(() => {
      this.processQueue()
    }, this.SYNC_INTERVAL)

    // Process on network reconnect
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline)
      window.removeEventListener('offline', this.handleOffline)
    }
  }

  private handleOnline = (): void => {
    toast.success('Connexion rétablie. Synchronisation...')
    this.processQueue()
  }

  private handleOffline = (): void => {
    toast.warning('Vous êtes hors ligne. Les modifications seront synchronisées à la reconnexion.')
  }

  async processQueue(): Promise<void> {
    if (typeof window === 'undefined') return
    if (!navigator.onLine) return

    const queue = mutationQueue.getQueue()
    if (queue.length === 0) return

    for (const mutation of queue) {
      const backoff = this.calculateBackoff(mutation.attemptCount)
      const timeSinceLastAttempt =
        Date.now() - new Date(mutation.lastAttempt).getTime()

      if (timeSinceLastAttempt < backoff) {
        continue
      }

      if (mutation.attemptCount >= this.MAX_ATTEMPTS) {
        mutationQueue.dequeue(mutation.id)
        toast.error('Impossible de synchroniser certaines modifications.', {
          action: {
            label: 'Réessayer',
            onClick: () => this.retryMutation(mutation),
          },
        })
        this.notifyListeners()
        continue
      }

      try {
        await this.executeMutation(mutation)
        mutationQueue.dequeue(mutation.id)
        this.notifyListeners()
      } catch {
        mutationQueue.incrementAttempt(mutation.id)
        this.notifyListeners()
      }
    }
  }

  private calculateBackoff(attemptCount: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attemptCount), 16000)
  }

  private async executeMutation(mutation: QueuedMutation): Promise<void> {
    const { type, endpoint, data } = mutation

    switch (type) {
      case 'create':
        await apiClient.post(endpoint, data)
        break
      case 'update':
        await apiClient.patch(endpoint, data)
        break
      case 'delete':
        await apiClient.delete(endpoint)
        break
    }
  }

  async retryMutation(mutation: QueuedMutation): Promise<void> {
    try {
      await this.executeMutation(mutation)
      mutationQueue.dequeue(mutation.id)
      toast.success('Modifications synchronisées')
      this.notifyListeners()
    } catch {
      toast.error('Échec de la synchronisation. Veuillez réessayer.')
    }
  }

  // Subscribe to queue changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }

  getQueueCount(): number {
    return mutationQueue.getQueue().length
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }
}

export const backgroundSync = new BackgroundSync()
