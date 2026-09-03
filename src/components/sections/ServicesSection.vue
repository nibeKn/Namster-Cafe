<script setup>
/** Services grid over a CSS-only textured backdrop. */

import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import ServiceCard from '@/components/ui/ServiceCard.vue'
import { services } from '@/data/services.js'

const sectionRef = ref(null)
useScrollReveal(sectionRef)
</script>

<template>
  <section id="services" ref="sectionRef" class="services section reveal">
    <div class="services__backdrop" aria-hidden="true"></div>

    <div class="container">
      <SectionHeader
        eyebrow="Servicios"
        title="Tres formas de pasar por acá"
        subtitle="Siéntate en el salón, aparta tu mesa con antelación o recíbelo en casa."
      />

      <div class="services__grid">
        <ServiceCard v-for="service in services" :key="service.id" :service="service" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.services__backdrop {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    radial-gradient(circle at 12% 8%, var(--rose-50), transparent 45%),
    radial-gradient(circle at 88% 82%, var(--caramel-100), transparent 42%),
    /* 1px dot grid: texture without a network request. */
    radial-gradient(circle at center, var(--rose-200) 1px, transparent 1px);
  background-size:
    100% 100%,
    100% 100%,
    28px 28px;
  opacity: 0.75;
  /* Fades the grid towards the edges so it never ends abruptly. */
  mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, #000 45%, transparent 100%);
}

.services__grid {
  display: grid;
  /* `auto-fit` drops from three to two to one column on its own. */
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  gap: var(--space-6);
}

.services__container {
  position: relative;
}

@media (max-width: 640px) {
  .services__grid {
    gap: var(--space-4);
  }
}
</style>
