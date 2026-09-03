import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { openingHours } from '@/data/business.js'

/**
 * Derives the live open/closed state from the venue's opening hours.
 *
 * @returns {{ isOpen: import('vue').ComputedRef<boolean>,
 *             label: import('vue').ComputedRef<string> }}
 */
export function useOpeningHours() {
  const now = ref(new Date())

  let timer = null

  const isOpen = computed(() => {
    const hour = now.value.getHours()
    return hour >= openingHours.opens && hour < openingHours.closes
  })

  const label = computed(() => {
    if (isOpen.value) return `Abierto ahora · cierra a las ${openingHours.closes}:00`
    const opensToday = now.value.getHours() < openingHours.opens
    return `Cerrado · abre ${opensToday ? 'hoy' : 'mañana'} a las ${openingHours.opens}:00`
  })

  /* One-minute resolution is enough for whole-hour opening times. */
  onMounted(() => {
    timer = setInterval(() => (now.value = new Date()), 60_000)
  })

  onBeforeUnmount(() => clearInterval(timer))

  return { isOpen, label }
}
