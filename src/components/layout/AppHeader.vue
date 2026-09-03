<script setup>
/**
 * Fixed header with an active-section indicator and a mobile drawer.
 *
 * Its height comes from `--header-h`, the same token that feeds
 * `scroll-padding-top`, so anchored headings always clear the bar.
 */

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { navigationLinks } from '@/data/navigation.js'
import { brand } from '@/data/media.js'
import { useScrollSpy } from '@/composables/useScrollSpy.js'
import AppImage from '@/components/ui/AppImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const menuButtonRef = ref(null)

const sectionIds = navigationLinks.map((link) => link.href.replace('#', ''))
const { activeId } = useScrollSpy(sectionIds)

/* Transparent over the hero photo, solid once scrolled past it. */
const isTransparent = computed(() => !isScrolled.value && !isMenuOpen.value)

function handleScroll() {
  isScrolled.value = window.scrollY > 24
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handleKeydown(event) {
  if (event.key !== 'Escape' || !isMenuOpen.value) return
  closeMenu()
  /* Returning focus to the trigger is what keyboard users expect. */
  menuButtonRef.value?.focus()
}

/* Freezes the page so touch scrolling does not bleed through the drawer. */
watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header" :class="{ 'header--solid': !isTransparent }">
    <div class="container header__inner">
      <a href="#hero" class="brand" @click="closeMenu">
        <span class="brand__mark">
          <AppImage
            :path="brand.logo"
            alt=""
            :width="36"
            :height="36"
            :blur-up="false"
            fit="contain"
          />
        </span>
        <span class="brand__name">Ñamster Café</span>
      </a>

      <nav
        id="primary-nav"
        class="nav"
        :class="{ 'nav--open': isMenuOpen }"
        aria-label="Navegación principal"
      >
        <ul class="nav__list">
          <li v-for="link in navigationLinks" :key="link.href">
            <a
              :href="link.href"
              class="nav__link"
              :class="{ 'nav__link--active': activeId === link.href.slice(1) }"
              :aria-current="activeId === link.href.slice(1) ? 'true' : undefined"
              @click="closeMenu"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>

        <a href="#reservation" class="btn btn--primary nav__cta" @click="closeMenu">
          Reservar mesa
        </a>
      </nav>

      <div class="header__actions">
        <a href="#reservation" class="btn btn--primary header__cta">Reservar</a>

        <button
          ref="menuButtonRef"
          type="button"
          class="menu-toggle"
          :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          :aria-expanded="isMenuOpen"
          aria-controls="primary-nav"
          @click="toggleMenu"
        >
          <AppIcon :name="isMenuOpen ? 'close' : 'menu'" :size="26" />
        </button>
      </div>
    </div>

    <!-- Tap-outside-to-close layer. -->
    <div v-if="isMenuOpen" class="nav__scrim" @click="closeMenu" />
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: var(--z-header);
  height: var(--header-h);
  transition:
    background-color var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}

/* Holds the contrast of white text over the light, busy top of the photo. */
.header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(34, 21, 25, 0.5), rgba(34, 21, 25, 0));
  opacity: 1;
  transition: opacity var(--duration-base) var(--ease-out);
  pointer-events: none;
}

.header--solid {
  background-color: rgba(255, 251, 248, 0.88);
  backdrop-filter: blur(12px) saturate(140%);
  box-shadow:
    0 1px 0 var(--color-border),
    var(--shadow-sm);
}

.header--solid::before {
  opacity: 0;
}

/* The drawer and its scrim are descendants of the header, so they only need
   ordering among themselves. The bar sits above the scrim to keep the close
   button visible and clickable while the menu is open. */
.header__inner {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

/* ── Brand ── */

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  /* Without this the brand wraps onto two lines and stretches the header. */
  white-space: nowrap;
  flex-shrink: 0;
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.25rem;
  border-radius: 50%;
  background: linear-gradient(140deg, var(--rose-200), var(--rose-400));
  box-shadow: var(--shadow-sm);
}

.brand__name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #fff;
  transition: color var(--duration-base) var(--ease-out);
}

.header--solid .brand__name {
  color: var(--rose-700);
}

/* ── Navigation ── */

.nav__list {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.nav__link {
  position: relative;
  display: block;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  transition: color var(--duration-fast) var(--ease-out);
}

.header--solid .nav__link {
  color: var(--ink-700);
}

/* Underline marks the active section without shifting text or changing weight,
   which would cause layout jumps while navigating. */
.nav__link::after {
  content: '';
  position: absolute;
  inset-block-end: 0.125rem;
  inset-inline: var(--space-3);
  height: 2px;
  border-radius: 2px;
  background-color: currentColor;
  transform: scaleX(0);
  transition: transform var(--duration-base) var(--ease-out);
}

.nav__link:hover::after {
  transform: scaleX(0.6);
}

.nav__link--active {
  color: #fff;
}

.header--solid .nav__link--active {
  color: var(--rose-600);
}

.nav__link--active::after {
  transform: scaleX(1);
}

.nav__cta {
  display: none;
}

/* ── Actions ── */

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.header__cta {
  min-height: 2.5rem;
  padding-inline: var(--space-5);
}

.menu-toggle {
  display: none;
  place-items: center;
  /* 44px minimum touch target. */
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-md);
  color: #fff;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.header--solid .menu-toggle {
  color: var(--ink-900);
}

.menu-toggle:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.header--solid .menu-toggle:hover {
  background-color: var(--rose-100);
}

/* ── Mobile drawer ── */

@media (max-width: 900px) {
  .menu-toggle {
    display: grid;
  }

  .header__cta {
    display: none;
  }

  .nav {
    position: fixed;
    inset-block: 0;
    inset-inline-end: 0;
    z-index: 2;
    width: min(20rem, 82vw);
    /* `dvh` tracks the mobile address bar; `vh` pushes the last link off screen. */
    height: 100dvh;
    padding: calc(var(--header-h) + var(--space-6)) var(--space-6) var(--space-8);
    background-color: var(--surface-page);
    box-shadow: -12px 0 40px -16px rgba(42, 26, 32, 0.35);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    overflow-y: auto;
    overscroll-behavior: contain;

    /* `visibility: hidden` removes the links from the tab order while closed —
       an off-canvas transform alone would leave them focusable. */
    visibility: hidden;
    transform: translateX(100%);
    transition:
      transform var(--duration-base) var(--ease-out),
      visibility var(--duration-base);
  }

  .nav--open {
    visibility: visible;
    transform: translateX(0);
  }

  .nav__list {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-1);
  }

  .nav__link {
    padding: var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-md);
    color: var(--ink-700);
  }

  .nav__link::after {
    display: none;
  }

  .nav__link:hover {
    background-color: var(--rose-50);
  }

  .nav__link--active {
    background-color: var(--rose-100);
    color: var(--rose-700);
  }

  .header--solid .nav__link,
  .header--solid .nav__link--active {
    color: inherit;
  }

  .nav__cta {
    display: inline-flex;
    margin-block-start: var(--space-5);
  }

  .nav__scrim {
    position: fixed;
    inset: 0;
    z-index: 1;
    background-color: rgba(34, 21, 25, 0.45);
    backdrop-filter: blur(2px);
    animation: scrim-in var(--duration-base) var(--ease-out);
  }

  @keyframes scrim-in {
    from {
      opacity: 0;
    }
  }
}

/* On very narrow screens the full name competes with the button. */
@media (max-width: 380px) {
  .brand__name {
    font-size: 1rem;
  }

  .brand__mark {
    width: 2.25rem;
    height: 2.25rem;
  }
}
</style>
