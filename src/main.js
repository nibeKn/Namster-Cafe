import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'

/* Scroll-reveal initial states hang off `.has-js`, so content stays visible if
   this bundle never runs. */
document.documentElement.classList.add('has-js')

createApp(App).mount('#app')
