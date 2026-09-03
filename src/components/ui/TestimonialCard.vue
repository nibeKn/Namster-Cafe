<script setup>
/**
 * A single customer review.
 *
 * @prop {object} testimonial - Review data.
 */

import StarRating from './StarRating.vue'

defineProps({
  testimonial: { type: Object, required: true },
})
</script>

<template>
  <article class="review">
    <span class="review__quote" aria-hidden="true">&rdquo;</span>

    <div class="review__head">
      <StarRating :rating="testimonial.rating" />
      <p class="review__tag">{{ testimonial.tag }}</p>
    </div>

    <blockquote class="review__text">{{ testimonial.text }}</blockquote>

    <footer class="review__author">
      <img
        :src="testimonial.avatar"
        :alt="`Fotografía de ${testimonial.name}`"
        class="review__avatar"
        width="40"
        height="40"
        loading="lazy"
        decoding="async"
      />
      <div>
        <p class="review__name">{{ testimonial.name }}</p>
        <p class="review__date">{{ testimonial.date }}</p>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.review {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
  padding: var(--space-6);
  background-color: var(--surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition:
    transform var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}

.review:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

/* Oversized typographic quote mark — no network request, no reading space. */
.review__quote {
  position: absolute;
  inset-block-start: -0.35em;
  inset-inline-end: 0.25em;
  font-family: var(--font-display);
  font-size: 7rem;
  line-height: 1;
  color: var(--rose-100);
  pointer-events: none;
  user-select: none;
}

.review__head {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.review__tag {
  padding: 0.25rem 0.625rem;
  background-color: var(--rose-100);
  border-radius: var(--radius-pill);
  font-size: var(--text-2xs);
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--rose-700);
}

.review__text {
  position: relative;
  flex: 1;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--ink-700);
}

.review__author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--color-border);
}

.review__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.review__name {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--ink-900);
}

.review__date {
  font-size: var(--text-xs);
  color: var(--color-muted);
}
</style>
