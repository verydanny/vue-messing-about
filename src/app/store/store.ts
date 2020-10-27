import Vue from "vue"
import Vuex, { Store } from "vuex"

import { actions } from "./actions"
import { mutations } from "./mutations"

export interface MyStore {
  hospitals: Record<string, string>
  actions: typeof actions
}

Vue.use(Vuex)

const initialState = {
  state: {
    hospitals: {},
    activeHospital: undefined,
  },
}

const storeConfig = {
  ...initialState,
  actions,
  mutations,
  getters: {
    hasFetchedHospitals: (state: MyStore) =>
      Object.keys(state.hospitals).length >= 1,
  },
}

export function createStore(): Store<MyStore> {
  return new Vuex.Store(storeConfig)
}
