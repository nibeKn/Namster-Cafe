<script setup>
/**
 * Application root.
 *
 * Section order follows the visitor's path: what the place is, what it offers,
 * why to trust it, what is on the menu and in the shop, and finally the two
 * actions available — booking a table and getting in touch.
 */

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import DrinksSection from '@/components/sections/DrinksSection.vue'
import MerchSection from '@/components/sections/MerchSection.vue'
import ReservationSection from '@/components/sections/ReservationSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <!-- First focusable element, so keyboard users can skip the header nav. -->
  <a class="skip-link" href="#main">Saltar al contenido</a>

  <AppHeader />

  <main id="main">
    <HeroSection />
    <ServicesSection />
    <TestimonialsSection />
    <StatsSection />
    <DrinksSection />
    <MerchSection />
    <ReservationSection />
    <ContactSection />
  </main>

  <AppFooter />
</template>
