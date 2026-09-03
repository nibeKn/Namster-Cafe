<script setup>
/** Sector picker and booking form. The sector cards are the radio group, so
 * the sector is asked for exactly once. */

import { ref, computed, watch } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import SectorCard from '@/components/ui/SectorCard.vue'
import FormField from '@/components/ui/FormField.vue'
import AppImage from '@/components/ui/AppImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { sectors } from '@/data/sectors.js'
import { brand } from '@/data/media.js'
import { useForm, required, email, phone, notInThePast } from '@/composables/useForm.js'

const sectionRef = ref(null)
const formRef = ref(null)
useScrollReveal(sectionRef)

/** Blocks past dates in the native picker itself. */
const today = computed(() => new Date().toISOString().split('T')[0])

const TIME_SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30']

const { values, isSubmitting, isSuccessful, errorFor, handleBlur, handleInput, submit, reset } =
  useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      guests: '',
      sector: '',
      date: '',
      time: '',
    },
    validators: {
      name: required('Necesitamos un nombre para la reserva'),
      email: (value) => required('Sin correo no podemos confirmarte')(value) || email()(value),
      phone: phone(),
      guests: required('Indica cuántas personas vienen'),
      sector: required('Elige uno de los cuatro sectores'),
      date: (value) => required('Elige el día de la visita')(value) || notInThePast()(value),
      time: required('Elige una hora'),
    },
    /* No backend yet; the delay makes the submitting state perceptible. This is
       the only line to change when an API is wired in. */
    onSubmit: () => new Promise((resolve) => setTimeout(resolve, 700)),
  })

/* A radio group fires no `blur` on mouse selection, so mark it visited on
   change to clear the error. */
watch(
  () => values.sector,
  () => handleBlur('sector'),
)

/** Human-readable summary for the confirmation screen. */
const summary = computed(() => {
  const date = values.date
    ? new Date(`${values.date}T00:00:00`).toLocaleDateString('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : ''
  return `${values.sector} · ${date} a las ${values.time} · ${values.guests} personas`
})
</script>

<template>
  <section id="reservation" ref="sectionRef" class="reservation section reveal">
    <div class="container">
      <SectionHeader
        eyebrow="Reservas"
        title="Aparta tu mesa"
        subtitle="Confirmamos por correo en menos de una hora, dentro del horario de atención."
      />

      <div class="reservation__layout">
        <div class="reservation__aside">
          <fieldset class="sectors">
            <legend class="sectors__legend">
              Elige el sector
              <span class="sectors__hint">Puedes cambiarlo al llegar según disponibilidad.</span>
            </legend>

            <div class="sectors__grid">
              <SectorCard
                v-for="sector in sectors"
                :key="sector.id"
                v-model="values.sector"
                :sector="sector"
                name="sector"
              />
            </div>

            <p v-if="errorFor('sector')" class="form__error" role="alert">
              <AppIcon name="alert-circle" :size="14" />
              {{ errorFor('sector') }}
            </p>
          </fieldset>

          <aside class="promo">
            <AppImage
              :path="brand.love"
              alt=""
              :width="64"
              :height="64"
              :blur-up="false"
              fit="contain"
            />
            <div>
              <h3 class="promo__title">¿Es un cumpleaños?</h3>
              <p class="promo__text">
                Escríbenos con tres días de antelación y preparamos la mesa con decoración, torta a
                pedido y una madriguera de visita.
              </p>
            </div>
          </aside>
        </div>

        <div class="reservation__panel">
          <!-- Replaces the form rather than stacking under it, which also
               prevents accidental resubmission. -->
          <div v-if="isSuccessful" class="form__success" role="status">
            <AppIcon name="check" :size="20" />
            <div>
              <p class="form__success-title">Reserva registrada</p>
              <p class="form__success-text">
                {{ summary }}. Te enviamos la confirmación a {{ values.email }}.
              </p>
              <button type="button" class="btn btn--secondary confirm__again" @click="reset">
                Hacer otra reserva
              </button>
            </div>
          </div>

          <form v-else ref="formRef" class="form" novalidate @submit.prevent="submit(formRef)">
            <h3 class="panel__title">Tus datos</h3>

            <div class="form__row">
              <FormField id="res-name" v-slot="f" label="Nombre completo" :error="errorFor('name')">
                <input
                  :id="f.id"
                  v-model="values.name"
                  name="name"
                  type="text"
                  class="form__input"
                  autocomplete="name"
                  :aria-describedby="f.describedBy"
                  :aria-invalid="f.invalid"
                  @blur="handleBlur('name')"
                  @input="handleInput('name')"
                />
              </FormField>

              <FormField id="res-email" v-slot="f" label="Correo" :error="errorFor('email')">
                <input
                  :id="f.id"
                  v-model="values.email"
                  name="email"
                  type="email"
                  class="form__input"
                  autocomplete="email"
                  inputmode="email"
                  :aria-describedby="f.describedBy"
                  :aria-invalid="f.invalid"
                  @blur="handleBlur('email')"
                  @input="handleInput('email')"
                />
              </FormField>
            </div>

            <div class="form__row">
              <FormField
                id="res-phone"
                v-slot="f"
                label="Teléfono"
                optional
                :error="errorFor('phone')"
              >
                <input
                  :id="f.id"
                  v-model="values.phone"
                  name="phone"
                  type="tel"
                  class="form__input"
                  autocomplete="tel"
                  inputmode="tel"
                  placeholder="+56 9 1234 5678"
                  :aria-describedby="f.describedBy"
                  :aria-invalid="f.invalid"
                  @blur="handleBlur('phone')"
                  @input="handleInput('phone')"
                />
              </FormField>

              <FormField id="res-guests" v-slot="f" label="Personas" :error="errorFor('guests')">
                <select
                  :id="f.id"
                  v-model="values.guests"
                  name="guests"
                  class="form__input"
                  :aria-describedby="f.describedBy"
                  :aria-invalid="f.invalid"
                  @change="handleBlur('guests')"
                >
                  <option value="" disabled>Seleccionar</option>
                  <option v-for="n in 11" :key="n" :value="String(n + 1)">{{ n + 1 }}</option>
                </select>
              </FormField>
            </div>

            <div class="form__row">
              <FormField id="res-date" v-slot="f" label="Fecha" :error="errorFor('date')">
                <input
                  :id="f.id"
                  v-model="values.date"
                  name="date"
                  type="date"
                  class="form__input"
                  :min="today"
                  :aria-describedby="f.describedBy"
                  :aria-invalid="f.invalid"
                  @blur="handleBlur('date')"
                  @input="handleInput('date')"
                />
              </FormField>

              <FormField id="res-time" v-slot="f" label="Hora" :error="errorFor('time')">
                <select
                  :id="f.id"
                  v-model="values.time"
                  name="time"
                  class="form__input"
                  :aria-describedby="f.describedBy"
                  :aria-invalid="f.invalid"
                  @change="handleBlur('time')"
                >
                  <option value="" disabled>Seleccionar</option>
                  <option v-for="slot in TIME_SLOTS" :key="slot" :value="slot">{{ slot }}</option>
                </select>
              </FormField>
            </div>

            <button
              type="submit"
              class="btn btn--primary btn--block btn--lg"
              :disabled="isSubmitting"
            >
              <AppIcon v-if="!isSubmitting" name="calendar" :size="18" />
              {{ isSubmitting ? 'Enviando…' : 'Confirmar reserva' }}
            </button>

            <p class="form__note">Guardamos tus datos sólo para gestionar esta reserva.</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reservation {
  background-color: var(--surface-blush);
}

.reservation__layout {
  display: grid;
  /* The form column gets the extra width: it is where the task happens, and
     at 1fr/1fr the paired fields end up too narrow. */
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: var(--space-10);
  align-items: start;
}

.reservation__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* ── Sectors ── */

.sectors {
  border: none;
}

.sectors__legend {
  display: block;
  margin-block-end: var(--space-4);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--ink-900);
}

.sectors__hint {
  display: block;
  margin-block-start: var(--space-1);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-muted);
}

.sectors__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: var(--space-3);
}

/* ── Promo ── */

.promo {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-5);
  background-color: var(--surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.promo :deep(img) {
  width: 4rem;
  height: 4rem;
  flex-shrink: 0;
}

.promo__title {
  font-size: var(--text-base);
  margin-block-end: var(--space-1);
}

.promo__text {
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
  color: var(--color-muted);
}

/* ── Form panel ── */

.reservation__panel {
  padding: var(--space-8);
  background-color: var(--surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  /* Follows the scroll alongside the shorter sector column. */
  position: sticky;
  top: calc(var(--header-h) + var(--space-4));
}

.panel__title {
  font-size: var(--text-lg);
  margin-block-end: var(--space-2);
}

.confirm__again {
  margin-block-start: var(--space-4);
}

@media (max-width: 900px) {
  .reservation__layout {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .reservation__panel {
    position: static;
    padding: var(--space-6);
  }
}

@media (max-width: 640px) {
  .reservation__panel {
    padding: var(--space-5);
  }
}
</style>
