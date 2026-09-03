import { reactive, ref, computed } from 'vue'

const IDLE = 'idle'
const SUBMITTING = 'submitting'
const SUCCESS = 'success'

/**
 * Form state, validation and submission.
 *
 * Interaction rules: a field shows its error only after it is left (`blur`) or
 * a submit is attempted; once flagged it revalidates on every keystroke so the
 * message clears as soon as the input is fixed. Submitting an invalid form
 * moves focus to the first offending field.
 *
 * @param {object} config
 * @param {object} config.initialValues - Initial value per field.
 * @param {Object<string, Function>} config.validators - Field to validator, each
 *   receiving `(value, values)` and returning an error message or an empty string.
 * @param {Function} [config.onSubmit] - Async effect run once the form validates.
 */
export function useForm({ initialValues, validators, onSubmit }) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  const status = ref(IDLE)

  const isSubmitting = computed(() => status.value === SUBMITTING)
  const isSuccessful = computed(() => status.value === SUCCESS)

  /**
   * @param {string} field
   * @returns {string} Error message, empty when valid.
   */
  function validateField(field) {
    const validator = validators[field]
    const message = validator ? validator(values[field], values) : ''
    errors[field] = message
    return message
  }

  /**
   * Validates every field. Uses `map` before checking the result because
   * `every` short-circuits, which would leave later fields unvalidated.
   *
   * @returns {boolean}
   */
  function validateAll() {
    const messages = Object.keys(validators).map((field) => validateField(field))
    return messages.every((message) => message === '')
  }

  /** Marks a field as visited and validates it. */
  function handleBlur(field) {
    touched[field] = true
    validateField(field)
  }

  /** Revalidates while typing, but only once the field has shown an error. */
  function handleInput(field) {
    if (touched[field]) validateField(field)
  }

  /**
   * @param {string} field
   * @returns {string} Error to display, empty until the field has been visited.
   */
  function errorFor(field) {
    return touched[field] ? errors[field] || '' : ''
  }

  /** Returns the form to its initial state. */
  function reset() {
    Object.assign(values, initialValues)
    for (const key of Object.keys(errors)) errors[key] = ''
    for (const key of Object.keys(touched)) touched[key] = false
    status.value = IDLE
  }

  /**
   * @param {HTMLFormElement} [formEl] - Form element, used to focus the first
   *   invalid control.
   */
  async function submit(formEl) {
    for (const field of Object.keys(validators)) touched[field] = true

    if (!validateAll()) {
      const firstInvalid = Object.keys(validators).find((field) => errors[field])
      if (firstInvalid && formEl) {
        formEl.querySelector(`[name="${firstInvalid}"]`)?.focus()
      }
      return
    }

    status.value = SUBMITTING
    try {
      await onSubmit?.(values)
      status.value = SUCCESS
    } catch {
      /* No backend yet. Wire a failure state here when one is connected. */
      status.value = IDLE
    }
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isSuccessful,
    errorFor,
    handleBlur,
    handleInput,
    submit,
    reset,
  }
}

/* ── Reusable validators ── */

/** @param {string} [message] @returns {(value: string) => string} */
export const required =
  (message = 'Este campo es obligatorio') =>
  (value) =>
    String(value ?? '').trim() ? '' : message

/** Deliberately permissive: checks the general shape without replicating RFC 5322. */
export const email =
  (message = 'Revisa el formato del correo') =>
  (value) => {
    const raw = String(value ?? '').trim()
    if (!raw) return ''
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw) ? '' : message
  }

/** Accepts spaces, dashes and an international prefix. */
export const phone =
  (message = 'Ingresa un teléfono válido') =>
  (value) => {
    const raw = String(value ?? '').trim()
    if (!raw) return ''
    return /^\+?[\d\s()-]{8,18}$/.test(raw) ? '' : message
  }

/** Rejects dates before today. */
export const notInThePast =
  (message = 'Elige una fecha a partir de hoy') =>
  (value) => {
    if (!value) return ''
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(`${value}T00:00:00`) >= today ? '' : message
  }

export const minLength = (min, message) => (value) => {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  return raw.length >= min ? '' : message || `Escribe al menos ${min} caracteres`
}
