import './src/assets/styles/main.scss'
import WebglController from './src/webgl/WebglController'

import { createApp } from 'vue'
import App from './src/App.vue'

createApp(App).mount('#vue-app')

new WebglController(document.getElementById('webgl-app'))