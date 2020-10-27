import Vue from "vue"

export const mutations = {
  SET_LIST: (state, list) => {
    list.forEach((item) => {
      if (item) {
        Vue.set(state.hospitals, item.id, item)
      }
    })
  },
  SET_ACTIVE_HOSPITAL: (state, type) => (state.activeHospital = type.id),
} as const
