import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

const Home = () => import("../pages/Home.vue")
const Hospitals = () => import("../pages/Hospitals.vue")
const Admin = () => import("../pages/Admin.vue")
const AdminHospitals = () => import("../pages/AdminHospital.vue")
const HospitalInfo = () => import("../pages/HospitalInfo.vue")

export function createRouter() {
  return new Router({
    mode: "history",
    fallback: false,
    routes: [
      { path: "/", component: Home },
      { path: "/hospitals", component: Hospitals },
      { path: "/hospital/:id", component: HospitalInfo },
      { path: "/admin", component: Admin },
      { path: "/admin/hospital/:id", component: AdminHospitals },
    ],
  })
}
