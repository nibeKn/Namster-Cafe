import { ref, readonly } from 'vue'

const query = window.matchMedia('(prefers-reduced-motion: reduce)')
const prefersReducedMotion = ref(query.matches)
query.addEventListener('change', (event) => (prefersReducedMotion.value = event.matches))

/**
 * Shared reactive read of the user's motion preference, for the animations that
 * CSS alone cannot gate.
 *
 * @returns {Readonly<import('vue').Ref<boolean>>}
 */
export function usePrefersReducedMotion() {
  return readonly(prefersReducedMotion)
}
