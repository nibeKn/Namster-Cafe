<script setup>
/** Shop products carousel. */

import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import AppCarousel from '@/components/ui/AppCarousel.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { merchProducts } from '@/data/merch.js'

const sectionRef = ref(null)
useScrollReveal(sectionRef)
</script>

<template>
  <section id="merch" ref="sectionRef" class="merch section reveal">
    <div class="container">
      <SectionHeader
        eyebrow="Tienda"
        tone="caramel"
        title="Para llevarse a casa"
        subtitle="Se venden en la barra y también los despachamos junto con el pedido de delivery."
      />

      <AppCarousel label="Productos de la tienda" tone="caramel">
        <ProductCard
          v-for="product in merchProducts"
          :key="product.id"
          :product="product"
          variant="caramel"
        />
      </AppCarousel>

      <div class="merch__footer">
        <a href="#contact" class="btn btn--caramel">
          Consultar disponibilidad
          <AppIcon name="arrow-right" :size="16" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.merch__footer {
  display: flex;
  justify-content: center;
  margin-block-start: var(--space-10);
}
</style>
