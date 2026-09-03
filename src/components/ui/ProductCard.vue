<script setup>
/**
 * Product card for the menu and the shop.
 *
 * @prop {object} product - Product data.
 * @prop {string} [variant='rose'] - Colour accent: `rose` (menu) or `caramel` (shop).
 * @prop {string} [sizes] - Image `sizes` attribute, matching its real layout slot.
 */

import AppImage from './AppImage.vue'

defineProps({
  product: { type: Object, required: true },
  variant: { type: String, default: 'rose' },
  sizes: { type: String, default: '(min-width: 1025px) 22rem, (min-width: 641px) 45vw, 88vw' },
})
</script>

<template>
  <article class="product" :class="`product--${variant}`">
    <div class="product__media">
      <AppImage
        :path="product.image"
        :alt="product.title"
        :width="440"
        :height="440"
        :widths="[320, 440, 640, 880]"
        :sizes="sizes"
      />
    </div>

    <div class="product__body">
      <p class="product__category">{{ product.category }}</p>
      <h3 class="product__title">{{ product.title }}</h3>
      <p class="product__desc">{{ product.description }}</p>

      <ul v-if="product.tags?.length" class="product__tags">
        <li v-for="tag in product.tags" :key="tag" class="product__tag">{{ tag }}</li>
      </ul>

      <p class="product__price">{{ product.price }}</p>
    </div>
  </article>
</template>

<style scoped>
.product {
  --accent: var(--rose-600);
  --accent-soft: var(--rose-50);

  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}

.product--caramel {
  --accent: var(--caramel-700);
  --accent-soft: var(--caramel-100);
}

.product:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product__media {
  /* Reserves the box before the image arrives, so the card height never jumps. */
  aspect-ratio: 1;
  background-color: var(--accent-soft);
  overflow: hidden;
}

.product__media :deep(img) {
  width: 100%;
  height: 100%;
  transition: transform var(--duration-slow) var(--ease-out);
}

.product:hover .product__media :deep(img) {
  transform: scale(1.04);
}

.product__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-1);
  padding: var(--space-5);
}

.product__category {
  font-size: var(--text-2xs);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--accent);
}

.product__title {
  font-size: var(--text-lg);
}

.product__desc {
  margin-block-start: var(--space-2);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
  color: var(--color-muted);
}

.product__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-block-start: var(--space-3);
}

.product__tag {
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-2xs);
  font-weight: 600;
  color: var(--ink-500);
}

.product__price {
  margin-block-start: auto;
  padding-block-start: var(--space-4);
  font-size: var(--text-xl);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--ink-900);
  /* Aligns digits across neighbouring cards. */
  font-variant-numeric: tabular-nums;
}
</style>
