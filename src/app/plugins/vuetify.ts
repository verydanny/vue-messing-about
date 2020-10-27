import Vue from "vue"
import Vuetify from "vuetify"

if (
  process.env.VUE_ENV === "client" &&
  process.env.NODE_ENV === "development"
) {
  require("vuetify/dist/vuetify.min.css")
}

Vue.use(Vuetify)

export const vuetify = new Vuetify()
