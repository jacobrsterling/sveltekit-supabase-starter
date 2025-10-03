type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

class ToastStore {
  toasts = $state<Toast[]>([])

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9)
  }

  show(message: string, type: ToastType = "info", duration = 4500) {
    const id = this.generateId()
    const toast: Toast = { id, message, type, duration }

    this.toasts = [...this.toasts, toast]

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  }

  success(message: string, duration = 4500) {
    return this.show(message, "success", duration)
  }

  error(message: string, duration = 7500) {
    return this.show(message, "error", duration)
  }

  info(message: string, duration = 4500) {
    return this.show(message, "info", duration)
  }

  warning(message: string, duration = 6000) {
    return this.show(message, "warning", duration)
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
  }

  clear() {
    this.toasts = []
  }
}

export const toast = new ToastStore()
