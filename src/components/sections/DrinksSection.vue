<script setup>
/** Menu carousel. */

import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import AppCarousel from '@/components/ui/AppCarousel.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { drinks } from '@/data/drinks.js'

const sectionRef = ref(null)
useScrollReveal(sectionRef)
</script>

<template>
  <section id="drinks" ref="sectionRef" class="drinks section reveal">
    <div class="container">
      <SectionHeader
        eyebrow="La carta"
        title="Seis recetas que sólo existen acá"
        subtitle="Rotan cada temporada. Estas son las que llevan más tiempo en pizarra."
      />

      <AppCarousel label="Carta de bebidas y repostería">
        <ProductCard v-for="drink in drinks" :key="drink.id" :product="drink" />
      </AppCarousel>

      <div class="drinks__footer">
        <!-- The only link out to the PDF, labelled as a download so it is never
             confused with the in-page menu. -->
        <a href="/docs/menu.pdf" class="btn btn--secondary" download>
          Descargar la carta completa
          <AppIcon name="arrow-down" :size="16" />
          <span class="visually-hidden">(PDF)</span>
        </a>
        <p class="drinks__note">Precios en pesos chilenos, IVA incluido.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.drinks {
  background-color: var(--surface-blush);
}

.drinks__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin-block-start: var(--space-10);
}

.drinks__note {
  font-size: var(--text-xs);
  color: var(--color-muted);
}
</style>
