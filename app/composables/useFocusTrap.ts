import { onMounted, onBeforeUnmount, watch, type Ref } from 'vue'

export function useFocusTrap(containerRef: Ref<HTMLElement | null>, active: Ref<boolean>) {
  function handleKeyDown(e: KeyboardEvent) {
    if (!active.value || !containerRef.value) return
    if (e.key !== 'Tab') return

    const focusableElements = containerRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) {
      e.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    if (!firstElement || !lastElement) {
      e.preventDefault()
      return
    }

    if (e.shiftKey) {
      if (document.activeElement === firstElement || document.activeElement === containerRef.value) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  function focusFirst() {
    if (!active.value || !containerRef.value) return
    const focusableElements = containerRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    firstElement?.focus()
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  watch(active, (newValue) => {
    if (newValue) {
      setTimeout(focusFirst, 50)
    }
  })

  return {
    focusFirst
  }
}
