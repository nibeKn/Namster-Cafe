<script setup>
/** Editorial strip of concrete, verifiable numbers about the venue. */

import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

const sectionRef = ref(null)
useScrollReveal(sectionRef)

const stats = [
  { value: '2019', label: 'Abrimos en Avenida Italia' },
  { value: '12', label: 'Cafés de origen en carta' },
  { value: '7', label: 'Hámsters residentes, todos con nombre' },
  { value: '45 min', label: 'Promedio de entrega a domicilio' },
]
</script>

<template>
  <section ref="sectionRef" class="stats reveal" aria-label="El local en cifras">
    <div class="container">
      <dl class="stats__grid">
        <div v-for="stat in stats" :key="stat.label" class="stats__item">
          <dt class="stats__value">{{ stat.value }}</dt>
          <dd class="stats__label">{{ stat.label }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.stats {
  padding-block: var(--space-16);
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  padding-block: var(--space-8);
  border-block: 1px solid var(--color-border);
}

.stats__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-inline: var(--space-4);
  /* A rule instead of four shadowed cards: the strip reads as one unit. */
  border-inline-start: 1px solid var(--color-border);
}

.stats__item:first-child {
  border-inline-start: none;
  padding-inline-start: 0;
}

.stats__value {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--rose-600);
}

.stats__label {
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
  color: var(--color-muted);
  text-wrap: balance;
}

@media (max-width: 860px) {
  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-8) var(--space-4);
  }

  /* With two columns, the first item of each row drops its divider. */
  .stats__item:nth-child(odd) {
    border-inline-start: none;
    padding-inline-start: 0;
  }
}

@media (max-width: 420px) {
  .stats__grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .stats__item {
    border-inline-start: none;
    padding-inline-start: 0;
  }
}
</style>
