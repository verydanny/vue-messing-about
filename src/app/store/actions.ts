import { ActionContext } from "vuex"

import { fetchHospitals } from "../../model/api/hospital"

export const actions = {
  FETCH_HOSPITALS: async ({ commit }: ActionContext<any, any>) =>
    fetchHospitals().then((hospitals) => commit("SET_LIST", hospitals)),
  SET_ACTIVE_HOSPITAL: ({ commit }, type) => commit(type),
} as const
