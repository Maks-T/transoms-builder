import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueKonva from 'vue-konva'
import App from './App.vue'
import './style.css'
import clickOutside from "@directives/clickOutside.js";

const app = createApp(App);
app.use(createPinia());
app.use(VueKonva);

app.directive('click-outside', clickOutside)

app.mount('#calcWrapper');
