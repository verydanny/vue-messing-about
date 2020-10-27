import Vue from "vue"

import { VueContext } from "../types/server"

import { sync } from "./store/sync"
import { createRouter } from "./router/router"
import { createStore } from "./store/store"
import { vuetify } from "./plugins/vuetify"
import App from "./App.vue"

export function createVueApp(ssrContext?: VueContext) {
  const router = createRouter()
  const store = createStore()

  sync(store, router, { moduleName: "RouteModule" })

  const app = new Vue({
    router,
    store,
    ...(ssrContext ? { ssrContext } : {}),
    vuetify,
    render: (ren) => ren(App),
  })

  return { app, router, store }
}
