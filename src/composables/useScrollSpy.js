import { ref, onMounted, onBeforeUnmount, readonly } from 'vue'

/**
 * Tracks which section is currently being read, for the navigation indicator.
 *
 * @param {string[]} sectionIds - Section ids in page order.
 * @returns {{ activeId: Readonly<import('vue').Ref<string>> }}
 */
export function useScrollSpy(sectionIds) {
  const activeId = ref(sectionIds[0] ?? '')

  let observer = null
  const visibility = new Map()

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        /* Tall sections overlap, so the one filling most of the screen wins.
           Ties go to the earlier section to stop the indicator flickering. */
        let winner = ''
        let best = 0
        for (const id of sectionIds) {
          const ratio = visibility.get(id) ?? 0
          if (ratio > best) {
            best = ratio
            winner = id
          }
        }

        if (winner) activeId.value = winner
      },
      /* Discounts the fixed header: a section hidden behind the bar should not
         count as visible. */
      { rootMargin: '-20% 0px -35% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    visibility.clear()
  })

  return { activeId: readonly(activeId) }
}
