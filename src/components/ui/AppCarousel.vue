<script setup>
/**
 * Accessible carousel built on native scroll-snap.
 *
 * The track is a focusable scroll region labelled for screen readers, arrows
 * disable at the ends rather than silently wrapping, a polite live region
 * announces the current page, and auto-rotation pauses on hover, on focus and
 * when the tab is hidden.
 *
 * @prop {string} label - Accessible name for the region.
 * @prop {number} [autoPlay=0] - ms between auto-advances. 0 disables.
 * @prop {number} [perView=3] - Cards visible on desktop.
 * @prop {string} [tone='rose'] - Colour accent: `rose` or `caramel`.
 */

import { computed } from 'vue'
import { useCarousel } from '@/composables/useCarousel.js'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  label: { type: String, required: true },
  autoPlay: { type: Number, default: 0 },
  perView: { type: Number, default: 3 },
  tone: { type: String, default: 'rose' },
})

const { trackRef, activeIndex, pageCount, canPrev, canNext, goTo, next, prev, pause, resume } =
  useCarousel({ autoPlayInterval: props.autoPlay })

/** Above this many pages, dots give way to a counter. */
const MAX_DOTS = 6

const showDots = computed(() => pageCount.value <= MAX_DOTS)
</script>

<template>
  <div
    class="carousel"
    :class="`carousel--${tone}`"
    :style="{ '--per-view-desktop': perView }"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
  >
    <div
      ref="trackRef"
      class="carousel__viewport"
      role="group"
      :aria-label="label"
      tabindex="0"
      @keydown.left.prevent="prev"
      @keydown.right.prevent="next"
    >
      <slot />
    </div>

    <p class="visually-hidden" role="status" aria-live="polite">
      Página {{ activeIndex + 1 }} de {{ pageCount }}
    </p>

    <div v-if="pageCount > 1" class="carousel__controls">
      <button
        type="button"
        class="carousel__arrow"
        :disabled="!canPrev"
        aria-label="Anterior"
        @click="prev"
      >
        <AppIcon name="chevron-left" :size="20" />
      </button>

      <div v-if="showDots" class="carousel__dots">
        <button
          v-for="page in pageCount"
          :key="page"
          type="button"
          class="carousel__dot"
          :class="{ 'carousel__dot--active': activeIndex === page - 1 }"
          :aria-label="`Ir a la página ${page}`"
          :aria-current="activeIndex === page - 1 ? 'true' : undefined"
          @click="goTo(page - 1)"
        />
      </div>

      <!-- Twelve identical dots say nothing and overflow the row on mobile. -->
      <p v-else class="carousel__counter" aria-hidden="true">
        <span class="carousel__counter-current">{{ activeIndex + 1 }}</span>
        <span class="carousel__counter-sep">/</span>
        {{ pageCount }}
      </p>

      <button
        type="button"
        class="carousel__arrow"
        :disabled="!canNext"
        aria-label="Siguiente"
        @click="next"
      >
        <AppIcon name="chevron-right" :size="20" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  --gap: var(--space-5);
  --per-view: 1;
  --carousel-accent: var(--rose-600);
  --carousel-accent-soft: var(--rose-200);
  --carousel-accent-hover: var(--rose-400);
}

.carousel--caramel {
  --carousel-accent: var(--caramel-700);
  --carousel-accent-soft: var(--caramel-200);
  --carousel-accent-hover: var(--caramel-500);
}

@media (min-width: 641px) {
  .carousel {
    --per-view: 2;
  }
}

@media (min-width: 1025px) {
  .carousel {
    --per-view: var(--per-view-desktop, 3);
  }
}

.carousel__viewport {
  display: grid;
  grid-auto-flow: column;
  /* Splits the visible width across the cards on show, minus the gaps. */
  grid-auto-columns: calc((100% - (var(--per-view) - 1) * var(--gap)) / var(--per-view));
  gap: var(--gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  /* Vertical breathing room so raised card shadows are not clipped, offset by
     a negative margin. Horizontal padding stays at zero on purpose: it counts
     towards `scrollWidth` and would leave the last page short of a clean snap. */
  padding-block: 0.5rem 1rem;
  margin-block: -0.5rem -1rem;
  scrollbar-width: none;
}

.carousel__viewport::-webkit-scrollbar {
  display: none;
}

.carousel__viewport > :deep(*) {
  scroll-snap-align: start;
  min-width: 0;
}

/* ── Controls ── */

.carousel__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-block-start: var(--space-8);
}

.carousel__arrow {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  /* Otherwise the control row absorbs overflow by shrinking these buttons. */
  flex-shrink: 0;
  border: 1px solid var(--color-border-strong);
  border-radius: 50%;
  background-color: var(--surface-raised);
  color: var(--carousel-accent);
  box-shadow: var(--shadow-xs);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    opacity var(--duration-fast) var(--ease-out);
}

.carousel__arrow:hover:not(:disabled) {
  background-color: var(--carousel-accent);
  border-color: var(--carousel-accent);
  color: #fff;
}

.carousel__arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.carousel__dots {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
}

/* ── Counter ── */

.carousel__counter {
  min-width: 4rem;
  font-size: var(--text-sm);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: var(--color-muted);
}

.carousel__counter-current {
  font-size: var(--text-md);
  color: var(--carousel-accent);
}

.carousel__counter-sep {
  margin-inline: 0.25rem;
  color: var(--carousel-accent-soft);
}

/* The visible dot is 8px but the button spans 24×24, meeting the WCAG 2.5.8
   target size without inflating the indicator. */
.carousel__dot {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.carousel__dot::before {
  content: '';
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-pill);
  background-color: var(--carousel-accent-soft);
  transition:
    width var(--duration-base) var(--ease-out),
    background-color var(--duration-base) var(--ease-out);
}

.carousel__dot:hover::before {
  background-color: var(--carousel-accent-hover);
}

/* The active dot stretches rather than only changing colour, so position is
   readable without distinguishing two shades. */
.carousel__dot--active::before {
  width: 1.25rem;
  background-color: var(--carousel-accent);
}
</style>
