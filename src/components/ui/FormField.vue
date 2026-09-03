<script setup>
/**
 * Field wrapper: label, control and error message.
 *
 * Exposes the accessible wiring through a scoped slot — `aria-describedby`,
 * `aria-invalid` and a stable id — so no usage can forget one.
 *
 * @prop {string} id - Base identifier for the field.
 * @prop {string} label - Label text.
 * @prop {string} [error] - Error message. Empty means valid.
 * @prop {boolean} [optional=false] - Marks the field as not required.
 * @prop {string} [hint] - Short clarification under the label.
 */

import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: '' },
  optional: { type: Boolean, default: false },
  hint: { type: String, default: '' },
})

const errorId = computed(() => `${props.id}-error`)
const hintId = computed(() => `${props.id}-hint`)

/* A control may be described by the hint, the error, or both. */
const describedBy = computed(() => {
  const ids = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.join(' ') || undefined
})
</script>

<template>
  <div class="field">
    <label :for="id" class="form__label">
      {{ label }}
      <span v-if="optional" class="form__optional">(opcional)</span>
    </label>

    <p v-if="hint" :id="hintId" class="field__hint">{{ hint }}</p>

    <slot :id="id" :described-by="describedBy" :invalid="error ? 'true' : undefined" />

    <p v-if="error" :id="errorId" class="form__error" role="alert">
      <AppIcon name="alert-circle" :size="14" />
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.field__hint {
  margin-block-start: calc(var(--space-1) * -1);
  font-size: var(--text-xs);
  color: var(--color-muted);
}
</style>
