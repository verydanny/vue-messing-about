import fetch from "isomorphic-unfetch"

import { endpoint } from "../../const"

export async function fetchHospitals() {
  return fetch(`${endpoint}/api/hospital/all`, {
    method: "GET",
  }).then((hospitals) => hospitals.json())
}
