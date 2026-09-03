<script setup>
/**
 * Inline SVG icons, drawn on a 24×24 canvas and inheriting `currentColor`.
 *
 * @prop {string} name - Key in the icon set.
 * @prop {number|string} [size=24] - Side length in px.
 * @prop {string} [title] - When set, the icon is exposed as an image with this
 *   accessible name. Omitted, it is hidden from screen readers.
 */

import { computed } from 'vue'

/** `fill` marks solid icons; `half` renders a half-filled star. */
const icons = {
  menu: { d: 'M4 7h16M4 12h16M4 17h16' },
  close: { d: 'M6 6l12 12M18 6L6 18' },
  'chevron-left': { d: 'M15 5l-7 7 7 7' },
  'chevron-right': { d: 'M9 5l7 7-7 7' },
  'arrow-right': { d: 'M4 12h15m0 0l-6-6m6 6l-6 6' },
  'arrow-down': { d: 'M12 4v15m0 0l-6-6m6 6l6-6' },
  star: {
    d: 'M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5z',
    fill: true,
  },
  'star-half': {
    d: 'M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5z',
    half: true,
  },
  'star-empty': {
    d: 'M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5z',
  },
  'map-pin': {
    d: 'M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 10-13 0C5.5 15.6 12 21 12 21zM12 13a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8z',
  },
  calendar: { d: 'M4.5 6.5h15v13h-15v-13zM8 3.5v4M16 3.5v4M4.5 11h15' },
  clock: { d: 'M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17zM12 7.5V12l3 2' },
  phone: {
    d: 'M20 16.9v2.6a1.4 1.4 0 01-1.55 1.4 16.6 16.6 0 01-7.2-2.57 16.3 16.3 0 01-5-5A16.6 16.6 0 013.68 6.1 1.4 1.4 0 015.07 4.5h2.6a1.4 1.4 0 011.4 1.2c.09.68.25 1.34.48 1.97a1.4 1.4 0 01-.32 1.48l-1.1 1.1a13.4 13.4 0 005 5l1.1-1.1a1.4 1.4 0 011.48-.31c.63.23 1.29.39 1.97.48a1.4 1.4 0 011.2 1.42z',
  },
  mail: { d: 'M4 6.5h16v11H4v-11zM4 7l8 6 8-6' },
  check: { d: 'M5 12.5l4.5 4.5L19 7.5' },
  'alert-circle': { d: 'M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17zM12 8v5M12 16h.01' },
}

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  title: { type: String, default: '' },
})

const icon = computed(() => icons[props.name] ?? icons['alert-circle'])
const isDecorative = computed(() => !props.title)
</script>

<template>
  <svg
    class="app-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="icon.fill ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="isDecorative ? undefined : 'img'"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-label="title || undefined"
    focusable="false"
  >
    <!-- Half star: a hard two-stop gradient fills the left side only. -->
    <defs v-if="icon.half">
      <linearGradient id="half-star-fill">
        <stop offset="50%" stop-color="currentColor" />
        <stop offset="50%" stop-color="transparent" />
      </linearGradient>
    </defs>
    <path :d="icon.d" :fill="icon.half ? 'url(#half-star-fill)' : undefined" />
  </svg>
</template>

<style scoped>
.app-icon {
  display: block;
  flex-shrink: 0;
}
</style>
