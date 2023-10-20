import './assets/main.css'
import { createPinia } from 'pinia'
import i18n from './i18n';
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'

import routes from "./router/index"

declare global {
  interface Window {
    __insp: any;
    __inspld: any;
    Beacon: any;
    _paq: any;
    $: any;
  }
}

export const createApp:any = ViteSSG(
  App,
  { routes },
  async ({ app, router, routes, isClient, initialState }) => {
    const pinia = createPinia();
    app.use(pinia)
    app.use(i18n)
  },
)