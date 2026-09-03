import { ref, computed, onMounted, onBeforeUnmount, readonly } from 'vue'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

/**
 * Page-based carousel driven by native scroll-snap.
 *
 * The track is a plain `overflow-x: auto` container, so the browser provides
 * touch swiping with momentum, dragging, trackpad scrolling and RTL support.
 * This composable only observes the position to render controls and offers
 * programmatic paging.
 *
 * @param {object} [options]
 * @param {number} [options.autoPlayInterval=0] - ms between auto-advances. 0 disables.
 * @returns {object} Track ref, position state and controls.
 */
export function useCarousel({ autoPlayInterval = 0 } = {}) {
  /** @type {import('vue').Ref<HTMLElement|null>} */
  const trackRef = ref(null)

  const activeIndex = ref(0)
  const pageCount = ref(1)
  const prefersReducedMotion = usePrefersReducedMotion()

  let autoPlayTimer = null
  let scrollFrame = null
  let resizeObserver = null
  let isPaused = false

  const canPrev = computed(() => activeIndex.value > 0)
  const canNext = computed(() => activeIndex.value < pageCount.value - 1)

  /**
   * Measures the track geometry.
   *
   * The page step is not simply `clientWidth`: with `n` cards per page the
   * visible width spans `n - 1` gaps, but advancing `n` cards crosses `n` of
   * them. Scroll-snap also aligns cards to the padding box, so at rest
   * `scrollLeft` equals the leading padding rather than zero.
   *
   * @returns {{ step: number, pages: number, origin: number }|null}
   */
  function readMetrics() {
    const track = trackRef.value
    const firstItem = track?.firstElementChild
    if (!track || !firstItem) return null

    const styles = getComputedStyle(track)
    const gap = parseFloat(styles.columnGap) || 0
    const itemWidth = firstItem.getBoundingClientRect().width
    if (itemWidth === 0) return null

    const padStart = parseFloat(styles.paddingLeft) || 0
    const viewport = track.clientWidth - padStart - (parseFloat(styles.paddingRight) || 0)

    /* Derived from the rendered width so the composable never needs to know the
       breakpoints that define the grid in CSS. */
    const perView = Math.max(1, Math.round((viewport + gap) / (itemWidth + gap)))

    return {
      step: perView * (itemWidth + gap),
      pages: Math.max(1, Math.ceil(track.children.length / perView)),
      origin: padStart,
    }
  }

  function measure() {
    const metrics = readMetrics()
    if (!metrics) return

    pageCount.value = metrics.pages
    activeIndex.value = clampIndex(
      Math.round((trackRef.value.scrollLeft - metrics.origin) / metrics.step),
    )
  }

  function clampIndex(index) {
    return Math.max(0, Math.min(index, pageCount.value - 1))
  }

  /**
   * @param {number} index - Target page, clamped to the valid range.
   * @param {boolean} [smooth=true]
   */
  function goTo(index, smooth = true) {
    const track = trackRef.value
    const metrics = readMetrics()
    if (!track || !metrics) return

    const target = clampIndex(index)
    track.scrollTo({
      left: metrics.origin + target * metrics.step,
      behavior: smooth && !prefersReducedMotion.value ? 'smooth' : 'auto',
    })
    activeIndex.value = target
  }

  /** Advances one page, wrapping to the first. */
  function next() {
    goTo(canNext.value ? activeIndex.value + 1 : 0)
  }

  /** Goes back one page, wrapping to the last. */
  function prev() {
    goTo(canPrev.value ? activeIndex.value - 1 : pageCount.value - 1)
  }

  function handleScroll() {
    if (scrollFrame) return
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null
      const metrics = readMetrics()
      if (!metrics) return
      activeIndex.value = clampIndex(
        Math.round((trackRef.value.scrollLeft - metrics.origin) / metrics.step),
      )
    })
  }

  /* Auto-rotation is skipped under `prefers-reduced-motion`: unstoppable moving
     content is a WCAG 2.2.2 failure. */
  function startAutoPlay() {
    if (!autoPlayInterval || prefersReducedMotion.value || autoPlayTimer) return
    autoPlayTimer = setInterval(() => {
      if (!isPaused) next()
    }, autoPlayInterval)
  }

  function stopAutoPlay() {
    if (!autoPlayTimer) return
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }

  /** Suspends rotation while the user is interacting. */
  function pause() {
    isPaused = true
  }

  /** Resumes rotation once the user leaves. */
  function resume() {
    isPaused = false
  }

  function handleVisibilityChange() {
    if (document.hidden) stopAutoPlay()
    else startAutoPlay()
  }

  onMounted(() => {
    const track = trackRef.value
    if (!track) return

    measure()
    track.addEventListener('scroll', handleScroll, { passive: true })

    /* Covers both window resizes and breakpoint changes that alter how many
       cards fit per page. */
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(track)

    document.addEventListener('visibilitychange', handleVisibilityChange)
    startAutoPlay()
  })

  onBeforeUnmount(() => {
    stopAutoPlay()
    if (scrollFrame) cancelAnimationFrame(scrollFrame)
    resizeObserver?.disconnect()
    trackRef.value?.removeEventListener('scroll', handleScroll)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return {
    trackRef,
    activeIndex: readonly(activeIndex),
    pageCount: readonly(pageCount),
    canPrev,
    canNext,
    goTo,
    next,
    prev,
    pause,
    resume,
  }
}
