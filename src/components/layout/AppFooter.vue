<script setup>
/** Footer: brand, links, newsletter and legal line. */

import { ref } from 'vue'
import { footerSections } from '@/data/navigation.js'
import { brand } from '@/data/media.js'
import { business } from '@/data/business.js'
import AppImage from '@/components/ui/AppImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useForm, required, email } from '@/composables/useForm.js'

const formRef = ref(null)

const contactLines = [
  { icon: 'map-pin', text: business.address },
  { icon: 'phone', text: business.phone.display, href: business.phone.href },
  { icon: 'mail', text: business.email, href: `mailto:${business.email}` },
  { icon: 'clock', text: business.hours },
]

const { values, isSubmitting, isSuccessful, errorFor, handleBlur, handleInput, submit } = useForm({
  initialValues: { newsletterEmail: '' },
  validators: {
    newsletterEmail: (value) => required('Escribe tu correo')(value) || email()(value),
  },
  onSubmit: () => new Promise((resolve) => setTimeout(resolve, 600)),
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="#hero" class="footer__logo">
            <AppImage
              :path="brand.logo"
              alt=""
              :width="40"
              :height="40"
              :blur-up="false"
              fit="contain"
            />
            <span class="footer__name">Ñamster Café</span>
          </a>

          <p class="footer__desc">
            Cafetería de barrio en Providencia. Café de origen, repostería propia y siete hámsters
            que llevan aquí más tiempo que la mitad del equipo.
          </p>

          <ul class="footer__contact">
            <li v-for="line in contactLines" :key="line.text" class="footer__contact-item">
              <AppIcon :name="line.icon" :size="16" class="footer__contact-icon" />
              <a v-if="line.href" :href="line.href" class="footer__contact-link">{{ line.text }}</a>
              <span v-else>{{ line.text }}</span>
            </li>
          </ul>
        </div>

        <nav class="footer__nav" aria-label="Enlaces del pie de página">
          <div v-for="section in footerSections" :key="section.title" class="footer__col">
            <h2 class="footer__col-title">{{ section.title }}</h2>
            <ul class="footer__col-list">
              <li v-for="link in section.links" :key="link.label">
                <a
                  :href="link.href"
                  class="footer__link"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener' : undefined"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <section class="newsletter" aria-labelledby="newsletter-title">
        <div>
          <h2 id="newsletter-title" class="newsletter__title">La carta de temporada, por correo</h2>
          <p class="newsletter__text">
            Un envío al mes con las recetas nuevas y las fechas de los talleres. Sin más.
          </p>
        </div>

        <p v-if="isSuccessful" class="newsletter__done" role="status">
          <AppIcon name="check" :size="18" />
          Listo, te apuntamos. Revisa tu correo para confirmar.
        </p>

        <form
          v-else
          ref="formRef"
          class="newsletter__form"
          novalidate
          @submit.prevent="submit(formRef)"
        >
          <div class="newsletter__field">
            <label for="newsletter-email" class="visually-hidden">Tu correo electrónico</label>
            <input
              id="newsletter-email"
              v-model="values.newsletterEmail"
              name="newsletterEmail"
              type="email"
              class="newsletter__input"
              placeholder="tucorreo@ejemplo.cl"
              autocomplete="email"
              inputmode="email"
              :aria-invalid="errorFor('newsletterEmail') ? 'true' : undefined"
              aria-describedby="newsletter-error"
              @blur="handleBlur('newsletterEmail')"
              @input="handleInput('newsletterEmail')"
            />
            <button type="submit" class="btn btn--primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Enviando…' : 'Suscribirme' }}
            </button>
          </div>

          <p
            v-if="errorFor('newsletterEmail')"
            id="newsletter-error"
            class="newsletter__error"
            role="alert"
          >
            {{ errorFor('newsletterEmail') }}
          </p>
        </form>
      </section>

      <div class="footer__bottom">
        <p class="footer__copy">© {{ currentYear }} Ñamster Café · Providencia, Santiago</p>
        <ul class="footer__legal">
          <li><a href="#contact" class="footer__link">Privacidad</a></li>
          <li><a href="#contact" class="footer__link">Términos</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-block: var(--space-16) var(--space-8);
  background-color: var(--surface-contrast);
  color: rgba(255, 255, 255, 0.72);
}

.footer__top {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: var(--space-12);
  padding-block-end: var(--space-10);
}

/* ── Brand ── */

.footer__brand {
  max-width: 34rem;
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  margin-block-end: var(--space-4);
}

.footer__logo :deep(img) {
  width: 2.5rem;
  height: 2.5rem;
}

.footer__name {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: #fff;
}

.footer__desc {
  max-width: 42ch;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: rgba(255, 255, 255, 0.6);
}

.footer__contact {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-block-start: var(--space-5);
}

.footer__contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.68);
}

.footer__contact-icon {
  color: var(--rose-300);
}

.footer__contact-link {
  /* 44px hit area without thickening the line: the vertical padding is offset
     by a negative margin. */
  padding-block: 0.6rem;
  margin-block: -0.6rem;
  transition: color var(--duration-fast) var(--ease-out);
}

.footer__contact-link:hover {
  color: #fff;
}

/* ── Link columns ── */

.footer__nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-8);
}

.footer__col-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: #fff;
  margin-block-end: var(--space-4);
}

.footer__col-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.footer__link {
  display: inline-block;
  padding-block: 0.6rem;
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.6);
  transition: color var(--duration-fast) var(--ease-out);
}

.footer__link:hover {
  color: var(--rose-300);
}

/* ── Newsletter ── */

.newsletter {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-8);
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
}

.newsletter__title {
  font-size: var(--text-base);
  color: #fff;
  margin-block-end: var(--space-1);
}

.newsletter__text {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.55);
}

.newsletter__field {
  display: flex;
  gap: var(--space-2);
}

.newsletter__input {
  flex: 1;
  min-width: 0;
  min-height: 2.75rem;
  padding: var(--space-3) var(--space-4);
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--radius-pill);
  font-size: 1rem;
  color: #fff;
}

.newsletter__input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.newsletter__input:focus {
  outline: none;
  border-color: var(--rose-300);
  box-shadow: 0 0 0 3px rgba(249, 174, 200, 0.18);
}

.newsletter__error {
  margin-block-start: var(--space-2);
  font-size: var(--text-xs);
  color: var(--rose-300);
}

.newsletter__done {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: #8fdcac;
}

/* ── Bottom bar ── */

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-block-start: var(--space-8);
  padding-block-start: var(--space-6);
  border-block-start: 1px solid rgba(255, 255, 255, 0.08);
}

.footer__copy {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.45);
}

.footer__legal {
  display: flex;
  gap: var(--space-5);
}

@media (max-width: 900px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .newsletter {
    grid-template-columns: 1fr;
    padding: var(--space-5);
  }
}

@media (max-width: 520px) {
  .newsletter__field {
    flex-direction: column;
  }

  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
