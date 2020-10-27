<template>
  <div>
    <h1 class="mb-5">Admin Panel</h1>
    <hospital-card
      v-for="hospital in hospitals"
      :key="hospital.id"
      :hospital="hospital"
      :to="`/admin/hospital/${hospital.id}`"
    />
  </div>
</template>

<script>
import HospitalCard from "../components/HospitalCard.vue"

export default {
  name: "admin-page",
  components: {
    HospitalCard,
  },
  data() {
    return {
      hospitals: this.$store.state.hospitals,
    }
  },
  async asyncData({ store }) {
    if (!store.getters.hasFetchedHospitals) {
      return store.dispatch("FETCH_HOSPITALS")
    }
  },
}
</script>
