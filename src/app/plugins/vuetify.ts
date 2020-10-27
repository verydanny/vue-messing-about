import Vue from "vue"
import Vuetify from "vuetify"

if (typeof window !== "undefined") {
  require("vuetify/dist/vuetify.min.css")
}

Vue.use(Vuetify)

export const vuetify = new Vuetify()
