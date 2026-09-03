<script setup>
/**
 * Star rating with half-star support.
 *
 * @prop {number} rating - Score from 0 to 5.
 * @prop {number} [size=17] - Side length of each star in px.
 */

import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  rating: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 5,
  },
  size: { type: Number, default: 17 },
})

/** A position counts as half when the score reaches at least its midpoint. */
const stars = computed(() =>
  Array.from({ length: 5 }, (_, index) => {
    const position = index + 1
    if (props.rating >= position) return 'star'
    if (props.rating >= position - 0.5) return 'star-half'
    return 'star-empty'
  }),
)

/* Announced once, instead of reading out five separate icons. */
const label = computed(() => `${props.rating} de 5 estrellas`)
</script>

<template>
  <div class="rating" role="img" :aria-label="label">
    <AppIcon
      v-for="(icon, index) in stars"
      :key="index"
      :name="icon"
      :size="size"
      class="rating__star"
      :class="{ 'rating__star--empty': icon === 'star-empty' }"
    />
  </div>
</template>

<style scoped>
.rating {
  display: flex;
  gap: 0.125rem;
  color: #e8a317;
}

.rating__star--empty {
  color: var(--rose-200);
}
</style>
