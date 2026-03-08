export interface QueuedMutation {
  id: string
  type: 'create' | 'update' | 'delete'
  endpoint: string
  data: unknown
  attemptCount: number
  lastAttempt: string
  createdAt: string
}

class MutationQueue {
  private readonly STORAGE_KEY = 'focus-guide-mutation-queue'

  getQueue(): QueuedMutation[] {
    if (typeof window === 'undefined') return []
    const queue = localStorage.getItem(this.STORAGE_KEY)
    return queue ? JSON.parse(queue) : []
  }

  enqueue(
    mutation: Omit<
      QueuedMutation,
      'id' | 'attemptCount' | 'createdAt' | 'lastAttempt'
    >
  ): string {
    const queue = this.getQueue()
    const newMutation: QueuedMutation = {
      ...mutation,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attemptCount: 0,
      lastAttempt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    queue.push(newMutation)
    this.saveQueue(queue)
    return newMutation.id
  }

  dequeue(id: string): void {
    const queue = this.getQueue().filter((m) => m.id !== id)
    this.saveQueue(queue)
  }

  incrementAttempt(id: string): void {
    const queue = this.getQueue()
    const mutation = queue.find((m) => m.id === id)
    if (mutation) {
      mutation.attemptCount++
      mutation.lastAttempt = new Date().toISOString()
      this.saveQueue(queue)
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.STORAGE_KEY)
  }

  private saveQueue(queue: QueuedMutation[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue))
  }
}

export const mutationQueue = new MutationQueue()
