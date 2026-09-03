<script setup>
/**
 * Selectable sector card built on a native radio input, so the browser provides
 * group semantics, arrow-key roving and "2 of 4 selected" announcements.
 *
 * @prop {object} sector - Sector data.
 * @prop {string} modelValue - Currently selected value in the group.
 * @prop {string} name - Shared name for the radio group.
 */

import AppImage from './AppImage.vue'

defineProps({
  sector: { type: Object, required: true },
  modelValue: { type: String, required: true },
  name: { type: String, required: true },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="sector" :class="{ 'sector--selected': modelValue === sector.value }">
    <input
      type="radio"
      class="sector__input"
      :name="name"
      :value="sector.value"
      :checked="modelValue === sector.value"
      @change="$emit('update:modelValue', sector.value)"
    />

    <span class="sector__figure">
      <AppImage
        :path="sector.icon"
        alt=""
        :width="56"
        :height="56"
        :blur-up="false"
        fit="contain"
      />
    </span>

    <span class="sector__body">
      <span class="sector__title">{{ sector.title }}</span>
      <span class="sector__desc">{{ sector.description }}</span>
      <span class="sector__capacity">{{ sector.capacity }}</span>
    </span>
  </label>
</template>

<style scoped>
.sector {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--surface-raised);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.sector:hover {
  border-color: var(--rose-300);
  box-shadow: var(--shadow-sm);
}

/* Visually hidden but still focusable — `display: none` would remove it from
   the tab order. */
.sector__input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

/* Focus ring moves to the card, which is what the user actually sees. */
.sector:has(.sector__input:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

.sector--selected {
  border-color: var(--rose-500);
  background-color: var(--rose-50);
  box-shadow: 0 0 0 3px var(--rose-100);
}

.sector__figure {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
}

.sector__body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.sector__title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--ink-900);
}

.sector__desc {
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
  color: var(--color-muted);
}

.sector__capacity {
  margin-block-start: var(--space-2);
  font-size: var(--text-2xs);
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--rose-700);
}
</style>
