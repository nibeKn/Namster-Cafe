<script setup>
/** Contact details, message form, venue gallery and location. */

import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { useOpeningHours } from '@/composables/useOpeningHours.js'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import AppCarousel from '@/components/ui/AppCarousel.vue'
import AppImage from '@/components/ui/AppImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import FormField from '@/components/ui/FormField.vue'
import { contactIcons, socialIcons, venuePhotos } from '@/data/media.js'
import { business, socialProfiles } from '@/data/business.js'
import { useForm, required, email, phone, minLength } from '@/composables/useForm.js'

const sectionRef = ref(null)
const formRef = ref(null)
useScrollReveal(sectionRef)

const { label: openingLabel } = useOpeningHours()

const contactDetails = [
  {
    icon: contactIcons.location,
    label: 'Dirección',
    value: business.address,
    href: business.mapsUrl,
    external: true,
  },
  {
    icon: contactIcons.phone,
    label: 'Teléfono',
    value: business.phone.display,
    href: business.phone.href,
  },
  {
    icon: contactIcons.mail,
    label: 'Correo',
    value: business.email,
    href: `mailto:${business.email}`,
  },
  { icon: contactIcons.clock, label: 'Horario', value: business.hours },
]

const socialLinks = socialProfiles.map((profile) => ({
  ...profile,
  icon: socialIcons[profile.id],
}))

const gallery = [
  { path: venuePhotos.facade, alt: 'Fachada del Ñamster Café desde la vereda de Avenida Italia' },
  { path: venuePhotos.view1, alt: 'Salón principal con mesas de madera y sillas en tonos pastel' },
  {
    path: venuePhotos.view2,
    alt: 'Rincón de lectura junto a la ventana, con estanterías y plantas',
  },
  { path: venuePhotos.view3, alt: 'Barra de café con la vitrina de repostería del día' },
]

/* The Google Maps iframe is hundreds of kilobytes of third-party JavaScript
   and cookies, so it only mounts once the visitor asks for it. */
const isMapLoaded = ref(false)

const { values, isSubmitting, isSuccessful, errorFor, handleBlur, handleInput, submit, reset } =
  useForm({
    initialValues: { name: '', email: '', phone: '', message: '' },
    validators: {
      name: required('¿Cómo te llamamos?'),
      email: (value) => required('Necesitamos un correo para responderte')(value) || email()(value),
      phone: phone(),
      message: (value) =>
        required('Cuéntanos en qué podemos ayudarte')(value) ||
        minLength(12, 'Escribe un poco más para poder ayudarte')(value),
    },
    onSubmit: () => new Promise((resolve) => setTimeout(resolve, 700)),
  })
</script>

<template>
  <section id="contact" ref="sectionRef" class="contact section reveal">
    <div class="container">
      <SectionHeader
        eyebrow="Contacto"
        title="Escríbenos o pásate"
        subtitle="Respondemos los correos dentro del horario de atención, de lunes a domingo."
      />

      <div class="contact__layout">
        <div class="details">
          <ul class="details__list">
            <li v-for="item in contactDetails" :key="item.label" class="detail">
              <span class="detail__icon">
                <AppImage
                  :path="item.icon"
                  alt=""
                  :width="44"
                  :height="44"
                  :blur-up="false"
                  fit="contain"
                />
              </span>
              <span class="detail__body">
                <span class="detail__label">{{ item.label }}</span>
                <a
                  v-if="item.href"
                  :href="item.href"
                  class="detail__value detail__value--link"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noopener' : undefined"
                >
                  {{ item.value }}
                </a>
                <span v-else class="detail__value">{{ item.value }}</span>
                <span v-if="item.label === 'Horario'" class="detail__status">{{
                  openingLabel
                }}</span>
              </span>
            </li>
          </ul>

          <div class="social">
            <h3 class="social__title">Síguenos</h3>
            <ul class="social__list">
              <li v-for="link in socialLinks" :key="link.label">
                <a
                  :href="link.href"
                  class="social__link"
                  target="_blank"
                  rel="noopener"
                  :aria-label="`${link.label} de Ñamster Café`"
                >
                  <AppImage
                    :path="link.icon"
                    alt=""
                    :width="28"
                    :height="28"
                    :blur-up="false"
                    fit="contain"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="contact__panel">
          <div v-if="isSuccessful" class="form__success" role="status">
            <AppIcon name="check" :size="20" />
            <div>
              <p class="form__success-title">Mensaje enviado</p>
              <p class="form__success-text">
                Te respondemos a {{ values.email }} dentro del horario de atención.
              </p>
              <button type="button" class="btn btn--secondary confirm__again" @click="reset">
                Escribir otro mensaje
              </button>
            </div>
          </div>

          <form v-else ref="formRef" class="form" novalidate @submit.prevent="submit(formRef)">
            <h3 class="panel__title">Envíanos un mensaje</h3>

            <FormField id="ct-name" v-slot="f" label="Tu nombre" :error="errorFor('name')">
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

            <div class="form__row">
              <FormField id="ct-email" v-slot="f" label="Correo" :error="errorFor('email')">
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

              <FormField
                id="ct-phone"
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
                  :aria-describedby="f.describedBy"
                  :aria-invalid="f.invalid"
                  @blur="handleBlur('phone')"
                  @input="handleInput('phone')"
                />
              </FormField>
            </div>

            <FormField id="ct-message" v-slot="f" label="Mensaje" :error="errorFor('message')">
              <textarea
                :id="f.id"
                v-model="values.message"
                name="message"
                rows="5"
                class="form__input"
                :aria-describedby="f.describedBy"
                :aria-invalid="f.invalid"
                @blur="handleBlur('message')"
                @input="handleInput('message')"
              ></textarea>
            </FormField>

            <button
              type="submit"
              class="btn btn--primary btn--block btn--lg"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Enviando…' : 'Enviar mensaje' }}
            </button>
          </form>
        </div>
      </div>

      <div class="place">
        <div class="place__gallery">
          <h3 class="place__title">El local</h3>
          <AppCarousel label="Fotografías del local" :per-view="1" :auto-play="6000">
            <figure v-for="photo in gallery" :key="photo.path" class="place__figure">
              <AppImage
                :path="photo.path"
                :alt="photo.alt"
                :width="720"
                :height="480"
                :widths="[480, 720, 1080]"
                sizes="(min-width: 901px) 34rem, 92vw"
              />
            </figure>
          </AppCarousel>
        </div>

        <div class="place__map">
          <h3 class="place__title">Cómo llegar</h3>

          <div v-if="!isMapLoaded" class="map-facade">
            <div class="map-facade__body">
              <AppIcon name="map-pin" :size="28" class="map-facade__pin" />
              <p class="map-facade__address">Avenida Italia 1450, Providencia</p>
              <p class="map-facade__note">
                Metro Santa Isabel, línea 5, a cuatro cuadras. El mapa se carga desde Google.
              </p>
              <div class="map-facade__actions">
                <button type="button" class="btn btn--secondary" @click="isMapLoaded = true">
                  Cargar el mapa
                </button>
                <a :href="business.mapsUrl" class="map-facade__link" target="_blank" rel="noopener">
                  Abrir en Google Maps
                </a>
              </div>
            </div>
          </div>

          <iframe
            v-else
            class="map__frame"
            title="Mapa de la ubicación de Ñamster Café"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.0569000470614!2d-70.62697792451046!3d-33.447824073390564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c57c2b04621d%3A0xa76b56c968636dc9!2sAv.%20Italia%201450%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1769112287611!5m2!1ses-419!2scl"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: var(--space-10);
  align-items: start;
  margin-block-end: var(--space-16);
}

/* ── Contact details ── */

.details {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-8);
  background: var(--gradient-blush);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.details__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.detail {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.detail__icon {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  flex-shrink: 0;
  background-color: var(--surface-raised);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
}

.detail__icon :deep(img) {
  width: 2.25rem;
  height: 2.25rem;
}

.detail__body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.detail__label {
  font-size: var(--text-2xs);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-muted);
}

.detail__value {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--ink-900);
  /* Long email addresses must not overflow the column on narrow screens. */
  overflow-wrap: anywhere;
}

.detail__value--link {
  text-decoration: underline;
  text-decoration-color: var(--rose-200);
  text-underline-offset: 3px;
  transition: text-decoration-color var(--duration-fast) var(--ease-out);
}

.detail__value--link:hover {
  text-decoration-color: var(--rose-500);
}

.detail__status {
  margin-block-start: 0.15rem;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--rose-700);
}

/* ── Social ── */

.social__title {
  font-size: var(--text-sm);
  font-weight: 700;
  margin-block-end: var(--space-3);
}

.social__list {
  display: flex;
  gap: var(--space-3);
}

.social__link {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  background-color: var(--surface-raised);
  border-radius: 50%;
  box-shadow: var(--shadow-xs);
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.social__link:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.social__link :deep(img) {
  width: 1.75rem;
  height: 1.75rem;
}

/* ── Form ── */

.contact__panel {
  padding: var(--space-8);
  background-color: var(--surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.panel__title {
  font-size: var(--text-lg);
  margin-block-end: var(--space-2);
}

.confirm__again {
  margin-block-start: var(--space-4);
}

/* ── Gallery and map ── */

.place {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
  gap: var(--space-10);
}

.place__title {
  font-size: var(--text-lg);
  margin-block-end: var(--space-4);
}

.place__figure {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  aspect-ratio: 3 / 2;
}

.place__figure :deep(img) {
  width: 100%;
  height: 100%;
}

.map-facade,
.map__frame {
  width: 100%;
  aspect-ratio: 3 / 2;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.map-facade {
  display: grid;
  place-items: center;
  padding: var(--space-6);
  text-align: center;
  background:
    radial-gradient(circle at center, var(--rose-50), var(--surface-sunken)), var(--surface-sunken);
}

.map-facade__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.map-facade__pin {
  color: var(--rose-500);
}

.map-facade__address {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--ink-900);
}

.map-facade__note {
  max-width: 26ch;
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
  color: var(--color-muted);
}

.map-facade__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-block-start: var(--space-3);
}

.map-facade__link {
  /* Vertical padding reaches the 24px minimum target without visually
     detaching the link from the button above it. */
  padding-block: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--rose-700);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.map__frame {
  display: block;
  overflow: hidden;
}

@media (max-width: 900px) {
  .contact__layout {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    margin-block-end: var(--space-12);
  }

  .details,
  .contact__panel {
    padding: var(--space-6);
  }

  .place {
    gap: var(--space-8);
  }
}

@media (max-width: 640px) {
  .details,
  .contact__panel {
    padding: var(--space-5);
  }
}
</style>
