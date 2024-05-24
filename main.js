import './src/assets/styles/main.scss'
import WebglController from './src/webgl/WebglController'
import UIWebglController from './src/webgl/UIWebglController'

import { createApp } from 'vue'
import App from './src/App.vue'

new WebglController(document.getElementById('webgl-app'))
new UIWebglController(document.getElementById('ui-webgl-app'))

createApp(App).mount('#vue-app')