<script setup>
/**
 * Service card: illustration, details and a single action.
 *
 * @prop {object} service - Service data.
 */

import AppImage from './AppImage.vue'
import AppIcon from './AppIcon.vue'

defineProps({
  service: { type: Object, required: true },
})
</script>

<template>
  <article class="service" :class="`service--${service.accent}`">
    <div class="service__figure">
      <AppImage
        :path="service.icon"
        alt=""
        :width="112"
        :height="112"
        :blur-up="false"
        fit="contain"
      />
    </div>

    <div class="service__body">
      <h3 class="service__title">{{ service.title }}</h3>
      <p class="service__tag">{{ service.tag }}</p>
      <p class="service__text">{{ service.description }}</p>

      <ul class="service__features">
        <li v-for="feature in service.features" :key="feature" class="service__feature">
          <AppIcon name="check" :size="16" class="service__check" />
          <span>{{ feature }}</span>
        </li>
      </ul>

      <a :href="service.cta.href" class="service__action">
        {{ service.cta.label }}
        <AppIcon name="arrow-right" :size="16" class="service__arrow" />
      </a>
    </div>
  </article>
</template>

<style scoped>
.service {
  /* Each accent redefines this pair; every other rule reads from it. */
  --accent: var(--rose-600);
  --accent-soft: var(--rose-100);

  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out),
    border-color var(--duration-base) var(--ease-out);
}

.service--plum {
  --accent: #7c4d9a;
  --accent-soft: #f2ebf7;
}

.service--caramel {
  --accent: var(--caramel-700);
  --accent-soft: var(--caramel-100);
}

/* Top rule appears on hover or focus only, so the grid stays calm at rest. */
.service::before {
  content: '';
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  height: 3px;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-base) var(--ease-out);
}

.service:hover,
.service:focus-within {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.service:hover::before,
.service:focus-within::before {
  transform: scaleX(1);
}

.service__figure {
  display: grid;
  place-items: center;
  padding: var(--space-8) var(--space-6) var(--space-4);
  background: radial-gradient(circle at 50% 30%, var(--accent-soft), transparent 70%);
}

.service__figure :deep(img) {
  width: 7rem;
  height: 7rem;
  transition: transform var(--duration-slow) var(--ease-spring);
}

.service:hover .service__figure :deep(img) {
  transform: translateY(-4px) rotate(-4deg);
}

.service__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-2);
  padding: 0 var(--space-6) var(--space-6);
}

.service__title {
  font-size: var(--text-xl);
}

.service__tag {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--accent);
}

.service__text {
  margin-block-start: var(--space-1);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-muted);
}

.service__features {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-block: var(--space-4);
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--color-border);
}

.service__feature {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--ink-700);
}

.service__check {
  margin-block-start: 0.15em;
  color: var(--accent);
}

.service__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  /* 44px minimum touch target. */
  min-height: 2.75rem;
  margin-block-start: auto;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  background-color: var(--accent-soft);
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: 600;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.service__action:hover {
  background-color: var(--accent);
  color: #fff;
}

.service__arrow {
  transition: transform var(--duration-base) var(--ease-out);
}

.service__action:hover .service__arrow {
  transform: translateX(3px);
}

@media (max-width: 640px) {
  .service__figure {
    padding-block: var(--space-6) var(--space-3);
  }

  .service__figure :deep(img) {
    width: 5.5rem;
    height: 5.5rem;
  }

  .service__body {
    padding-inline: var(--space-5);
    padding-block-end: var(--space-5);
  }
}
</style>
