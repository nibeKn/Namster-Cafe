<script setup>
/** Customer reviews carousel. */

import { ref, computed } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import AppCarousel from '@/components/ui/AppCarousel.vue'
import TestimonialCard from '@/components/ui/TestimonialCard.vue'
import StarRating from '@/components/ui/StarRating.vue'
import { testimonials } from '@/data/testimonials.js'

const sectionRef = ref(null)
useScrollReveal(sectionRef)

/* Derived from the reviews themselves so it cannot drift out of date. */
const averageRating = computed(() => {
  const total = testimonials.reduce((sum, review) => sum + review.rating, 0)
  return Math.round((total / testimonials.length) * 10) / 10
})
</script>

<template>
  <section id="testimonials" ref="sectionRef" class="testimonials section reveal">
    <div class="container">
      <SectionHeader
        eyebrow="Reseñas"
        title="Lo que se dice de nosotros"
        subtitle="Opiniones publicadas por quienes ya pasaron por el local."
      />

      <div class="testimonials__summary">
        <StarRating :rating="averageRating" :size="20" />
        <p class="testimonials__score">
          <strong>{{ averageRating }}</strong> sobre 5
          <span class="testimonials__count">· {{ testimonials.length }} reseñas publicadas</span>
        </p>
      </div>

      <AppCarousel label="Reseñas de clientes" :auto-play="5000">
        <TestimonialCard
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          :testimonial="testimonial"
        />
      </AppCarousel>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  background-color: var(--surface-blush);
}

.testimonials__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-block-end: var(--space-10);
  /* Pulls the summary up against the heading it belongs to. */
  margin-block-start: calc(var(--space-8) * -1);
}

.testimonials__score {
  font-size: var(--text-sm);
  color: var(--color-muted);
}

.testimonials__score strong {
  font-size: var(--text-lg);
  font-weight: 800;
  color: var(--ink-900);
}

.testimonials__count {
  color: var(--ink-400);
}

@media (max-width: 640px) {
  .testimonials__summary {
    margin-block-start: calc(var(--space-6) * -1);
  }

  .testimonials__count {
    display: block;
    width: 100%;
    text-align: center;
  }
}
</style>
