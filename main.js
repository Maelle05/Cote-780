import './src/assets/styles/main.scss'
import { createApp } from 'vue'
import App from './src/App.vue'
import i18n from '@/config/i18n'
import { app } from '@/App'

// Vue App
const appVue = createApp(App);
appVue.use(i18n);
appVue.mount('#vue-app');

// JS App
app.init();