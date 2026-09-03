<script setup>
/**
 * Section heading: eyebrow, title and lead paragraph.
 *
 * @prop {string} [eyebrow] - Short label above the title.
 * @prop {string} title - Section title.
 * @prop {string} [subtitle] - Lead paragraph.
 * @prop {string} [tone='rose'] - Eyebrow accent: `rose` or `caramel`.
 */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  tone: { type: String, default: 'rose' },
})
</script>

<template>
  <header class="section-header" :class="`section-header--${tone}`">
    <p v-if="eyebrow" class="eyebrow section-header__eyebrow">{{ eyebrow }}</p>
    <h2 class="section-header__title">{{ title }}</h2>
    <p v-if="subtitle" class="section-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin-block-end: var(--space-12);
  text-align: center;
}

.section-header--caramel .section-header__eyebrow {
  color: var(--caramel-700);
}

.section-header--caramel .section-header__eyebrow::before {
  background-color: var(--caramel-300);
}

.section-header__title {
  font-size: var(--text-3xl);
  max-width: 22ch;
}

.section-header__subtitle {
  max-width: 46ch;
  font-size: var(--text-lg);
  line-height: var(--leading-snug);
  color: var(--color-muted);
}
</style>
