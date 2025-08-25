import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueKonva from 'vue-konva'
import App from './App.vue'
import './style.css'

const app = createApp(App);
app.use(createPinia());
app.use(VueKonva);
app.mount('#calcWrapper');
