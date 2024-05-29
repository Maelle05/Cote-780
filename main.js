import './src/assets/styles/main.scss'
import WebglController from './src/webgl/WebglController'
import UIWebglController from './src/webgl/UIWebglController'

import { createApp } from 'vue'
import App from './src/App.vue'
import i18n from '@/config/i18n'

new WebglController(document.getElementById('webgl-app'))
new UIWebglController(document.getElementById('ui-webgl-app'))

const app = createApp(App);
app.use(i18n);
app.mount('#vue-app');