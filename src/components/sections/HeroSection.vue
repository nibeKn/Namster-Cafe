<script setup>
/** Full-screen cover with the venue photo, live opening status and the two
 * primary calls to action. */

import { brand, venuePhotos } from '@/data/media.js'
import { cldUrl, cldSrcset } from '@/lib/cloudinary.js'
import AppImage from '@/components/ui/AppImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useOpeningHours } from '@/composables/useOpeningHours.js'

const { isOpen, label: openingLabel } = useOpeningHours()

const photoPath = venuePhotos.reception
/* Written as a raw `<img>` rather than AppImage so the srcset matches the
   `<link rel="preload">` in index.html exactly; any difference would cost a
   second download. */
const heroSrcset = cldSrcset(photoPath, [640, 1024, 1600, 2000])
const heroSrc = cldUrl(photoPath, { width: 1600 })
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero__media">
      <img
        :src="heroSrc"
        :srcset="heroSrcset"
        sizes="100vw"
        alt="Interior del Ñamster Café: barra de madera clara, mobiliario en tonos pastel y pizarras con la carta"
        class="hero__photo"
        width="1600"
        height="1067"
        fetchpriority="high"
      />
      <div class="hero__veil" aria-hidden="true"></div>
    </div>

    <div class="container hero__content">
      <p class="hero__status" :class="{ 'hero__status--closed': !isOpen }">
        <span class="hero__status-dot" aria-hidden="true"></span>
        {{ openingLabel }}
      </p>

      <h1 class="hero__title">
        <span class="hero__title-line">Ñamster</span>
        <span class="hero__title-line hero__title-line--with-mark">
          Café
          <span class="hero__mark">
            <AppImage
              :path="brand.logo"
              alt=""
              :width="160"
              :height="160"
              :blur-up="false"
              fit="contain"
              priority
            />
          </span>
        </span>
      </h1>

      <p class="hero__lede">
        Café de especialidad, repostería de vitrina y siete hámsters que no pagan arriendo.
        <span class="hero__lede-place">Avenida Italia 1450, Providencia.</span>
      </p>

      <div class="hero__actions">
        <a href="#reservation" class="btn btn--primary btn--lg">Reservar mesa</a>
        <a href="#drinks" class="btn btn--secondary btn--lg">Ver la carta</a>
      </div>
    </div>

    <a href="#services" class="hero__scroll-cue" aria-label="Ir al contenido">
      <AppIcon name="arrow-down" :size="18" />
    </a>
  </section>
</template>

<style scoped>
.hero {
  /* Scales with the viewport, capped at both ends. */
  --hero-radius: clamp(1.25rem, 5vw, 2.75rem);

  position: relative;
  /* `svh` measures with the mobile browser bar expanded, which is the state
     the page loads in. `vh` would push content below the fold. */
  min-height: 100svh;
  display: grid;
  align-items: center;
  /* Keeps the photo's `z-index: -1` inside the hero instead of slipping behind
     the document background. Overflow is not clipped: the panel shadow needs to
     escape the box. */
  isolation: isolate;
}

/* The bottom edge is two rounded corners rather than a drawn silhouette: a
   radius in `rem` measures the same at every width, unlike a stretched shape. */
.hero__media {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-end-start-radius: var(--hero-radius);
  border-end-end-radius: var(--hero-radius);
  overflow: hidden;
  /* Offset downwards only, so the panel sits on the page without a halo. */
  box-shadow: 0 24px 48px -32px rgba(42, 26, 32, 0.55);
}

.hero__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
}

/* Graded rather than flat: reinforces the header band and the text band while
   letting the middle breathe. Contrast over the headline is 7:1. */
.hero__veil {
  position: absolute;
  inset: 0;
  border-end-start-radius: inherit;
  border-end-end-radius: inherit;
  background:
    linear-gradient(
      to bottom,
      rgba(34, 21, 25, 0.45) 0%,
      rgba(34, 21, 25, 0.2) 32%,
      rgba(34, 21, 25, 0.5) 72%,
      /* No text below 72%, so the veil eases off and the room stays visible. */
      rgba(34, 21, 25, 0.55) 100%
    ),
    linear-gradient(to right, rgba(122, 30, 66, 0.25), rgba(34, 21, 25, 0.05));
}

.hero__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-5);
  padding-block: calc(var(--header-h) + var(--space-8)) var(--space-20);
}

/* ── Opening status ── */

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: var(--radius-pill);
  background-color: rgba(34, 21, 25, 0.42);
  backdrop-filter: blur(8px);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
}

.hero__status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #6ee7a8;
  box-shadow: 0 0 0 3px rgba(110, 231, 168, 0.25);
}

.hero__status--closed .hero__status-dot {
  background-color: var(--caramel-300);
  box-shadow: 0 0 0 3px rgba(233, 198, 138, 0.25);
}

/* ── Headline ── */

.hero__title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1em;
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 600;
  line-height: 0.88;
  letter-spacing: -0.02em;
  color: #fff;
  /* Lifts the text off the photo, without the neon halo a coloured glow gives. */
  text-shadow: 0 2px 30px rgba(34, 21, 25, 0.45);
}

.hero__title-line--with-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.12em;
}

.hero__mark {
  display: block;
  width: 0.92em;
  height: 0.92em;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 8px 30px -6px rgba(34, 21, 25, 0.4);
  padding: 0.06em;
}

.hero__mark :deep(img) {
  width: 100%;
  height: 100%;
}

/* ── Supporting text ── */

.hero__lede {
  max-width: 34rem;
  font-size: var(--text-lg);
  line-height: var(--leading-snug);
  color: rgba(255, 255, 255, 0.94);
  text-shadow: 0 1px 12px rgba(34, 21, 25, 0.5);
}

.hero__lede-place {
  display: block;
  margin-block-start: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--rose-200);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-block-start: var(--space-2);
}

/* ── Scroll cue ── */

.hero__scroll-cue {
  position: absolute;
  inset-block-end: var(--space-8);
  inset-inline: 0;
  margin-inline: auto;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  color: #fff;
  background-color: rgba(34, 21, 25, 0.3);
  backdrop-filter: blur(6px);
  animation: nudge 2.6s var(--ease-out) infinite;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.hero__scroll-cue:hover {
  background-color: rgba(34, 21, 25, 0.55);
}

@keyframes nudge {
  0%,
  70%,
  100% {
    transform: translateY(0);
  }
  80% {
    transform: translateY(5px);
  }
}

/* ── Mobile ── */

@media (max-width: 640px) {
  .hero__content {
    gap: var(--space-4);
    padding-block-end: var(--space-16);
  }

  .hero__title {
    /* Keeps the two lines on one screen down to 360px wide. */
    line-height: 0.92;
  }

  .hero__lede {
    font-size: var(--text-base);
  }

  .hero__actions {
    flex-direction: column;
    align-self: stretch;
    width: 100%;
    max-width: 20rem;
    margin-inline: auto;
  }

  .hero__actions .btn {
    width: 100%;
  }

  .hero__scroll-cue {
    display: none;
  }
}
</style>
