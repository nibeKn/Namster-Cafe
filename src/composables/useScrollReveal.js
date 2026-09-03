import { onMounted, onBeforeUnmount } from 'vue'

const REVEALED_CLASS = 'is-revealed'

/**
 * Marks an element as revealed the first time it enters the viewport, then
 * stops observing it. The hidden starting state lives in CSS under `.has-js`.
 *
 * @param {import('vue').Ref<HTMLElement|null>} elementRef - Element to observe.
 * @param {object} [options]
 * @param {number} [options.threshold=0.12] - Visible fraction that triggers the reveal.
 * @param {string} [options.rootMargin='0px 0px -8% 0px'] - Fires slightly before the
 *   element reaches the bottom edge so the animation lands as it settles.
 */
export function useScrollReveal(elementRef, options = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = options

  let observer = null

  onMounted(() => {
    const element = elementRef.value
    if (!element) return

    /* Without IntersectionObserver, reveal immediately rather than leaving the
       section permanently invisible. */
    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add(REVEALED_CLASS)
      return
    }

    observer = new IntersectionObserver(
      (entries, self) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add(REVEALED_CLASS)
          self.unobserve(entry.target)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
