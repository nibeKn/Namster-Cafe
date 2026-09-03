<script setup>
/**
 * Responsive Cloudinary image with reserved layout space.
 *
 * Requests the right-sized `f_auto,q_auto` variant, publishes `width`/`height`
 * so the box is reserved before the download starts, and fades in over a tiny
 * blurred placeholder.
 *
 * @prop {string} path - Versioned Cloudinary path, e.g. `v1786693647/logo.png`.
 * @prop {string} alt - Alternative text. Empty string for decorative images.
 * @prop {number} width - Reference width in px; drives the `srcset` and aspect ratio.
 * @prop {number} height - Reference height in px.
 * @prop {number[]} [widths] - `srcset` widths. Defaults to 1x and 2x of `width`.
 * @prop {string} [sizes] - `sizes` attribute. Defaults to the fixed width in px.
 * @prop {boolean} [priority=false] - Eager, high-priority load.
 * @prop {boolean} [blurUp=true] - Blurred placeholder while downloading.
 * @prop {string} [fit='cover'] - `object-fit` within the box.
 */

import { computed, ref } from 'vue'
import { cldUrl, cldSrcset, cldPlaceholder } from '@/lib/cloudinary.js'

const props = defineProps({
  path: { type: String, required: true },
  alt: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  widths: { type: Array, default: null },
  sizes: { type: String, default: '' },
  priority: { type: Boolean, default: false },
  blurUp: { type: Boolean, default: true },
  fit: { type: String, default: 'cover' },
})

const isLoaded = ref(false)

const srcsetWidths = computed(() => props.widths ?? [props.width, props.width * 2])
const srcset = computed(() => cldSrcset(props.path, srcsetWidths.value))

/** Fallback for browsers without `srcset`: the largest variant. */
const src = computed(() => cldUrl(props.path, { width: Math.max(...srcsetWidths.value) }))

const sizesAttr = computed(() => props.sizes || `${props.width}px`)

/** Dropped once the real image paints, so no placeholder stays in memory. */
const placeholderStyle = computed(() => {
  if (!props.blurUp || isLoaded.value) return null
  return { backgroundImage: `url("${cldPlaceholder(props.path)}")` }
})
</script>

<template>
  <img
    :src="src"
    :srcset="srcset"
    :sizes="sizesAttr"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async"
    class="app-image"
    :class="{ 'app-image--loaded': isLoaded }"
    :style="[placeholderStyle, { objectFit: fit }]"
    @load="isLoaded = true"
  />
</template>

<style scoped>
.app-image {
  display: block;
  max-width: 100%;
  height: auto;
  background-size: cover;
  background-position: center;
  transition: opacity 0.45s ease;
}

/* Starts just below full opacity so the fade reads on fast loads, without
   hiding the image should `load` never fire. */
.app-image:not(.app-image--loaded) {
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .app-image {
    transition: none;
  }

  .app-image:not(.app-image--loaded) {
    opacity: 1;
  }
}
</style>
